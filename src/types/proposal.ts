export type InverterBrand = 'huawei' | 'atmoce' | 'enphase' | 'custom';
export type ElectricalPhase = '1-Phase' | '3-Phase';
export type RoofType = 'Metal Sheet' | 'CPAC Tile' | 'Flat Slab / Concrete' | 'Roman Tile' | 'Ceramic Tile';

export interface CustomerInfo {
  name: string;
  address: string;
  subdistrict: string;
  district: string;
  province: string;
  zipcode: string;
  fullAddress: string;
  tel: string;
  email: string;
  taxId?: string;
  coordinates: string; // "13.xxxx, 100.xxxx"
  electricalPhase: ElectricalPhase;
  monthlyElectricBill: number; // e.g. 12,000 THB
  averageUnitsPerMonth: number; // e.g. 2,666 kWh
  meterType: string; // TOU / Normal
}

export interface BoMItem {
  id: string;
  brand: string;
  item: string;
  description: string;
  quantity: number;
  unit: string;
}

export interface InverterOptionConfig {
  id: string;
  title: string; // e.g. "Huawei String Inverter 13 kW 3 Phase + Battery 14kWh"
  brand: InverterBrand;
  inverterType: 'String' | 'Micro';
  inverterModel: string; // e.g. "SUN2000-15K" or "Micro Inverter 1250W 2:1"
  inverterCount: number;
  smartMeterModel: string;
  dataLoggerModel: string;
  
  // Battery
  hasBattery: boolean;
  batteryModel: string; // e.g. "Huawei Smart Guard w/Battery 14kWh" or "ATMOCE Battery Bank 16kWh"
  batteryCapacityKwh: number;
  backupBoxModel: string;
  
  // Pricing
  priceSolarSet: number; // e.g. 320,000 THB
  priceBatterySet: number; // e.g. 230,000 THB
  discountAmount: number; // e.g. 0
  grandTotal: number; // e.g. 550,000 THB
  isVatIncluded: boolean;

  // Calculation parameters
  peakSunHours: number; // 4.0 for String, 5.0 for Micro
  efficiencyRate: number; // 0.80 (80%)
  tariffRate: number; // 4.5 THB/unit

  // BoM customization
  mainEquipment: BoMItem[];
  mountingStructure: BoMItem[];
  acSystem: BoMItem[];
  dcSystem: BoMItem[];
  installationServices: BoMItem[];

  // Warranty
  warrantyPanelProductYears: number; // 15
  warrantyPanelLinearYears: number; // 30
  warrantyInverterYears: number; // 10 or 15 or 25
  warrantyInstallationYears: number; // 2
  warrantyBatteryYears?: number; // 10
}

export interface SiteMedia {
  coverPhoto: string; // Drone/Front house image
  sitePhotos: string[]; // 2-4 actual photos
  roofDesignTop: string; // SolarEdge 2D/3D Top-down
  roofDesignIso: string; // SolarEdge 3D Isometric
  roofDesignAdditional?: string[];
  electricBillPhoto: string;
}

export interface DocumentSectionToggles {
  showCover: boolean;
  showSitePictures: boolean;
  showRoofDesigns: boolean;
  showElectricBill: boolean;
  showQuotation1: boolean;
  showRoi1: boolean;
  showWarranty1: boolean;
  showQuotation2: boolean;
  showRoi2: boolean;
  showWarranty2: boolean;
  showPanelSpecsheet: boolean;
  showInverterSpecsheet1: boolean;
  showInverterSpecsheet2: boolean;
  showSiteReferences: boolean;
  showClosingPage: boolean;
}

export interface ProposalProject {
  id: string;
  quotationNumber: string; // PSC-260823-01
  quotationNumber2?: string; // PSC-260823-02
  date: string; // "2026-08-23" or "23/08/2026"
  validityDays: number; // 15 days
  systemWarrantyYears: number; // 2 years

  // Salesperson
  salesName: string;
  salesPosition: string;
  salesTel: string;
  salesMobile: string;
  salesEmail: string;

  // Customer
  customer: CustomerInfo;

  // System general config
  systemSizeKwp: number; // e.g. 13.0 kWp
  panelBrand: string; // "LONGi"
  panelModel: string; // "Hi-MO X10 650W N-Type"
  panelWattage: number; // 650
  panelCount: number; // 20
  roofType: RoofType;

  // Comparison Options (1 or 2 options)
  activeOptionsCount: 1 | 2;
  option1: InverterOptionConfig;
  option2: InverterOptionConfig;

  // Media
  media: SiteMedia;

  // Toggles for page inclusion
  toggles: DocumentSectionToggles;

  // Terms & Conditions
  termsAndConditions: string[];
  serviceRemarkItems: string[];

  // Bank Info
  bankName: string;
  bankAccountNo: string;
  bankAccountName: string;

  lastModified: number;
}
