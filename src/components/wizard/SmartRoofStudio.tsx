import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ProposalProject } from '../../types/proposal';
import { 
  MapPin, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  CheckCircle2, 
  Layers, 
  Sun, 
  PenTool, 
  Trash2, 
  Move, 
  Sparkles,
  Maximize2
} from 'lucide-react';

interface SmartRoofStudioProps {
  proposal: ProposalProject;
  onApply: (roofTopDataUrl: string, roofIsoDataUrl: string) => void;
  onClose?: () => void;
}

interface Point {
  x: number;
  y: number;
}

export const SmartRoofStudio: React.FC<SmartRoofStudioProps> = ({ proposal, onApply }) => {
  // Parse coordinates
  const parseCoords = (): { lat: number; lng: number } => {
    const raw = proposal.customer.coordinates || '18.670256, 98.915720';
    const parts = raw.split(',').map(s => parseFloat(s.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return { lat: parts[0], lng: parts[1] };
    }
    return { lat: 18.670256, lng: 98.915720 };
  };

  const initialCoords = parseCoords();
  const [lat, setLat] = useState<number>(initialCoords.lat);
  const [lng, setLng] = useState<number>(initialCoords.lng);
  
  // Close-up Zoom level (supports 18 to 22 with digital magnification)
  const [zoom, setZoom] = useState<number>(20);
  const [digitalScale, setDigitalScale] = useState<number>(1.8); // 1.0x to 3.0x close-up magnification
  const [panOffset, setPanOffset] = useState<Point>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<Point>({ x: 0, y: 0 });

  // Drawing tool modes
  const [drawMode, setDrawMode] = useState<'preset' | 'polygon'>('preset');
  const [customPoints, setCustomPoints] = useState<Point[]>([]);

  // Real-world physical dimensions in METERS
  const [roofWidthMeters, setRoofWidthMeters] = useState<number>(10.0);
  const [roofLengthMeters, setRoofLengthMeters] = useState<number>(14.0);
  const [rotation, setRotation] = useState<number>(15);
  const [roofType, setRoofType] = useState<'gable' | 'hip' | 'l-shape' | 'shed'>('gable');
  const [panelOrientation, setPanelOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [pitchAngle, setPitchAngle] = useState<number>(20);
  const [showIrradiance, setShowIrradiance] = useState<boolean>(true);

  const canvas2dRef = useRef<HTMLCanvasElement>(null);
  const canvas3dRef = useRef<HTMLCanvasElement>(null);

  // Compute meters per pixel based on latitude and zoom
  const getMetersPerPixel = useCallback(() => {
    const latRad = (lat * Math.PI) / 180;
    const baseMetersPerPixel = (156543.03392 * Math.cos(latRad)) / Math.pow(2, zoom);
    return baseMetersPerPixel / digitalScale;
  }, [lat, zoom, digitalScale]);

  // Synchronize when proposal coordinates change
  useEffect(() => {
    const c = parseCoords();
    setLat(c.lat);
    setLng(c.lng);
    setPanOffset({ x: 0, y: 0 });
  }, [proposal.customer.coordinates]);

  // Load satellite image tiles and render roof
  const drawSatelliteAndRoof = useCallback(() => {
    const canvas = canvas2dRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Tile Zoom math
    const tileZoom = Math.min(20, zoom);
    const n = Math.pow(2, tileZoom);
    const centerTileX = ((lng + 180) / 360) * n;
    const latRad = (lat * Math.PI) / 180;
    const centerTileY = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;

    const baseTileX = Math.floor(centerTileX);
    const baseTileY = Math.floor(centerTileY);

    const pixelOffsetX = (centerTileX - baseTileX) * 256;
    const pixelOffsetY = (centerTileY - baseTileY) * 256;

    const centerX = width / 2 + panOffset.x;
    const centerY = height / 2 + panOffset.y;

    ctx.save();
    // Apply digital close-up magnification from center
    ctx.translate(centerX, centerY);
    ctx.scale(digitalScale, digitalScale);
    ctx.translate(-centerX, -centerY);

    // Draw 3x3 Satellite Tiles
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const tileX = baseTileX + dx;
        const tileY = baseTileY + dy;
        const posX = centerX - pixelOffsetX + dx * 256;
        const posY = centerY - pixelOffsetY + dy * 256;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = `https://mt1.google.com/vt/lyrs=s&x=${tileX}&y=${tileY}&z=${tileZoom}`;
        img.onload = () => {
          ctx.drawImage(img, posX, posY, 256, 256);
          // Redraw overlay after each tile loads
          renderOverlayOnly();
        };
      }
    }
    ctx.restore();

    renderOverlayOnly();
    draw3DView();
  }, [lat, lng, zoom, digitalScale, panOffset, drawMode, customPoints, roofWidthMeters, roofLengthMeters, rotation, roofType, panelOrientation, pitchAngle, showIrradiance, proposal.panelCount, proposal.systemSizeKwp]);

  const renderOverlayOnly = useCallback(() => {
    const canvas = canvas2dRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2 + panOffset.x;
    const centerY = height / 2 + panOffset.y;

    const metersPerPixel = getMetersPerPixel();
    const boxPixelW = roofWidthMeters / metersPerPixel;
    const boxPixelH = roofLengthMeters / metersPerPixel;

    // Center Location Pin Dot
    ctx.save();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(centerX, centerY);

    if (drawMode === 'preset') {
      ctx.rotate((rotation * Math.PI) / 180);

      const halfW = boxPixelW / 2;
      const halfH = boxPixelH / 2;

      // Draw Roof Facets with Sun Irradiance
      if (roofType === 'gable') {
        // Gable Roof (จั่ว 2 ด้าน)
        // North Slope (Moderate)
        ctx.fillStyle = showIrradiance ? 'rgba(217, 119, 6, 0.65)' : 'rgba(245, 158, 11, 0.45)';
        ctx.fillRect(-halfW, -halfH, boxPixelW, halfH);

        // South Slope (High Irradiance - Yellow/Gold)
        ctx.fillStyle = showIrradiance ? 'rgba(250, 204, 21, 0.75)' : 'rgba(245, 158, 11, 0.55)';
        ctx.fillRect(-halfW, 0, boxPixelW, halfH);

        // Ridge Line (สันจั่ว)
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-halfW, 0);
        ctx.lineTo(halfW, 0);
        ctx.stroke();

        // Outer Boundary Box
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.strokeRect(-halfW, -halfH, boxPixelW, boxPixelH);

        // Real-dimension Labels in Meters
        ctx.fillStyle = '#f0fdf4';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.fillText(`${roofWidthMeters.toFixed(1)}m`, -halfW + 4, -halfH - 4);
        ctx.fillText(`${roofLengthMeters.toFixed(1)}m`, halfW + 6, 0);

        // Place Solar Panels in South Slope
        drawPlacedPanels(ctx, -halfW + 6, 4, boxPixelW - 12, halfH - 8, metersPerPixel);
      } else if (roofType === 'l-shape') {
        // L-Shape Roof
        const w = boxPixelW;
        const h = boxPixelH;
        const wing = boxPixelW * 0.45;

        ctx.fillStyle = showIrradiance ? 'rgba(250, 204, 21, 0.75)' : 'rgba(245, 158, 11, 0.55)';
        ctx.beginPath();
        ctx.moveTo(-w / 2 + wing, -h / 2);
        ctx.lineTo(w / 2, -h / 2);
        ctx.lineTo(w / 2, h / 2);
        ctx.lineTo(-w / 2, h / 2);
        ctx.lineTo(-w / 2, h / 2 - wing);
        ctx.lineTo(-w / 2 + wing, h / 2 - wing);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Ridge
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-w / 2 + wing, -h / 2);
        ctx.lineTo(0, 0);
        ctx.lineTo(w / 2, h / 2 - wing);
        ctx.stroke();

        drawPlacedPanels(ctx, -w / 2 + 6, h / 2 - wing + 6, w - 12, wing - 10, metersPerPixel);
      } else {
        // Hip / Shed Roof
        ctx.fillStyle = showIrradiance ? 'rgba(250, 204, 21, 0.75)' : 'rgba(245, 158, 11, 0.55)';
        ctx.fillRect(-halfW, -halfH, boxPixelW, boxPixelH);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.strokeRect(-halfW, -halfH, boxPixelW, boxPixelH);

        // Place Panels
        drawPlacedPanels(ctx, -halfW + 6, -halfH + 6, boxPixelW - 12, boxPixelH - 12, metersPerPixel);
      }
    } else {
      // Custom Polygon
      if (customPoints.length > 1) {
        ctx.fillStyle = 'rgba(250, 204, 21, 0.65)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(customPoints[0].x, customPoints[0].y);
        for (let i = 1; i < customPoints.length; i++) {
          ctx.lineTo(customPoints[i].x, customPoints[i].y);
        }
        if (customPoints.length >= 3) {
          ctx.closePath();
          ctx.fill();
        }
        ctx.stroke();

        customPoints.forEach((p, idx) => {
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 9px sans-serif';
          ctx.fillText(`${idx + 1}`, p.x + 6, p.y + 6);
        });

        if (customPoints.length >= 4) {
          drawPlacedPanels(ctx, -40, -20, 80, 40, metersPerPixel);
        }
      }
    }

    ctx.restore();

    // Bottom Stats Bar (SolarEdge Style)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
    ctx.fillRect(0, height - 38, width, 38);

    const count = proposal.panelCount || 6;
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText(`PV MODULES: ${count}/${count}`, 16, height - 15);

    ctx.fillStyle = '#34d399';
    ctx.fillText(`DC POWER: ${proposal.systemSizeKwp} kWp`, width / 2 - 50, height - 15);

    ctx.fillStyle = '#38bdf8';
    const annualMwh = (proposal.systemSizeKwp * 1.45).toFixed(2);
    ctx.fillText(`EST. ANNUAL PRODUCTION: ${annualMwh} MWh`, width - 235, height - 15);
  }, [drawMode, customPoints, roofWidthMeters, roofLengthMeters, rotation, roofType, panelOrientation, showIrradiance, proposal.panelCount, proposal.systemSizeKwp, getMetersPerPixel, panOffset]);

  useEffect(() => {
    drawSatelliteAndRoof();
  }, [drawSatelliteAndRoof]);

  // Draw Solar Panels matching real LONGi 650W dimensions (2.38m x 1.13m)
  const drawPlacedPanels = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    availW: number,
    _availH: number,
    metersPerPixel: number
  ) => {
    const count = proposal.panelCount || 6;

    // LONGi 650W real physical dimensions: 2.38m length, 1.13m width
    const panelPhysicalW = panelOrientation === 'portrait' ? 1.13 : 2.38;
    const panelPhysicalH = panelOrientation === 'portrait' ? 2.38 : 1.13;

    // Convert to canvas pixels
    const pW = Math.max(10, panelPhysicalW / metersPerPixel);
    const pH = Math.max(16, panelPhysicalH / metersPerPixel);
    const gap = 2.5;

    let cols = Math.floor(availW / (pW + gap));
    if (cols < 1) cols = 1;
    let placed = 0;

    for (let r = 0; r < 5 && placed < count; r++) {
      for (let c = 0; c < cols && placed < count; c++) {
        const px = startX + c * (pW + gap);
        const py = startY + r * (pH + gap);

        // Draw Blue N-Type Solar Cell
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(px, py, pW, pH);
        ctx.strokeStyle = '#93c5fd';
        ctx.lineWidth = 1;
        ctx.strokeRect(px, py, pW, pH);

        // Grid lines inside panel
        ctx.strokeStyle = 'rgba(96, 165, 250, 0.6)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(px + pW / 2, py);
        ctx.lineTo(px + pW / 2, py + pH);
        ctx.moveTo(px, py + pH / 2);
        ctx.lineTo(px + pW, py + pH / 2);
        ctx.stroke();

        placed++;
      }
    }
  };

  const draw3DView = () => {
    const canvas = canvas3dRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Dark 3D Background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // 3D Perspective Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = -width; i < width * 2; i += 45) {
      ctx.beginPath();
      ctx.moveTo(i, height);
      ctx.lineTo(width / 2 + (i - width / 2) * 0.35, height / 2 - 90);
      ctx.stroke();
    }

    ctx.save();
    ctx.translate(width / 2, height / 2 - 10);
    ctx.rotate(((rotation - 15) * Math.PI) / 180);
    ctx.scale(1.2, 0.7);

    // 3D House Body
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-100, -30, 200, 110);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(-100, -30, 200, 110);

    // 3D Roof Slopes with Irradiance Heatmap
    const grad1 = ctx.createLinearGradient(-100, 0, 100, 60);
    grad1.addColorStop(0, '#fbbf24');
    grad1.addColorStop(1, '#f59e0b');
    ctx.fillStyle = grad1;
    ctx.beginPath();
    ctx.moveTo(-110, 55);
    ctx.lineTo(110, 55);
    ctx.lineTo(80, -20);
    ctx.lineTo(-80, -20);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.stroke();

    // 3D Placed Solar Panels
    const count = proposal.panelCount || 6;
    ctx.fillStyle = '#1d4ed8';
    ctx.strokeStyle = '#93c5fd';
    ctx.lineWidth = 1;

    for (let i = 0; i < count; i++) {
      const px = -65 + i * 22;
      ctx.fillRect(px, 10, 16, 26);
      ctx.strokeRect(px, 10, 16, 26);
    }

    ctx.restore();

    // 3D Stats Footer
    ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
    ctx.fillRect(0, height - 38, width, 38);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText(`3D PERSPECTIVE • ROOF TILT: ${pitchAngle}° • ORIENTATION: SOUTH`, 16, height - 15);

    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`LONGi Hi-MO X10 650W • N-Type BC-CELL`, width - 250, height - 15);
  };

  // Mouse canvas interaction (Pan or Draw)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvas2dRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (drawMode === 'polygon') {
      const relX = x - (canvas.width / 2 + panOffset.x);
      const relY = y - (canvas.height / 2 + panOffset.y);
      setCustomPoints([...customPoints, { x: relX, y: relY }]);
    } else {
      setIsPanning(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning && drawMode === 'preset') {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      // Zoom in
      setDigitalScale(prev => Math.min(3.5, prev + 0.15));
    } else {
      // Zoom out
      setDigitalScale(prev => Math.max(0.8, prev - 0.15));
    }
  };

  const handleApply = () => {
    const canvas2d = canvas2dRef.current;
    const canvas3d = canvas3dRef.current;
    if (canvas2d && canvas3d) {
      onApply(canvas2d.toDataURL('image/png'), canvas3d.toDataURL('image/png'));
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-700 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black tracking-tight text-white">Live Satellite Roof & PV Placement</h3>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>ภาพถ่ายดาวเทียมจริงตรงพิกัด 100%</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              ดึงภาพดาวเทียมตรงพิกัด <strong className="text-cyan-300 font-mono">{lat.toFixed(6)}, {lng.toFixed(6)}</strong> และปรับขนาดหลังคาตัวบ้านจริง
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleApply}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white px-5 py-2.5 rounded-xl font-black text-xs shadow-lg shadow-emerald-500/25 transition cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>บันทึก 2D/3D ลง Proposal ทันที</span>
        </button>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Canvases (Col 7) */}
        <div className="lg:col-span-7 space-y-4">
          {/* 2D Satellite Canvas */}
          <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 relative shadow-inner">
            <div className="flex justify-between items-center mb-2 px-1 text-xs">
              <span className="font-bold text-sky-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>2D Satellite Close-Up (หมุนลูกกลิ้งเมาส์ หรือกดปุ่มซูมเพื่อขยาย)</span>
              </span>
              
              {/* Zoom & Magnification Controls */}
              <div className="flex items-center gap-2 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setDigitalScale(prev => Math.max(0.8, prev - 0.25));
                    if (digitalScale <= 1.0) setZoom(prev => Math.max(17, prev - 1));
                  }}
                  className="p-1 hover:text-sky-400 transition cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[10px] text-cyan-300 font-bold">
                  {(digitalScale * 100).toFixed(0)}% ซูมใกล้
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setDigitalScale(prev => Math.min(3.5, prev + 0.25));
                    if (digitalScale >= 2.0) setZoom(prev => Math.min(20, prev + 1));
                  }}
                  className="p-1 hover:text-sky-400 transition cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => { setDigitalScale(2.0); setZoom(20); setPanOffset({ x: 0, y: 0 }); }}
                  className="ml-1 text-[9px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded cursor-pointer"
                  title="Reset Zoom & Center"
                >
                  Reset
                </button>
              </div>
            </div>

            <canvas
              ref={canvas2dRef}
              width={560}
              height={340}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onWheel={handleWheel}
              className="w-full h-[290px] rounded-xl object-contain bg-slate-900 cursor-move"
            />
          </div>

          {/* 3D Perspective Canvas */}
          <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 relative shadow-inner">
            <div className="flex justify-between items-center mb-2 px-1 text-xs">
              <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>3D Roof Perspective & Heatmap</span>
              </span>
              <span className="text-[10px] text-amber-400">มุมเอียง {pitchAngle}° (ทิศใต้รับแดด 100%)</span>
            </div>
            <canvas
              ref={canvas3dRef}
              width={560}
              height={240}
              className="w-full h-[190px] rounded-xl object-contain bg-slate-900"
            />
          </div>
        </div>

        {/* Controls & Tools Panel (Col 5) */}
        <div className="lg:col-span-5 bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-5">
          {/* Mode Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
              1. โหมดการกำหนดหลังคา
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDrawMode('preset')}
                className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  drawMode === 'preset'
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-xs'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                <Move className="w-3.5 h-3.5" />
                <span>โครงสำเร็จรูป (ปรับขนาดได้)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDrawMode('polygon');
                  setCustomPoints([]);
                }}
                className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  drawMode === 'polygon'
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-xs'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>คลิกวาด 4 จุดบนหลังคา</span>
              </button>
            </div>
          </div>

          {/* Preset Controls with REAL-WORLD METERS */}
          {drawMode === 'preset' ? (
            <div className="space-y-4 pt-2 border-t border-slate-700 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">ทรงหลังคา</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'gable', label: 'ทรงจั่ว (Gable)' },
                    { id: 'hip', label: 'ทรงปั้นหยา (Hip)' },
                    { id: 'l-shape', label: 'หลังคาตัว L' },
                    { id: 'shed', label: 'เพิงหมาแหงน / แบน' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setRoofType(t.id as any)}
                      className={`p-2 rounded-lg border font-semibold cursor-pointer ${
                        roofType === t.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rotation Slider */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>หมุนตามแนวหลังคาบ้านจริง</span>
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

              {/* Real-World Meter Dimensions */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-slate-400">ความกว้างหลังคา</label>
                    <span className="text-cyan-300 font-mono font-bold">{roofWidthMeters.toFixed(1)} m</span>
                  </div>
                  <input
                    type="range"
                    min="3.0"
                    max="25.0"
                    step="0.5"
                    value={roofWidthMeters}
                    onChange={(e) => setRoofWidthMeters(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-slate-400">ความยาวหลังคา</label>
                    <span className="text-cyan-300 font-mono font-bold">{roofLengthMeters.toFixed(1)} m</span>
                  </div>
                  <input
                    type="range"
                    min="4.0"
                    max="35.0"
                    step="0.5"
                    value={roofLengthMeters}
                    onChange={(e) => setRoofLengthMeters(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Digital Zoom Slider */}
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1">
                    <Maximize2 className="w-3 h-3 text-emerald-400" />
                    <span>ระยะซูมดาวเทียมเข้าใกล้ (Close-up Zoom)</span>
                  </span>
                  <span className="text-emerald-400 font-mono font-bold">{(digitalScale * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="3.5"
                  step="0.1"
                  value={digitalScale}
                  onChange={(e) => setDigitalScale(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-2 border-t border-slate-700 text-xs">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-700">
                <span className="font-bold text-amber-300 block mb-1">วิธีวาดขอบหลังคา:</span>
                <p className="text-[11px] text-slate-400">
                  คลิกที่มุมทั้ง 4 จุดของหลังคาบ้านบนแผนที่ดาวเทียม ระบบจะคำนวณพื้นที่และวางแผงให้อัตโนมัติ ({customPoints.length} จุดที่คลิกแล้ว)
                </p>
              </div>

              {customPoints.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCustomPoints([])}
                  className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 text-xs font-bold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ล้างจุดที่วาดแล้วเริ่มใหม่</span>
                </button>
              )}
            </div>
          )}

          {/* Panel Orientation & Pitch */}
          <div className="pt-3 border-t border-slate-700 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-300">การวางแผง LONGi 650W ({proposal.panelCount} แผง)</span>
              <span className="text-emerald-400 font-bold">{proposal.systemSizeKwp} kWp</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPanelOrientation('portrait')}
                className={`py-2 px-3 rounded-lg border text-center font-semibold cursor-pointer ${
                  panelOrientation === 'portrait'
                    ? 'bg-cyan-600 text-white border-cyan-400'
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
                    ? 'bg-cyan-600 text-white border-cyan-400'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                แนวนอน (Landscape)
              </button>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">ความชันหลังคา (Pitch Angle)</label>
              <select
                value={pitchAngle}
                onChange={(e) => setPitchAngle(parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs"
              >
                <option value="15">15° (เมทัลชีท / ลอนคู่)</option>
                <option value="20">20° (มาตรฐาน ซีแพคโมเนีย)</option>
                <option value="25">25° (ปั้นหยาสูง)</option>
                <option value="30">30° (จั่วสูง)</option>
              </select>
            </div>
          </div>

          {/* Irradiance Toggle */}
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700 flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <div>
                <span className="font-bold text-white block">จำลองความเข้มแสงแดด (Irradiance)</span>
                <span className="text-[10px] text-slate-400">สีเหลือง/ทอง = ทิศใต้แดดแรงสุด</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={showIrradiance}
              onChange={(e) => setShowIrradiance(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
