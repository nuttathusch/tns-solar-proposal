// TNS SolarEdge 1-Click Sync - Background Service Worker

chrome.runtime.onInstalled.addListener(() => {
  console.log('[TNS Solar] Service Worker installed');
});

// Handle messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'SYNC_SOLAREDGE_DATA') {
    handleSyncData(message.data).then(result => sendResponse(result));
    return true; // Keep channel open for async response
  }
});

async function handleSyncData(data) {
  try {
    // 1. Store in chrome.storage.local
    await chrome.storage.local.set({ lastSyncedSolarEdge: data });

    // 2. Query for open TNS Solar Proposal tabs
    const tabs = await chrome.tabs.query({});
    const tnsTab = tabs.find(t => 
      t.url && (
        t.url.includes('nuttathusch.github.io/tns-solar-proposal') ||
        t.url.includes('localhost:5173') ||
        t.url.includes('localhost:')
      )
    );

    if (tnsTab && tnsTab.id) {
      // Focus the open TNS Proposal tab
      await chrome.tabs.update(tnsTab.id, { active: true });
      if (tnsTab.windowId) {
        await chrome.windows.update(tnsTab.windowId, { focused: true });
      }

      // Send data to TNS Proposal web app
      await chrome.tabs.sendMessage(tnsTab.id, {
        action: 'INJECT_SOLAREDGE_PROPOSAL_DATA',
        payload: data
      }).catch(err => {
        console.log('Sending message to existing tab, executing direct script injection:', err);
        chrome.scripting.executeScript({
          target: { tabId: tnsTab.id },
          func: (syncPayload) => {
            window.postMessage({ type: 'TNS_SOLAREDGE_SYNC', payload: syncPayload }, '*');
            localStorage.setItem('tns_solaredge_latest_sync', JSON.stringify(syncPayload));
          },
          args: [data]
        });
      });

      return { success: true, tabAction: 'updated_existing' };
    } else {
      // Open new TNS Proposal tab
      const newTab = await chrome.tabs.create({
        url: 'https://nuttathusch.github.io/tns-solar-proposal/'
      });

      // Inject data once loaded
      setTimeout(async () => {
        if (newTab.id) {
          await chrome.scripting.executeScript({
            target: { tabId: newTab.id },
            func: (syncPayload) => {
              window.postMessage({ type: 'TNS_SOLAREDGE_SYNC', payload: syncPayload }, '*');
              localStorage.setItem('tns_solaredge_latest_sync', JSON.stringify(syncPayload));
            },
            args: [data]
          }).catch(console.error);
        }
      }, 2000);

      return { success: true, tabAction: 'opened_new' };
    }
  } catch (error) {
    console.error('Error handling SolarEdge sync:', error);
    return { success: false, error: error.message };
  }
}
