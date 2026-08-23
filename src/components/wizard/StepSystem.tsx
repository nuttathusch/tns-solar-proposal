import React from 'react';
import type { ProposalProject, InverterBrand, RoofType, InverterOptionConfig } from '../../types/proposal';
import { createHuaweiOption, createAtmoceOption, createEnphaseOption } from '../../data/presets';
import { Sun, Battery, Layers, Zap, Sliders } from 'lucide-react';

interface StepSystemProps {
  proposal: ProposalProject;
  onChange: (updated: ProposalProject) => void;
}

export const StepSystem: React.FC<StepSystemProps> = ({ proposal, onChange }) => {
  const { systemSizeKwp, panelCount, roofType, activeOptionsCount, option1, option2 } = proposal;

  const handleUpdatePanelCount = (count: number) => {
    const safeCount = Math.max(1, count);
    const kwp = Number(((safeCount * proposal.panelWattage) / 1000).toFixed(2));
    onChange({
      ...proposal,
      panelCount: safeCount,
      systemSizeKwp: kwp,
      option1: {
        ...proposal.option1,
        mainEquipment: proposal.option1.mainEquipment.map(eq =>
          eq.item === 'Solar Panel' ? { ...eq, quantity: safeCount } : eq
        )
      },
      option2: {
        ...proposal.option2,
        mainEquipment: proposal.option2.mainEquipment.map(eq =>
          eq.item === 'Solar Panel' ? { ...eq, quantity: safeCount } : eq
        )
      }
    });
  };

  const handleUpdateKwp = (kwp: number) => {
    const safeKwp = Math.max(1, kwp);
    const count = Math.ceil((safeKwp * 1000) / proposal.panelWattage);
    onChange({
      ...proposal,
      systemSizeKwp: safeKwp,
      panelCount: count,
      option1: {
        ...proposal.option1,
        mainEquipment: proposal.option1.mainEquipment.map(eq =>
          eq.item === 'Solar Panel' ? { ...eq, quantity: count } : eq
        )
      },
      option2: {
        ...proposal.option2,
        mainEquipment: proposal.option2.mainEquipment.map(eq =>
          eq.item === 'Solar Panel' ? { ...eq, quantity: count } : eq
        )
      }
    });
  };

  const handleBrandChange = (optionKey: 'option1' | 'option2', brand: InverterBrand) => {
    let newOption: InverterOptionConfig;
    if (brand === 'huawei') {
      newOption = createHuaweiOption(systemSizeKwp, panelCount);
    } else if (brand === 'atmoce') {
      newOption = createAtmoceOption(systemSizeKwp, panelCount);
    } else if (brand === 'enphase') {
      newOption = createEnphaseOption(systemSizeKwp, panelCount);
    } else {
      newOption = {
        ...proposal[optionKey],
        brand: 'custom',
        title: `Custom Solar System ${systemSizeKwp} kWp`
      };
    }

    onChange({
      ...proposal,
      [optionKey]: newOption
    });
  };

  const renderOptionCard = (optionKey: 'option1' | 'option2', opt: InverterOptionConfig, titleLabel: string) => (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
        <h4 className="font-bold text-sm text-[#0f3460] flex items-center gap-2">
          <Zap className="w-4 h-4 text-sky-600" />
          <span>{titleLabel}</span>
        </h4>
        <span className="text-xs bg-white px-3 py-1 rounded-full font-bold border border-slate-300 text-slate-700">
          {opt.brand.toUpperCase()} {opt.inverterType.toUpperCase()}
        </span>
      </div>

      {/* Brand Select */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          เลือกยี่ห้อระบบ Inverter
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'huawei', label: 'Huawei', desc: 'String Inverter + SmartGuard' },
            { id: 'atmoce', label: 'ATMOCE', desc: 'Microinverter 1250W 2:1' },
            { id: 'enphase', label: 'Enphase', desc: 'Microinverter IQ8 / IQ8P' },
          ].map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => handleBrandChange(optionKey, b.id as InverterBrand)}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                opt.brand === b.id
                  ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 text-blue-900 font-bold'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="text-sm font-bold">{b.label}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{b.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Inverter Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            ชื่อรุ่น Inverter
          </label>
          <input
            type="text"
            value={opt.inverterModel}
            onChange={(e) => onChange({
              ...proposal,
              [optionKey]: { ...opt, inverterModel: e.target.value }
            })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            จำนวน Inverter (เครื่อง/ชุด)
          </label>
          <input
            type="number"
            value={opt.inverterCount}
            onChange={(e) => onChange({
              ...proposal,
              [optionKey]: { ...opt, inverterCount: parseInt(e.target.value) || 1 }
            })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
          />
        </div>
      </div>

      {/* Battery Config */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Battery className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-800">ระบบ Energy Storage (Battery Backup)</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={opt.hasBattery}
              onChange={(e) => onChange({
                ...proposal,
                [optionKey]: { ...opt, hasBattery: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {opt.hasBattery && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                ความจุแบตเตอรี่ (kWh)
              </label>
              <input
                type="number"
                value={opt.batteryCapacityKwh}
                onChange={(e) => onChange({
                  ...proposal,
                  [optionKey]: { ...opt, batteryCapacityKwh: parseFloat(e.target.value) || 0 }
                })}
                placeholder="เช่น 14"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                ชื่อรุ่นแบตเตอรี่ & Backup Box
              </label>
              <input
                type="text"
                value={opt.batteryModel}
                onChange={(e) => onChange({
                  ...proposal,
                  [optionKey]: { ...opt, batteryModel: e.target.value }
                })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* ROI Parameters */}
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            ชั่วโมงแดดเฉลี่ย (ชม./วัน)
          </label>
          <input
            type="number"
            step="0.1"
            value={opt.peakSunHours}
            onChange={(e) => onChange({
              ...proposal,
              [optionKey]: { ...opt, peakSunHours: parseFloat(e.target.value) || 4.0 }
            })}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            ประสิทธิภาพระบบ (%)
          </label>
          <input
            type="number"
            value={opt.efficiencyRate}
            onChange={(e) => onChange({
              ...proposal,
              [optionKey]: { ...opt, efficiencyRate: parseFloat(e.target.value) || 80 }
            })}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            อัตราค่าไฟคำนวณ (บาท/หน่วย)
          </label>
          <input
            type="number"
            step="0.1"
            value={opt.tariffRate}
            onChange={(e) => onChange({
              ...proposal,
              [optionKey]: { ...opt, tariffRate: parseFloat(e.target.value) || 4.5 }
            })}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
          />
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
            <Sun className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">กำหนดขนาดระบบและแบรนด์ Inverter</h2>
            <p className="text-xs text-blue-200">เลือกขนาดแผงโซลาร์ และระบบ Inverter (Huawei / ATMOCE / Enphase)</p>
          </div>
        </div>
      </div>

      {/* General Solar Config */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
        <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>ข้อมูลแผงโซล่าร์เซลล์และโครงสร้าง</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ขนาดระบบรวม (kWp)
            </label>
            <input
              type="number"
              step="0.5"
              value={systemSizeKwp}
              onChange={(e) => handleUpdateKwp(parseFloat(e.target.value) || 1)}
              className="w-full px-3.5 py-2.5 text-sm font-bold text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              จำนวนแผง (แผง)
            </label>
            <input
              type="number"
              value={panelCount}
              onChange={(e) => handleUpdatePanelCount(parseInt(e.target.value) || 1)}
              className="w-full px-3.5 py-2.5 text-sm font-bold text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              รุ่นแผงโซลาร์ (Fixed Model)
            </label>
            <input
              type="text"
              readOnly
              value={`${proposal.panelBrand} ${proposal.panelModel}`}
              className="w-full px-3.5 py-2.5 text-xs font-medium text-slate-700 rounded-xl border border-slate-200 bg-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ประเภทหลังคา
            </label>
            <select
              value={roofType}
              onChange={(e) => onChange({ ...proposal, roofType: e.target.value as RoofType })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Metal Sheet">เมทัลชีท (Metal Sheet)</option>
              <option value="CPAC Tile">กระเบื้องซีแพค (CPAC Tile)</option>
              <option value="Flat Slab / Concrete">ดาดฟ้าคอนกรีต (Flat Slab)</option>
              <option value="Roman Tile">กระเบื้องลอนคู่ (Roman Tile)</option>
              <option value="Ceramic Tile">กระเบื้องเซรามิก / ลอนสเปน</option>
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Options Selector */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>รูปแบบการนำเสนอในเอกสาร Proposal</span>
          </h3>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => onChange({ ...proposal, activeOptionsCount: 1 })}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                activeOptionsCount === 1 ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              เสนอ 1 ระบบ
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...proposal, activeOptionsCount: 2 })}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                activeOptionsCount === 2 ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              เสนอเปรียบเทียบ 2 ระบบ
            </button>
          </div>
        </div>

        {/* Option 1 Form */}
        {renderOptionCard('option1', option1, activeOptionsCount === 2 ? 'ระบบที่ 1 (Option 1)' : 'ระบบหลักที่นำเสนอ')}

        {/* Option 2 Form (If active) */}
        {activeOptionsCount === 2 && (
          renderOptionCard('option2', option2, 'ระบบที่ 2 (Option 2 เพื่อเปรียบเทียบ)')
        )}
      </div>
    </div>
  );
};
