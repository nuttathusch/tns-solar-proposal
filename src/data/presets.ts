import type { ProposalProject, InverterOptionConfig, BoMItem } from '../types/proposal';
import { generateQuotationNumber, formatThaiDate } from '../utils/solarCalculator';

export const COMPANY_INFO = {
  nameEn: 'TNS network solutions Co., Ltd.',
  nameTh: 'บริษัท ทีเอ็นเอส เน็ทเวิร์ค โซลูชั่น จำกัด',
  brandName: 'TNS SOLAR SYSTEM',
  slogan: 'BEST QUALITY BEST PRICE',
  address: '9/91 Village No. 2, Samet Subdistrict, Mueang District, Chonburi 20000',
  branchAddress: '134/83 Lanna Heritage, Moo2, Somphot Chiangmai Rd., Pabong, Saraphi, Chiangmai 50140',
  taxId: '0505557011574',
  tel: '087 304 3724',
  email: 'nuttathus@tnsnetwork.co.th',
  website: 'www.tnsnetwork.co.th',
  bankName: 'ธนาคารไทยพาณิชย์',
  bankAccountNo: '681-2-24162-8',
  bankAccountName: 'บริษัท ทีเอ็นเอส เน็ทเวิร์ค โซลูชั่น จำกัด'
};

export const MAINTENANCE_9_TASKS = [
  'ทำความสะอาดแผงโซล่าร์เซลล์',
  'ตรวจสอบกำลังการผลิตไฟฟ้า',
  'ตรวจสอบสภาพโครงสร้างแผงและอุปกรณ์จับยึด',
  'ตรวจสอบสภาพสายไฟฟ้าทั้งหมด',
  'ตรวจสอบสภาพการทำงานของ Inverter และตู้ไฟฟ้า',
  'ตรวจสอบสถานะ และความแน่นของขั้วไฟฟ้า',
  'ตรวจสอบอุปกรณ์ป้องกันไฟฟ้ารวมทั้งสวิตช์ และรีเลย์',
  'ตรวจสอบระบบการเชื่อมต่อสายดิน',
  'ตรวจสอบความร้อนของแผงโซล่าร์เซลล์ และระบบไฟฟ้า ด้วยอุปกรณ์วัดอุณหภูมิ'
];

export const DEFAULT_TERMS = [
  'สำรวจและออกแบบ',
  'ดำเนินการขออนุญาตติดตั้งการไฟฟ้าฯ',
  'เขียนแบบ และยื่นขออนุญาตขนานไฟในระบบ',
  'รับประกันงานติดตั้ง 2 ปี พร้อมบริการล้างแผงปีละ 1 ครั้ง'
];

export function createDefaultBoMMounting(panelCount: number = 20): BoMItem[] {
  return [
    { id: 'm1', brand: 'Mega Industry Thailand', item: 'Aluminum Rail', description: 'รางอลูมิเนียมติดตั้งแผงสำหรับหลังคาเมทัลชีท', quantity: 1, unit: 'ชุด' },
    { id: 'm2', brand: 'Mega Industry Thailand', item: 'Mid Clamp', description: 'สำหรับยึดกลางแผง', quantity: Math.max(1, (panelCount - 1) * 2), unit: 'ตัว' },
    { id: 'm3', brand: 'Mega Industry Thailand', item: 'End Clamp', description: 'สำหรับยึดปลายแผง', quantity: 4, unit: 'ตัว' },
    { id: 'm4', brand: 'Mega Industry Thailand', item: 'Roof Hook / L-Foot', description: 'ชุดยึดหลังคา', quantity: panelCount, unit: 'ชุด' },
    { id: 'm5', brand: 'Mega Industry Thailand', item: 'Stainless Bolt & Nut', description: 'SUS304', quantity: 1, unit: 'ชุด' },
    { id: 'm6', brand: 'Mega Industry Thailand', item: 'Cable Clip', description: 'จัดเก็บสายใต้แผง', quantity: panelCount * 2, unit: 'ตัว' },
    { id: 'm7', brand: 'Mega Industry Thailand', item: 'Ground Lug', description: 'จุดต่อกราวด์แผง', quantity: 2, unit: 'ตัว' },
  ];
}

