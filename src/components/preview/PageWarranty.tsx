import React from 'react';
import type { ProposalProject, InverterOptionConfig } from '../../types/proposal';
import { PageLayout } from './PageLayout';
import { MAINTENANCE_9_TASKS } from '../../data/presets';

interface PageWarrantyProps {
  proposal: ProposalProject;
  option: InverterOptionConfig;
}

export const PageWarranty: React.FC<PageWarrantyProps> = ({ proposal, option }) => {
  return (
    <PageLayout>
      <div className="flex flex-col justify-between h-full py-1 text-slate-800">
        {/* Top Header */}
        <div className="text-center mb-4">
          <h2 className="text-3xl font-black text-[#0f3460] tracking-tight">
            Warranty & Services
          </h2>
          <div className="inline-block bg-rose-50 text-rose-700 px-4 py-1 rounded-full text-xs font-bold border border-rose-200 mt-1">
            {option.inverterType.toUpperCase()} INVERTER &nbsp;|&nbsp; ประกันงานติดตั้ง {proposal.systemWarrantyYears} ปี
          </div>
        </div>

        {/* 3 Warranty Pillars / Badges */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Pillar 1: Solar Panel */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center shadow-xs">
            <div className="w-12 h-12 bg-sky-100 text-sky-700 rounded-xl flex items-center justify-center mb-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h4 className="font-extrabold text-xs text-slate-800 uppercase">PV PANELS</h4>
            <span className="text-[10px] text-slate-500">รับประกันแผงโซล่าร์เซลล์</span>
            <div className="mt-2 text-xl font-black text-[#0f3460]">
              {option.warrantyPanelProductYears} / {option.warrantyPanelLinearYears} ปี
            </div>
            <span className="text-[8px] text-slate-400 mt-0.5">วัสดุ 15 ปี / ประสิทธิภาพ 30 ปี</span>
          </div>

          {/* Pillar 2: Inverter */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center shadow-xs">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center mb-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="font-extrabold text-xs text-slate-800 uppercase">{option.brand.toUpperCase()} INVERTER</h4>
            <span className="text-[10px] text-slate-500">รับประกันอินเวอร์เตอร์</span>
            <div className="mt-2 text-xl font-black text-[#0f3460]">
              {option.warrantyInverterYears} ปี
            </div>
            <span className="text-[8px] text-slate-400 mt-0.5">{option.inverterModel}</span>
          </div>

          {/* Pillar 3: Installation & Service */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center shadow-xs">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 className="font-extrabold text-xs text-slate-800 uppercase">INSTALLATION</h4>
            <span className="text-[10px] text-slate-500">รับประกันงานติดตั้ง</span>
            <div className="mt-2 text-xl font-black text-emerald-600">
              {proposal.systemWarrantyYears} ปี
            </div>
            <span className="text-[8px] text-slate-400 mt-0.5">พร้อมบริการล้างแผงและตรวจเช็ค</span>
          </div>
        </div>

        {/* 9-Task Maintenance Schedule Table */}
        <div className="border border-slate-300 rounded-xl overflow-hidden shadow-xs mb-2">
          <div className="bg-[#0f3460] text-white px-4 py-2 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-xs">รายละเอียดการบำรุงรักษาระบบ Solar Cell</h4>
              <p className="text-[8px] text-slate-300">Description of Annual Maintenance Tasks</p>
            </div>
            <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded font-semibold">TNS Maintenance Service</span>
          </div>

          <div className="divide-y divide-slate-200 text-[9.5px]">
            {MAINTENANCE_9_TASKS.map((task, idx) => (
              <div key={idx} className="flex justify-between items-center px-4 py-1.5 bg-white hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[9px]">
                    {idx + 1}
                  </span>
                  <span className="text-slate-800 font-medium">{task}</span>
                </div>
                <div className="font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200 text-[8.5px]">
                  1 ครั้ง / ปี
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
