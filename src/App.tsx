import { useState, useEffect } from 'react';
import type { ProposalProject } from './types/proposal';
import { loadCurrentProposal, saveProposal, exportProposalAsJson } from './utils/storage';
import { createInitialProposal } from './data/presets';
import { Header } from './components/Header';
import { StepCustomer } from './components/wizard/StepCustomer';
import { StepSystem } from './components/wizard/StepSystem';
import { StepImages } from './components/wizard/StepImages';
import { StepQuotation } from './components/wizard/StepQuotation';
import { StepPages } from './components/wizard/StepPages';
import { DocumentViewer } from './components/preview/DocumentViewer';
import { PageCover } from './components/preview/PageCover';
import { PageSitePictures } from './components/preview/PageSitePictures';
import { PageRoofDesign } from './components/preview/PageRoofDesign';
import { PageElectricBill } from './components/preview/PageElectricBill';
import { PageSectionDivider } from './components/preview/PageSectionDivider';
import { PageQuotation } from './components/preview/PageQuotation';
import { PageROI } from './components/preview/PageROI';
import { PageWarranty } from './components/preview/PageWarranty';
import { PageSpecsheetPanelDivider, PageSpecsheetPanel1 } from './components/preview/PageSpecsheetPanel';
import { PageInverterDivider, PageHuaweiSpecsheet, PageAtmoceSpecsheet } from './components/preview/PageSpecsheetInverter';
import { PageSiteReferencesDivider, PageSiteReferencesPair } from './components/preview/PageSiteReferences';
import { PageClosing } from './components/preview/PageClosing';
import { User, Sun, Image as ImageIcon, FileText, BookOpen, ChevronLeft, ChevronRight, Eye, CheckCircle2 } from 'lucide-react';

type WizardTab = 'customer' | 'system' | 'images' | 'quotation' | 'pages';

