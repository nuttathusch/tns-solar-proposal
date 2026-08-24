// TNS SolarEdge 1-Click Sync - Service Worker (Manifest V3)

chrome.runtime.onInstalled.addListener(() => {
  console.log('[TNS Solar SW] Installed / Updated');
});

// ─── Message router ─────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'SYNC_SOLAREDGE_DATA') {
    handleSync(message.data, sender.tab)
      .then(result => sendResponse(result))
      .catch(err => sendResponse({ success: false, error: String(err) }));
    return true; // keep channel open for async
  }
});

// ─── Core sync handler ───────────────────────────────────────────────────────
async function handleSync(stats, senderTab) {
  console.log('[TNS Solar SW] handleSync received:', stats);

  // 1️⃣  Capture screenshot of the SolarEdge tab BEFORE we switch focus
  let screenshotDataUrl = '';
  try {
    const windowId = senderTab?.windowId;
    if (typeof windowId === 'number') {
      // Make the SolarEdge tab active briefly to capture it
      if (senderTab?.id) await chrome.tabs.update(senderTab.id, { active: true });
      screenshotDataUrl = await chrome.tabs.captureVisibleTab(windowId, { format: 'png' });
      console.log('[TNS Solar SW] Screenshot captured OK, bytes:', screenshotDataUrl.length);
    }
  } catch (capErr) {
    console.warn('[TNS Solar SW] Screenshot failed (non-fatal):', capErr.message);
  }

  const payload = { ...stats, screenshotDataUrl };

  // 2️⃣  Persist to chrome.storage.local so the TNS web app can read it any time
  await chrome.storage.local.set({ tns_solaredge_sync: payload });
  console.log('[TNS Solar SW] Saved to chrome.storage.local');

  // 3️⃣  Find open TNS Proposal tab and inject data directly
  const allTabs = await chrome.tabs.query({});
  const tnsTab = allTabs.find(t =>
    t.url && (
      t.url.includes('nuttathusch.github.io/tns-solar-proposal') ||
      t.url.includes('localhost:5173') ||
      t.url.includes('localhost:')
    )
  );

  if (tnsTab?.id) {
    console.log('[TNS Solar SW] Found TNS tab:', tnsTab.id);
    // Switch focus to TNS tab
    await chrome.tabs.update(tnsTab.id, { active: true });
    await chrome.windows.update(tnsTab.windowId, { focused: true });

    // Inject data directly into the page context
    await chrome.scripting.executeScript({
      target: { tabId: tnsTab.id },
      func: injectIntoPage,
      args: [payload]
    });

    return { success: true, action: 'injected_into_existing_tab' };
  } else {
    // No TNS tab open → open one and inject after load
    console.log('[TNS Solar SW] No TNS tab open, opening new one...');
    const newTab = await chrome.tabs.create({
      url: 'https://nuttathusch.github.io/tns-solar-proposal/'
    });

    // Wait for page to fully load then inject
    await waitForTabComplete(newTab.id);
    await chrome.scripting.executeScript({
      target: { tabId: newTab.id },
      func: injectIntoPage,
      args: [payload]
    });

    return { success: true, action: 'opened_new_tab_and_injected' };
  }
}

// ─── This function runs INSIDE the TNS web page context ─────────────────────
function injectIntoPage(syncPayload) {
  console.log('[TNS Page] Extension injected payload:', syncPayload);
  // Write to localStorage so the "นำเข้าจาก SolarEdge" button can read it
  try {
    localStorage.setItem('tns_solaredge_latest_sync', JSON.stringify(syncPayload));
  } catch (e) {}
  // Also fire a postMessage for the React listener in App.tsx
  window.postMessage({ type: 'TNS_SOLAREDGE_SYNC', payload: syncPayload }, '*');
}

// ─── Wait for a tab to finish loading ───────────────────────────────────────
function waitForTabComplete(tabId, timeoutMs = 8000) {
  return new Promise((resolve) => {
    const deadline = Date.now() + timeoutMs;

    function checkDone(updatedTabId, changeInfo) {
      if (updatedTabId === tabId && changeInfo.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(checkDone);
        resolve();
      }
      if (Date.now() > deadline) {
        chrome.tabs.onUpdated.removeListener(checkDone);
        resolve(); // resolve anyway to avoid hanging
      }
    }

    chrome.tabs.onUpdated.addListener(checkDone);
  });
}
