import React, { useState } from 'react';
import type { ProposalProject, SiteMedia } from '../../types/proposal';
import { SmartRoofStudio } from './SmartRoofStudio';
import { Image as ImageIcon, Upload, Trash2, Sparkles, Wand2, ChevronDown, ChevronUp } from 'lucide-react';

interface StepImagesProps {
  proposal: ProposalProject;
  onChange: (updated: ProposalProject) => void;
}

export const StepImages: React.FC<StepImagesProps> = ({ proposal, onChange }) => {
  const { media } = proposal;
  const [showSmartStudio, setShowSmartStudio] = useState<boolean>(true);

  const handleUpdateMedia = (field: keyof SiteMedia, value: any) => {
    onChange({
      ...proposal,
      media: {
        ...proposal.media,
        [field]: value
      }
    });
  };

  const handleApplySmartRoof = (data2d: string, data3d: string) => {
    onChange({
      ...proposal,
      media: {
        ...proposal.media,
        roofDesignTop: data2d,
        roofDesignIso: data3d
      }
    });
    alert('✅ บันทึกภาพจำลอง 2D Top-down และ 3D Perspective เข้าสู่ Proposal หน้า 4-5 เรียบร้อยแล้ว!');
  };

  const handleFileUpload = (field: keyof SiteMedia, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        handleUpdateMedia(field, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMultipleSitePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const readers = files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then(newImages => {
        const combined = [...(media.sitePhotos || []), ...newImages].slice(0, 4);
        handleUpdateMedia('sitePhotos', combined);
      });
    }
  };

  const loadSampleDemoImages = () => {
    const sampleCover = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80';
    const sampleSite1 = 'https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&w=800&q=80';
    const sampleSite2 = 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80';

    onChange({
      ...proposal,
      media: {
        ...proposal.media,
        coverPhoto: sampleCover,
        sitePhotos: [sampleSite1, sampleSite2],
      }
    });
  };

  const handleImportFromSolarEdgeStorage = () => {
    try {
      const raw = localStorage.getItem('tns_solaredge_latest_sync');
      if (raw) {
        const payload = JSON.parse(raw);
        onChange({
          ...proposal,
          customer: {
            ...proposal.customer,
            name: payload.projectName || proposal.customer.name,
            address: payload.street || proposal.customer.address
          },
          systemSizeKwp: payload.dcPowerKwp || proposal.systemSizeKwp,
          panelCount: payload.modulesCount || proposal.panelCount,
          media: {
            ...proposal.media,
            roofDesignTop: payload.canvasDataUrl || proposal.media.roofDesignTop,
            roofDesignIso: payload.canvasDataUrl || proposal.media.roofDesignIso
          }
        });
        alert('⚡ นำเข้าข้อมูลและรูปภาพจาก SolarEdge เรียบร้อยแล้ว!');
      } else {
        alert('ไม่พบข้อมูล SolarEdge ในระบบ กรุณาเปิดแท็บ SolarEdge Designer แล้วกดปุ่ม Sync to TNS Proposal อีกครั้งครับ');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center border border-blue-400/30">
            <ImageIcon className="w-5 h-5 text-sky-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold">จัดการรูปภาพหน้างาน และโมเดลหลังคา 3D</h2>
            <p className="text-xs text-blue-200">ดึงภาพจาก SolarEdge Designer อัตโนมัติ หรือใช้ Smart Roof Studio ในเว็บ</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleImportFromSolarEdgeStorage}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>⚡ นำเข้าจาก SolarEdge ล่าสุด</span>
          </button>

          <button
            type="button"
            onClick={loadSampleDemoImages}
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-3 py-2 rounded-xl transition cursor-pointer"
          >
            <span>รูปตัวอย่าง</span>
          </button>
        </div>
      </div>

      {/* SMART ROOF & AUTO PV STUDIO SECTION */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-sm">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-800">
                ระบบสร้างหลังคา & วางแผงอัตโนมัติ (Smart Roof Studio)
              </h3>
              <p className="text-xs text-slate-500">
                แทนที่การทำใน SolarEdge Designer: ปรับทรงหลังคา หมุนองศา และกดบันทึกเข้า Proposal ได้ทันที 100%
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowSmartStudio(!showSmartStudio)}
            className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 cursor-pointer"
          >
            <span>{showSmartStudio ? 'ซ่อนเครื่องมือ' : 'เปิดเครื่องมือออกแบบ'}</span>
            {showSmartStudio ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showSmartStudio && (
          <div className="mt-4">
            <SmartRoofStudio
              proposal={proposal}
              onApply={handleApplySmartRoof}
            />
          </div>
        )}
      </div>

      {/* Manual Upload Sections (If user also has custom photos) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Cover Photo */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">1</span>
              <span>ภาพหน้าปก (Cover Hero Photo)</span>
            </h3>
            {media.coverPhoto && (
              <button
                type="button"
                onClick={() => handleUpdateMedia('coverPhoto', '')}
                className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ลบ</span>
              </button>
            )}
          </div>

          <div className="h-52 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl overflow-hidden relative flex flex-col items-center justify-center">
            {media.coverPhoto ? (
              <img src={media.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100/80 transition p-4 text-center">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-semibold text-slate-700">คลิกเพื่ออัปโหลดภาพมุมสูง / หน้าบ้าน</span>
                <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, JPEG</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('coverPhoto', e)}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* 2. Electricity Bill Photo */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center justify-center font-bold">2</span>
              <span>ภาพบิลค่าไฟฟ้า (Electricity Bill)</span>
            </h3>
            {media.electricBillPhoto && (
              <button
                type="button"
                onClick={() => handleUpdateMedia('electricBillPhoto', '')}
                className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ลบ</span>
              </button>
            )}
          </div>

          <div className="h-52 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl overflow-hidden relative flex flex-col items-center justify-center">
            {media.electricBillPhoto ? (
              <img src={media.electricBillPhoto} alt="Bill" className="w-full h-full object-contain bg-slate-900" />
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100/80 transition p-4 text-center">
                <Upload className="w-8 h-8 text-amber-500 mb-2 opacity-80" />
                <span className="text-xs font-semibold text-slate-700">อัปโหลดรูปถ่ายบิลค่าไฟ (MEA / PEA)</span>
                <span className="text-[10px] text-slate-400 mt-0.5">แนบในหน้าเอกสารประกอบ</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('electricBillPhoto', e)}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* 3. Additional Site Photos (Up to 4) */}
        <div className="md:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-bold">3</span>
              <span>รูปถ่ายหน้างานจริงเพิ่มเติม (Site Pictures: 2 - 4 รูป)</span>
            </h3>
            {(media.sitePhotos?.length || 0) > 0 && (
              <button
                type="button"
                onClick={() => handleUpdateMedia('sitePhotos', [])}
                className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ลบทั้งหมด</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(media.sitePhotos || []).map((img, idx) => (
              <div key={idx} className="h-36 rounded-xl overflow-hidden border border-slate-200 relative group bg-slate-100">
                <img src={img} alt={`Site ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    const filtered = (media.sitePhotos || []).filter((_, i) => i !== idx);
                    handleUpdateMedia('sitePhotos', filtered);
                  }}
                  className="absolute top-1.5 right-1.5 bg-rose-600/90 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">
                  รูปที่ {idx + 1}
                </span>
              </div>
            ))}

            {(media.sitePhotos?.length || 0) < 4 && (
              <label className="h-36 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition p-2 text-center">
                <Upload className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-[11px] font-semibold text-slate-600">+ เพิ่มรูปถ่ายหน้างาน</span>
                <span className="text-[9px] text-slate-400">เลือกได้หลายรูปพร้อมกัน</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleMultipleSitePhotos}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
