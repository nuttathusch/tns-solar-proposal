import React from 'react';

export const PageSpecsheetPanelDivider: React.FC = () => (
  <div className="a4-page relative flex flex-col justify-center items-center bg-slate-900 text-white">
    <div className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-6 border-y border-slate-700 text-center">
      <h1 className="text-4xl font-black tracking-widest uppercase text-white" style={{ letterSpacing: '6px' }}>
        SOLAR PANEL
      </h1>
      <p className="text-xs text-sky-400 font-semibold tracking-wider uppercase mt-2">
        LONGi Hi-MO X10 650W N-Type BC-CELL
      </p>
    </div>
  </div>
);

export const PageSpecsheetPanel1: React.FC = () => {
  return (
    <div className="a4-page relative flex flex-col justify-between bg-white text-slate-800 p-8">
      {/* Top Brand Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-slate-900">Hi-MO</span>
            <span className="bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded">X10</span>
            <span className="text-xl font-bold text-slate-700">Explorer</span>
          </div>
          <h2 className="text-xs font-bold text-slate-500 mt-1">LR7-72HVH</h2>
          <h3 className="text-3xl font-black text-slate-900">630~650M</h3>
        </div>

        <div className="text-right">
          <span className="text-2xl font-black text-red-600">LONGi</span>
        </div>
      </div>

      {/* Hero Feature Badges */}
      <div className="my-3 space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600" />
          <span className="font-semibold text-slate-800">Suitable for Distribution Market & Residential Rooftops</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600" />
          <span className="font-semibold text-slate-800">Highest efficiency with the best energy generation performance</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600" />
          <span className="font-semibold text-slate-800">TaiRay wafer & BC technology enhances high product reliability</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600" />
          <span className="font-semibold text-slate-800">Smart manufacturing & LONGi product lifecycle standards</span>
        </div>
      </div>

      {/* Warranty Badges */}
      <div className="flex gap-4 my-2">
        <div className="flex-1 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-red-600 text-red-600 font-black flex items-center justify-center text-sm">
            15
          </div>
          <div>
            <span className="font-bold text-xs text-slate-900 block">15-Year Warranty</span>
            <span className="text-[9px] text-slate-600">for Materials and Processing</span>
          </div>
        </div>

        <div className="flex-1 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-red-600 text-red-600 font-black flex items-center justify-center text-sm">
            30
          </div>
          <div>
            <span className="font-bold text-xs text-slate-900 block">30-Year Warranty</span>
            <span className="text-[9px] text-slate-600">for Extra Linear Power Output</span>
          </div>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-4 gap-2 my-3 text-center bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-800">
        <div>
          <span className="text-xl font-black text-red-600">24.1%</span>
          <span className="text-[8px] block font-semibold text-slate-600 uppercase">MAX MODULE EFFICIENCY</span>
        </div>
        <div>
          <span className="text-xl font-black text-slate-800">0~3%</span>
          <span className="text-[8px] block font-semibold text-slate-600 uppercase">POWER TOLERANCE</span>
        </div>
        <div>
          <span className="text-xl font-black text-emerald-600">&lt;1%</span>
          <span className="text-[8px] block font-semibold text-slate-600 uppercase">FIRST YEAR DEGRADATION</span>
        </div>
        <div>
          <span className="text-xl font-black text-slate-800">0.35%</span>
          <span className="text-[8px] block font-semibold text-slate-600 uppercase">YEAR 2-30 DEGRADATION</span>
        </div>
      </div>

      {/* Technical Data Table */}
      <div className="border border-slate-300 rounded-lg overflow-hidden text-[8px] text-slate-800">
        <div className="bg-slate-800 text-white font-bold p-1.5 text-center">
          Electrical Characteristics (STC: AM1.5 1000W/m² 25°C) - LR7-72HVH-650M
        </div>
        <div className="grid grid-cols-2 divide-x divide-slate-200">
          <div className="p-2 space-y-1">
            <div className="flex justify-between border-b pb-0.5">
              <span>Maximum Power (Pmax)</span>
              <strong>650 W</strong>
            </div>
            <div className="flex justify-between border-b pb-0.5">
              <span>Open Circuit Voltage (Voc)</span>
              <strong>53.90 V</strong>
            </div>
            <div className="flex justify-between border-b pb-0.5">
              <span>Short Circuit Current (Isc)</span>
              <strong>15.29 A</strong>
            </div>
            <div className="flex justify-between">
              <span>Voltage at Max Power (Vmp)</span>
              <strong>44.56 V</strong>
            </div>
          </div>

          <div className="p-2 space-y-1">
            <div className="flex justify-between border-b pb-0.5">
              <span>Current at Max Power (Imp)</span>
              <strong>14.59 A</strong>
            </div>
            <div className="flex justify-between border-b pb-0.5">
              <span>Module Efficiency</span>
              <strong className="text-red-600">24.1%</strong>
            </div>
            <div className="flex justify-between border-b pb-0.5">
              <span>Dimensions</span>
              <strong>2382 x 1134 x 30 mm</strong>
            </div>
            <div className="flex justify-between">
              <span>Weight</span>
              <strong>28.5 kg</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Certs */}
      <div className="flex justify-between items-center text-[7.5px] text-slate-500 pt-2 border-t border-slate-200">
        <span>Complete System and Product Certifications: IEC 61215, IEC 61730, UL 61730, ISO 9001/14001/45001</span>
        <span className="font-bold text-red-600">LONGi Solar</span>
      </div>
    </div>
  );
};
