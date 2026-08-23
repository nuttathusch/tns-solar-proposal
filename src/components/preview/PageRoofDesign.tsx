import React from 'react';
import type { ProposalProject } from '../../types/proposal';
import { PageLayout } from './PageLayout';

interface PageRoofDesignProps {
  proposal: ProposalProject;
}

export const PageRoofDesign: React.FC<PageRoofDesignProps> = ({ proposal }) => {
  const { media, systemSizeKwp, panelCount } = proposal;

  return (
    <PageLayout subTitle="Site Picture">
      <div className="flex flex-col gap-5 h-full justify-center">
        {/* Top-down SolarEdge Layout */}
        <div className="w-full h-[370px] rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 relative flex items-center justify-center">
          {media.roofDesignTop ? (
            <img src={media.roofDesignTop} alt="SolarEdge 2D Top Layout" className="w-full h-full object-contain bg-slate-900" />
          ) : (
            <div className="text-center p-6 text-slate-300">
              <svg className="w-16 h-16 mx-auto mb-2 text-sky-400 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="font-semibold text-white">ภาพจำลองการจัดวางแผง 2D / Top-Down View</p>
              <p className="text-xs text-slate-400 mt-1">Exported from SolarEdge Designer</p>
            </div>
          )}

          {/* Overlay Stats Bar */}
          <div className="absolute bottom-2 left-4 right-4 bg-black/75 backdrop-blur-sm rounded-lg px-4 py-1.5 flex justify-between items-center text-[10px] text-white border border-slate-700">
            <span className="font-semibold">PV MODULES: <strong className="text-sky-400">{panelCount} แผง</strong></span>
            <span className="font-semibold">DC POWER: <strong className="text-emerald-400">{systemSizeKwp} kWp</strong></span>
            <span className="font-semibold">EST. ANNUAL PRODUCTION: <strong className="text-amber-400">~{Math.round(systemSizeKwp * 1450).toLocaleString()} kWh/yr</strong></span>
          </div>
        </div>

        {/* 3D Isometric View */}
        <div className="w-full h-[370px] rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 relative flex items-center justify-center">
          {media.roofDesignIso ? (
            <img src={media.roofDesignIso} alt="SolarEdge 3D Isometric" className="w-full h-full object-contain bg-slate-900" />
          ) : (
            <div className="text-center p-6 text-slate-300">
              <svg className="w-16 h-16 mx-auto mb-2 text-indigo-400 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="font-semibold text-white">ภาพจำลองหลังคา 3D Perspective / Isometric View</p>
              <p className="text-xs text-slate-400 mt-1">Exported from SolarEdge Designer</p>
            </div>
          )}

          {/* Overlay Stats Bar */}
          <div className="absolute bottom-2 left-4 right-4 bg-black/75 backdrop-blur-sm rounded-lg px-4 py-1.5 flex justify-between items-center text-[10px] text-white border border-slate-700">
            <span className="font-medium text-slate-300">หลังคา: <strong className="text-white">{proposal.roofType}</strong></span>
            <span className="font-medium text-slate-300">ชนิดแผง: <strong className="text-sky-300">LONGi Hi-MO X10 650W</strong></span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
