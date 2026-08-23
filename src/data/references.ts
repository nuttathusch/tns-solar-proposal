export interface SiteReferenceItem {
  id: string;
  title: string;
  location: string;
  kwp: string;
  systemType: string;
  panelsCount?: string;
  invertersCount?: string;
  monthlySavings: string;
  suitableBill: string;
  imageUrl?: string;
  badge?: string;
}

export const SITE_REFERENCES: SiteReferenceItem[] = [
  {
    id: 'ref1',
    title: 'โรงงานน้ำตาลลิน',
    location: 'อุตสาหกรรม',
    kwp: '394 kWp',
    systemType: 'MICRO INVERTER',
    invertersCount: 'IQ7A 290 ตัว / IQ8 390 ตัว',
    monthlySavings: '275,800',
    suitableBill: '400,000 บาท ขึ้นไป',
    badge: 'Industrial Mega Project'
  },
  {
    id: 'ref2',
    title: 'WSB',
    location: 'อาคารพาณิชย์ & สำนักงาน',
    kwp: '101.2 kWp',
    systemType: 'Commercial Solar',
    monthlySavings: '84,600',
    suitableBill: '100,000 บาท ขึ้นไป',
    badge: 'Commercial'
  },
  {
    id: 'ref3',
    title: 'เตี๋ยวยำตุ้ย',
    location: 'ร้านอาหาร & ธุรกิจ',
    kwp: '15 kWp',
    systemType: 'Commercial Rooftop',
    monthlySavings: '9,000 - 11,250',
    suitableBill: '15,000 บาท ขึ้นไป',
    badge: 'SME Business'
  },
  {
    id: 'ref4',
    title: 'สถานีบริการน้ำมันบางจากเลี่ยงหนองมน',
    location: 'ชลบุรี',
    kwp: '30 kWp',
    systemType: 'Enphase IQ8P Microinverter',
    monthlySavings: '51,840',
    suitableBill: '100,000 บาท ขึ้นไป',
    badge: 'Gas Station'
  },
  {
    id: 'ref5',
    title: 'PTT Station Kalasin',
    location: 'กาฬสินธุ์',
    kwp: '60 kWp',
    systemType: 'PTT Station Solar Rooftop',
    panelsCount: '109 Panels',
    monthlySavings: '100,000 - 140,000',
    suitableBill: '107,000 บาท ขึ้นไป',
    badge: 'PTT Station'
  },
  {
    id: 'ref6',
    title: 'Air Diamond Cafe & Hotel',
    location: 'เชียงใหม่',
    kwp: '50 kWp',
    systemType: 'Cafe & Hotel Rooftop',
    panelsCount: '90 Panels',
    monthlySavings: '30,000 - 35,000',
    suitableBill: '50,000 บาท ขึ้นไป',
    badge: 'Landmark Hotel'
  },
  {
    id: 'ref7',
    title: 'PTT Station Chiangmai',
    location: 'เชียงใหม่',
    kwp: '147 kWp',
    systemType: 'PTT Station Solar Rooftop',
    panelsCount: '186 Panels',
    monthlySavings: '100,000 - 140,000',
    suitableBill: '107,000 บาท ขึ้นไป',
    badge: 'PTT Station'
  },
  {
    id: 'ref8',
    title: 'PTT Station Nakhon Ratchasima',
    location: 'นครราชสีมา',
    kwp: '90 kWp',
    systemType: 'PTT Station Solar Rooftop',
    panelsCount: '164 Panels',
    monthlySavings: '63,000',
    suitableBill: '90,000 บาท ขึ้นไป',
    badge: 'PTT Station'
  }
];