export default function App() {
  const [proposal, setProposal] = useState<ProposalProject>(loadCurrentProposal);
  const [activeView, setActiveView] = useState<'wizard' | 'preview'>('wizard');
  const [activeTab, setActiveTab] = useState<WizardTab>('customer');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Auto save whenever proposal changes
  useEffect(() => {
    saveProposal(proposal);
  }, [proposal]);

  // Listen for TNS Chrome Extension 1-Click Sync events
  useEffect(() => {
    const handleExtensionMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'TNS_SOLAREDGE_SYNC') {
        const payload = event.data.payload;
        console.log('[TNS App] Received sync from Chrome Extension:', payload);
        
        setProposal(prev => {
          const updated = { ...prev };
          if (payload.projectName) {
            updated.customer = { ...updated.customer, name: payload.projectName };
          }
          if (payload.street) {
            updated.customer = { ...updated.customer, address: payload.street };
          }
          if (payload.dcPowerKwp && payload.dcPowerKwp > 0) {
            updated.systemSizeKwp = payload.dcPowerKwp;
          }
          if (payload.modulesCount && payload.modulesCount > 0) {
            updated.panelCount = payload.modulesCount;
          }
          if (payload.canvasDataUrl) {
            updated.media = {
              ...updated.media,
              roofDesignTop: payload.canvasDataUrl,
              roofDesignIso: payload.canvasDataUrl
            };
          }
          return updated;
        });

        alert(`⚡ ได้รับข้อมูลจาก SolarEdge เรียบร้อยแล้ว!\n• โครงการ: ${payload.projectName || 'SolarEdge Design'}\n• กำลังผลิต: ${payload.dcPowerKwp || '13'} kWp\n• จำนวนแผง: ${payload.modulesCount || '20'} แผง\n• บันทึกรูปภาพ 2D/3D เข้าเล่ม Proposal เรียบร้อยแล้วครับ!`);
      }
    };

    window.addEventListener('message', handleExtensionMessage);
    return () => window.removeEventListener('message', handleExtensionMessage);
  }, []);

  const handleManualSave = () => {
    saveProposal(proposal);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleNewProposal = () => {
    if (confirm('คุณต้องการสร้างเอกสาร Proposal ใหม่ใช่หรือไม่? (ข้อมูลปัจจุบันจะถูกรีเซ็ตเป็นค่าเริ่มต้น)')) {
      const fresh = createInitialProposal();
      setProposal(fresh);
      saveProposal(fresh);
      setActiveTab('customer');
      setActiveView('wizard');
    }
  };

  const handleExportJson = () => {
    exportProposalAsJson(proposal);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const wizardSteps: { id: WizardTab; title: string; subtitle: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'customer', title: '1. ข้อมูลลูกค้า & บิลค่าไฟ', subtitle: 'ชื่อ ที่อยู่ พิกัด และประเมินขนาด', icon: User },
    { id: 'system', title: '2. ขนาดระบบ & Inverter', subtitle: 'Huawei / ATMOCE / Enphase / แบตฯ', icon: Sun },
    { id: 'images', title: '3. รูปภาพ & SolarEdge', subtitle: 'ภาพบ้าน ภาพ 3D และบิลไฟ', icon: ImageIcon },
    { id: 'quotation', title: '4. ใบเสนอราคา & ราคา', subtitle: 'BoM อุปกรณ์ ราคา และส่วนลด', icon: FileText },
    { id: 'pages', title: '5. เลือกหน้าในเล่ม', subtitle: 'เปิด/ปิด Specsheet และ Portfolio', icon: BookOpen },
  ];

  const currentStepIdx = wizardSteps.findIndex(s => s.id === activeTab);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-['Prompt',sans-serif]">
      {/* Top Navbar */}
      <Header
        proposal={proposal}
        activeView={activeView}
        onViewChange={setActiveView}
        onNewProposal={handleNewProposal}
        onSave={handleManualSave}
        onExportJson={handleExportJson}
        onPrintPdf={handlePrintPdf}
        isSaved={isSaved}
      />

      {/* Main View Area */}
      {activeView === 'preview' ? (
        <div className="flex-1 h-[calc(100vh-64px)]">
          <DocumentViewer proposal={proposal} />
        </div>
      ) : (
        <main className="no-print flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
          {/* Step Navigation Bar */}
          <div className="bg-white rounded-2xl p-2 shadow-xs border border-slate-200">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-1">
              {wizardSteps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = activeTab === step.id;
                const isPassed = idx < currentStepIdx;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveTab(step.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl transition cursor-pointer text-left ${
                      isActive
                        ? 'bg-blue-50/90 text-blue-900 ring-1 ring-blue-500/30'
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : isPassed
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {isPassed ? '✓' : <Icon className="w-4 h-4" />}
                    </div>

                    <div className="overflow-hidden">
                      <div className="text-xs font-bold truncate">{step.title}</div>
                      <div className="text-[10px] text-slate-400 truncate">{step.subtitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step Content Card */}
          <div className="flex-1 pb-16">
            {activeTab === 'customer' && <StepCustomer proposal={proposal} onChange={setProposal} />}
            {activeTab === 'system' && <StepSystem proposal={proposal} onChange={setProposal} />}
            {activeTab === 'images' && <StepImages proposal={proposal} onChange={setProposal} />}
            {activeTab === 'quotation' && <StepQuotation proposal={proposal} onChange={setProposal} />}
            {activeTab === 'pages' && <StepPages proposal={proposal} onChange={setProposal} />}

            {/* Bottom Wizard Navigation Footer */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center">
              <button
                type="button"
                disabled={currentStepIdx === 0}
                onClick={() => setActiveTab(wizardSteps[currentStepIdx - 1].id)}
                className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currentStepIdx === 0
                    ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-200'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>ย้อนกลับ</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveView('preview')}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-sky-400" />
                  <span>ดูเล่ม Proposal จริง</span>
                </button>

                {currentStepIdx < wizardSteps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab(wizardSteps[currentStepIdx + 1].id)}
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow transition cursor-pointer"
                  >
                    <span>ขั้นตอนถัดไป</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveView('preview')}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>เสร็จสิ้นและดูผลงาน</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Hidden Print Container - Active Only on window.print() */}
      <div className="print-only hidden">
        {proposal.toggles.showCover && <PageCover proposal={proposal} />}
        {proposal.toggles.showSitePictures && (
          <>
            <PageSitePictures proposal={proposal} pageIndex={0} />
            {(proposal.media.sitePhotos?.length || 0) > 2 && (
              <PageSitePictures proposal={proposal} pageIndex={1} />
            )}
          </>
        )}
        {proposal.toggles.showRoofDesigns && <PageRoofDesign proposal={proposal} />}
        {proposal.toggles.showElectricBill && <PageElectricBill proposal={proposal} />}
        
        {proposal.toggles.showQuotation1 && (
          <>
            <PageSectionDivider option={proposal.option1} />
            <PageQuotation proposal={proposal} option={proposal.option1} quotationNo={proposal.quotationNumber} />
          </>
        )}
        {proposal.toggles.showRoi1 && <PageROI proposal={proposal} option={proposal.option1} />}
        {proposal.toggles.showWarranty1 && <PageWarranty proposal={proposal} option={proposal.option1} />}

        {proposal.activeOptionsCount === 2 && proposal.toggles.showQuotation2 && (
          <>
            <PageSectionDivider option={proposal.option2} />
            <PageQuotation 
              proposal={proposal} 
              option={proposal.option2} 
              quotationNo={proposal.quotationNumber2 || `${proposal.quotationNumber}-B`} 
            />
          </>
        )}
        {proposal.activeOptionsCount === 2 && proposal.toggles.showRoi2 && (
          <PageROI proposal={proposal} option={proposal.option2} />
        )}
        {proposal.activeOptionsCount === 2 && proposal.toggles.showWarranty2 && (
          <PageWarranty proposal={proposal} option={proposal.option2} />
        )}

        {proposal.toggles.showPanelSpecsheet && (
          <>
            <PageSpecsheetPanelDivider />
            <PageSpecsheetPanel1 />
          </>
        )}

        {proposal.toggles.showInverterSpecsheet1 && (
          <>
            <PageInverterDivider brand={proposal.option1.brand} />
            {proposal.option1.brand === 'huawei' ? <PageHuaweiSpecsheet /> : <PageAtmoceSpecsheet />}
          </>
        )}

        {proposal.activeOptionsCount === 2 && proposal.toggles.showInverterSpecsheet2 && (
          <>
            <PageInverterDivider brand={proposal.option2.brand} />
            {proposal.option2.brand === 'huawei' ? <PageHuaweiSpecsheet /> : <PageAtmoceSpecsheet />}
          </>
        )}

        {proposal.toggles.showSiteReferences && (
          <>
            <PageSiteReferencesDivider />
            <PageSiteReferencesPair pairIndex={0} />
            <PageSiteReferencesPair pairIndex={1} />
            <PageSiteReferencesPair pairIndex={2} />
            <PageSiteReferencesPair pairIndex={3} />
          </>
        )}

        {proposal.toggles.showClosingPage && <PageClosing />}
      </div>
    </div>
  );
}
