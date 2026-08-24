// TNS SolarEdge 1-Click Sync Content Script

(function () {
  console.log('[TNS Solar] Content script active on SolarEdge Designer');

  // Inject Floating 1-Click Sync Button
  function injectFloatingButton() {
    if (document.getElementById('tns-sync-floating-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'tns-sync-floating-btn';
    btn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
      <span>Sync to TNS Proposal</span>
    `;

    // Styling
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: '9999999',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
      color: '#ffffff',
      padding: '13px 22px',
      borderRadius: '50px',
      fontSize: '14px',
      fontWeight: '800',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Prompt", sans-serif',
      boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.6), 0 8px 10px -6px rgba(5, 150, 105, 0.4)',
      border: '2px solid rgba(255, 255, 255, 0.4)',
      cursor: 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-2px) scale(1.04)';
      btn.style.boxShadow = '0 15px 30px -5px rgba(5, 150, 105, 0.7)';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translateY(0) scale(1)';
      btn.style.boxShadow = '0 10px 25px -5px rgba(5, 150, 105, 0.6)';
    });

    btn.addEventListener('click', handleSyncClick);

    document.body.appendChild(btn);
  }

  // Extract Data from SolarEdge Designer DOM
  function extractSolarEdgeData() {
    // 1. Project Title / Customer Name
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

    // 3. System Stats (kWp, Modules, MWh)
    let dcPowerKwp = 0;
    let modulesCount = 0;
    let annualMwh = 0;

    const pageText = document.body.innerText || '';
    
    // Extract DC Power (e.g. "13/13 kWp", "13 kWp", "3.5 kWp")
    const kwpMatch = pageText.match(/(\d+(?:\.\d+)?)\s*(?:\/\s*\d+(?:\.\d+)?\s*)?kWp/i);
    if (kwpMatch) {
      dcPowerKwp = parseFloat(kwpMatch[1]);
    }

    // Extract PV Modules count (e.g. "20/20", "6/6")
    const modulesMatch = pageText.match(/(\d+)\s*\/\s*(\d+)/) || pageText.match(/(\d+)\s*PV\s*MODULES/i);
    if (modulesMatch) {
      modulesCount = parseInt(modulesMatch[2] || modulesMatch[1]);
    }

    // Extract Annual Production (e.g. "18.96 MWh")
    const mwhMatch = pageText.match(/(\d+(?:\.\d+)?)\s*MWh/i);
    if (mwhMatch) {
      annualMwh = parseFloat(mwhMatch[1]);
    }

    return {
      projectName,
      street,
      dcPowerKwp,
      modulesCount,
      annualMwh,
      sourceUrl: window.location.href,
      timestamp: new Date().toISOString()
    };
  }

  // Toast Notification
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 20px;">${type === 'success' ? '⚡' : '⚠️'}</span>
        <span>${message}</span>
      </div>
    `;

    Object.assign(toast.style, {
      position: 'fixed',
      top: '24px',
      right: '24px',
      zIndex: '10000000',
      background: type === 'success' ? '#0f172a' : '#991b1b',
      color: '#ffffff',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      padding: '14px 24px',
      borderRadius: '16px',
      fontSize: '14px',
      fontWeight: '700',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Prompt", sans-serif',
      boxShadow: '0 20px 30px -5px rgba(0, 0, 0, 0.6)',
      transition: 'all 0.3s ease'
    });

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Handle 1-Click Sync
  async function handleSyncClick() {
    const btn = document.getElementById('tns-sync-floating-btn');
    if (btn) {
      btn.innerHTML = '<span>กำลังดึงรูปและข้อมูล...</span>';
      btn.style.opacity = '0.8';
    }

    const payload = extractSolarEdgeData();
    console.log('[TNS Solar] Extracted SolarEdge data:', payload);

    chrome.runtime.sendMessage({
      action: 'SYNC_SOLAREDGE_DATA',
      data: payload
    }, (response) => {
      if (btn) {
        btn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Sync เรียบร้อย!</span>
        `;
        setTimeout(() => {
          injectFloatingButton();
        }, 3000);
      }

      showToast('ดึงภาพ SolarEdge และส่งไปยัง TNS Proposal Studio เรียบร้อยแล้ว!');
    });
  }

  // Listen for popup trigger
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'GET_SOLAREDGE_DATA') {
      const data = extractSolarEdgeData();
      sendResponse({ success: true, data });
      return true;
    }
  });

  // Inject when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFloatingButton);
  } else {
    injectFloatingButton();
  }

  // Retry after dynamic route changes in SolarEdge SPA
  setInterval(injectFloatingButton, 1500);
})();
