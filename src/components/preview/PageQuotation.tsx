import React from 'react';
import type { ProposalProject, InverterOptionConfig } from '../../types/proposal';
import { COMPANY_INFO } from '../../data/presets';
import { TNSCubeLogo } from './PageLayout';
import { formatNumber } from '../../utils/solarCalculator';

interface PageQuotationProps {
  proposal: ProposalProject;
  option: InverterOptionConfig;
  quotationNo?: string;
}

export const PageQuotation: React.FC<PageQuotationProps> = ({ proposal, option, quotationNo }) => {
  const { customer } = proposal;
  const qNo = quotationNo || proposal.quotationNumber;

  return (
    <div className="a4-page relative flex flex-col justify-between bg-white text-slate-800 text-[10px] p-6">
      {/* Top Company Header */}
      <div className="flex justify-between items-start pb-2 border-b border-slate-300">
        <div>
          <h2 className="font-bold text-sm text-[#0f3460]">{COMPANY_INFO.nameEn}</h2>
          <p className="text-[8.5px] text-slate-600">{COMPANY_INFO.address}</p>
          <p className="text-[8.5px] text-slate-600">
            <strong>TAX ID :</strong> {COMPANY_INFO.taxId}
          </p>
          <p className="text-[8.5px] text-sky-700">{COMPANY_INFO.website}</p>
        </div>

        <div className="flex items-center gap-2 text-right">
          <div className="flex flex-col text-[7px] text-[#0f3460] font-bold leading-tight">
            <span className="text-[10px]">TNS</span>
            <span>SOLAR</span>
            <span className="text-[6px] text-slate-500">SYSTEM</span>
          </div>
          <TNSCubeLogo size={36} />
        </div>
      </div>

      {/* Title & Customer / Quotation Info Header */}
      <div className="py-2">
        <div className="flex justify-between items-start">
          <div className="w-[60%]">
            <h1 className="text-xl font-extrabold text-[#0f3460] tracking-tight">
              Quotation / ใบเสนอราคา
            </h1>
            <p className="text-[10.5px] font-bold text-slate-800 mt-0.5">
              {option.title}
            </p>
            
            <div className="mt-1 text-[9px] text-slate-700 leading-relaxed bg-slate-50 p-2 rounded border border-slate-200">
              <p><strong>Company / Customer :</strong> {customer.name || 'คุณวรางคณา สงวนศิลป์'}</p>
              <p><strong>Tel :</strong> {customer.tel || '-'}</p>
              <p><strong>Address :</strong> {customer.fullAddress || customer.address}</p>
            </div>
          </div>

          <div className="w-[38%] bg-slate-50 p-2 rounded border border-slate-200 text-[9px] text-slate-700 leading-snug">
            <div className="flex justify-between">
              <strong>Quotation No. :</strong>
              <span className="font-bold text-[#0052cc]">{qNo}</span>
            </div>
            <div className="flex justify-between">
              <strong>Date :</strong>
              <span>{proposal.date}</span>
            </div>
            <div className="flex justify-between">
              <strong>Sales :</strong>
              <span>{proposal.salesName}</span>
            </div>
            <div className="flex justify-between">
              <strong>Tel :</strong>
              <span>{proposal.salesTel}</span>
            </div>
            <div className="flex justify-between">
              <strong>E-mail :</strong>
              <span>{proposal.salesEmail}</span>
            </div>
            <div className="flex justify-between">
              <strong>Mobile :</strong>
              <span>{proposal.salesMobile}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Quotation Table */}
      <div className="flex-1 w-full overflow-hidden border border-slate-300 rounded text-[8.5px]">
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-slate-100 font-bold text-slate-800 text-center py-1 border-b border-slate-300">
          <div className="col-span-2 border-r border-slate-300">Brand</div>
          <div className="col-span-3 border-r border-slate-300">Item</div>
          <div className="col-span-5 border-r border-slate-300">Description</div>
          <div className="col-span-2">Quantity</div>
        </div>

        {/* Section 1: Main Equipment */}
        <div className="bg-slate-50 px-2 py-0.5 font-bold text-[#0f3460] border-b border-slate-200 text-[9px]">
          {option.title} - รายการอุปกรณ์หลัก (Main Equipment)
        </div>
        {option.mainEquipment.map((eq, i) => (
          <div key={eq.id || i} className="grid grid-cols-12 border-b border-slate-200 py-0.5 px-1 items-center bg-white hover:bg-slate-50/50">
            <div className="col-span-2 font-semibold text-center text-slate-700">{eq.brand}</div>
            <div className="col-span-3 font-medium px-1 text-slate-800">{eq.item}</div>
            <div className="col-span-5 px-1 text-slate-600 whitespace-pre-line leading-tight">{eq.description}</div>
            <div className="col-span-2 text-center font-semibold text-slate-800">{eq.quantity} {eq.unit}</div>
          </div>
        ))}

        {/* Section 2: Mounting Structure */}
        <div className="bg-slate-50 px-2 py-0.5 font-bold text-[#0f3460] border-b border-slate-200 text-[9px]">
          ระบบโครงสร้างติดตั้ง (Mounting Structure)
        </div>
        <div className="grid grid-cols-12 border-b border-slate-200 py-0.5 px-1 items-center bg-white">
          <div className="col-span-2 font-semibold text-center text-slate-700">Mega Industry Thailand</div>
          <div className="col-span-3 px-1 text-slate-700 leading-tight">
            Aluminum Rail<br/>
            Mid Clamp / End Clamp<br/>
            Roof Hook / L-Foot<br/>
            Stainless Bolt & Nut / Clip
          </div>
          <div className="col-span-5 px-1 text-slate-600 leading-tight">
            รางอลูมิเนียมติดตั้งแผงสำหรับหลังคา{proposal.roofType}<br/>
            อุปกรณ์ยึดกลางและปลายแผง / ชุดยึดหลังคา<br/>
            SUS304, จัดเก็บสายใต้แผง, จุดต่อกราวด์แผง
          </div>
          <div className="col-span-2 text-center font-semibold text-slate-800">1 ชุด</div>
        </div>

        {/* Section 3: AC System */}
        <div className="bg-slate-50 px-2 py-0.5 font-bold text-[#0f3460] border-b border-slate-200 text-[9px]">
          ระบบไฟฟ้า AC
        </div>
        <div className="grid grid-cols-12 border-b border-slate-200 py-0.5 px-1 items-center bg-white">
          <div className="col-span-2 font-semibold text-center text-slate-700">Chint/Schneider / Suntree / BCC</div>
          <div className="col-span-3 px-1 text-slate-700 leading-tight">
            AC Breaker Main / SPD<br/>
            AC Cable / Combiner Box
          </div>
          <div className="col-span-5 px-1 text-slate-600 leading-tight">
            MCCB 2P/4P, Surge Protection Type II<br/>
            สายไฟ CV 2C/4C, ตู้ไฟ AC IP65, สายกราวด์ THW
          </div>
          <div className="col-span-2 text-center font-semibold text-slate-800">1 ชุด</div>
        </div>

        {/* Section 4: DC System (If String Inverter) */}
        {option.inverterType === 'String' && (
          <>
            <div className="bg-slate-50 px-2 py-0.5 font-bold text-[#0f3460] border-b border-slate-200 text-[9px]">
              ระบบไฟฟ้า DC
            </div>
            <div className="grid grid-cols-12 border-b border-slate-200 py-0.5 px-1 items-center bg-white">
              <div className="col-span-2 font-semibold text-center text-slate-700">Chint/Suntree/KJL</div>
              <div className="col-span-3 px-1 text-slate-700 leading-tight">
                DC Breaker / SPD<br/>
                Solar Cable / DC Combiner Box
              </div>
              <div className="col-span-5 px-1 text-slate-600 leading-tight">
                MCCB DC 40–63A, Surge Protection Type II<br/>
                Solar Cable 4/6 Sq.mm, ตู้ไฟ DC IP65
              </div>
              <div className="col-span-2 text-center font-semibold text-slate-800">1 ชุด</div>
            </div>
          </>
        )}

        {/* Section 5: Installation & Services */}
        <div className="bg-slate-50 px-2 py-0.5 font-bold text-[#0f3460] border-b border-slate-200 text-[9px]">
          งานติดตั้งและบริการ
        </div>
        <div className="grid grid-cols-12 py-0.5 px-1 items-center bg-white">
          <div className="col-span-2 font-semibold text-center text-slate-700">TNS</div>
          <div className="col-span-3 px-1 text-slate-700">Installation & Commissioning</div>
          <div className="col-span-5 px-1 text-slate-600">
            สำรวจ ออกแบบ ติดตั้ง ทดสอบระบบ และยื่นขออนุญาตขนานไฟ
          </div>
          <div className="col-span-2 text-center font-semibold text-slate-800">1 งาน</div>
        </div>
      </div>

      {/* Pricing Summary & Bank Information */}
      <div className="my-2 border border-slate-300 rounded p-2 bg-slate-50 flex justify-between items-center text-[9px]">
        {/* Bank Account */}
        <div className="w-[45%] text-slate-700 border-r border-slate-200 pr-2">
          <span className="font-bold text-[#0f3460] block">หมายเหตุ : เลขที่บัญชีสำหรับชำระเงินค่าสินค้า/บริการ</span>
          <p className="font-semibold text-slate-800">{COMPANY_INFO.bankName} เลขที่บัญชี {COMPANY_INFO.bankAccountNo}</p>
          <p className="text-[8px] text-slate-600">ชื่อบัญชี {COMPANY_INFO.bankAccountName}</p>
        </div>

        {/* Price Breakdown */}
        <div className="w-[50%] flex flex-col gap-1 text-right pl-2">
          <div className="flex justify-between items-center text-slate-700">
            <span className="font-semibold">{option.brand.toUpperCase()} Solar Set {proposal.systemSizeKwp}kWp</span>
            <span className="font-bold">{formatNumber(option.priceSolarSet)}.-</span>
          </div>
          {option.hasBattery && (
            <div className="flex justify-between items-center text-slate-700">
              <span className="font-semibold">{option.batteryModel.split(' ')[0]} Battery {option.batteryCapacityKwh}kWh</span>
              <span className="font-bold">{formatNumber(option.priceBatterySet)}.-</span>
            </div>
          )}
          {option.discountAmount > 0 && (
            <div className="flex justify-between items-center text-emerald-600">
              <span className="font-semibold">ส่วนลดพิเศษ (Discount)</span>
              <span className="font-bold">- {formatNumber(option.discountAmount)}.-</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-1 border-t border-slate-300">
            <span className="text-xs font-black text-[#0f3460]">Grand Total <span className="text-[7.5px] font-normal text-slate-500">(included VAT 7%)</span></span>
            <span className="text-base font-black text-rose-600">{formatNumber(option.grandTotal)}.-</span>
          </div>
        </div>
      </div>

      {/* Terms & Conditions and Remarks */}
      <div className="grid grid-cols-2 gap-3 text-[8px] border-t border-slate-200 pt-1.5 mb-1">
        <div>
          <h4 className="font-bold text-[#0f3460] uppercase text-[8.5px]">Terms & Condition</h4>
          <ul className="mt-0.5 space-y-0.5 text-slate-700">
            <li><strong>Delivery Time :</strong> TBA</li>
            <li><strong>Payment Term :</strong> ชำระ 50% เมื่อสั่งซื้อ 50% เมื่อส่งมอบงานแล้วเสร็จ</li>
            <li><strong>Validity :</strong> {proposal.validityDays} days</li>
            <li><strong>System Warranty :</strong> {proposal.systemWarrantyYears} Years</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-[#0f3460] text-[8.5px]">Remark: ราคาที่เสนอรวมรายละเอียดงานบริการ ดังนี้</h4>
          <ul className="mt-0.5 space-y-0.5 text-slate-700">
            <li>- สำรวจและออกแบบ</li>
            <li>- ดำเนินการขออนุญาตติดตั้งการไฟฟ้าฯ</li>
            <li>- เขียนแบบ และยื่นขออนุญาตขนานไฟในระบบ</li>
            <li>- รับประกันงานติดตั้ง 2 ปี พร้อมบริการล้างแผงปีละ 1 ครั้ง</li>
          </ul>
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-8 text-center text-[8px] pt-2 border-t border-slate-200">
        <div>
          <p className="font-semibold text-slate-700 mb-6">ผู้เสนอราคา</p>
          <div className="w-36 h-0.5 bg-slate-400 mx-auto" />
          <p className="font-bold text-slate-800 mt-1">{proposal.salesName}</p>
          <p className="text-slate-500">{proposal.salesPosition}</p>
        </div>

        <div>
          <p className="font-semibold text-slate-700 mb-6">Customer's Signature & Company Seal</p>
          <div className="w-48 h-0.5 bg-slate-400 mx-auto" />
          <p className="font-bold text-slate-800 mt-1">Authorized : Purchase Manager</p>
          <p className="text-slate-500">Date : _____/_____/_________</p>
        </div>
      </div>
    </div>
  );
};
