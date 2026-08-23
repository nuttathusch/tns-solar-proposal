import React from 'react';
import type { ProposalProject, InverterOptionConfig } from '../../types/proposal';
import { generateQuotationNumber, formatNumber } from '../../utils/solarCalculator';
import { FileText, DollarSign, UserCheck, RefreshCw } from 'lucide-react';

interface StepQuotationProps {
  proposal: ProposalProject;
  onChange: (updated: ProposalProject) => void;
}

export const StepQuotation: React.FC<StepQuotationProps> = ({ proposal, onChange }) => {
  const { option1, option2, activeOptionsCount } = proposal;

  const handleUpdateOptionPricing = (
    optionKey: 'option1' | 'option2',
    field: 'priceSolarSet' | 'priceBatterySet' | 'discountAmount',
    val: number
  ) => {
    const opt = proposal[optionKey];
    const updatedOpt = { ...opt, [field]: val };
    // Auto recompute grand total
    const batteryCost = updatedOpt.hasBattery ? (updatedOpt.priceBatterySet || 0) : 0;
    const total = (updatedOpt.priceSolarSet || 0) + batteryCost - (updatedOpt.discountAmount || 0);
    updatedOpt.grandTotal = Math.max(0, total);

    onChange({
      ...proposal,
      [optionKey]: updatedOpt
    });
  };

  const renderPricingCard = (optionKey: 'option1' | 'option2', opt: InverterOptionConfig, label: string) => (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
        <h4 className="font-bold text-sm text-[#0f3460]">{label}</h4>
        <span className="text-xs font-bold text-slate-700 bg-white px-3 py-0.5 rounded-full border border-slate-300">
          {opt.brand.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            ราคาชุด Solar Set ({proposal.systemSizeKwp} kWp)
          </label>
          <div className="relative">
            <input
              type="number"
              step="1000"
              value={opt.priceSolarSet}
              onChange={(e) => handleUpdateOptionPricing(optionKey, 'priceSolarSet', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm font-bold text-slate-900 rounded-xl border border-slate-300 bg-white"
            />
            <span className="absolute right-3 top-2 text-xs text-slate-400">บาท</span>
          </div>
        </div>

        {opt.hasBattery && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ราคาชุด Battery ({opt.batteryCapacityKwh} kWh)
            </label>
            <div className="relative">
              <input
                type="number"
                step="1000"
                value={opt.priceBatterySet}
                onChange={(e) => handleUpdateOptionPricing(optionKey, 'priceBatterySet', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm font-bold text-slate-900 rounded-xl border border-slate-300 bg-white"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400">บาท</span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            ส่วนลดพิเศษ (Discount)
          </label>
          <div className="relative">
            <input
              type="number"
              step="1000"
              value={opt.discountAmount}
              onChange={(e) => handleUpdateOptionPricing(optionKey, 'discountAmount', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm font-bold text-emerald-600 rounded-xl border border-slate-300 bg-white"
            />
            <span className="absolute right-3 top-2 text-xs text-slate-400">บาท</span>
          </div>
        </div>
      </div>

      {/* Total Box */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center">
        <div>
          <span className="text-xs text-slate-500 block">ยอดรวมสุทธิ (Grand Total รวม VAT 7%)</span>
          <span className="text-[10px] text-slate-400">
            {formatNumber(opt.priceSolarSet)} + {opt.hasBattery ? formatNumber(opt.priceBatterySet) : 0} {opt.discountAmount > 0 ? `- ${formatNumber(opt.discountAmount)}` : ''}
          </span>
        </div>
        <div className="text-xl font-black text-rose-600">
          {formatNumber(opt.grandTotal)}.- บาท
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center border border-blue-400/30">
            <FileText className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">กำหนดราคาและเงื่อนไขใบเสนอราคา (Quotation)</h2>
            <p className="text-xs text-blue-200">ตั้งราคาแพ็กเกจโซลาร์, แบตเตอรี่, ข้อมูลผู้เสนอราคา และเงื่อนไขการรับประกัน</p>
          </div>
        </div>
      </div>

      {/* Quotation Header & Numbers */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
        <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <span>ข้อมูลเลขที่และวันที่ใบเสนอราคา</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              เลขที่ใบเสนอราคา (Quotation No.)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={proposal.quotationNumber}
                onChange={(e) => onChange({ ...proposal, quotationNumber: e.target.value })}
                className="w-full px-3 py-2 text-sm font-mono font-bold text-blue-900 rounded-xl border border-slate-300"
              />
              <button
                type="button"
                onClick={() => onChange({ ...proposal, quotationNumber: generateQuotationNumber(1) })}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-300 text-slate-600 cursor-pointer"
                title="สร้างเลขที่ใหม่"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              วันที่เสนอราคา
            </label>
            <input
              type="text"
              value={proposal.date}
              onChange={(e) => onChange({ ...proposal, date: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              กำหนดยืนราคา (วัน)
            </label>
            <input
              type="number"
              value={proposal.validityDays}
              onChange={(e) => onChange({ ...proposal, validityDays: parseInt(e.target.value) || 15 })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
            />
          </div>
        </div>
      </div>

      {/* Salesperson Details */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
        <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-emerald-600" />
          <span>ข้อมูลผู้เสนอราคา (TNS Project Manager)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ชื่อผู้เสนอราคา
            </label>
            <input
              type="text"
              value={proposal.salesName}
              onChange={(e) => onChange({ ...proposal, salesName: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              เบอร์โทรศัพท์มือถือ
            </label>
            <input
              type="tel"
              value={proposal.salesMobile}
              onChange={(e) => onChange({ ...proposal, salesMobile: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              อีเมลติดต่อ
            </label>
            <input
              type="email"
              value={proposal.salesEmail}
              onChange={(e) => onChange({ ...proposal, salesEmail: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
            />
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
        <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <span>กำหนดราคาแพ็กเกจ</span>
        </h3>

        {renderPricingCard('option1', option1, activeOptionsCount === 2 ? 'ราคา Option 1' : 'ราคาแพ็กเกจ')}

        {activeOptionsCount === 2 && (
          renderPricingCard('option2', option2, 'ราคา Option 2 (เปรียบเทียบ)')
        )}
      </div>
    </div>
  );
};
