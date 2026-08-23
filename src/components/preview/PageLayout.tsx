import React from 'react';
import { COMPANY_INFO } from '../../data/presets';

interface PageLayoutProps {
  pageTitle?: string;
  subTitle?: string;
  hideHeader?: boolean;
  hideFooter?: boolean;
  children: React.ReactNode;
  pageNumber?: number;
  totalPages?: number;
  className?: string;
}

export const TNSCubeLogo: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <svg width={size} height={size * 0.9} viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Geometric Isometric Cube lines like in TNS logo */}
    <path d="M50 5 L90 28 L50 51 L10 28 Z" stroke="#0f3460" strokeWidth="2.5" fill="none" />
    <path d="M50 51 L90 28 L90 74 L50 97 Z" stroke="#0f3460" strokeWidth="2.5" fill="none" />
    <path d="M50 51 L10 28 L10 74 L50 97 Z" stroke="#0f3460" strokeWidth="2.5" fill="none" />
    
    <path d="M50 5 L50 51" stroke="#0f3460" strokeWidth="2" />
    <path d="M10 28 L50 51" stroke="#0f3460" strokeWidth="2" />
    <path d="M90 28 L50 51" stroke="#0f3460" strokeWidth="2" />
    
    {/* Triangle/Cube subdivisions */}
    <path d="M30 16.5 L70 39.5" stroke="#1a5fb4" strokeWidth="1.8" />
    <path d="M70 16.5 L30 39.5" stroke="#1a5fb4" strokeWidth="1.8" />
    <path d="M30 62.5 L70 85.5" stroke="#1a5fb4" strokeWidth="1.8" />
    <path d="M70 62.5 L30 85.5" stroke="#1a5fb4" strokeWidth="1.8" />
  </svg>
);

export const TNSNetworkLogo: React.FC = () => (
  <div className="bg-[#0088b4] text-white px-2.5 py-1 rounded flex flex-col justify-center items-center font-bold tracking-tighter leading-none shadow-sm">
    <span className="text-xl font-black tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>TNS</span>
    <span className="text-[7px] font-normal tracking-wide uppercase opacity-90">network solutions</span>
  </div>
);

export const PageHeader: React.FC<{ pageTitle?: string; subTitle?: string }> = ({
  pageTitle = 'SOLAR ROOF TOP - ON GRIDSOLAR POWER SYSTEM',
  subTitle
}) => (
  <div className="w-full pt-6 px-10 pb-3 flex justify-between items-center border-b border-slate-100">
    <div className="flex items-center gap-3">
      <TNSCubeLogo size={44} />
      <div className="flex flex-col">
        <span className="font-extrabold text-xs text-[#0f3460] tracking-wider uppercase">TNS</span>
        <span className="font-bold text-[10px] text-[#0f3460] tracking-wider uppercase">SOLAR</span>
        <span className="font-medium text-[9px] text-[#1a5fb4] tracking-widest uppercase">SYSTEM</span>
        <span className="text-[6px] tracking-tight text-slate-500 uppercase">BEST QUALITY BEST PRICE</span>
      </div>
    </div>

    <div className="text-center flex-1 pr-12">
      <h2 className="text-[#0f3460] text-sm font-semibold tracking-wide uppercase">
        {pageTitle}
      </h2>
      {subTitle && (
        <h3 className="text-[#0052cc] text-xl font-bold tracking-tight mt-0.5">
          {subTitle}
        </h3>
      )}
    </div>
  </div>
);

export const PageFooter: React.FC = () => (
  <div className="absolute bottom-0 left-0 right-0 w-full px-10 py-3.5 bg-white border-t border-slate-200 flex justify-between items-center text-[8.5px] text-slate-600">
    {/* Left: QR Code info */}
    <div className="flex items-center gap-2.5">
      <div className="w-10 h-10 bg-slate-900 rounded p-1 flex items-center justify-center text-white text-[7px] font-bold relative">
        {/* Mock QR Code Pattern */}
        <div className="w-full h-full border border-white flex flex-col justify-between p-0.5">
          <div className="flex justify-between">
            <div className="w-2 h-2 bg-white" />
            <div className="w-2 h-2 bg-white" />
          </div>
          <div className="text-center text-[5px] text-emerald-400 font-bold bg-slate-800 px-0.5 rounded">LINE</div>
          <div className="flex justify-between">
            <div className="w-2 h-2 bg-white" />
            <div className="w-1.5 h-1.5 bg-white" />
          </div>
        </div>
      </div>
      <div>
        <p className="font-bold text-slate-800 text-[9.5px]">{COMPANY_INFO.nameEn}</p>
        <p className="text-[8px] text-slate-500 leading-tight">{COMPANY_INFO.address}</p>
        <p className="text-[8px] text-slate-600">
          <span className="font-semibold">Tel :</span> {COMPANY_INFO.tel} &nbsp;|&nbsp; 
          <span className="font-semibold">E-mail :</span> {COMPANY_INFO.email}
        </p>
      </div>
    </div>

    {/* Right: Logos */}
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        <TNSCubeLogo size={28} />
        <div className="flex flex-col text-[7px] text-[#0f3460] font-bold leading-none">
          <span>TNS</span>
          <span>SOLAR</span>
          <span className="text-[5.5px] font-normal text-slate-500">SYSTEM</span>
        </div>
      </div>
      <TNSNetworkLogo />
    </div>
  </div>
);

export const PageLayout: React.FC<PageLayoutProps> = ({
  pageTitle,
  subTitle,
  hideHeader = false,
  hideFooter = false,
  children,
  className = ''
}) => {
  return (
    <div className={`a4-page relative flex flex-col justify-between ${className}`}>
      {!hideHeader && <PageHeader pageTitle={pageTitle} subTitle={subTitle} />}
      <div className="flex-1 w-full px-10 py-4 flex flex-col pb-20">
        {children}
      </div>
      {!hideFooter && <PageFooter />}
    </div>
  );
};
