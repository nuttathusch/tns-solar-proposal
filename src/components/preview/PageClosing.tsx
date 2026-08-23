import React from 'react';
import { PageFooter, TNSCubeLogo } from './PageLayout';

export const PageClosing: React.FC = () => {
  return (
    <div className="a4-page relative flex flex-col justify-between bg-slate-900 text-white overflow-hidden">
      {/* Background Graphic & Engineer Visual */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-12">
        {/* Abstract Sky & Mountain Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-900 to-black opacity-95" />
        
        {/* Subtle Solar Mesh */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Content Box */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-[500px]">
          <div className="mb-6">
            <TNSCubeLogo size={80} />
          </div>

          <h1 className="text-4xl font-black tracking-widest text-white uppercase drop-shadow-md mb-2" style={{ letterSpacing: '4px' }}>
            TNS SOLAR SYSTEM
          </h1>
          <p className="text-sm font-semibold tracking-widest text-sky-400 uppercase mb-8">
            BEST QUALITY • BEST PRICE • PROFESSIONAL INSTALLATION
          </p>

          <div className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl p-6 backdrop-blur-md text-left text-xs space-y-3 shadow-2xl">
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 text-base">✓</span>
              <p className="text-slate-200">ทีมวิศวกรและช่างผู้ชำนาญการติดตั้งระบบ Solar Cell ตามมาตรฐานสากล</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 text-base">✓</span>
              <p className="text-slate-200">ใช้อุปกรณ์ Tier-1 มาตรฐานระดับโลก พร้อมรับประกันสูงสุด 30 ปี</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 text-base">✓</span>
              <p className="text-slate-200">บริการครบวงจรตั้งแต่สำรวจ ออกแบบ ยื่นขออนุญาตการไฟฟ้าฯ จนถึงตรวจเช็คบำรุงรักษา</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400">ขอขอบพระคุณที่ไว้วางใจให้เราดูแลระบบพลังงานแสงอาทิตย์ของคุณ</p>
            <p className="text-base font-bold text-white mt-1">TNS network solutions Co., Ltd.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pb-1 bg-white text-slate-800 z-10">
        <PageFooter />
      </div>
    </div>
  );
};
