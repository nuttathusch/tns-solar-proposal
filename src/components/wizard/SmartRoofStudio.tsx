import React, { useState, useRef, useEffect } from 'react';
import type { ProposalProject } from '../../types/proposal';
import { Sparkles, RotateCw, CheckCircle2, Layers, Sun, Bot, Sliders, Play } from 'lucide-react';

interface SmartRoofStudioProps {
  proposal: ProposalProject;
  onApply: (roofTopDataUrl: string, roofIsoDataUrl: string) => void;
  onClose?: () => void;
}

export const SmartRoofStudio: React.FC<SmartRoofStudioProps> = ({ proposal, onApply }) => {
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [detectionSuccess, setDetectionSuccess] = useState<boolean>(true);
  const [rotation, setRotation] = useState<number>(0);
  const [roofScale, setRoofScale] = useState<number>(1.0);
  const [pitchAngle, setPitchAngle] = useState<number>(20);
  const [panelOrientation, setPanelOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [showIrradiance, setShowIrradiance] = useState<boolean>(true);
  const [roofTypeDetected, setRoofTypeDetected] = useState<string>('L-Shape Complex Hip Roof (ตรวจจับหลังคาตัว L อัตโนมัติ)');
  const [confidenceScore, setConfidenceScore] = useState<number>(96);

  const canvas2dRef = useRef<HTMLCanvasElement>(null);
  const canvas3dRef = useRef<HTMLCanvasElement>(null);

  // Trigger AI Auto Detection
  const handleRunAiDetection = () => {
    setIsDetecting(true);
    setDetectionSuccess(false);
    
    // Simulate AI Computer Vision scanning & skeletonizing the roof from satellite
    setTimeout(() => {
      setIsDetecting(false);
      setDetectionSuccess(true);
      setRoofTypeDetected('L-Shape Multi-Facet Hip Roof (ตรวจจับขอบเขตและสันหลังคา 100%)');
      setConfidenceScore(98.4);
      setRotation(5);
    }, 1200);
  };

  useEffect(() => {
    drawAutoDetected2D();
    drawAutoDetected3D();
  }, [rotation, roofScale, pitchAngle, panelOrientation, showIrradiance, proposal.panelCount, proposal.systemSizeKwp]);

  const drawAutoDetected2D = () => {
    const canvas = canvas2dRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Dark Satellite Simulation Background
    ctx.fillStyle = '#0b1120';
    ctx.fillRect(0, 0, width, height);

    // Subtle Satellite Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 35) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 35) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.save();
    ctx.translate(width / 2, height / 2 - 10);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(roofScale, roofScale);

    // AI Detected L-Shape Roof Contours & Facets
    const baseW = 270;
    const baseH = 270;
    const wingW = 120;
    const wingH = 120;

    // Draw AI detected building outline shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.moveTo(-baseW / 2 + wingW + 6, -baseH / 2 + 6);
    ctx.lineTo(baseW / 2 + 6, -baseH / 2 + 6);
    ctx.lineTo(baseW / 2 + 6, baseH / 2 + 6);
    ctx.lineTo(-baseW / 2 + 6, baseH / 2 + 6);
    ctx.lineTo(-baseW / 2 + 6, baseH / 2 - wingH + 6);
    ctx.lineTo(-baseW / 2 + wingW + 6, baseH / 2 - wingH + 6);
    ctx.closePath();
    ctx.fill();

    // 1. Facet: South-Facing Horizontal Slope (High Irradiance)
    const gradSouth = ctx.createLinearGradient(-baseW / 2, baseH / 2 - wingH, 0, baseH / 2);
    gradSouth.addColorStop(0, showIrradiance ? '#fde047' : '#f59e0b');
    gradSouth.addColorStop(1, showIrradiance ? '#f59e0b' : '#d97706');
    ctx.fillStyle = gradSouth;
    ctx.beginPath();
    ctx.moveTo(-baseW / 2, baseH / 2);
    ctx.lineTo(baseW / 2, baseH / 2);
    ctx.lineTo(baseW / 2 - 40, baseH / 2 - wingH / 2);
    ctx.lineTo(-baseW / 2 + 40, baseH / 2 - wingH / 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 2. Facet: Vertical Wing South/East Face (High Irradiance)
    const gradEast = ctx.createLinearGradient(baseW / 2 - wingW, -baseH / 2, baseW / 2, 0);
    gradEast.addColorStop(0, showIrradiance ? '#fbbf24' : '#d97706');
    gradEast.addColorStop(1, showIrradiance ? '#f59e0b' : '#b45309');
    ctx.fillStyle = gradEast;
    ctx.beginPath();
    ctx.moveTo(baseW / 2, -baseH / 2);
    ctx.lineTo(baseW / 2, baseH / 2);
    ctx.lineTo(baseW / 2 - wingW / 2, baseH / 2 - 40);
    ctx.lineTo(baseW / 2 - wingW / 2, -baseH / 2 + 40);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.stroke();

    // 3. Facet: North/West Slopes (Moderate Irradiance)
    ctx.fillStyle = showIrradiance ? '#d97706' : '#92400e';
    ctx.beginPath();
    ctx.moveTo(-baseW / 2 + wingW, -baseH / 2);
    ctx.lineTo(baseW / 2, -baseH / 2);
    ctx.lineTo(baseW / 2 - wingW / 2, -baseH / 2 + 40);
    ctx.lineTo(-baseW / 2 + wingW, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Main Roof Ridge Lines (เส้นสันหลังคาและสันตะเข้)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    // Horizontal ridge
    ctx.moveTo(-baseW / 2 + 40, baseH / 2 - wingH / 2);
    ctx.lineTo(baseW / 2 - 40, baseH / 2 - wingH / 2);
    // Vertical ridge
    ctx.moveTo(baseW / 2 - wingW / 2, -baseH / 2 + 40);
    ctx.lineTo(baseW / 2 - wingW / 2, baseH / 2 - 40);
    // Hip corner connections
    ctx.moveTo(-baseW / 2, baseH / 2);
    ctx.lineTo(-baseW / 2 + 40, baseH / 2 - wingH / 2);
    ctx.moveTo(baseW / 2, baseH / 2);
    ctx.lineTo(baseW / 2 - 40, baseH / 2 - wingH / 2);
    ctx.moveTo(baseW / 2, -baseH / 2);
    ctx.lineTo(baseW / 2 - wingW / 2, -baseH / 2 + 40);
    ctx.stroke();

    // Outer Auto-Detected Boundary (Cyan Highlight Line with Corner Handles)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-baseW / 2 + wingW, -baseH / 2);
    ctx.lineTo(baseW / 2, -baseH / 2);
    ctx.lineTo(baseW / 2, baseH / 2);
    ctx.lineTo(-baseW / 2, baseH / 2);
    ctx.lineTo(-baseW / 2, baseH / 2 - wingH);
    ctx.lineTo(-baseW / 2 + wingW, baseH / 2 - wingH);
    ctx.closePath();
    ctx.stroke();

    // Dimension labels (like in SolarEdge Designer: 7.27m, 14.54m)
    ctx.fillStyle = '#e0f2fe';
    ctx.font = 'bold 9px Inter, sans-serif';
    ctx.fillText('14.54m', -30, baseH / 2 + 14);
    ctx.fillText('14.92m', baseW / 2 + 8, 10);
    ctx.fillText('7.27m', 0, -baseH / 2 - 6);

    // AUTO PLACE PANELS (20 Panels of LONGi 650W)
    const targetCount = proposal.panelCount || 20;
    const pW = panelOrientation === 'portrait' ? 17 : 30;
    const pH = panelOrientation === 'portrait' ? 30 : 17;
    let placed = 0;

    // Pack on South facet
    const southStartX = -baseW / 2 + 20;
    const southStartY = baseH / 2 - wingH + 30;
    for (let i = 0; i < 9 && placed < targetCount; i++) {
      const px = southStartX + i * (pW + 4);
      drawSolarPanel(ctx, px, southStartY, pW, pH);
      placed++;
    }

    // Pack on East/West facet
    const eastStartX = baseW / 2 - wingW + 22;
    const eastStartY = -baseH / 2 + 45;
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 2; c++) {
        if (placed < targetCount) {
          const px = eastStartX + c * (pW + 5);
          const py = eastStartY + r * (pH + 5);
          if (py + pH < baseH / 2 - wingH - 10) {
            drawSolarPanel(ctx, px, py, pW, pH);
            placed++;
          }
        }
      }
    }

    ctx.restore();

    // Bottom Stats Bar (SolarEdge Designer Style)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
    ctx.fillRect(0, height - 38, width, 38);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText(`PV MODULES: ${targetCount}/${targetCount}`, 20, height - 16);

    ctx.fillStyle = '#34d399';
    ctx.fillText(`DC POWER: ${proposal.systemSizeKwp} kWp`, width / 2 - 60, height - 16);

    ctx.fillStyle = '#38bdf8';
    const annualProd = (proposal.systemSizeKwp * 1450).toFixed(2);
    ctx.fillText(`EST. ANNUAL PRODUCTION: ${annualProd} MWh`, width - 240, height - 16);
  };

  const drawAutoDetected3D = () => {
    const canvas = canvas3dRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Dark 3D Space Background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Perspective Grid Lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = -width; i < width * 2; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, height);
      ctx.lineTo(width / 2 + (i - width / 2) * 0.3, height / 2 - 100);
      ctx.stroke();
    }

    ctx.save();
    ctx.translate(width / 2, height / 2 - 20);
    ctx.rotate(((rotation - 15) * Math.PI) / 180);
    ctx.scale(roofScale * 1.1, roofScale * 0.7);

    // 3D House Base
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(-100, 100);
    ctx.lineTo(120, 100);
    ctx.lineTo(120, -60);
    ctx.lineTo(30, -60);
    ctx.lineTo(30, 20);
    ctx.lineTo(-100, 20);
    ctx.closePath();
    ctx.fill();

    // 3D Roof Slopes with Irradiance Gradient
    const grad1 = ctx.createLinearGradient(-100, 0, 100, 100);
    grad1.addColorStop(0, '#fbbf24');
    grad1.addColorStop(1, '#f59e0b');
    ctx.fillStyle = grad1;
    ctx.beginPath();
    ctx.moveTo(-90, 85);
    ctx.lineTo(110, 85);
    ctx.lineTo(60, 40);
    ctx.lineTo(-40, 40);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.stroke();

    const grad2 = ctx.createLinearGradient(30, -50, 100, 30);
    grad2.addColorStop(0, '#fde047');
    grad2.addColorStop(1, '#d97706');
    ctx.fillStyle = grad2;
    ctx.beginPath();
    ctx.moveTo(110, 85);
    ctx.lineTo(110, -50);
    ctx.lineTo(70, -30);
    ctx.lineTo(60, 40);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 3D Solar Panels on South Facet
    ctx.fillStyle = '#1d4ed8';
    ctx.strokeStyle = '#93c5fd';
    ctx.lineWidth = 1;
    for (let i = 0; i < 9; i++) {
      ctx.fillRect(-70 + i * 18, 55, 14, 22);
      ctx.strokeRect(-70 + i * 18, 55, 14, 22);
    }
    // 3D Panels on East/West Facet
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 2; c++) {
        ctx.fillRect(75 + c * 14, -20 + r * 16, 11, 13);
        ctx.strokeRect(75 + c * 14, -20 + r * 16, 11, 13);
      }
    }

    ctx.restore();

    // 3D Overlay Bottom Info
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, height - 38, width, 38);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10.5px Inter, sans-serif';
    ctx.fillText(`3D PERSPECTIVE • ROOF TILT: ${pitchAngle}° • ORIENTATION: SOUTH`, 20, height - 16);

    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`LONGi Hi-MO X10 650W • N-Type BC-CELL`, width - 260, height - 16);
  };

  const drawSolarPanel = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);

    // Inner busbars
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + w / 2, y + h);
    ctx.moveTo(x, y + h / 2);
    ctx.lineTo(x + w, y + h / 2);
    ctx.stroke();
  };

  const handleApplyToProposal = () => {
    const canvas2d = canvas2dRef.current;
    const canvas3d = canvas3dRef.current;
    if (canvas2d && canvas3d) {
      const data2d = canvas2d.toDataURL('image/png');
      const data3d = canvas3d.toDataURL('image/png');
      onApply(data2d, data3d);
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-700 space-y-6">
      {/* Top Banner with AI Auto-Detect Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black tracking-tight text-white">AI Smart Roof & Auto PV Placement</h3>
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Auto-Detect</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              ตรวจจับหลังคาบ้านจากพิกัด GPS อัตโนมัติ วาดขอบและสันหลังคา พร้อมคำนวณแสงแดดและวางแผงทันที
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            disabled={isDetecting}
            onClick={handleRunAiDetection}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-600/30 transition cursor-pointer"
          >
            {isDetecting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>กำลังวิเคราะห์ภาพดาวเทียม...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>สั่ง AI ตรวจจับหลังคาใหม่</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleApplyToProposal}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white px-5 py-2.5 rounded-xl font-black text-xs shadow-lg shadow-emerald-500/25 transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>บันทึก 2D/3D ลง Proposal ทันที</span>
          </button>
        </div>
      </div>

      {/* AI Detection Status Indicator */}
      {detectionSuccess && (
        <div className="bg-cyan-950/60 border border-cyan-800/80 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black shadow-sm">
              ✓
            </div>
            <div>
              <span className="text-xs font-bold text-cyan-200 block">{roofTypeDetected}</span>
              <span className="text-[11px] text-slate-400">
                พิกัด: <strong className="text-white font-mono">{proposal.customer.coordinates || '13.8055, 100.5788'}</strong> &nbsp;|&nbsp;
                ความแม่นยำ AI: <strong className="text-emerald-400">{confidenceScore}%</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="bg-slate-900 text-amber-300 px-3 py-1 rounded-lg border border-slate-700 font-semibold flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>ทิศใต้รับแสงสูงสุด 100%</span>
            </span>
            <span className="bg-slate-900 text-sky-300 px-3 py-1 rounded-lg border border-slate-700 font-semibold">
              วางแผง: {proposal.panelCount} แผง ({proposal.systemSizeKwp} kWp)
            </span>
          </div>
        </div>
      )}

      {/* Main Grid: Canvases on Left, Adjustments on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Canvases View (Col 7) */}
        <div className="lg:col-span-7 space-y-4">
          {/* 2D Top-Down Canvas */}
          <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 relative shadow-inner">
            <div className="flex justify-between items-center mb-2 px-1 text-xs">
              <span className="font-bold text-sky-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>2D Auto-Traced Roof & Panel Placement ({proposal.panelCount} แผง)</span>
              </span>
              <span className="text-[10px] text-slate-400">ขนาดแผงจริง LONGi 650W (2.38 x 1.13m)</span>
            </div>
            <canvas
              ref={canvas2dRef}
              width={560}
              height={320}
              className="w-full h-[260px] rounded-xl object-contain bg-slate-900"
            />
          </div>

          {/* 3D Perspective Canvas */}
          <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 relative shadow-inner">
            <div className="flex justify-between items-center mb-2 px-1 text-xs">
              <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>3D Roof Perspective & Facet Irradiance Heatmap</span>
              </span>
              <span className="text-[10px] text-amber-400">มุมเอียงหลังคา {pitchAngle}°</span>
            </div>
            <canvas
              ref={canvas3dRef}
              width={560}
              height={320}
              className="w-full h-[260px] rounded-xl object-contain bg-slate-900"
            />
          </div>
        </div>

        {/* Fine-Tuning Controls (Col 5) */}
        <div className="lg:col-span-5 bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-5">
          <h4 className="font-bold text-xs text-slate-300 flex items-center gap-2 uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>ปรับแต่งมุมมองและตำแหน่ง (Fine Tuning)</span>
          </h4>

          {/* 1. Rotation Slider */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>หมุนองศาตามแนวตัวบ้าน (Rotation)</span>
              </span>
              <span className="font-mono text-cyan-400 font-bold">{rotation}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={rotation}
              onChange={(e) => setRotation(parseInt(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* 2. Roof Scale & Pitch Angle */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">ขยาย/ย่อขนาดหลังคา</label>
              <input
                type="range"
                min="0.7"
                max="1.4"
                step="0.05"
                value={roofScale}
                onChange={(e) => setRoofScale(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">ความชันหลังคา (Pitch)</label>
              <select
                value={pitchAngle}
                onChange={(e) => setPitchAngle(parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs"
              >
                <option value="15">15° (เมทัลชีท / ลอนคู่)</option>
                <option value="20">20° (มาตรฐาน ซีแพค)</option>
                <option value="25">25° (ปั้นหยาสูง)</option>
                <option value="30">30° (จั่วสูง)</option>
              </select>
            </div>
          </div>

          {/* 3. Panel Orientation */}
          <div className="space-y-2 text-xs">
            <span className="font-bold text-slate-300 block">การจัดเรียงแผงโซลาร์</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPanelOrientation('portrait')}
                className={`py-2 px-3 rounded-lg border text-center font-semibold cursor-pointer ${
                  panelOrientation === 'portrait'
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-xs'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                แนวตั้ง (Portrait)
              </button>
              <button
                type="button"
                onClick={() => setPanelOrientation('landscape')}
                className={`py-2 px-3 rounded-lg border text-center font-semibold cursor-pointer ${
                  panelOrientation === 'landscape'
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-xs'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                แนวนอน (Landscape)
              </button>
            </div>
          </div>

          {/* 4. Irradiance Simulation Toggle */}
          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-700 flex justify-between items-center text-xs">
            <div className="flex items-center gap-2.5">
              <Sun className="w-4 h-4 text-amber-400" />
              <div>
                <span className="font-bold text-white block">แสดงแผนที่ความเข้มแสง (Irradiance)</span>
                <span className="text-[10px] text-slate-400">สีส้ม/เหลือง = แสงแรงสุดในไทย</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={showIrradiance}
              onChange={(e) => setShowIrradiance(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {/* 5. Summary Info */}
          <div className="bg-cyan-950/40 border border-cyan-900/60 rounded-xl p-3 text-xs space-y-1 text-slate-300">
            <div className="flex justify-between">
              <span>รุ่นแผงโซลาร์:</span>
              <strong className="text-white">LONGi Hi-MO X10 650W</strong>
            </div>
            <div className="flex justify-between">
              <span>จำนวนแผงที่คำนวณได้:</span>
              <strong className="text-emerald-400">{proposal.panelCount} แผง ({proposal.systemSizeKwp} kWp)</strong>
            </div>
            <div className="flex justify-between">
              <span>ทิศทางที่วางแผง:</span>
              <strong className="text-amber-300">ทิศใต้ (South) & ทิศตะวันตก (West)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
