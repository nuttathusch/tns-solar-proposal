import React from 'react';
import type { InverterOptionConfig } from '../../types/proposal';
import { PageFooter } from './PageLayout';

interface PageSectionDividerProps {
  option: InverterOptionConfig;
}

export const PageSectionDivider: React.FC<PageSectionDividerProps> = ({ option }) => {
  return (
    <div className="a4-page relative flex flex-col justify-between bg-slate-900 text-white">
      {/* Top Banner */}
      <div className="pt-12 px-12 text-center">
        <h1 className="text-4xl font-black tracking-widest uppercase text-white" style={{ letterSpacing: '4px' }}>
          QUOTATION
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-sky-400 to-emerald-400 mx-auto mt-3 rounded-full" />
      </div>

      {/* Brand Hero Visual */}
      <div className="flex-1 px-10 flex flex-col items-center justify-center my-4">
        <div className="w-full max-w-[580px] bg-slate-800/80 border border-slate-700 rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Brand Logo & Name */}
          <div className="mb-6">
            {option.brand === 'huawei' && (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-red-600/30">
                  <span className="text-white font-black text-2xl tracking-tighter">H</span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-widest text-red-500">HUAWEI</h2>
                <span className="text-xs uppercase text-slate-400 tracking-wider mt-1">Smart PV & Energy Storage Solutions</span>
              </div>
            )}

            {option.brand === 'atmoce' && (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-rose-500/30">
                  <span className="text-white font-black text-2xl tracking-tighter">A</span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-widest text-rose-400">ATMOCE</h2>
                <span className="text-xs uppercase text-slate-400 tracking-wider mt-1">Next-Gen Microinverter & Energy Storage</span>
              </div>
            )}

            {option.brand === 'enphase' && (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#ea6b24] rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-orange-500/30">
                  <span className="text-white font-black text-2xl tracking-tighter">E</span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-widest text-[#ea6b24]">ENPHASE</h2>
                <span className="text-xs uppercase text-slate-400 tracking-wider mt-1">Energy Evolved - Microinverter System</span>
              </div>
            )}

            {option.brand === 'custom' && (
              <div className="flex flex-col items-center">
                <h2 className="text-3xl font-extrabold tracking-widest text-sky-400">{option.title}</h2>
              </div>
            )}
          </div>

          {/* System Highlight Card */}
          <div className="w-full bg-slate-900/90 rounded-xl p-5 border border-slate-700 text-left">
            <h4 className="text-sm font-bold text-white mb-2 pb-1 border-b border-slate-700">
              {option.title}
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">อินเวอร์เตอร์</span>
                <strong className="text-sky-300">{option.inverterModel} ({option.inverterType})</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">ระบบแบตเตอรี่</span>
                <strong className="text-emerald-300">{option.hasBattery ? `${option.batteryCapacityKwh} kWh Backup` : 'ไม่มีแบตเตอรี่'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">รับประกันอินเวอร์เตอร์</span>
                <strong className="text-amber-300">{option.warrantyInverterYears} ปี</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">ชั่วโมงแดดประเมิน</span>
                <strong className="text-white">{option.peakSunHours} ชม./วัน</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pb-1 bg-white text-slate-800">
        <PageFooter />
      </div>
    </div>
  );
};
