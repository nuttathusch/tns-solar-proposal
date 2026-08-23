export interface SizingRecommendation {
  monthlyBill: number;
  monthlyUnits: number;
  dailyUnitsNeeded: number;
  recommendedKwp: number;
  roundedKwp: number;
  panelCount: number;
  actualKwp: number;
  estimatedPriceRange: { min: number; max: number };
}

export interface ROICalculationResult {
  efficiencyRatePercent: number; // 80%
  sunHoursPerDay: number; // 4.0 or 5.0
  dailyProductionKwh: number; // 65 units
  monthlyProductionKwh: number; // 2,000 units
  yearlyProductionKwh: number; // 23,000 units
  tariffRate: number; // 4.5 THB/unit
  monthlySavingsThb: number; // 9,000 THB
  yearlySavingsThb: number; // 108,000 THB
  installationCostThb: number; // 550,000 THB
  paybackPeriodMonths: number; // 60 months
  paybackPeriodYears: number; // 5.0 years
  totalReturn25YearsThb: number; // 2,000,000 THB
  returnLifespanYears: number; // 25 or 26
}

/**
 * Recommend Solar Rooftop system size based on monthly electricity bill (THB)
 */
export function estimateSystemSize(monthlyBillThb: number, tariffRate: number = 4.5, panelWatt: number = 650): SizingRecommendation {
  const safeBill = Math.max(0, Number(monthlyBillThb) || 0);
  const monthlyUnits = safeBill / tariffRate;
  const dailyUnits = monthlyUnits / 30;
  
  // Assume average 4.2 peak sun hours with 80% system performance ratio
  // Energy (kWh/day) = kWp * 4.2 * 0.8 => kWp = DailyUnits / (4.2 * 0.8)
  const targetKwp = dailyUnits > 0 ? dailyUnits / (4.2 * 0.8) : 5.0;
  
  // Standard solar tiers: 3kW, 5kW, 8kW, 10kW, 13kW, 15kW, 20kW, 30kW
  const panelCount = Math.max(4, Math.ceil((targetKwp * 1000) / panelWatt));
  const actualKwp = (panelCount * panelWatt) / 1000;
  
  // Price estimate (approx 28,000 - 38,000 THB per kWp without battery)
  const minPrice = Math.round(actualKwp * 26000);
  const maxPrice = Math.round(actualKwp * 38000);

  return {
    monthlyBill: safeBill,
    monthlyUnits: Math.round(monthlyUnits),
    dailyUnitsNeeded: Number(dailyUnits.toFixed(1)),
    recommendedKwp: Number(targetKwp.toFixed(2)),
    roundedKwp: Number(actualKwp.toFixed(1)),
    panelCount,
    actualKwp: Number(actualKwp.toFixed(2)),
    estimatedPriceRange: { min: minPrice, max: maxPrice }
  };
}

/**
 * Calculate Energy Savings and ROI metrics for Proposal
 */
export function calculateROI(
  systemKwp: number,
  totalCostThb: number,
  sunHoursPerDay: number = 4.5,
  tariffRate: number = 4.5,
  efficiencyPercent: number = 80,
  lifespanYears: number = 25
): ROICalculationResult {
  const kwp = Math.max(1, Number(systemKwp) || 10);
  const cost = Math.max(0, Number(totalCostThb) || 0);
  const sunHours = Math.max(1, Number(sunHoursPerDay) || 4.5);
  const rate = Math.max(1, Number(tariffRate) || 4.5);

  // Daily production in units (kWh)
  // For String (typically calculated as 4-5 peak hours):
  const dailyKwh = Math.round(kwp * sunHours * (efficiencyPercent >= 1 ? efficiencyPercent / 100 : efficiencyPercent || 0.8) * 1.25);
  // Monthly approx 30 days
  const monthlyKwh = Math.round(dailyKwh * 30.7);
  // Yearly approx 365 days or 12 months with seasonal variation
  const yearlyKwh = Math.round(monthlyKwh * 11.5);

  const monthlySavings = Math.round(monthlyKwh * rate);
  const yearlySavings = Math.round(monthlySavings * 12);

  // Payback in months & years
  const paybackMonths = monthlySavings > 0 ? Math.round(cost / monthlySavings) : 0;
  const paybackYears = Number((paybackMonths / 12).toFixed(1));

  // 25-year cumulative return after payback taking into account 80% lifetime degradation
  const netYearsAfterPayback = Math.max(0, lifespanYears - (paybackMonths / 12));
  const totalReturn = Math.round(netYearsAfterPayback * yearlySavings * 0.85);

  return {
    efficiencyRatePercent: efficiencyPercent,
    sunHoursPerDay: sunHours,
    dailyProductionKwh: dailyKwh,
    monthlyProductionKwh: monthlyKwh,
    yearlyProductionKwh: yearlyKwh,
    tariffRate: rate,
    monthlySavingsThb: monthlySavings,
    yearlySavingsThb: yearlySavings,
    installationCostThb: cost,
    paybackPeriodMonths: paybackMonths,
    paybackPeriodYears: paybackYears,
    totalReturn25YearsThb: totalReturn,
    returnLifespanYears: lifespanYears
  };
}

/**
 * Format numbers with comma and optional decimals
 */
export function formatNumber(value: number | string, decimals: number = 0): string {
  const num = Number(value);
  if (isNaN(num)) return '0';
  return num.toLocaleString('th-TH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Generate proposal quotation number: PSC-YYMMDD-01
 */
export function generateQuotationNumber(sequence: number = 1): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const seq = String(sequence).padStart(2, '0');
  return `PSC-${yy}${mm}${dd}-${seq}`;
}

/**
 * Format date to Thai DD/MM/YYYY
 */
export function formatThaiDate(dateStr?: string): string {
  const d = dateStr ? new Date(dateStr) : new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
