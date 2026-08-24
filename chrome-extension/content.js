// TNS SolarEdge 1-Click Sync - Content Script (runs on designer.solaredge.com)

(function () {
  if (document.__TNS_LOADED) return;
  document.__TNS_LOADED = true;

  console.log('[TNS Solar] Content script loaded on SolarEdge Designer');

  // ─── Inject floating sync button ───────────────────────────────────────────
  function injectFloatingButton() {
    if (document.getElementById('tns-sync-floating-btn')) return;
    if (!document.body) return;

    const btn = document.createElement('button');
    btn.id = 'tns-sync-floating-btn';
    btn.innerHTML = `
      <span style="font-size:18px;">⚡</span>
      <span>Sync to TNS Proposal</span>
    `;
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: '2147483647',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
      color: '#ffffff',
      padding: '13px 22px',
      borderRadius: '50px',
      fontSize: '14px',
      fontWeight: '800',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      boxShadow: '0 10px 30px rgba(5,150,105,0.6)',
      border: '2px solid rgba(255,255,255,0.4)',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    });

    btn.onmouseenter = () => { btn.style.transform = 'translateY(-2px) scale(1.04)'; };
    btn.onmouseleave = () => { btn.style.transform = 'translateY(0) scale(1)'; };
    btn.onclick = handleSyncClick;

    document.body.appendChild(btn);
  }

  // ─── Extract stats from SolarEdge DOM ─────────────────────────────────────
  function extractStats() {
    const pageText = document.body.innerText || '';

    // Project name: try header or document title
    let projectName = '';
    const nameEl = document.querySelector(
      '[data-qa="project-name"], .project-name, .site-name, .header-site-name'
    );
    if (nameEl) projectName = (nameEl.textContent || '').trim();
    if (!projectName) {
      const m = document.title.match(/SolarEdge\s*-?\s*Designer\s*[|–-]?\s*(.*)/i);
      projectName = m ? m[1].trim() : document.title.trim();
    }

    // Address
    let address = '';
    const addrEl = document.querySelector('[data-qa="street"], .street-field, input[name="street"]');
    if (addrEl) address = (addrEl.textContent || addrEl.value || '').trim();

    // DC Power (e.g. "13/13 kWp" → 13)
    let dcPowerKwp = 0;
    const kwpMatch = pageText.match(/(\d+(?:\.\d+)?)\s*\/\s*\d+(?:\.\d+)?\s*kWp/i)
                  || pageText.match(/(\d+(?:\.\d+)?)\s*kWp/i);
    if (kwpMatch) dcPowerKwp = parseFloat(kwpMatch[1]);

    // Module count (e.g. "20/20" → 20)
    let modulesCount = 0;
    const modMatch = pageText.match(/(\d+)\s*\/\s*(\d+)\s*(?:PV)?/)
                  || pageText.match(/(\d+)\s*PV\s*MODULES?/i);
    if (modMatch) modulesCount = parseInt(modMatch[2] || modMatch[1], 10);

    // Annual production (e.g. "18.96 MWh")
    let annualMwh = 0;
    const mwhMatch = pageText.match(/(\d+(?:\.\d+)?)\s*MWh/i);
    if (mwhMatch) annualMwh = parseFloat(mwhMatch[1]);

    return { projectName, address, dcPowerKwp, modulesCount, annualMwh,
             sourceUrl: location.href, timestamp: new Date().toISOString() };
  }

  // ─── Show toast ───────────────────────────────────────────────────────────
  function showToast(msg, ok = true) {
    const t = document.createElement('div');
    t.textContent = msg;
    Object.assign(t.style, {
      position: 'fixed', top: '20px', right: '20px', zIndex: '2147483647',
      background: ok ? '#0f172a' : '#991b1b', color: '#fff',
      padding: '14px 22px', borderRadius: '14px',
      fontSize: '14px', fontWeight: '700',
      boxShadow: '0 20px 30px rgba(0,0,0,0.5)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '320px'
    });
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 4000);
  }

  // ─── Main sync click handler ───────────────────────────────────────────────
  async function handleSyncClick() {
    const btn = document.getElementById('tns-sync-floating-btn');
    if (btn) { btn.textContent = 'กำลังส่งข้อมูล...'; btn.style.opacity = '0.7'; }

    const stats = extractStats();
    console.log('[TNS Solar] Sending stats to background:', stats);

    chrome.runtime.sendMessage(
      { action: 'SYNC_SOLAREDGE_DATA', data: stats },
      (resp) => {
        if (chrome.runtime.lastError) {
          console.error('[TNS Solar] sendMessage error:', chrome.runtime.lastError.message);
          showToast('❌ Extension Error: ' + chrome.runtime.lastError.message, false);
        } else if (resp && resp.success) {
          showToast('⚡ ส่งข้อมูลไปยัง TNS Proposal เรียบร้อยแล้ว! กำลังเปิดหน้าเว็บ...');
        } else {
          showToast('⚠️ ส่งข้อมูลแล้ว แต่ไม่พบแท็บ TNS Proposal Studio ที่เปิดค้างไว้');
        }
        // Restore button after 3s
        setTimeout(() => {
          if (btn) {
            btn.innerHTML = '<span style="font-size:18px;">⚡</span><span>Sync to TNS Proposal</span>';
            btn.style.opacity = '1';
          }
        }, 3000);
      }
    );
  }

  // ─── Listen for popup requests ─────────────────────────────────────────────
  chrome.runtime.onMessage.addListener((req, _sender, sendResponse) => {
    if (req.action === 'GET_SOLAREDGE_DATA') {
      sendResponse({ success: true, data: extractStats() });
    }
    return false;
  });

  // ─── Boot ─────────────────────────────────────────────────────────────────
  function boot() {
    injectFloatingButton();
    // Re-check every 2 s in case SolarEdge SPA navigates away
    setInterval(injectFloatingButton, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
