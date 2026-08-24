// TNS SolarEdge 1-Click Sync - Content Script v1.2
// Runs on designer.solaredge.com

(function () {
  if (window.__TNS_CONTENT_LOADED) return;
  window.__TNS_CONTENT_LOADED = true;

  console.log('[TNS Content] Loaded on:', location.href);

  // ─── Extract stats from the SolarEdge DOM ──────────────────────────────
  function extractStats() {
    const text = document.body.innerText || '';

    // Project name
    let projectName = '';
    const titleEl = document.querySelector(
      '[data-qa="project-name"], .project-name, .site-name, [class*="projectName"], [class*="project-name"]'
    );
    if (titleEl) projectName = (titleEl.textContent || '').trim();
    if (!projectName) {
      // Try the page title e.g. "SolarEdge Designer | คุณวราวุฒา สงวนศักดิ์"
      const m = document.title.replace(/SolarEdge[^|]*\|\s*/i, '').trim();
      projectName = m || document.title;
    }

    // Address
    let address = '';
    const addrEl = document.querySelector(
      '[data-qa="street"], .street-field, input[name="street"], [class*="address"]'
    );
    if (addrEl) address = (addrEl.textContent || addrEl.value || '').trim();

    // DC Power — matches "13/13 kWp" or "13 kWp"
    let dcPowerKwp = 0;
    const kwpM = text.match(/(\d+(?:\.\d+)?)\s*\/\s*\d+(?:\.\d+)?\s*kWp/i)
               || text.match(/(\d+(?:\.\d+)?)\s*kWp/i);
    if (kwpM) dcPowerKwp = parseFloat(kwpM[1]);

    // Module count — matches "20/20"
    let modulesCount = 0;
    const modM = text.match(/(\d+)\s*\/\s*(\d+)/) || text.match(/(\d+)\s*PV\s*MODULES?/i);
    if (modM) modulesCount = parseInt(modM[2] || modM[1], 10);

    // Annual MWh
    let annualMwh = 0;
    const mwhM = text.match(/(\d+(?:\.\d+)?)\s*MWh/i);
    if (mwhM) annualMwh = parseFloat(mwhM[1]);

    console.log('[TNS Content] Extracted stats:', { projectName, dcPowerKwp, modulesCount, annualMwh });
    return {
      projectName, address, dcPowerKwp, modulesCount, annualMwh,
      sourceUrl: location.href,
      timestamp: new Date().toISOString()
    };
  }

  // ─── Toast ─────────────────────────────────────────────────────────────
  function toast(msg, ok = true) {
    const el = document.createElement('div');
    el.textContent = msg;
    Object.assign(el.style, {
      position: 'fixed', top: '20px', right: '20px',
      zIndex: '2147483647',
      background: ok ? '#0f172a' : '#b91c1c',
      color: '#fff',
      padding: '13px 22px', borderRadius: '14px',
      fontSize: '13px', fontWeight: '700',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      boxShadow: '0 20px 30px rgba(0,0,0,0.5)',
      maxWidth: '340px', lineHeight: '1.5'
    });
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.transition = 'opacity 0.3s';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 300);
    }, 5000);
  }

  // ─── Sync click ────────────────────────────────────────────────────────
  async function handleSyncClick() {
    const btn = document.getElementById('tns-sync-btn');
    if (btn) { btn.textContent = '⏳ กำลังดึงข้อมูลและภาพ...'; btn.style.opacity = '0.7'; }

    const stats = extractStats();

    chrome.runtime.sendMessage(
      { action: 'SYNC_SOLAREDGE_DATA', data: stats },
      (resp) => {
        if (chrome.runtime.lastError) {
          console.error('[TNS Content] runtime.lastError:', chrome.runtime.lastError.message);
          toast('❌ Extension Error: ' + chrome.runtime.lastError.message, false);
          restoreBtn();
          return;
        }
        console.log('[TNS Content] SW response:', resp);
        if (resp?.success) {
          const imgOk = resp.hasScreenshot;
          toast(
            imgOk
              ? '⚡ ส่งข้อมูล + ภาพ SolarEdge เข้า TNS Proposal เรียบร้อยแล้ว!'
              : '⚡ ส่งข้อมูลสำเร็จ แต่ไม่มีภาพ Screenshot (กรุณา Reload หน้า SolarEdge แล้วกด Sync อีกครั้ง)',
            imgOk
          );
        } else {
          toast('❌ เกิดข้อผิดพลาด: ' + (resp?.error || 'Unknown'), false);
        }
        restoreBtn();
      }
    );
  }

  function restoreBtn() {
    setTimeout(() => {
      const btn = document.getElementById('tns-sync-btn');
      if (btn) {
        btn.textContent = '⚡ Sync to TNS Proposal';
        btn.style.opacity = '1';
      }
    }, 3000);
  }

  // ─── Inject floating button ───────────────────────────────────────────
  function injectButton() {
    if (document.getElementById('tns-sync-btn')) return;
    if (!document.body) return;

    const btn = document.createElement('button');
    btn.id = 'tns-sync-btn';
    btn.textContent = '⚡ Sync to TNS Proposal';

    Object.assign(btn.style, {
      position: 'fixed', bottom: '24px', right: '24px',
      zIndex: '2147483647',
      background: 'linear-gradient(135deg,#059669,#0d9488)',
      color: '#fff',
      padding: '13px 24px',
      borderRadius: '50px',
      fontSize: '14px', fontWeight: '800',
      fontFamily: 'system-ui,-apple-system,sans-serif',
      boxShadow: '0 10px 30px rgba(5,150,105,0.65)',
      border: '2px solid rgba(255,255,255,0.4)',
      cursor: 'pointer',
      transition: 'transform .15s, opacity .15s'
    });

    btn.onmouseenter = () => { btn.style.transform = 'scale(1.05) translateY(-2px)'; };
    btn.onmouseleave = () => { btn.style.transform = 'scale(1) translateY(0)'; };
    btn.onclick = handleSyncClick;

    document.body.appendChild(btn);
    console.log('[TNS Content] Sync button injected');
  }

  // Listen for popup's GET_SOLAREDGE_DATA request
  chrome.runtime.onMessage.addListener((req, _sender, sendResponse) => {
    if (req.action === 'GET_SOLAREDGE_DATA') {
      sendResponse({ success: true, data: extractStats() });
    }
    return false;
  });

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectButton);
  } else {
    injectButton();
  }
  // Retry for SPA route changes
  setInterval(injectButton, 2000);
})();
