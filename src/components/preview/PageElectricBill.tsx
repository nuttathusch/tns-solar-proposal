import React from 'react';
import type { ProposalProject } from '../../types/proposal';
import { PageLayout } from './PageLayout';
import { formatNumber } from '../../utils/solarCalculator';

interface PageElectricBillProps {
  proposal: ProposalProject;
}

export const PageElectricBill: React.FC<PageElectricBillProps> = ({ proposal }) => {
  const { customer, media } = proposal;

  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-between h-full py-2">
        <div className="w-full text-center mb-2">
          <h3 className="text-xl font-bold text-[#0f3460]">เอกสารประกอบการประเมินการใช้ไฟฟ้า</h3>
          <p className="text-xs text-slate-500">Electricity Bill & Consumption Reference</p>
        </div>

        {/* Electric Bill Center Container */}
        <div className="w-full max-w-[480px] h-[600px] bg-slate-900 rounded-xl overflow-hidden shadow-md border border-slate-300 p-2 flex items-center justify-center relative">
          {media.electricBillPhoto ? (
            <img 
              src={media.electricBillPhoto} 
              alt="Customer Electricity Bill" 
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center p-6 text-slate-400">
              <svg className="w-20 h-20 mx-auto mb-3 opacity-40 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="font-semibold text-white text-base">รูปถ่ายใบแจ้งค่าไฟฟ้า (MEA / PEA)</p>
              <p className="text-xs text-slate-400 mt-1">อัปโหลดรูปบิลค่าไฟเพื่อใช้อ้างอิงการคำนวณ</p>
            </div>
          )}
        </div>

        {/* Bill Summary Banner */}
        <div className="w-full max-w-[540px] mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3 flex justify-around items-center text-center">
          <div>
            <span className="text-[10px] text-slate-500 block">ค่าไฟฟ้าเฉลี่ยต่อเดือน</span>
            <span className="text-base font-bold text-[#0f3460]">
              {customer.monthlyElectricBill ? `${formatNumber(customer.monthlyElectricBill, 2)} บาท` : 'ตามบิลแนบ'}
            </span>
          </div>
          <div className="h-8 w-px bg-blue-200" />
          <div>
            <span className="text-[10px] text-slate-500 block">ระบบไฟฟ้า</span>
            <span className="text-base font-bold text-sky-600">
              {customer.electricalPhase || '3-Phase'}
            </span>
          </div>
          <div className="h-8 w-px bg-blue-200" />
          <div>
            <span className="text-[10px] text-slate-500 block">ขนาดระบบที่แนะนำ</span>
            <span className="text-base font-bold text-emerald-600">
              {proposal.systemSizeKwp} kWp
            </span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