export function createDefaultBoMAc(): BoMItem[] {
  return [
    { id: 'ac1', brand: 'Chint/Schneider', item: 'AC Breaker Main', description: 'MCCB 2P / 4P', quantity: 1, unit: 'ตัว' },
    { id: 'ac2', brand: 'Suntree', item: 'AC SPD Type II', description: 'Surge Protection', quantity: 1, unit: 'ตัว' },
    { id: 'ac3', brand: 'YASAKI/BCC', item: 'AC Cable', description: 'CV 2C/4C', quantity: 1, unit: 'ชุด' },
    { id: 'ac4', brand: 'KJL', item: 'AC Combiner Box', description: 'IP65', quantity: 1, unit: 'ตู้' },
    { id: 'ac5', brand: 'YASAKI/BCC', item: 'Ground Cable', description: 'THW Green/Yellow', quantity: 1, unit: 'ชุด' },
  ];
}

export function createDefaultBoMDc(): BoMItem[] {
  return [
    { id: 'dc1', brand: 'Chint/Schneider/Kingtec', item: 'DC Breaker Main', description: 'MCCB 2P/4P 40–63A', quantity: 1, unit: 'ตัว' },
    { id: 'dc2', brand: 'Suntree', item: 'DC SPD Type II', description: 'Surge Protection', quantity: 1, unit: 'ตัว' },
    { id: 'dc3', brand: 'YASAKI/BCC', item: 'DC Cable', description: 'Solar Cable 4/6 Sq.mm', quantity: 1, unit: 'ชุด' },
    { id: 'dc4', brand: 'KJL', item: 'DC Combiner Box', description: 'IP65', quantity: 1, unit: 'ตู้' },
    { id: 'dc5', brand: 'YASAKI/BCC', item: 'Ground Cable', description: 'THW Green/Yellow', quantity: 1, unit: 'ชุด' },
  ];
}

export function createHuaweiOption(systemSizeKwp: number = 13, panelCount: number = 20): InverterOptionConfig {
  return {
    id: 'opt_huawei',
    title: `On-Grid Solar Roof Top ${systemSizeKwp} kW 3 Phase - Huawei String inverter + Battery 14kWh`,
    brand: 'huawei',
    inverterType: 'String',
    inverterModel: systemSizeKwp > 12 ? 'SUN2000-15K' : 'SUN2000-10KTL-M1',
    inverterCount: 1,
    smartMeterModel: 'Huawei Smart Meter 3 Phase',
    dataLoggerModel: 'Built-in FusionSolar WLAN/4G',
    hasBattery: true,
    batteryModel: 'Huawei Smart Guard w/Battery 14kWh',
    batteryCapacityKwh: 14,
    backupBoxModel: 'SmartGuard ใช้งานได้แม้ไฟฟ้าดับ พร้อมแบตฯ ขนาด 14kWh',
    priceSolarSet: 320000,
    priceBatterySet: 230000,
    discountAmount: 0,
    grandTotal: 550000,
    isVatIncluded: true,
    peakSunHours: 4.0,
    efficiencyRate: 80,
    tariffRate: 4.5,
    mainEquipment: [
      { id: 'he1', brand: 'LONGi', item: 'Solar Panel', description: 'LONGi Hi-MO X10 650W N-Type', quantity: panelCount, unit: 'แผง' },
      { id: 'he2', brand: 'Huawei', item: 'Inverter', description: systemSizeKwp > 12 ? 'SUN2000-15K' : 'SUN2000-10KTL-M1', quantity: 1, unit: 'เครื่อง' },
      { id: 'he3', brand: 'Huawei', item: 'Smart Meter', description: 'Huawei Smart Meter 3 Phase', quantity: 1, unit: 'ตัว' },
      { id: 'he4', brand: 'Huawei', item: 'Data Logger', description: 'Built-in FusionSolar WLAN/4G', quantity: 1, unit: 'ชุด' },
      { id: 'he5', brand: 'Huawei', item: 'Battery', description: 'Huawei Smart Guard w/Battery 14kWh\nใช้งานได้ แม้ไฟฟ้าดับ พร้อมแบตฯ ขนาด 14kWh', quantity: 1, unit: 'ชุด' },
    ],
    mountingStructure: createDefaultBoMMounting(panelCount),
    acSystem: createDefaultBoMAc(),
    dcSystem: createDefaultBoMDc(),
    installationServices: [
      { id: 'is1', brand: 'TNS', item: 'Installation', description: 'งานติดตั้งและทดสอบระบบ พร้อมยื่นขอขนานไฟ MEA/PEA', quantity: 1, unit: 'งาน' }
    ],
    warrantyPanelProductYears: 15,
    warrantyPanelLinearYears: 30,
    warrantyInverterYears: 10,
    warrantyInstallationYears: 2,
    warrantyBatteryYears: 10,
  };
}

