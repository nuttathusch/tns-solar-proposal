import React from 'react';
import type { ProposalProject } from '../../types/proposal';
import { PageFooter, TNSCubeLogo } from './PageLayout';

interface PageCoverProps {
  proposal: ProposalProject;
}

export const PageCover: React.FC<PageCoverProps> = ({ proposal }) => {
  const { customer, media, option1 } = proposal;

  return (
    <div className="a4-page relative flex flex-col justify-between bg-white text-slate-800">
      {/* Top Header */}
      <div className="pt-8 px-12 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <TNSCubeLogo size={56} />
          <div className="flex flex-col">
            <span className="font-black text-sm text-[#0f3460] tracking-wider uppercase">TNS</span>
            <span className="font-bold text-xs text-[#0f3460] tracking-wider uppercase">SOLAR</span>
            <span className="font-semibold text-[10px] text-[#1a5fb4] tracking-widest uppercase">SYSTEM</span>
            <span className="text-[7px] tracking-tight text-slate-500 uppercase">BEST QUALITY BEST PRICE</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-slate-500 block">Date: {proposal.date}</span>
          <span className="text-xs font-bold text-[#0052cc]">Ref No: {proposal.quotationNumber}</span>
        </div>
      </div>

      {/* Main Title */}
      <div className="text-center pt-2 pb-3">
        <h1 className="text-5xl font-black tracking-tight text-[#0a192f] uppercase" style={{ letterSpacing: '2px' }}>
          PROPOSAL
        </h1>
        <p className="text-xs font-semibold tracking-widest text-[#0f3460] uppercase mt-1">
          SOLAR ROOF TOP - ON GRIDSOLAR POWER SYSTEM
        </p>
        <p className="text-sm font-medium text-slate-600">
          On grid solar power
        </p>
      </div>

      {/* Hero Image Section */}
      <div className="flex-1 px-10 relative flex flex-col items-center justify-center">
        <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 relative bg-slate-100 flex items-center justify-center">
          {media.coverPhoto ? (
            <img 
              src={media.coverPhoto} 
              alt="Site Drone View" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-slate-800 via-slate-700 to-slate-600 flex flex-col items-center justify-center text-white p-6 text-center">
              <svg className="w-20 h-20 opacity-40 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-semibold text-lg">รูปถ่ายหน้างานจริง / ภาพมุมสูงโดรน</span>
              <span className="text-xs text-slate-300 mt-1">อัปโหลดรูปภาพบ้านลูกค้าเพื่อแสดงในหน้าปก</span>
            </div>
          )}

          {/* Floating Inverter / Equipment Badge Mockup in Bottom Right */}
          <div className="absolute right-4 bottom-4 bg-white/90 backdrop-blur-md rounded-xl p-3 shadow-md border border-slate-200 flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 overflow-hidden">
              <div className="text-center font-bold text-[9px] text-slate-700">
                {option1.brand === 'huawei' ? 'HUAWEI' : option1.brand === 'atmoce' ? 'ATMOCE' : 'ENPHASE'}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-emerald-600 block">Tier-1 N-Type System</span>
              <span className="text-xs font-bold text-slate-800">{proposal.systemSizeKwp} kWp Solar Rooftop</span>
              <span className="text-[9px] text-slate-500 block">LONGi Hi-MO X10 650W</span>
            </div>
          </div>
        </div>

        {/* Customer Name Banner */}
        <div className="w-full mt-6 bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-[#0f3460] rounded-lg flex items-center justify-center text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Customer name :</span>
            <h2 className="text-2xl font-black text-[#0f3460]">
              {customer.name || 'คุณวรางคณา สงวนศิลป์'}
            </h2>
            {customer.address && (
              <p className="text-xs text-slate-600 mt-0.5">{customer.fullAddress || customer.address}</p>
            )}
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <div className="pb-1">
        <PageFooter />
      </div>
    </div>
  );
};
