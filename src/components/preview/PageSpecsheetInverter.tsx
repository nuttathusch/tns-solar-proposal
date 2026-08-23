import React from 'react';
import type { InverterBrand } from '../../types/proposal';
import { PageFooter } from './PageLayout';

export const PageInverterDivider: React.FC<{ brand: InverterBrand }> = ({ brand }) => (
  <div className="a4-page relative flex flex-col justify-center items-center bg-slate-900 text-white">
    <div className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-6 border-y border-slate-700 text-center">
      <h1 className="text-4xl font-black tracking-widest uppercase text-white" style={{ letterSpacing: '4px' }}>
        {brand.toUpperCase()}
      </h1>
      <p className="text-xs text-sky-400 font-semibold tracking-wider uppercase mt-2">
        Smart PV & Energy Storage Inverter Specifications
      </p>
    </div>
  </div>
);

export const PageHuaweiSpecsheet: React.FC = () => {
  return (
    <div className="a4-page relative flex flex-col justify-between bg-white text-slate-800 p-8 pb-20">
      {/* Top Header */}
      <div className="flex justify-between items-start border-b border-slate-200 pb-3">
        <div>
          <span className="text-xs font-bold text-slate-500">SUN2000-12/15/17/20/25KTL-M5</span>
          <h2 className="text-2xl font-black text-slate-900">Smart PV Controller</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
            H
          </div>
          <span className="text-xl font-black text-red-600">HUAWEI</span>
        </div>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-3 gap-3 my-4 text-center">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full mx-auto flex items-center justify-center mb-1.5 font-bold text-xs">
            🛡️
          </div>
          <h4 className="font-bold text-xs text-slate-800">Active Safety</h4>
          <p className="text-[8px] text-slate-500 mt-0.5">AI Powered Arcing Protection (AFCI)</p>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center mb-1.5 font-bold text-xs">
            📈
          </div>
          <h4 className="font-bold text-xs text-slate-800">Higher Yields</h4>
          <p className="text-[8px] text-slate-500 mt-0.5">Up to 30% More Energy with Optimizer</p>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="w-8 h-8 bg-sky-100 text-sky-600 rounded-full mx-auto flex items-center justify-center mb-1.5 font-bold text-xs">
            📶
          </div>
          <h4 className="font-bold text-xs text-slate-800">Flexible Communication</h4>
          <p className="text-[8px] text-slate-500 mt-0.5">WLAN, Fast Ethernet, 4G Supported</p>
        </div>
      </div>

      {/* Tech Specifications Table */}
      <div className="border border-slate-300 rounded-xl overflow-hidden text-[8px]">
        <div className="bg-slate-800 text-white font-bold px-3 py-1.5 flex justify-between">
          <span>Technical Specifications - SUN2000-15KTL-M5</span>
          <span>Efficiency 98.4%</span>
        </div>
        <div className="divide-y divide-slate-200 bg-white">
          <div className="grid grid-cols-12 p-1.5 bg-slate-50 font-semibold text-slate-700">
            <div className="col-span-6">Efficiency & Input</div>
            <div className="col-span-6">Output & Protection</div>
          </div>
          <div className="grid grid-cols-12 p-1.5">
            <div className="col-span-6 pr-2 space-y-0.5">
              <div className="flex justify-between"><span>Max. Efficiency:</span> <strong>98.4%</strong></div>
              <div className="flex justify-between"><span>European Weighted Efficiency:</span> <strong>98.0%</strong></div>
              <div className="flex justify-between"><span>Recommended Max. PV Power:</span> <strong>22,500 Wp</strong></div>
              <div className="flex justify-between"><span>Max. Input Voltage:</span> <strong>1,100 V</strong></div>
              <div className="flex justify-between"><span>MPPT Operating Voltage Range:</span> <strong>200 V ~ 1,000 V</strong></div>
              <div className="flex justify-between"><span>Number of MPP Trackers:</span> <strong>2 MPPT (4 Inputs)</strong></div>
            </div>
            <div className="col-span-6 pl-2 space-y-0.5 border-l border-slate-200">
              <div className="flex justify-between"><span>Grid Connection:</span> <strong>Three Phase 380V/400V</strong></div>
              <div className="flex justify-between"><span>Rated Output Power:</span> <strong>15,000 W</strong></div>
              <div className="flex justify-between"><span>Max. Apparent Power:</span> <strong>16,500 VA</strong></div>
              <div className="flex justify-between"><span>DC Surge Protection:</span> <strong>TYPE II</strong></div>
              <div className="flex justify-between"><span>AC Surge Protection:</span> <strong>CLASS II</strong></div>
              <div className="flex justify-between"><span>Ingress Protection:</span> <strong>IP66 (Outdoor)</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* FusionSolar Mobile App Banner */}
      <div className="my-3 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-600 text-white rounded-lg flex items-center justify-center font-bold text-xs shadow-sm">
            ☀️
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-800">FusionSolar Mobile App</h4>
            <p className="text-[8px] text-slate-600">Smart String Inverter Real-time Monitoring & Control</p>
          </div>
        </div>
        <div className="text-right text-[8px] text-slate-600">
          <span className="bg-sky-600 text-white px-2 py-0.5 rounded font-semibold">Real-Time Yield & Load</span>
        </div>
      </div>

      <PageFooter />
    </div>
  );
};

