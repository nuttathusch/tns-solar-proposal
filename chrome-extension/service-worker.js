// TNS SolarEdge 1-Click Sync - Background Service Worker

chrome.runtime.onInstalled.addListener(() => {
  console.log('[TNS Solar] Service Worker installed');
});

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'SYNC_SOLAREDGE_DATA') {
    handleSyncData(message.data, sender.tab).then(result => sendResponse(result));
    return true; // Keep channel open for async response
  }
});

async function handleSyncData(data, senderTab) {
  try {
    console.log('[TNS Solar] Starting SolarEdge sync with data:', data);

    // 1. Capture Visible Tab Screenshot (Crystal-Clear GPU Capture)
    let screenshotUrl = '';
    try {
      if (senderTab && typeof senderTab.windowId === 'number') {
        screenshotUrl = await chrome.tabs.captureVisibleTab(senderTab.windowId, { format: 'png' });
      } else {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (activeTab && typeof activeTab.windowId === 'number') {
          screenshotUrl = await chrome.tabs.captureVisibleTab(activeTab.windowId, { format: 'png' });
        } else {
          screenshotUrl = await chrome.tabs.captureVisibleTab({ format: 'png' });
        }
      }
      console.log('[TNS Solar] Screenshot captured successfully, length:', screenshotUrl.length);
    } catch (captureErr) {
      console.warn('[TNS Solar] captureVisibleTab failed:', captureErr);
      screenshotUrl = data.canvasDataUrl || '';
    }

    const finalPayload = {
      ...data,
      canvasDataUrl: screenshotUrl || data.canvasDataUrl || ''
    };

    // 2. Persist in chrome.storage.local
    await chrome.storage.local.set({ lastSyncedSolarEdge: finalPayload });

    // 3. Find any open TNS Solar Proposal tabs
    const allTabs = await chrome.tabs.query({});
    const tnsTab = allTabs.find(t => 
      t.url && (
        t.url.includes('nuttathusch.github.io/tns-solar-proposal') ||
        t.url.includes('localhost:5173') ||
        t.url.includes('localhost:')
      )
    );

    if (tnsTab && typeof tnsTab.id === 'number') {
      console.log('[TNS Solar] Found open TNS Proposal tab:', tnsTab.id, tnsTab.url);

      // Focus the TNS tab
      await chrome.tabs.update(tnsTab.id, { active: true });
      if (typeof tnsTab.windowId === 'number') {
        await chrome.windows.update(tnsTab.windowId, { focused: true });
      }

      // Execute script to post message and update localStorage in page context
      await chrome.scripting.executeScript({
        target: { tabId: tnsTab.id },
        func: (syncData) => {
          console.log('[TNS Page] Injected SolarEdge sync data:', syncData);
          window.postMessage({ type: 'TNS_SOLAREDGE_SYNC', payload: syncData }, '*');
          try {
            localStorage.setItem('tns_solaredge_latest_sync', JSON.stringify(syncData));
            // Trigger storage event manually for same-tab listener
            window.dispatchEvent(new Event('tns_solaredge_sync_event'));
          } catch (e) {
            console.error('Failed to set localStorage in page:', e);
          }
        },
        args: [finalPayload]
      });

      return { success: true, tabAction: 'updated_existing' };
    } else {
      console.log('[TNS Solar] No open TNS tab found, opening new tab...');
      // Open new tab
      const newTab = await chrome.tabs.create({
        url: 'https://nuttathusch.github.io/tns-solar-proposal/'
      });

      // Inject data once tab is ready
      setTimeout(async () => {
        if (newTab && typeof newTab.id === 'number') {
          await chrome.scripting.executeScript({
            target: { tabId: newTab.id },
            func: (syncData) => {
              window.postMessage({ type: 'TNS_SOLAREDGE_SYNC', payload: syncData }, '*');
              try {
                localStorage.setItem('tns_solaredge_latest_sync', JSON.stringify(syncData));
                window.dispatchEvent(new Event('tns_solaredge_sync_event'));
              } catch (e) {
                console.error(e);
              }
            },
            args: [finalPayload]
          }).catch(console.error);
        }
      }, 1800);

      return { success: true, tabAction: 'opened_new' };
    }
  } catch (error) {
    console.error('[TNS Solar] Error in handleSyncData:', error);
    return { success: false, error: error.message };
  }
}
