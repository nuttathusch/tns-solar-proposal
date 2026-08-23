import React, { useRef, useState } from 'react';
import type { ProposalProject } from '../../types/proposal';
import { PageCover } from './PageCover';
import { PageSitePictures } from './PageSitePictures';
import { PageRoofDesign } from './PageRoofDesign';
import { PageElectricBill } from './PageElectricBill';
import { PageSectionDivider } from './PageSectionDivider';
import { PageQuotation } from './PageQuotation';
import { PageROI } from './PageROI';
import { PageWarranty } from './PageWarranty';
import { PageSpecsheetPanelDivider, PageSpecsheetPanel1 } from './PageSpecsheetPanel';
import { PageInverterDivider, PageHuaweiSpecsheet, PageAtmoceSpecsheet } from './PageSpecsheetInverter';
import { PageSiteReferencesDivider, PageSiteReferencesPair } from './PageSiteReferences';
import { PageClosing } from './PageClosing';
import { Printer, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface DocumentViewerProps {
  proposal: ProposalProject;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ proposal }) => {
  const [zoom, setZoom] = useState<number>(0.85);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const { toggles, activeOptionsCount, option1, option2 } = proposal;

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-hidden select-none">
      {/* Top Toolbar */}
      <div className="no-print bg-slate-800 border-b border-slate-700 px-6 py-2.5 flex justify-between items-center z-20 shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-white text-xs font-bold uppercase tracking-wider bg-slate-700 px-2.5 py-1 rounded">
            Live Preview (A4 View)
          </span>
          <span className="text-slate-400 text-xs">
            {customerSummary(proposal)}
          </span>
        </div>

        {/* Zoom & Action Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-700 rounded-lg p-0.5 text-slate-300 mr-2">
            <button 
              onClick={() => setZoom(prev => Math.max(0.4, Number((prev - 0.1).toFixed(1))))}
              className="p-1 hover:bg-slate-600 hover:text-white rounded transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs px-2 font-mono font-medium text-white">
              {Math.round(zoom * 100)}%
            </span>
            <button 
              onClick={() => setZoom(prev => Math.min(1.3, Number((prev + 0.1).toFixed(1))))}
              className="p-1 hover:bg-slate-600 hover:text-white rounded transition"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setZoom(0.85)}
              className="p-1 hover:bg-slate-600 hover:text-white rounded transition ml-1"
              title="Reset Zoom"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-md transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์ / Export PDF (A4)</span>
          </button>
        </div>
      </div>

      {/* Pages Scroll View */}
      <div 
        ref={containerRef} 
        className="flex-1 overflow-y-auto overflow-x-auto p-8 flex flex-col items-center gap-8 bg-slate-900 scroll-smooth"
      >
        <div 
          style={{ 
            transform: `scale(${zoom})`, 
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out'
          }}
          className="flex flex-col gap-10 print:transform-none print:m-0 print:p-0 print:gap-0"
        >
          {/* Page 1: Cover */}
          {toggles.showCover && <PageCover proposal={proposal} />}

          {/* Pages 2-3: Site Pictures */}
          {toggles.showSitePictures && (
            <>
              <PageSitePictures proposal={proposal} pageIndex={0} />
              {(proposal.media.sitePhotos?.length || 0) > 2 && (
                <PageSitePictures proposal={proposal} pageIndex={1} />
              )}
            </>
          )}

          {/* Pages 4-5: SolarEdge Roof Design */}
          {toggles.showRoofDesigns && <PageRoofDesign proposal={proposal} />}

          {/* Page 6: Electric Bill Photo */}
          {toggles.showElectricBill && <PageElectricBill proposal={proposal} />}

          {/* Quotation 1 */}
          {toggles.showQuotation1 && (
            <>
              <PageSectionDivider option={option1} />
              <PageQuotation proposal={proposal} option={option1} quotationNo={proposal.quotationNumber} />
            </>
          )}

          {/* ROI 1 */}
          {toggles.showRoi1 && <PageROI proposal={proposal} option={option1} />}

          {/* Warranty 1 */}
          {toggles.showWarranty1 && <PageWarranty proposal={proposal} option={option1} />}

          {/* Quotation 2 (If active) */}
          {activeOptionsCount === 2 && toggles.showQuotation2 && (
            <>
              <PageSectionDivider option={option2} />
              <PageQuotation 
                proposal={proposal} 
                option={option2} 
                quotationNo={proposal.quotationNumber2 || `${proposal.quotationNumber}-B`} 
              />
            </>
          )}

          {/* ROI 2 */}
          {activeOptionsCount === 2 && toggles.showRoi2 && <PageROI proposal={proposal} option={option2} />}

          {/* Warranty 2 */}
          {activeOptionsCount === 2 && toggles.showWarranty2 && <PageWarranty proposal={proposal} option={option2} />}

          {/* Solar Panel Specsheet */}
          {toggles.showPanelSpecsheet && (
            <>
              <PageSpecsheetPanelDivider />
              <PageSpecsheetPanel1 />
            </>
          )}

          {/* Inverter 1 Specsheet */}
          {toggles.showInverterSpecsheet1 && (
            <>
              <PageInverterDivider brand={option1.brand} />
              {option1.brand === 'huawei' ? <PageHuaweiSpecsheet /> : <PageAtmoceSpecsheet />}
            </>
          )}

          {/* Inverter 2 Specsheet */}
          {activeOptionsCount === 2 && toggles.showInverterSpecsheet2 && (
            <>
              <PageInverterDivider brand={option2.brand} />
              {option2.brand === 'huawei' ? <PageHuaweiSpecsheet /> : <PageAtmoceSpecsheet />}
            </>
          )}

          {/* Site Reference Portfolio */}
          {toggles.showSiteReferences && (
            <>
              <PageSiteReferencesDivider />
              <PageSiteReferencesPair pairIndex={0} />
              <PageSiteReferencesPair pairIndex={1} />
              <PageSiteReferencesPair pairIndex={2} />
              <PageSiteReferencesPair pairIndex={3} />
            </>
          )}

          {/* Page 30: Closing */}
          {toggles.showClosingPage && <PageClosing />}
        </div>
      </div>
    </div>
  );
};

function customerSummary(proposal: ProposalProject): string {
  const name = proposal.customer.name || 'ลูกค้า';
  const kwp = proposal.systemSizeKwp || 13;
  return `${name} • ${kwp} kWp • ${proposal.quotationNumber}`;
}
