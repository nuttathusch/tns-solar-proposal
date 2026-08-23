import React, { useState } from 'react';
import type { ProposalProject, ElectricalPhase } from '../../types/proposal';
import { estimateSystemSize, formatNumber } from '../../utils/solarCalculator';
import { User, MapPin, Zap, ExternalLink, Calculator, CheckCircle2 } from 'lucide-react';

interface StepCustomerProps {
  proposal: ProposalProject;
  onChange: (updated: ProposalProject) => void;
}

export const StepCustomer: React.FC<StepCustomerProps> = ({ proposal, onChange }) => {
  const { customer } = proposal;
  const [billInput, setBillInput] = useState<string>(customer.monthlyElectricBill?.toString() || '');

  // Calculate live recommendation based on bill
  const currentBillNum = parseFloat(billInput) || 0;
  const sizing = estimateSystemSize(currentBillNum);

  const handleApplySizing = () => {
    if (sizing.actualKwp > 0) {
      onChange({
        ...proposal,
        systemSizeKwp: sizing.actualKwp,
        panelCount: sizing.panelCount,
        customer: {
          ...proposal.customer,
          monthlyElectricBill: currentBillNum,
          averageUnitsPerMonth: sizing.monthlyUnits
        },
        // Also update option titles and panel counts
        option1: {
          ...proposal.option1,
          mainEquipment: proposal.option1.mainEquipment.map(eq => 
            eq.item === 'Solar Panel' ? { ...eq, quantity: sizing.panelCount } : eq
          )
        },
        option2: {
          ...proposal.option2,
          mainEquipment: proposal.option2.mainEquipment.map(eq => 
            eq.item === 'Solar Panel' ? { ...eq, quantity: sizing.panelCount } : eq
          )
        }
      });
    }
  };

  const handleUpdateCustomer = (fields: Partial<typeof customer>) => {
    const updatedCustomer = { ...customer, ...fields };
    // Auto assemble full address if individual fields are typed
    if (fields.address || fields.subdistrict || fields.district || fields.province || fields.zipcode) {
      const parts = [
        updatedCustomer.address,
        updatedCustomer.subdistrict ? `แขวง/ตำบล${updatedCustomer.subdistrict}` : '',
        updatedCustomer.district ? `เขต/อำเภอ${updatedCustomer.district}` : '',
        updatedCustomer.province ? `จังหวัด${updatedCustomer.province}` : '',
        updatedCustomer.zipcode
      ].filter(Boolean);
      updatedCustomer.fullAddress = parts.join(' ');
    }
    onChange({ ...proposal, customer: updatedCustomer });
  };

  const openGoogleMaps = () => {
    if (customer.coordinates) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(customer.coordinates)}`, '_blank');
    } else if (customer.fullAddress || customer.address) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(customer.fullAddress || customer.address)}`, '_blank');
    }
  };

  const openSolarEdgeDesigner = () => {
    window.open('https://designer.solaredge.com/', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center border border-blue-400/30">
            <User className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold">ข้อมูลลูกค้าและสถานที่ติดตั้ง</h2>
            <p className="text-xs text-blue-200">กรอกข้อมูลลูกค้าและค่าไฟเพื่อประเมินขนาดระบบ Solar Rooftop อัตโนมัติ</p>
          </div>
        </div>
      </div>

      {/* Customer Info Form */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
        <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          <span>ข้อมูลผู้ติดต่อ / ลูกค้า</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ชื่อลูกค้า / บริษัท <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={customer.name}
              onChange={(e) => handleUpdateCustomer({ name: e.target.value })}
              placeholder="เช่น คุณวรางคณา สงวนศิลป์"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              เบอร์โทรศัพท์ติดต่อ <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              value={customer.tel}
              onChange={(e) => handleUpdateCustomer({ tel: e.target.value })}
              placeholder="เช่น 081 234 5678"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ที่อยู่สถานที่ติดตั้ง <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={customer.fullAddress || customer.address}
              onChange={(e) => handleUpdateCustomer({ address: e.target.value, fullAddress: e.target.value })}
              placeholder="เช่น 25/94 ซอยลาดพร้าว 35 ถนนลาดพร้าว แขวงจันทรเกษม เขตจตุจักร กรุงเทพมหานคร 10900"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Map & Coordinates */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
        <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-rose-600" />
          <span>พิกัดตำแหน่งบ้าน / หลังคา</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              พิกัด GPS (Latitude, Longitude)
            </label>
            <input
              type="text"
              value={customer.coordinates}
              onChange={(e) => handleUpdateCustomer({ coordinates: e.target.value })}
              placeholder="เช่น 13.8055, 100.5788"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={openGoogleMaps}
              className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-300 transition cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>เปิด Maps</span>
            </button>

            <button
              type="button"
              onClick={openSolarEdgeDesigner}
              className="flex-1 flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-sm transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>SolarEdge</span>
            </button>
          </div>
        </div>
      </div>

      {/* Electricity Bill & Smart Sizing Calculator */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
        <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>ประเมินขนาดระบบจากค่าไฟ (Smart Solar Sizing)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ค่าไฟเฉลี่ยต่อเดือน (บาท) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={billInput}
                onChange={(e) => {
                  setBillInput(e.target.value);
                  handleUpdateCustomer({ monthlyElectricBill: parseFloat(e.target.value) || 0 });
                }}
                placeholder="เช่น 12000"
                className="w-full px-3.5 py-2.5 pr-12 text-sm font-bold text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400">บาท</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ระบบไฟฟ้าของบ้าน (Phase)
            </label>
            <select
              value={customer.electricalPhase}
              onChange={(e) => handleUpdateCustomer({ electricalPhase: e.target.value as ElectricalPhase })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="3-Phase">3-Phase (3 เฟส - เหมาะกับ 10kW+)</option>
              <option value="1-Phase">1-Phase (1 เฟส - เหมาะกับ 3-5kW)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ประเภทมิเตอร์ไฟฟ้า
            </label>
            <input
              type="text"
              value={customer.meterType}
              onChange={(e) => handleUpdateCustomer({ meterType: e.target.value })}
              placeholder="เช่น TOU 3-Phase"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Live Sizing Recommendation Box */}
        {currentBillNum > 0 && (
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200 rounded-2xl p-5 mt-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-950">ขนาดระบบที่แนะนำตามการใช้งาน</h4>
                  <p className="text-xs text-emerald-700">คำนวณจากค่าไฟ {formatNumber(currentBillNum)} บาท/เดือน (~{formatNumber(sizing.monthlyUnits)} หน่วย)</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleApplySizing}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>นำขนาด {sizing.actualKwp} kWp ไปใช้</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-center">
              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-emerald-100 shadow-2xs">
                <span className="text-[11px] text-slate-500 block">ขนาดติดตั้งแนะนำ</span>
                <strong className="text-xl font-black text-emerald-700">{sizing.actualKwp} kWp</strong>
              </div>
              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-emerald-100 shadow-2xs">
                <span className="text-[11px] text-slate-500 block">จำนวนแผง (650W)</span>
                <strong className="text-xl font-black text-slate-800">{sizing.panelCount} แผง</strong>
              </div>
              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-emerald-100 shadow-2xs">
                <span className="text-[11px] text-slate-500 block">ผลิตไฟได้ประมาณ</span>
                <strong className="text-xl font-black text-sky-700">~{formatNumber(sizing.actualKwp * 140)} หน่วย/ด.</strong>
              </div>
              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-emerald-100 shadow-2xs">
                <span className="text-[11px] text-slate-500 block">ประหยัดค่าไฟประมาณ</span>
                <strong className="text-xl font-black text-emerald-600">~{formatNumber(sizing.actualKwp * 140 * 4.5)} บ./ด.</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