export const PageAtmoceSpecsheet: React.FC = () => {
  return (
    <div className="a4-page relative flex flex-col justify-between bg-white text-slate-800 p-8 pb-20">
      {/* Top Header */}
      <div className="flex justify-between items-start border-b border-slate-200 pb-3">
        <div>
          <span className="text-xs font-bold text-slate-500">ATMOCE Microinverter System</span>
          <h2 className="text-2xl font-black text-slate-900">เล็ก แต่ทรงพลัง (Compact & Powerful)</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
            A
          </div>
          <span className="text-xl font-black text-rose-600">ATMOCE</span>
        </div>
      </div>

      {/* Grid Highlights */}
      <div className="grid grid-cols-3 gap-3 my-4 text-center">
        <div className="bg-slate-900 text-white p-4 rounded-xl shadow-md">
          <span className="text-2xl font-black text-sky-400">1250W</span>
          <p className="text-[8px] text-slate-300 uppercase mt-1">กำลังไฟฟ้าสูง (2:1 per Micro)</p>
        </div>

        <div className="bg-slate-900 text-white p-4 rounded-xl shadow-md">
          <span className="text-2xl font-black text-emerald-400">98.2%</span>
          <p className="text-[8px] text-slate-300 uppercase mt-1">ประสิทธิภาพสูงสุด (Max Efficiency)</p>
        </div>

        <div className="bg-slate-900 text-white p-4 rounded-xl shadow-md">
          <span className="text-2xl font-black text-amber-400">25 ปี</span>
          <p className="text-[8px] text-slate-300 uppercase mt-1">รับประกันยาวนาน (Warranty)</p>
        </div>
      </div>

      {/* Safety & Technology Features */}
      <div className="grid grid-cols-2 gap-3 my-2 text-xs">
        <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl">
          <span className="font-bold text-rose-700 block text-sm">ปลอดภัยสูงด้วยแรงดันต่ำพิเศษ &lt;60Vdc</span>
          <p className="text-[8.5px] text-slate-600 mt-1">
            ไม่มีประกายไฟ DC High Voltage ขจัดความเสี่ยงการเกิดเพลิงไหม้บนหลังคา 100%
          </p>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-xl">
          <span className="font-bold text-indigo-700 block text-sm">เทคโนโลยี MLPE & SPoF Prevention</span>
          <p className="text-[8.5px] text-slate-600 mt-1">
            แยกการทำงานอิสระแต่ละคู่แผง หากแผงใดมีเงาบัง แผงอื่นยังคงผลิตไฟได้เต็มกำลัง 100%
          </p>
        </div>
      </div>

      {/* Atmozen App Banner */}
      <div className="my-3 bg-slate-900 text-white p-4 rounded-xl border border-slate-700 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-sm text-rose-400">Atmozen APP</h4>
          <p className="text-[8.5px] text-slate-300 mt-0.5">จัดการระบบโซลาร์จากระยะไกลแบบเรียลไทม์ ตรวจสอบการผลิตและการจ่ายไฟ</p>
        </div>
        <div className="bg-rose-600 text-white text-[9px] font-bold px-3 py-1 rounded">
          IoT Cloud Monitoring
        </div>
      </div>

      <PageFooter />
    </div>
  );
};
