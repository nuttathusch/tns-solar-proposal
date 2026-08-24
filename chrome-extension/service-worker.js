// TNS SolarEdge 1-Click Sync - Service Worker v1.2

chrome.runtime.onInstalled.addListener(() => {
  console.log('[TNS SW] Installed v1.2');
});

// ─── Message router ─────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'SYNC_SOLAREDGE_DATA') {
    handleSync(message.data, sender.tab)
      .then(result => sendResponse(result))
      .catch(err => {
        console.error('[TNS SW] handleSync error:', err);
        sendResponse({ success: false, error: String(err) });
      });
    return true; // keep async channel open
  }
});

// ─── Core sync ───────────────────────────────────────────────────────────────
async function handleSync(stats, senderTab) {
  console.log('[TNS SW] handleSync stats:', JSON.stringify(stats));
  console.log('[TNS SW] senderTab:', senderTab);

  // ── Step 1: Capture screenshot of the SolarEdge tab ──────────────────────
  let screenshotDataUrl = '';

  if (senderTab && typeof senderTab.windowId === 'number') {
    try {
      // First, make sure SolarEdge tab is the active (foreground) tab
      await chrome.tabs.update(senderTab.id, { active: true });
      // Small delay so the browser has time to bring the tab to front
      await sleep(300);
      // Capture the visible area
      screenshotDataUrl = await chrome.tabs.captureVisibleTab(
        senderTab.windowId,
        { format: 'png' }
      );
      console.log('[TNS SW] captureVisibleTab OK, dataUrl length:', screenshotDataUrl.length);
    } catch (err) {
      console.error('[TNS SW] captureVisibleTab FAILED:', err.message || err);
      screenshotDataUrl = '';
    }
  } else {
    console.warn('[TNS SW] senderTab.windowId missing, skip screenshot');
  }

  const payload = { ...stats, screenshotDataUrl };

  // ── Step 2: Persist to chrome.storage.local ───────────────────────────────
  await chrome.storage.local.set({ tns_solaredge_sync: payload });
  // Also write with the key the web app reads from localStorage
  // (we inject it directly via executeScript below, but keep it in storage too)
  console.log('[TNS SW] Saved to storage. screenshotDataUrl length:', screenshotDataUrl.length);

  // ── Step 3: Find open TNS tab ─────────────────────────────────────────────
  const allTabs = await chrome.tabs.query({});
  const tnsTab = allTabs.find(t =>
    t.url && (
      t.url.includes('nuttathusch.github.io/tns-solar-proposal') ||
      t.url.includes('localhost:5173') ||
      t.url.includes('localhost:')
    )
  );

  if (tnsTab?.id) {
    console.log('[TNS SW] Found TNS tab id:', tnsTab.id, 'url:', tnsTab.url);

    // Bring TNS tab to front
    await chrome.tabs.update(tnsTab.id, { active: true });
    if (typeof tnsTab.windowId === 'number') {
      await chrome.windows.update(tnsTab.windowId, { focused: true });
    }

    // Inject the payload into the page context (writes localStorage + fires postMessage)
    await chrome.scripting.executeScript({
      target: { tabId: tnsTab.id },
      func: injectPayloadIntoPage,
      args: [payload]
    });

    console.log('[TNS SW] executeScript done on TNS tab');
    return { success: true, action: 'injected_existing_tab', hasScreenshot: !!screenshotDataUrl };
  } else {
    console.log('[TNS SW] No open TNS tab, opening new one...');
    const newTab = await chrome.tabs.create({
      url: 'https://nuttathusch.github.io/tns-solar-proposal/'
    });

    await waitForTabComplete(newTab.id, 10000);
    await sleep(500); // give React time to mount

    await chrome.scripting.executeScript({
      target: { tabId: newTab.id },
      func: injectPayloadIntoPage,
      args: [payload]
    });

    console.log('[TNS SW] executeScript done on new TNS tab');
    return { success: true, action: 'opened_new_tab', hasScreenshot: !!screenshotDataUrl };
  }
}

// ─── Injected into the TNS web page ─────────────────────────────────────────
// This function runs in the page context (not extension context)
function injectPayloadIntoPage(syncPayload) {
  console.log('[TNS Page] Extension injected, screenshotDataUrl length:',
    (syncPayload.screenshotDataUrl || '').length);

  // Write to localStorage
  try {
    localStorage.setItem('tns_solaredge_latest_sync', JSON.stringify(syncPayload));
  } catch (e) {
    console.error('[TNS Page] localStorage write failed:', e);
  }

  // Fire postMessage so App.tsx listener picks it up immediately
  window.postMessage({ type: 'TNS_SOLAREDGE_SYNC', payload: syncPayload }, '*');
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function waitForTabComplete(tabId, timeoutMs = 8000) {
  return new Promise((resolve) => {
    const deadline = Date.now() + timeoutMs;

    function listener(updatedTabId, changeInfo) {
      if (updatedTabId === tabId && changeInfo.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
      if (Date.now() > deadline) {
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    }
    chrome.tabs.onUpdated.addListener(listener);
  });
}
