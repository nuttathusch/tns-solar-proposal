import React from 'react';
import type { ProposalProject, DocumentSectionToggles } from '../../types/proposal';
import { BookOpen, CheckSquare, Square } from 'lucide-react';

interface StepPagesProps {
  proposal: ProposalProject;
  onChange: (updated: ProposalProject) => void;
}

export const StepPages: React.FC<StepPagesProps> = ({ proposal, onChange }) => {
  const { toggles, activeOptionsCount } = proposal;

  const handleToggle = (key: keyof DocumentSectionToggles) => {
    onChange({
      ...proposal,
      toggles: {
        ...proposal.toggles,
        [key]: !proposal.toggles[key]
      }
    });
  };

  const handleSelectAll = (select: boolean) => {
    const updated: DocumentSectionToggles = {
      showCover: select,
      showSitePictures: select,
      showRoofDesigns: select,
      showElectricBill: select,
      showQuotation1: select,
      showRoi1: select,
      showWarranty1: select,
      showQuotation2: select,
      showRoi2: select,
      showWarranty2: select,
      showPanelSpecsheet: select,
      showInverterSpecsheet1: select,
      showInverterSpecsheet2: select,
      showSiteReferences: select,
      showClosingPage: select,
    };
    onChange({ ...proposal, toggles: updated });
  };

  const pageItems = [
    { key: 'showCover', title: '1. หน้าปก (Cover Page)', desc: 'โลโก้ TNS, ชื่อลูกค้า, รูปบ้านมุมสูง, และ Inverter Mockup', always: true },
    { key: 'showSitePictures', title: '2. รูปถ่ายหน้างานจริง (Site Pictures)', desc: 'ภาพถ่ายโดรน / ภาพรอบตัวบ้าน 2-4 รูป' },
    { key: 'showRoofDesigns', title: '3. รูปแบบหลังคา 3D (SolarEdge Designer)', desc: 'ภาพการจัดวางแผง 2D Top-down และโมเดลหลังคา 3D Perspective' },
    { key: 'showElectricBill', title: '4. รูปบิลค่าไฟฟ้า (Electricity Bill)', desc: 'ภาพใบแจ้งค่าไฟฟ้า MEA / PEA ของลูกค้า' },
    { key: 'showQuotation1', title: '5. ใบเสนอราคา Option 1 (Quotation)', desc: `ตาราง BoM และราคาระบบ ${proposal.option1.brand.toUpperCase()}` },
    { key: 'showRoi1', title: '6. ตารางวิเคราะห์ความคุ้มค่า & จุดคุ้มทุน 1 (ROI)', desc: 'คำนวณหน่วยผลิต, ผลประหยัดต่อเดือน/ปี, Payback, ผลตอบแทน 25 ปี' },
    { key: 'showWarranty1', title: '7. เงื่อนไขการรับประกัน & บริการ 1 (Warranty & Services)', desc: 'รับประกันแผง 15/30 ปี, Inverter, ติดตั้ง 2 ปี, ตารางตรวจเช็ค 9 รายการ' },
  ];

  if (activeOptionsCount === 2) {
    pageItems.push(
      { key: 'showQuotation2', title: '8. ใบเสนอราคา Option 2 (Quotation Comparison)', desc: `ตาราง BoM และราคาระบบ ${proposal.option2.brand.toUpperCase()}` },
      { key: 'showRoi2', title: '9. ตารางวิเคราะห์ความคุ้มค่า & จุดคุ้มทุน 2 (ROI)', desc: 'คำนวณผลประหยัดและจุดคุ้มทุนของ Option 2' },
      { key: 'showWarranty2', title: '10. เงื่อนไขการรับประกัน & บริการ 2 (Warranty 2)', desc: 'การรับประกันและบริการของ Option 2' }
    );
  }

  pageItems.push(
    { key: 'showPanelSpecsheet', title: '11. Specsheet แผงโซลาร์ (LONGi Hi-MO X10 650W)', desc: 'โบรชัวร์และตารางสเปกทางเทคนิคแผง LONGi N-Type BC-CELL' },
    { key: 'showInverterSpecsheet1', title: `12. Specsheet Inverter (${proposal.option1.brand.toUpperCase()})`, desc: `โบรชัวร์และ Mobile App สำหรับระบบ ${proposal.option1.brand.toUpperCase()}` }
  );

  if (activeOptionsCount === 2) {
    pageItems.push(
      { key: 'showInverterSpecsheet2', title: `13. Specsheet Inverter (${proposal.option2.brand.toUpperCase()})`, desc: `โบรชัวร์และข้อมูลระบบ ${proposal.option2.brand.toUpperCase()}` }
    );
  }

  pageItems.push(
    { key: 'showSiteReferences', title: '14. ผลงานอ้างอิงจริง (Site References Portfolio)', desc: 'ภาพผลงานโรงงานน้ำตาลลิน 394kWp, WSB 101kWp, ปั๊ม PTT, คาเฟ่ ฯลฯ' },
    { key: 'showClosingPage', title: '15. หน้าปิดท้ายเล่ม (Closing Page)', desc: 'ภาพทีมงานช่างติดตั้ง TNS SOLAR SYSTEM และข้อมูลติดต่อ' }
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-md flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center border border-blue-400/30">
            <BookOpen className="w-5 h-5 text-sky-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold">เลือกหน้าเอกสารที่ต้องการแนบในเล่ม Proposal</h2>
            <p className="text-xs text-blue-200">เปิด-ปิดหน้าต่างๆ เช่น Specsheet, หน้าเปรียบเทียบ หรือ ผลงานอ้างอิง</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleSelectAll(true)}
            className="text-xs font-semibold bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition cursor-pointer"
          >
            เลือกทั้งหมด
          </button>
          <button
            type="button"
            onClick={() => handleSelectAll(false)}
            className="text-xs font-semibold bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition cursor-pointer"
          >
            ยกเลิกทั้งหมด
          </button>
        </div>
      </div>

      {/* Pages Checklist */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {pageItems.map((item) => {
            const isChecked = toggles[item.key as keyof DocumentSectionToggles];
            return (
              <div
                key={item.key}
                onClick={() => handleToggle(item.key as keyof DocumentSectionToggles)}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                  isChecked
                    ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-300'
                    : 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="mt-0.5 text-blue-600">
                  {isChecked ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-slate-400" />}
                </div>
                <div className="flex-1">
                  <h4 className={`text-xs font-bold ${isChecked ? 'text-blue-950' : 'text-slate-700'}`}>
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