export function createAtmoceOption(systemSizeKwp: number = 13, panelCount: number = 20): InverterOptionConfig {
  const microCount = Math.ceil(panelCount / 2);
  return {
    id: 'opt_atmoce',
    title: `On-Grid Solar Roof Top ${systemSizeKwp} kW 3 Phase - ATMOCE Micro inverter + Battery 16kWh`,
    brand: 'atmoce',
    inverterType: 'Micro',
    inverterModel: 'Micro Inverter 1250W 2:1',
    inverterCount: microCount,
    smartMeterModel: 'M-Combiner, PV 2 input',
    dataLoggerModel: 'Junction adapter and Cable',
    hasBattery: true,
    batteryModel: 'Set Battery Bank 16kWh with Stack control & Base',
    batteryCapacityKwh: 16,
    backupBoxModel: '3Phase Backupbox ใช้งานได้แม้ไฟฟ้าดับ',
    priceSolarSet: 250000,
    priceBatterySet: 220000,
    discountAmount: 0,
    grandTotal: 470000,
    isVatIncluded: true,
    peakSunHours: 5.0,
    efficiencyRate: 85,
    tariffRate: 4.5,
    mainEquipment: [
      { id: 'ae1', brand: 'LONGi', item: 'Solar Panel', description: 'LONGi Hi-MO X10 650W N-Type', quantity: panelCount, unit: 'แผง' },
      { id: 'ae2', brand: 'ATMOCE', item: 'Micro Inverter', description: 'Micro Inverter 1250W 2:1', quantity: microCount, unit: 'ชุด' },
      { id: 'ae3', brand: 'ATMOCE', item: 'Combiner', description: 'M-Combiner, PV 2 input (Warranty 5 Years)', quantity: 1, unit: 'ชุด' },
      { id: 'ae4', brand: 'ATMOCE', item: 'Adapter', description: 'Junction adapter and Cable', quantity: 1, unit: 'ชุด' },
      { id: 'ae5', brand: 'ATMOCE', item: 'Battery', description: 'Set Battery Bank 16kWh with Stack control & Base', quantity: 1, unit: 'ชุด' },
      { id: 'ae6', brand: 'ATMOCE', item: 'Backup Box', description: '3Phase Backupbox ใช้งานได้แม้ไฟฟ้าดับ', quantity: 1, unit: 'ชุด' },
    ],
    mountingStructure: createDefaultBoMMounting(panelCount),
    acSystem: createDefaultBoMAc(),
    dcSystem: [],
    installationServices: [
      { id: 'is1', brand: 'TNS', item: 'Installation', description: 'งานติดตั้งและทดสอบระบบ พร้อมยื่นขอขนานไฟ MEA/PEA', quantity: 1, unit: 'งาน' }
    ],
    warrantyPanelProductYears: 15,
    warrantyPanelLinearYears: 30,
    warrantyInverterYears: 15,
    warrantyInstallationYears: 2,
    warrantyBatteryYears: 10,
  };
}

