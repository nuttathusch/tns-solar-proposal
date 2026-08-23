document.addEventListener('DOMContentLoaded', async () => {
  const statusEl = document.getElementById('tab-status');
  const syncBtn = document.getElementById('btn-sync-now');

  // Query active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const isSolarEdge = tab && tab.url && tab.url.includes('designer.solaredge.com');

  if (isSolarEdge) {
    statusEl.innerHTML = `<span class="badge">พร้อมเชื่อมต่อ</span> ${tab.title || 'SolarEdge Designer'}`;
    syncBtn.disabled = false;
  } else {
    statusEl.innerHTML = `<span style="color: #f59e0b;">ไม่ใช่หน้า SolarEdge Designer</span> (กรุณาเปิดแท็บ designer.solaredge.com)`;
    syncBtn.disabled = false; // Still allow trying
  }

  syncBtn.addEventListener('click', async () => {
    syncBtn.disabled = true;
    syncBtn.textContent = 'กำลังดึงข้อมูล...';

    if (isSolarEdge && tab.id) {
      chrome.tabs.sendMessage(tab.id, { action: 'GET_SOLAREDGE_DATA' }, async (res) => {
        if (res && res.success) {
          // Send to background to sync with TNS
          await chrome.runtime.sendMessage({
            action: 'SYNC_SOLAREDGE_DATA',
            data: res.data
          });
          syncBtn.textContent = '✅ Sync สำเร็จแล้ว!';
          setTimeout(() => window.close(), 1200);
        } else {
          syncBtn.textContent = 'กำลังเชื่อมต่อเบื้องหลัง...';
          // Query all tabs to find SolarEdge tab
          const tabs = await chrome.tabs.query({});
          const seTab = tabs.find(t => t.url && t.url.includes('designer.solaredge.com'));
          if (seTab && seTab.id) {
            chrome.tabs.sendMessage(seTab.id, { action: 'GET_SOLAREDGE_DATA' }, async (seRes) => {
              if (seRes && seRes.success) {
                await chrome.runtime.sendMessage({
                  action: 'SYNC_SOLAREDGE_DATA',
                  data: seRes.data
                });
                syncBtn.textContent = '✅ Sync สำเร็จแล้ว!';
                setTimeout(() => window.close(), 1200);
              }
            });
          }
        }
      });
    } else {
      // Find open SolarEdge tab
      const tabs = await chrome.tabs.query({});
      const seTab = tabs.find(t => t.url && t.url.includes('designer.solaredge.com'));
      if (seTab && seTab.id) {
        chrome.tabs.sendMessage(seTab.id, { action: 'GET_SOLAREDGE_DATA' }, async (res) => {
          if (res && res.success) {
            await chrome.runtime.sendMessage({
              action: 'SYNC_SOLAREDGE_DATA',
              data: res.data
            });
            syncBtn.textContent = '✅ Sync สำเร็จแล้ว!';
            setTimeout(() => window.close(), 1200);
          }
        });
      } else {
        alert('กรุณาเปิดแท็บ SolarEdge Designer ที่คุณออกแบบไว้ แล้วกดปุ่มนี้อีกครั้งครับ');
        syncBtn.disabled = false;
        syncBtn.textContent = '⚡ ดึงข้อมูลจาก SolarEdge เข้า Proposal';
      }
    }
  });
});
