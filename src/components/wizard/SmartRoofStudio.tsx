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
  Plus,
  Minus,
  Wand2,
  MousePointer,
  HelpCircle
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

interface PlacedPanel {
  id: string;
  x: number; // canvas pixel X relative to center
  y: number; // canvas pixel Y relative to center
  orientation: 'portrait' | 'landscape';
}

type StudioTool = 'draw-roof' | 'edit-vertices' | 'move-panels' | 'pan-map';

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
  
  // Map zoom and pan
  const [zoom, setZoom] = useState<number>(20);
  const [digitalScale, setDigitalScale] = useState<number>(1.8);
  const [panOffset, setPanOffset] = useState<Point>({ x: 0, y: 0 });
  const [isMapDragging, setIsMapDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<Point>({ x: 0, y: 0 });

  // Current active tool
  const [activeTool, setActiveTool] = useState<StudioTool>('draw-roof');

  // Roof Polygon Geometry
  const [polygonPoints, setPolygonPoints] = useState<Point[]>([]);
  const [isPolygonClosed, setIsPolygonClosed] = useState<boolean>(false);
  const [activeVertexIdx, setActiveVertexIdx] = useState<number | null>(null);

  // Inner Edges & Ridges (Auto Inner Edge / Straight Skeleton)
  const [hasInnerEdges, setHasInnerEdges] = useState<boolean>(false);
  const [ridgeLines, setRidgeLines] = useState<{ p1: Point; p2: Point }[]>([]);

  // Interactive Placed Panels
  const [panels, setPanels] = useState<PlacedPanel[]>([]);
  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(null);
  const [draggingPanelId, setDraggingPanelId] = useState<string | null>(null);
  const [panelDragOffset, setPanelDragOffset] = useState<Point>({ x: 0, y: 0 });

  // Roof settings
  const [pitchAngle, setPitchAngle] = useState<number>(20);
  const [showIrradiance, setShowIrradiance] = useState<boolean>(true);
  const [defaultOrientation, setDefaultOrientation] = useState<'portrait' | 'landscape'>('portrait');

  const canvas2dRef = useRef<HTMLCanvasElement>(null);
  const canvas3dRef = useRef<HTMLCanvasElement>(null);

  // Ground resolution: Meters per pixel
  const getMetersPerPixel = useCallback(() => {
    const latRad = (lat * Math.PI) / 180;
    const baseMetersPerPixel = (156543.03392 * Math.cos(latRad)) / Math.pow(2, zoom);
    return baseMetersPerPixel / digitalScale;
  }, [lat, zoom, digitalScale]);

  // Synchronize when customer coordinates change
  useEffect(() => {
    const c = parseCoords();
    setLat(c.lat);
    setLng(c.lng);
    setPanOffset({ x: 0, y: 0 });
  }, [proposal.customer.coordinates]);

  // Initialize a default house polygon centered on map if empty
  const initPresetLOrGable = (type: 'gable' | 'l-shape') => {
    const mpp = getMetersPerPixel();
    if (type === 'gable') {
      const w = 12 / mpp;
      const h = 8 / mpp;
      const pts: Point[] = [
        { x: -w / 2, y: -h / 2 },
        { x: w / 2, y: -h / 2 },
        { x: w / 2, y: h / 2 },
        { x: -w / 2, y: h / 2 },
      ];
      setPolygonPoints(pts);
      setIsPolygonClosed(true);
      computeInnerEdges(pts);
      autoPlacePanelsOnPolygon(pts, proposal.panelCount || 6);
    } else {
      const w = 14 / mpp;
      const wing = 6 / mpp;
      const pts: Point[] = [
        { x: -w / 2 + wing, y: -w / 2 },
        { x: w / 2, y: -w / 2 },
        { x: w / 2, y: w / 2 },
        { x: -w / 2, y: w / 2 },
        { x: -w / 2, y: w / 2 - wing },
        { x: -w / 2 + wing, y: w / 2 - wing },
      ];
      setPolygonPoints(pts);
      setIsPolygonClosed(true);
      computeInnerEdges(pts);
      autoPlacePanelsOnPolygon(pts, proposal.panelCount || 20);
    }
  };

  // AUTO INNER EDGE: Computes ridge lines, medial axis and hip vertices automatically
  const computeInnerEdges = (points: Point[]) => {
    if (points.length < 3) return;

    // Calculate Centroid
    let cx = 0;
    let cy = 0;
    points.forEach(p => {
      cx += p.x;
      cy += p.y;
    });
    cx /= points.length;
    cy /= points.length;

    const ridges: { p1: Point; p2: Point }[] = [];

    if (points.length === 4) {
      // Rectangular Gable / Hip Roof: Create central ridge line
      const mid1 = { x: (points[0].x + points[3].x) / 2, y: (points[0].y + points[3].y) / 2 };
      const mid2 = { x: (points[1].x + points[2].x) / 2, y: (points[1].y + points[2].y) / 2 };

      // Central ridge
      ridges.push({ p1: mid1, p2: mid2 });
      // Hips to corners
      ridges.push({ p1: points[0], p2: mid1 });
      ridges.push({ p1: points[3], p2: mid1 });
      ridges.push({ p1: points[1], p2: mid2 });
      ridges.push({ p1: points[2], p2: mid2 });
    } else {
      // Complex / L-Shape / N-gon: Connect corners to centroid / internal skeleton
      points.forEach(p => {
        ridges.push({ p1: p, p2: { x: cx, y: cy } });
      });
    }

    setRidgeLines(ridges);
    setHasInnerEdges(true);
  };

  // AUTO PLACE PANELS: Fits LONGi 650W panels into the polygon bounding box
  const autoPlacePanelsOnPolygon = (points: Point[], count: number) => {
    if (points.length < 3) return;

    const mpp = getMetersPerPixel();
    // LONGi 650W real physical dimensions: 2.38m length, 1.13m width
    const pW = (defaultOrientation === 'portrait' ? 1.13 : 2.38) / mpp;
    const pH = (defaultOrientation === 'portrait' ? 2.38 : 1.13) / mpp;
    const gap = 2.5;

    // Find bounding box of polygon
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    points.forEach(p => {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    });

    const availW = maxX - minX;
    const availH = maxY - minY;

    // Target southern/lower area for highest solar irradiance in Thailand
    const startX = minX + Math.max(10, (availW - count * (pW + gap)) / 2);
    const startY = minY + availH * 0.4;

    const newPanels: PlacedPanel[] = [];
    const maxCols = Math.max(1, Math.floor((availW - 10) / (pW + gap)));

    for (let i = 0; i < count; i++) {
      const col = i % maxCols;
      const row = Math.floor(i / maxCols);
      newPanels.push({
        id: `panel-${Date.now()}-${i}`,
        x: startX + col * (pW + gap),
        y: startY + row * (pH + gap),
        orientation: defaultOrientation
      });
    }

    setPanels(newPanels);
  };

  // Render Satellite Tiles & Roof
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
          renderOverlayOnly();
        };
      }
    }
    ctx.restore();

    renderOverlayOnly();
    draw3DView();
  }, [lat, lng, zoom, digitalScale, panOffset, polygonPoints, isPolygonClosed, activeVertexIdx, hasInnerEdges, ridgeLines, panels, selectedPanelId, showIrradiance, pitchAngle, proposal.panelCount, proposal.systemSizeKwp]);

  const renderOverlayOnly = useCallback(() => {
    const canvas = canvas2dRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2 + panOffset.x;
    const centerY = height / 2 + panOffset.y;
    const mpp = getMetersPerPixel();

    ctx.save();
    ctx.translate(centerX, centerY);

    // 1. Draw Roof Polygon Fill & Irradiance Heatmap
    if (polygonPoints.length > 1) {
      ctx.beginPath();
      ctx.moveTo(polygonPoints[0].x, polygonPoints[0].y);
      for (let i = 1; i < polygonPoints.length; i++) {
        ctx.lineTo(polygonPoints[i].x, polygonPoints[i].y);
      }

      if (isPolygonClosed) {
        ctx.closePath();
        // Solar Irradiance Gradient (Yellow / Gold on South side)
        const grad = ctx.createLinearGradient(0, -100, 0, 100);
        grad.addColorStop(0, showIrradiance ? 'rgba(217, 119, 6, 0.60)' : 'rgba(245, 158, 11, 0.40)');
        grad.addColorStop(1, showIrradiance ? 'rgba(250, 204, 21, 0.75)' : 'rgba(245, 158, 11, 0.55)');
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Outer Boundary Line (Cyan High-Tech)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 2. Draw Auto Inner Edges / Ridge Lines (White Solid)
      if (hasInnerEdges && ridgeLines.length > 0) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ridgeLines.forEach(ridge => {
          ctx.beginPath();
          ctx.moveTo(ridge.p1.x, ridge.p1.y);
          ctx.lineTo(ridge.p2.x, ridge.p2.y);
          ctx.stroke();
        });
      }

      // 3. Draw Edge Dimension Labels in METERS (SolarEdge Designer Style)
      ctx.fillStyle = '#f0fdf4';
      ctx.font = 'bold 10px Inter, sans-serif';
      for (let i = 0; i < polygonPoints.length; i++) {
        const p1 = polygonPoints[i];
        const p2 = polygonPoints[(i + 1) % polygonPoints.length];
        if (i < polygonPoints.length - 1 || isPolygonClosed) {
          const edgeLengthMeters = (Math.hypot(p2.x - p1.x, p2.y - p1.y) * mpp).toFixed(2);
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;

          // Dimension badge background
          ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
          ctx.fillRect(midX - 18, midY - 7, 36, 14);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(midX - 18, midY - 7, 36, 14);

          ctx.fillStyle = '#38bdf8';
          ctx.textAlign = 'center';
          ctx.fillText(`${edgeLengthMeters}m`, midX, midY + 4);
          ctx.textAlign = 'start';
        }
      }

      // 4. Draw Corner Vertex Circles (Handles)
      polygonPoints.forEach((pt, idx) => {
        const isHover = activeVertexIdx === idx;
        ctx.fillStyle = isHover ? '#f59e0b' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, isHover ? 6 : 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    }

    // 5. Draw Interactive Placed Solar Panels (LONGi 650W)
    panels.forEach(p => {
      const pW = (p.orientation === 'portrait' ? 1.13 : 2.38) / mpp;
      const pH = (p.orientation === 'portrait' ? 2.38 : 1.13) / mpp;
      const isSelected = selectedPanelId === p.id;

      // Dark Blue N-Type Solar Cell
      ctx.fillStyle = isSelected ? '#3b82f6' : '#1e3a8a';
      ctx.fillRect(p.x, p.y, pW, pH);

      // Aluminum Frame
      ctx.strokeStyle = isSelected ? '#fbbf24' : '#93c5fd';
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.strokeRect(p.x, p.y, pW, pH);

      // Panel Busbars & Grid
      ctx.strokeStyle = 'rgba(147, 197, 253, 0.5)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(p.x + pW / 2, p.y);
      ctx.lineTo(p.x + pW / 2, p.y + pH);
      ctx.moveTo(p.x, p.y + pH / 2);
      ctx.lineTo(p.x + pW, p.y + pH / 2);
      ctx.stroke();
    });

    ctx.restore();

    // SolarEdge Designer Bottom Stats Bar
    ctx.fillStyle = 'rgba(0, 0, 0, 0.90)';
    ctx.fillRect(0, height - 38, width, 38);

    const count = panels.length;
    const totalKwp = (count * 0.65).toFixed(2);
    const estMwh = (count * 0.65 * 1.45).toFixed(2);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText(`PV MODULES: ${count}/${proposal.panelCount || count}`, 16, height - 15);

    ctx.fillStyle = '#34d399';
    ctx.fillText(`DC POWER: ${totalKwp} kWp`, width / 2 - 40, height - 15);

    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`EST. ANNUAL PRODUCTION: ${estMwh} MWh`, width - 235, height - 15);
  }, [polygonPoints, isPolygonClosed, activeVertexIdx, hasInnerEdges, ridgeLines, panels, selectedPanelId, showIrradiance, getMetersPerPixel, panOffset, proposal.panelCount]);

  useEffect(() => {
    drawSatelliteAndRoof();
  }, [drawSatelliteAndRoof]);

  // Draw 3D Perspective View
  const draw3DView = () => {
    const canvas = canvas3dRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Dark 3D Space Background
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
    ctx.scale(1.2, 0.7);

    // 3D House Body
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-110, -30, 220, 110);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(-110, -30, 220, 110);

    // 3D Slopes with Irradiance Heatmap
    const grad1 = ctx.createLinearGradient(-100, 0, 100, 60);
    grad1.addColorStop(0, '#fbbf24');
    grad1.addColorStop(1, '#f59e0b');
    ctx.fillStyle = grad1;
    ctx.beginPath();
    ctx.moveTo(-115, 55);
    ctx.lineTo(115, 55);
    ctx.lineTo(85, -20);
    ctx.lineTo(-85, -20);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.stroke();

    // 3D Solar Panels
    const count = panels.length || proposal.panelCount || 6;
    ctx.fillStyle = '#1d4ed8';
    ctx.strokeStyle = '#93c5fd';
    ctx.lineWidth = 1;

    for (let i = 0; i < count; i++) {
      const px = -80 + (i % 8) * 20;
      const py = 5 + Math.floor(i / 8) * 24;
      ctx.fillRect(px, py, 15, 20);
      ctx.strokeRect(px, py, 15, 20);
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

  // Mouse Interaction: Clicking corners, Dragging vertices, Dragging panels, Panning map
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvas2dRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const centerX = canvas.width / 2 + panOffset.x;
    const centerY = canvas.height / 2 + panOffset.y;
    const relX = clickX - centerX;
    const relY = clickY - centerY;
    const mpp = getMetersPerPixel();

    if (activeTool === 'pan-map') {
      setIsMapDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      return;
    }

    if (activeTool === 'draw-roof') {
      if (isPolygonClosed) {
        // If already closed, restart drawing
        setPolygonPoints([{ x: relX, y: relY }]);
        setIsPolygonClosed(false);
        setHasInnerEdges(false);
        setRidgeLines([]);
        return;
      }

      // Check if clicking near first point to close polygon
      if (polygonPoints.length >= 3) {
        const first = polygonPoints[0];
        const dist = Math.hypot(first.x - relX, first.y - relY);
        if (dist < 15) {
          setIsPolygonClosed(true);
          computeInnerEdges(polygonPoints);
          autoPlacePanelsOnPolygon(polygonPoints, proposal.panelCount || 6);
          setActiveTool('move-panels');
          return;
        }
      }

      // Add point
      const nextPts = [...polygonPoints, { x: relX, y: relY }];
      setPolygonPoints(nextPts);
      if (nextPts.length >= 4) {
        // Offer auto-close
      }
      return;
    }

    if (activeTool === 'edit-vertices') {
      // Find closest vertex
      for (let i = 0; i < polygonPoints.length; i++) {
        const pt = polygonPoints[i];
        if (Math.hypot(pt.x - relX, pt.y - relY) < 12) {
          setActiveVertexIdx(i);
          return;
        }
      }
    }

    if (activeTool === 'move-panels') {
      // Check if clicking on an existing panel to drag it
      for (let i = panels.length - 1; i >= 0; i--) {
        const p = panels[i];
        const pW = (p.orientation === 'portrait' ? 1.13 : 2.38) / mpp;
        const pH = (p.orientation === 'portrait' ? 2.38 : 1.13) / mpp;

        if (relX >= p.x && relX <= p.x + pW && relY >= p.y && relY <= p.y + pH) {
          setSelectedPanelId(p.id);
          setDraggingPanelId(p.id);
          setPanelDragOffset({ x: relX - p.x, y: relY - p.y });
          return;
        }
      }
      setSelectedPanelId(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvas2dRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const centerX = canvas.width / 2 + panOffset.x;
    const centerY = canvas.height / 2 + panOffset.y;
    const relX = clickX - centerX;
    const relY = clickY - centerY;

    if (isMapDragging && activeTool === 'pan-map') {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
      return;
    }

    if (activeVertexIdx !== null && activeTool === 'edit-vertices') {
      const updated = [...polygonPoints];
      updated[activeVertexIdx] = { x: relX, y: relY };
      setPolygonPoints(updated);
      if (hasInnerEdges) computeInnerEdges(updated);
      return;
    }

    if (draggingPanelId !== null && activeTool === 'move-panels') {
      setPanels(prev => prev.map(p => {
        if (p.id === draggingPanelId) {
          return {
            ...p,
            x: relX - panelDragOffset.x,
            y: relY - panelDragOffset.y
          };
        }
        return p;
      }));
    }
  };

  const handleMouseUp = () => {
    setIsMapDragging(false);
    setActiveVertexIdx(null);
    setDraggingPanelId(null);
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setDigitalScale(prev => Math.min(3.5, prev + 0.15));
    } else {
      setDigitalScale(prev => Math.max(0.8, prev - 0.15));
    }
  };

  // Rotate selected panel or all panels
  const handleRotatePanels = () => {
    if (selectedPanelId) {
      setPanels(prev => prev.map(p => {
        if (p.id === selectedPanelId) {
          return { ...p, orientation: p.orientation === 'portrait' ? 'landscape' : 'portrait' };
        }
        return p;
      }));
    } else {
      setDefaultOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait');
      setPanels(prev => prev.map(p => ({
        ...p,
        orientation: p.orientation === 'portrait' ? 'landscape' : 'portrait'
      })));
    }
  };

  // Add 1 Panel
  const handleAddSinglePanel = () => {
    const mpp = getMetersPerPixel();
    const pW = (defaultOrientation === 'portrait' ? 1.13 : 2.38) / mpp;
    const pH = (defaultOrientation === 'portrait' ? 2.38 : 1.13) / mpp;

    const newPanel: PlacedPanel = {
      id: `panel-${Date.now()}`,
      x: -pW / 2,
      y: -pH / 2,
      orientation: defaultOrientation
    };
    setPanels([...panels, newPanel]);
    setSelectedPanelId(newPanel.id);
    setActiveTool('move-panels');
  };

  // Remove Selected Panel
  const handleRemovePanel = () => {
    if (selectedPanelId) {
      setPanels(panels.filter(p => p.id !== selectedPanelId));
      setSelectedPanelId(null);
    } else if (panels.length > 0) {
      setPanels(panels.slice(0, -1));
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
    <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-700 space-y-5 font-['Prompt',sans-serif]">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black tracking-tight text-white">Solar Designer Studio</h3>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>วาดขอบ + สันหลังคา + ขยับแผงได้อิสระ</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              คลิกจุดวาดขอบหลังคาบ้านจริงบนแผนที่ดาวเทียม กดสร้างสันหลังคา และลากขยับตำแหน่งแผงได้เหมือน SolarEdge
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

      {/* Interactive Tool Selection Bar */}
      <div className="bg-slate-950 p-2 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTool('draw-roof')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition cursor-pointer ${
              activeTool === 'draw-roof'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>1. คลิกวาดขอบหลังคา ({polygonPoints.length} จุด)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (polygonPoints.length >= 3) {
                setIsPolygonClosed(true);
                computeInnerEdges(polygonPoints);
              }
            }}
            disabled={polygonPoints.length < 3}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition cursor-pointer ${
              hasInnerEdges
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-sm'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>2. Auto Inner Edge (สร้างสันหลังคา & ความชัน)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('move-panels')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition cursor-pointer ${
              activeTool === 'move-panels'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <MousePointer className="w-4 h-4" />
            <span>3. ลากขยับแผง ({panels.length} แผง)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('edit-vertices')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition cursor-pointer ${
              activeTool === 'edit-vertices'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Move className="w-4 h-4" />
            <span>ปรับขยับมุม</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('pan-map')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition cursor-pointer ${
              activeTool === 'pan-map'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>เลื่อนแผนที่</span>
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-500 font-bold uppercase">โครงสำเร็จ:</span>
          <button
            type="button"
            onClick={() => initPresetLOrGable('gable')}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 cursor-pointer"
          >
            ทรงจั่ว
          </button>
          <button
            type="button"
            onClick={() => initPresetLOrGable('l-shape')}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 cursor-pointer"
          >
            หลังคาตัว L
          </button>
          <button
            type="button"
            onClick={() => {
              setPolygonPoints([]);
              setIsPolygonClosed(false);
              setHasInnerEdges(false);
              setRidgeLines([]);
              setPanels([]);
            }}
            className="p-1 text-rose-400 hover:text-rose-300 transition cursor-pointer"
            title="ล้างทั้งหมด"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Visual Canvases (Col 7) */}
        <div className="lg:col-span-7 space-y-4">
          {/* 2D Satellite Canvas */}
          <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 relative shadow-inner">
            <div className="flex justify-between items-center mb-2 px-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sky-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>2D Interactive Roof Canvas</span>
                </span>
                {activeTool === 'draw-roof' && (
                  <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                    คลิกบนหลังคาบ้านเพื่อปักจุดมุม
                  </span>
                )}
                {activeTool === 'move-panels' && (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] px-2 py-0.5 rounded-full">
                    คลิกค้างแล้วลากแผงเพื่อย้ายตำแหน่ง
                  </span>
                )}
              </div>
              
              {/* Zoom Controls */}
              <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-0.5 rounded-xl border border-slate-800">
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
                  {(digitalScale * 100).toFixed(0)}% ซูม
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
              </div>
            </div>

            <canvas
              ref={canvas2dRef}
              width={560}
              height={360}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onWheel={handleWheel}
              className={`w-full h-[300px] rounded-xl object-contain bg-slate-900 ${
                activeTool === 'draw-roof' ? 'cursor-crosshair' : activeTool === 'move-panels' ? 'cursor-grab' : 'cursor-move'
              }`}
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
              height={230}
              className="w-full h-[180px] rounded-xl object-contain bg-slate-900"
            />
          </div>
        </div>

        {/* Panel & Roof Controls (Col 5) */}
        <div className="lg:col-span-5 bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-4">
          {/* Action Tools for Panels */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              จัดการแผงโซลาร์ (LONGi Hi-MO X10 650W)
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => autoPlacePanelsOnPolygon(polygonPoints, proposal.panelCount || 6)}
                disabled={polygonPoints.length < 3}
                className="p-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>วางแผงอัตโนมัติ ({proposal.panelCount || 6} แผง)</span>
              </button>

              <button
                type="button"
                onClick={handleRotatePanels}
                className="p-2.5 bg-slate-900 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>หมุนแผง 90° ({defaultOrientation === 'portrait' ? 'แนวตั้ง' : 'แนวนอน'})</span>
              </button>

              <button
                type="button"
                onClick={handleAddSinglePanel}
                className="p-2 bg-slate-900 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded-xl font-semibold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>เพิ่มแผง (+1)</span>
              </button>

              <button
                type="button"
                onClick={handleRemovePanel}
                className="p-2 bg-slate-900 hover:bg-slate-700 text-rose-400 border border-slate-700 rounded-xl font-semibold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
                <span>ลบแผง (-1)</span>
              </button>
            </div>
          </div>

          {/* Roof Pitch & Irradiance */}
          <div className="pt-3 border-t border-slate-700 space-y-3 text-xs">
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

            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="font-bold text-white block">จำลองความเข้มแสงแดด (Irradiance)</span>
                  <span className="text-[10px] text-slate-400">สีเหลือง/ทอง = ทิศใต้แดดแรงสุดในไทย</span>
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

          {/* User Guide Card */}
          <div className="bg-cyan-950/40 border border-cyan-900/60 rounded-xl p-3.5 text-xs space-y-2 text-slate-300">
            <div className="flex items-center gap-1.5 font-bold text-cyan-300">
              <HelpCircle className="w-4 h-4" />
              <span>วิธีใช้งานระบบ (เหมือน SolarEdge):</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-400">
              <li>คลิกปุ่ม <strong>"1. คลิกวาดขอบหลังคา"</strong> แล้วคลิกที่มุมหลังคาจริงทั้ง 4 ด้าน</li>
              <li>คลิกปุ่ม <strong>"2. Auto Inner Edge"</strong> เพื่อสร้างสันหลังคา & ความชัน</li>
              <li>คลิกปุ่ม <strong>"วางแผงอัตโนมัติ"</strong> หรือลากขยับตำแหน่งแผงได้อิสระ</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
