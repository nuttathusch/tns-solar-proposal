import React from 'react';
import type { ProposalProject } from '../types/proposal';
import { TNSCubeLogo } from './preview/PageLayout';
import { Plus, Save, Download, Printer, Eye, Edit3, Check } from 'lucide-react';

interface HeaderProps {
  proposal: ProposalProject;
  activeView: 'wizard' | 'preview';
  onViewChange: (view: 'wizard' | 'preview') => void;
  onNewProposal: () => void;
  onSave: () => void;
  onExportJson: () => void;
  onPrintPdf: () => void;
  isSaved?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  proposal: _proposal,
  activeView,
  onViewChange,
  onNewProposal,
  onSave,
  onExportJson,
  onPrintPdf,
  isSaved = false
}) => {
  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <TNSCubeLogo size={36} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-[#0f3460] tracking-wider">TNS SOLAR SYSTEM</span>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Proposal Studio</span>
            </div>
            <span className="text-[10px] text-slate-500 block leading-tight">ระบบสร้างเอกสารเสนอโครงการ Solar Rooftop อัตโนมัติ</span>
          </div>
        </div>

        {/* Center: View Switcher Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => onViewChange('wizard')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeView === 'wizard'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>แก้ไขข้อมูล (Studio)</span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange('preview')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeView === 'preview'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>ดูตัวอย่างเล่มจริง (Preview A4)</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNewProposal}
            className="flex items-center gap-1.5 text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 transition cursor-pointer"
            title="สร้าง Proposal ลูกค้ารายใหม่"
          >
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            <span>สร้างใหม่</span>
          </button>

          <button
            type="button"
            onClick={onSave}
            className="flex items-center gap-1.5 text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 transition cursor-pointer"
            title="บันทึกลงในเครื่อง"
          >
            {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Save className="w-3.5 h-3.5 text-slate-600" />}
            <span>{isSaved ? 'บันทึกแล้ว' : 'บันทึก'}</span>
          </button>

          <button
            type="button"
            onClick={onExportJson}
            className="hidden sm:flex items-center gap-1.5 text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 transition cursor-pointer"
            title="Export JSON backup"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>สำรองข้อมูล</span>
          </button>

          <button
            type="button"
            onClick={onPrintPdf}
            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
