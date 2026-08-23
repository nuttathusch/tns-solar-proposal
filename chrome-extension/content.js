// TNS SolarEdge 1-Click Sync Content Script

(function () {
  console.log('[TNS Solar] Content script loaded on SolarEdge Designer');

  // Inject Floating 1-Click Sync Button
  function injectFloatingButton() {
    if (document.getElementById('tns-sync-floating-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'tns-sync-floating-btn';
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
      <span>Sync to TNS Proposal</span>
    `;

    // Styling
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: '999999',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
      color: '#ffffff',
      padding: '12px 20px',
      borderRadius: '50px',
      fontSize: '14px',
      fontWeight: '700',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.5), 0 8px 10px -6px rgba(5, 150, 105, 0.3)',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      cursor: 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-2px) scale(1.03)';
      btn.style.boxShadow = '0 15px 30px -5px rgba(5, 150, 105, 0.6)';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translateY(0) scale(1)';
      btn.style.boxShadow = '0 10px 25px -5px rgba(5, 150, 105, 0.5)';
    });

    btn.addEventListener('click', handleSyncClick);

    document.body.appendChild(btn);
  }

  // Extract Data & Canvas from SolarEdge Designer
  async function extractSolarEdgeData() {
    // 1. Project Title
    let projectName = '';
    const nameEl = document.querySelector('.project-name, [data-qa="project-name"], h1, .header-title, input[name="name"]');
    if (nameEl) {
      projectName = nameEl.textContent?.trim() || (nameEl).value?.trim() || '';
    }
    if (!projectName) {
      const match = document.title.match(/DESIGNER\s*[|•-]?\s*(.*)/i);
      projectName = match ? match[1].trim() : document.title;
    }

    // 2. Address / Street
    let street = '';
    const streetEl = document.querySelector('[data-qa="street"], .street-name, input[name="street"]');
    if (streetEl) {
      street = streetEl.textContent?.trim() || (streetEl).value?.trim() || '';
    }

    // 3. System Stats (kWp, Modules count, MWh)
    let dcPowerKwp = 0;
    let modulesCount = 0;
    let annualMwh = 0;

    const pageText = document.body.innerText || '';
    
    // Extract DC Power (e.g. "13 kWp", "13/13 kWp", "3.5 kWp")
    const kwpMatch = pageText.match(/(\d+(?:\.\d+)?)\s*(?:\/\s*\d+(?:\.\d+)?\s*)?kWp/i);
    if (kwpMatch) {
      dcPowerKwp = parseFloat(kwpMatch[1]);
    }

    // Extract PV Modules count (e.g. "20/20", "6/6", "20 Modules")
    const modulesMatch = pageText.match(/(\d+)\s*\/\s*(\d+)/) || pageText.match(/(\d+)\s*PV\s*MODULES/i);
    if (modulesMatch) {
      modulesCount = parseInt(modulesMatch[2] || modulesMatch[1]);
    }

    // Extract Annual Production (e.g. "18.96 MWh")
    const mwhMatch = pageText.match(/(\d+(?:\.\d+)?)\s*MWh/i);
    if (mwhMatch) {
      annualMwh = parseFloat(mwhMatch[1]);
    }

    // 4. Capture Canvas Viewport (2D / 3D WebGL Canvas)
    let canvasDataUrl = '';
    const canvases = Array.from(document.querySelectorAll('canvas'));
    if (canvases.length > 0) {
      // Pick the largest canvas in the viewport
      const mainCanvas = canvases.reduce((prev, curr) => {
        const pArea = prev.width * prev.height;
        const cArea = curr.width * curr.height;
        return cArea > pArea ? curr : prev;
      }, canvases[0]);

      try {
        canvasDataUrl = mainCanvas.toDataURL('image/png');
      } catch (err) {
        console.warn('Canvas export failed due to security/context, fallback screenshot:', err);
      }
    }

    return {
      projectName,
      street,
      dcPowerKwp,
      modulesCount,
      annualMwh,
      canvasDataUrl,
      sourceUrl: window.location.href,
      timestamp: new Date().toISOString()
    };
  }

  // Toast Notification
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 18px;">${type === 'success' ? '⚡' : '⚠️'}</span>
        <span>${message}</span>
      </div>
    `;

    Object.assign(toast.style, {
      position: 'fixed',
      top: '24px',
      right: '24px',
      zIndex: '1000000',
      background: type === 'success' ? '#0f172a' : '#991b1b',
      color: '#ffffff',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '14px 20px',
      borderRadius: '16px',
      fontSize: '13px',
      fontWeight: '600',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
      transition: 'all 0.3s ease'
    });

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Handle 1-Click Sync
  async function handleSyncClick() {
    const btn = document.getElementById('tns-sync-floating-btn');
    if (btn) {
      btn.innerHTML = '<span>กำลังดึงข้อมูล...</span>';
      btn.style.opacity = '0.8';
    }

    const payload = await extractSolarEdgeData();
    console.log('[TNS Solar] Extracted SolarEdge data:', payload);

    chrome.runtime.sendMessage({
      action: 'SYNC_SOLAREDGE_DATA',
      data: payload
    }, (response) => {
      if (btn) {
        btn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Sync เรียบร้อย!</span>
        `;
        setTimeout(() => {
          injectFloatingButton();
        }, 2500);
      }

      if (response && response.success) {
        showToast('ดึงข้อมูลจาก SolarEdge และส่งไปยัง TNS Proposal เรียบร้อยแล้ว!');
      } else {
        showToast('บันทึกข้อมูลเรียบร้อย! กำลังเปิดหน้า TNS Proposal Studio...');
      }
    });
  }

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'GET_SOLAREDGE_DATA') {
      extractSolarEdgeData().then(data => sendResponse({ success: true, data }));
      return true;
    }
  });

  // Inject when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFloatingButton);
  } else {
    injectFloatingButton();
  }

  // Retry after dynamic routing changes
  setInterval(injectFloatingButton, 2000);
})();
