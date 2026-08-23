import React from 'react';
import { PageLayout } from './PageLayout';
import { SITE_REFERENCES, type SiteReferenceItem } from '../../data/references';

export const PageSiteReferencesDivider: React.FC = () => (
  <div className="a4-page relative flex flex-col justify-center items-center bg-slate-900 text-white">
    <div className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-6 border-y border-slate-700 text-center">
      <h1 className="text-4xl font-black tracking-widest uppercase text-white" style={{ letterSpacing: '4px' }}>
        EXAMPLE INSTALLATION PICTURE
      </h1>
      <p className="text-xs text-sky-400 font-semibold tracking-wider uppercase mt-2">
        TNS Solar System - Proven Installation References & Portfolio
      </p>
    </div>
  </div>
);

const ReferenceCard: React.FC<{ item: SiteReferenceItem }> = ({ item }) => (
  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white flex flex-col justify-between h-[340px]">
    {/* Card Top Stats Bar */}
    <div className="bg-slate-900 text-white p-2.5 flex justify-between items-center">
      <div>
        <h4 className="font-bold text-xs text-sky-400">{item.title}</h4>
        <span className="text-[8px] text-slate-400">{item.systemType} {item.invertersCount || item.panelsCount || ''}</span>
      </div>
      <div className="bg-[#0052cc] text-white px-3 py-1 rounded text-sm font-black tracking-wide">
        {item.kwp}
      </div>
    </div>

    {/* Center Image Mockup */}
    <div className="flex-1 bg-gradient-to-tr from-slate-800 to-slate-700 relative overflow-hidden flex items-center justify-center p-3">
      {/* Decorative solar grid pattern */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]" />
      <div className="text-center text-white z-10">
        <svg className="w-12 h-12 mx-auto mb-1 text-sky-400 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <span className="text-[11px] font-bold block">{item.title}</span>
        <span className="text-[8.5px] text-slate-300">{item.location}</span>
      </div>

      {/* Floating Badge */}
      {item.badge && (
        <span className="absolute top-2 right-2 bg-emerald-600/90 text-white text-[7.5px] font-bold px-2 py-0.5 rounded shadow-sm">
          {item.badge}
        </span>
      )}
    </div>

    {/* Card Bottom Savings Footer */}
    <div className="bg-slate-50 p-2.5 border-t border-slate-200 flex justify-between items-center text-[9px]">
      <div>
        <span className="text-slate-500 block text-[7.5px]">ผลประหยัดค่าไฟฟ้า</span>
        <strong className="text-emerald-700 text-xs">~ {item.monthlySavings} บาท/เดือน</strong>
      </div>
      <div className="text-right">
        <span className="text-slate-500 block text-[7.5px]">เหมาะกับค่าไฟฟ้า</span>
        <strong className="text-slate-800 text-[9px]">{item.suitableBill}</strong>
      </div>
    </div>
  </div>
);

export const PageSiteReferencesPair: React.FC<{ pairIndex: number }> = ({ pairIndex }) => {
  const startIdx = pairIndex * 2;
  const item1 = SITE_REFERENCES[startIdx];
  const item2 = SITE_REFERENCES[startIdx + 1];

  return (
    <PageLayout pageTitle="Example Installation Picture">
      <div className="flex flex-col gap-5 justify-center h-full">
        {item1 && <ReferenceCard item={item1} />}
        {item2 && <ReferenceCard item={item2} />}
      </div>
    </PageLayout>
  );
};
