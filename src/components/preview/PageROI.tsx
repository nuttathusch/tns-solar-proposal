import React from 'react';
import type { ProposalProject, InverterOptionConfig } from '../../types/proposal';
import { PageFooter, TNSCubeLogo } from './PageLayout';
import { calculateROI, formatNumber } from '../../utils/solarCalculator';

interface PageROIProps {
  proposal: ProposalProject;
  option: InverterOptionConfig;
}

export const PageROI: React.FC<PageROIProps> = ({ proposal, option }) => {
  const roi = calculateROI(
    proposal.systemSizeKwp,
    option.grandTotal,
    option.peakSunHours,
    option.tariffRate,
    option.efficiencyRate,
    25
  );

  return (
    <div className="a4-page relative flex flex-col justify-between bg-white text-slate-800 p-8 pb-20">
      {/* Top Header */}
      <div className="flex justify-between items-start pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <TNSCubeLogo size={44} />
          <div className="flex flex-col text-[7px] text-[#0f3460] font-bold leading-tight">
            <span className="text-[10px]">TNS</span>
            <span>SOLAR</span>
            <span className="text-[6px] text-slate-500">SYSTEM</span>
          </div>
        </div>

        <div className="text-center flex-1">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            Energy Savings for Solar Roof Top
          </h2>
          <h3 className="text-sm font-bold text-amber-500">
            เปรียบเทียบการผลิต ระยะเวลาคืนทุน จุดคุ้มทุน
          </h3>
        </div>

        <div className="text-right">
          <div className="text-[10px] font-bold text-slate-700 uppercase">
            {option.brand === 'huawei' && <span className="text-red-600 font-extrabold">HUAWEI</span>}
            {option.brand === 'atmoce' && <span className="text-rose-600 font-extrabold">ATMOCE</span>}
            {option.brand === 'enphase' && <span className="text-orange-600 font-extrabold">ENPHASE</span>}
            {' '}{option.inverterType.toUpperCase()} INVERTER
          </div>
          <div className="mt-1 bg-[#0f3460] text-white font-black text-xs px-3 py-1 rounded inline-block shadow-sm">
            ขนาดการติดตั้ง {proposal.systemSizeKwp} kWp
          </div>
        </div>
      </div>

      {/* Energy Consumption Note */}
      <div className="text-[9px] text-slate-500 py-1">
        <span>Energy Consumption per Day: Max: 12Hours (06.00-18.00) | Min: 6 Hours (09.00-15.00)</span>
      </div>

      {/* Main 4 ROI Sections */}
      <div className="flex-1 flex flex-col justify-around gap-2 text-[10px]">
        {/* Section 1: Generation Ability */}
        <div className="border border-slate-300 rounded-lg overflow-hidden shadow-xs">
          <div className="grid grid-cols-12 bg-slate-100">
            <div className="col-span-4 bg-slate-700 text-white font-bold p-3 flex items-center justify-center text-center leading-tight">
              ความสามารถในการผลิตกระแสไฟฟ้า ของอุปกรณ์โซล่าร์เซลล์
            </div>
            <div className="col-span-8 p-3 space-y-1 text-slate-700">
              <div className="flex justify-between border-b border-slate-200 pb-0.5">
                <span>ประสิทธิภาพการผลิต (ชั่วโมง/วัน)</span>
                <strong className="text-slate-900">{roi.efficiencyRatePercent}%</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-0.5">
                <span>การรับแสง 100% โดยเฉลี่ยต่อวัน</span>
                <strong className="text-slate-900">{roi.sunHoursPerDay} ชั่วโมง/วัน</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-0.5">
                <span>ประมาณการผลิตกระแสไฟฟ้าต่อวัน</span>
                <strong className="text-slate-900">{formatNumber(roi.dailyProductionKwh)} หน่วย/วัน</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-0.5">
                <span>ประมาณการผลิตกระแสไฟฟ้าต่อเดือน</span>
                <strong className="text-sky-700 font-bold">{formatNumber(roi.monthlyProductionKwh)} หน่วย/เดือน</strong>
              </div>
              <div className="flex justify-between">
                <span>ประมาณการผลิตกระแสไฟฟ้าต่อปี</span>
                <strong className="text-sky-700 font-bold">{formatNumber(roi.yearlyProductionKwh)} หน่วย/ปี</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Financial Savings */}
        <div className="border border-slate-300 rounded-lg overflow-hidden shadow-xs">
          <div className="grid grid-cols-12 bg-slate-100">
            <div className="col-span-4 bg-[#0f3460] text-white font-bold p-3 flex items-center justify-center text-center leading-tight">
              อัตราค่าไฟฟ้า ที่ชุดอุปกรณ์ Solar Cell ผลิตได้
            </div>
            <div className="col-span-8 p-3 space-y-1 text-slate-700">
              <div className="flex justify-between border-b border-slate-200 pb-0.5">
                <span>ราคาค่าไฟฟ้าที่นำมาคำนวณ</span>
                <strong className="text-slate-900">{roi.tariffRate} บาท/หน่วย</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-0.5">
                <span>จำนวนหน่วยไฟฟ้าที่ลดลง</span>
                <strong className="text-slate-900">{formatNumber(roi.monthlyProductionKwh)} หน่วย/เดือน</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-0.5">
                <span>รวมประหยัดเงินได้</span>
                <strong className="text-emerald-600 font-bold">{formatNumber(roi.monthlySavingsThb)} บาท/เดือน</strong>
              </div>
              <div className="flex justify-between">
                <span>รวมประหยัดเงินได้ต่อปี</span>
                <strong className="text-emerald-600 font-bold">{formatNumber(roi.yearlySavingsThb)} บาท/ปี</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Payback Period / ROI */}
        <div className="border border-slate-300 rounded-lg overflow-hidden shadow-xs">
          <div className="grid grid-cols-12 bg-slate-100">
            <div className="col-span-4 bg-slate-800 text-white font-bold p-3 flex flex-col items-center justify-center text-center leading-tight">
              <span>สรุปความคุ้ม</span>
              <span>และระยะเวลาคืนทุน (ROI)</span>
            </div>
            <div className="col-span-8 p-3 space-y-1 text-slate-700">
              <div className="flex justify-between border-b border-slate-200 pb-0.5">
                <span>ต้นทุนการติดตั้ง</span>
                <strong className="text-rose-600 font-bold">{formatNumber(roi.installationCostThb)} บาท</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-0.5">
                <span>คืนทุนภายใน</span>
                <strong className="text-amber-600 font-bold">{roi.paybackPeriodMonths} เดือน</strong>
              </div>
              <div className="flex justify-between">
                <span>หรือเท่ากับ</span>
                <strong className="text-amber-600 font-bold">{roi.paybackPeriodYears} ปี</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Total Return After Payback */}
        <div className="border border-slate-300 rounded-lg overflow-hidden shadow-xs">
          <div className="grid grid-cols-12 bg-slate-100">
            <div className="col-span-4 bg-emerald-700 text-white font-bold p-3 flex flex-col items-center justify-center text-center leading-tight">
              <span>Total Return</span>
              <span className="text-amber-300 font-semibold">หลังจากคืนทุน</span>
            </div>
            <div className="col-span-8 p-3 space-y-1.5 text-slate-700">
              <div className="flex justify-between border-b border-slate-200 pb-0.5">
                <span>ประหยัดเงินได้โดยเฉลี่ย</span>
                <strong className="text-slate-900">{formatNumber(roi.yearlySavingsThb)} บาท/ปี</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-0.5">
                <span>มูลค่าที่ได้รับหลังคืนทุน (อายุการใช้งาน)</span>
                <strong className="text-slate-900">{roi.returnLifespanYears} ปี</strong>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="font-semibold text-slate-800">คิดอัตรา 80% เท่ากับ</span>
                <div className="bg-slate-800 text-white px-4 py-1.5 rounded-lg text-sm font-black tracking-wider">
                  {formatNumber(roi.totalReturn25YearsThb)}.- บาท
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Legal Note */}
      <div className="text-[7.5px] text-slate-500 text-center border-t border-slate-200 pt-1 mt-1">
        ตารางแสดงการคำนวณตามมาตรฐานกระทรวงพลังงาน ระยะเวลาคืนทุนขึ้นอยู่กับพฤติกรรมการใช้งานจริง ไม่รวมค่า Maintenance
      </div>

      <PageFooter />
    </div>
  );
};
