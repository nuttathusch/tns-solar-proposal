import React from 'react';
import type { ProposalProject, SiteMedia } from '../../types/proposal';
import { Image as ImageIcon, Upload, Trash2, ExternalLink, Sparkles } from 'lucide-react';

interface StepImagesProps {
  proposal: ProposalProject;
  onChange: (updated: ProposalProject) => void;
}

export const StepImages: React.FC<StepImagesProps> = ({ proposal, onChange }) => {
  const { media } = proposal;

  const handleUpdateMedia = (field: keyof SiteMedia, value: any) => {
    onChange({
      ...proposal,
      media: {
        ...proposal.media,
        [field]: value
      }
    });
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
    // High quality architectural & solar rooftop demo illustrations
    const sampleCover = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80';
    const sampleSite1 = 'https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&w=800&q=80';
    const sampleSite2 = 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80';
    const sampleRoof2D = 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=800&q=80';
    const sampleRoof3D = 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80';

    onChange({
      ...proposal,
      media: {
        coverPhoto: sampleCover,
        sitePhotos: [sampleSite1, sampleSite2],
        roofDesignTop: sampleRoof2D,
        roofDesignIso: sampleRoof3D,
        roofDesignAdditional: [],
        electricBillPhoto: ''
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-md flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center border border-blue-400/30">
            <ImageIcon className="w-5 h-5 text-sky-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold">จัดการรูปภาพหน้างาน และ SolarEdge Designer</h2>
            <p className="text-xs text-blue-200">อัปโหลดรูปบ้านลูกค้า, ภาพจำลองการวางแผง 3D และบิลค่าไฟฟ้า</p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadSampleDemoImages}
          className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>ใส่รูปตัวอย่างสำหรับทดสอบ</span>
        </button>
      </div>

      {/* SolarEdge Designer Shortcut Helper */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
            SE
          </div>
          <div>
            <h4 className="font-bold text-xs text-amber-950">ขั้นตอนการดึงรูปจาก SolarEdge Designer</h4>
            <p className="text-[11px] text-amber-800">
              1. เปิด SolarEdge Designer &nbsp;→&nbsp; 2. วางแผงบนหลังคา &nbsp;→&nbsp; 3. แคปรูปหน้าจอ (2D และ 3D) &nbsp;→&nbsp; 4. นำมาอัปโหลดด้านล่างนี้
            </p>
          </div>
        </div>
        <a
          href="https://designer.solaredge.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition"
        >
          <span>เปิด Designer</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Image Upload Sections */}
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

        {/* 2. SolarEdge 2D Top-Down */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 text-xs flex items-center justify-center font-bold">2</span>
              <span>SolarEdge: 2D Layout (Top-Down)</span>
            </h3>
            {media.roofDesignTop && (
              <button
                type="button"
                onClick={() => handleUpdateMedia('roofDesignTop', '')}
                className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ลบ</span>
              </button>
            )}
          </div>

          <div className="h-52 bg-slate-900 border-2 border-dashed border-slate-700 rounded-xl overflow-hidden relative flex flex-col items-center justify-center">
            {media.roofDesignTop ? (
              <img src={media.roofDesignTop} alt="SolarEdge 2D" className="w-full h-full object-contain" />
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800/80 transition p-4 text-center">
                <Upload className="w-8 h-8 text-sky-400 mb-2 opacity-80" />
                <span className="text-xs font-semibold text-slate-200">อัปโหลดภาพจำลองการจัดวางแผง 2D</span>
                <span className="text-[10px] text-slate-400 mt-0.5">ภาพมุมมอง Top-down จาก SolarEdge</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('roofDesignTop', e)}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* 3. SolarEdge 3D Isometric */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">3</span>
              <span>SolarEdge: 3D Roof Model (Isometric)</span>
            </h3>
            {media.roofDesignIso && (
              <button
                type="button"
                onClick={() => handleUpdateMedia('roofDesignIso', '')}
                className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ลบ</span>
              </button>
            )}
          </div>

          <div className="h-52 bg-slate-900 border-2 border-dashed border-slate-700 rounded-xl overflow-hidden relative flex flex-col items-center justify-center">
            {media.roofDesignIso ? (
              <img src={media.roofDesignIso} alt="SolarEdge 3D" className="w-full h-full object-contain" />
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800/80 transition p-4 text-center">
                <Upload className="w-8 h-8 text-indigo-400 mb-2 opacity-80" />
                <span className="text-xs font-semibold text-slate-200">อัปโหลดภาพโมเดลหลังคา 3D</span>
                <span className="text-[10px] text-slate-400 mt-0.5">ภาพมุมมอง Isometric 3D จาก SolarEdge</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('roofDesignIso', e)}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* 4. Electricity Bill Photo */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center justify-center font-bold">4</span>
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

        {/* 5. Additional Site Photos (Up to 4) */}
        <div className="md:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-bold">5</span>
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