export function createEnphaseOption(systemSizeKwp: number = 13, panelCount: number = 20): InverterOptionConfig {
  return {
    id: 'opt_enphase',
    title: `On-Grid Solar Roof Top ${systemSizeKwp} kW 3 Phase - Enphase IQ8P Micro Inverter`,
    brand: 'enphase',
    inverterType: 'Micro',
    inverterModel: 'Enphase IQ8P Microinverter 480W',
    inverterCount: panelCount,
    smartMeterModel: 'IQ Gateway (Envoy) Metered',
    dataLoggerModel: 'Enphase Enlighten Cloud Monitoring',
    hasBattery: false,
    batteryModel: 'Enphase IQ Battery 5P (Optional)',
    batteryCapacityKwh: 0,
    backupBoxModel: 'IQ System Controller 2 (Optional)',
    priceSolarSet: 390000,
    priceBatterySet: 0,
    discountAmount: 0,
    grandTotal: 390000,
    isVatIncluded: true,
    peakSunHours: 5.0,
    efficiencyRate: 88,
    tariffRate: 4.5,
    mainEquipment: [
      { id: 'ee1', brand: 'LONGi', item: 'Solar Panel', description: 'LONGi Hi-MO X10 650W N-Type', quantity: panelCount, unit: 'แผง' },
      { id: 'ee2', brand: 'Enphase', item: 'Micro Inverter', description: 'Enphase IQ8P Microinverter 480W (1:1 per Panel)', quantity: panelCount, unit: 'ตัว' },
      { id: 'ee3', brand: 'Enphase', item: 'Gateway', description: 'IQ Gateway (Envoy) 3-Phase Metered with CT', quantity: 1, unit: 'ชุด' },
      { id: 'ee4', brand: 'Enphase', item: 'Q-Cable & Acc', description: 'Enphase IQ Q-Cable & Terminator set', quantity: 1, unit: 'ชุด' },
    ],
    mountingStructure: createDefaultBoMMounting(panelCount),
    acSystem: createDefaultBoMAc(),
    dcSystem: [],
    installationServices: [
      { id: 'is1', brand: 'TNS', item: 'Installation', description: 'งานติดตั้งและทดสอบระบบ พร้อมยื่นขอขนานไฟ MEA/PEA', quantity: 1, unit: 'งาน' }
    ],
    warrantyPanelProductYears: 15,
    warrantyPanelLinearYears: 30,
    warrantyInverterYears: 25,
    warrantyInstallationYears: 2,
    warrantyBatteryYears: 10,
  };
}

export function createInitialProposal(): ProposalProject {
  const panelCount = 20;
  const systemSizeKwp = 13.0;

  return {
    id: `proj_${Date.now()}`,
    quotationNumber: generateQuotationNumber(1),
    quotationNumber2: generateQuotationNumber(2),
    date: formatThaiDate(),
    validityDays: 15,
    systemWarrantyYears: 2,
    salesName: 'Nuttathus Chaiwut',
    salesPosition: 'Project Manager',
    salesTel: '-',
    salesMobile: '087 304 3724',
    salesEmail: 'Nuttathus@tnsnetwork.co.th',
    
    customer: {
      name: 'คุณวรางคณา สงวนศิลป์',
      address: '25/94 ซอยลาดพร้าว 35 ถนนลาดพร้าว',
      subdistrict: 'จันทรเกษม',
      district: 'จตุจักร',
      province: 'กรุงเทพมหานคร',
      zipcode: '10900',
      fullAddress: '25/94 ซอยลาดพร้าว 35 ถนนลาดพร้าว แขวงจันทรเกษม เขตจตุจักร กรุงเทพมหานคร 10900',
      tel: '081 234 5678',
      email: 'customer@example.com',
      coordinates: '13.8055, 100.5788',
      electricalPhase: '3-Phase',
      monthlyElectricBill: 12198.80,
      averageUnitsPerMonth: 2710,
      meterType: 'TOU 3-Phase'
    },

    systemSizeKwp,
    panelBrand: 'LONGi',
    panelModel: 'Hi-MO X10 650W N-Type',
    panelWattage: 650,
    panelCount,
    roofType: 'Metal Sheet',

    activeOptionsCount: 2,
    option1: createHuaweiOption(systemSizeKwp, panelCount),
    option2: createAtmoceOption(systemSizeKwp, panelCount),

    media: {
      coverPhoto: '',
      sitePhotos: [],
      roofDesignTop: '',
      roofDesignIso: '',
      roofDesignAdditional: [],
      electricBillPhoto: ''
    },

    toggles: {
      showCover: true,
      showSitePictures: true,
      showRoofDesigns: true,
      showElectricBill: true,
      showQuotation1: true,
      showRoi1: true,
      showWarranty1: true,
      showQuotation2: true,
      showRoi2: true,
      showWarranty2: true,
      showPanelSpecsheet: true,
      showInverterSpecsheet1: true,
      showInverterSpecsheet2: true,
      showSiteReferences: true,
      showClosingPage: true,
    },

    termsAndConditions: [
      'Delivery Time : TBA',
      'Payment Term : ชำระ 50% เมื่อสั่งซื้อ 50% เมื่อส่งมอบงานแล้วเสร็จ',
      'Validity : 15 days',
      'System Warranty : 2 Years'
    ],
    serviceRemarkItems: DEFAULT_TERMS,

    bankName: COMPANY_INFO.bankName,
    bankAccountNo: COMPANY_INFO.bankAccountNo,
    bankAccountName: COMPANY_INFO.bankAccountName,

    lastModified: Date.now()
  };
}
