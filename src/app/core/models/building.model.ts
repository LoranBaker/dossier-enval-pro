// src/app/core/models/building.model.ts

export interface Building {
    address: string;
    buildingType: string;
    buildingYear: number;
    selfOccupied: number;
    ownerStructure: string;
    selfUsedLivingSpace: number;
    floors: number;
    adjacentBuildings: boolean;
    units: {
      total: number;
      commercial: number;
    };
    livingSpace: number;
    baseArea: number;
    retrofittedInsulation: boolean;
    additionalConstruction: boolean;
    commercialSpace: number;
    plotSize: number;
    residents: number;
    heating: HeatingDetails;
    hotWater: HotWaterDetails;
    roof: RoofDetails;
    facade: FacadeDetails;
    windows: WindowDetails;
    basement: BasementDetails;
    photovoltaic: PhotovoltaicDetails;
    consumption: ConsumptionDetails;
    renovations: Renovation[];
  }
  
  export interface HeatingDetails {
    type: string;
    surfaces: string;
    renovationYear: number | null;
    insulatedPipes: boolean;
  }
  
  export interface HotWaterDetails {
    source: string;
    renovationYear: number | null;
  }
  
  export interface RoofDetails {
    form: string;
    usage: string;
    area: number;
    orientation: {
      direction: string;
      area: {
        sso: number;
        ono: number;
      };
    };
    skylights: number;
  }
  
  export interface FacadeDetails {
    construction: string;
    condition: string;
  }
  
  export interface WindowDetails {
    glazing: string;
    frameMaterial: string;
  }
  
  export interface BasementDetails {
    exists: boolean;
    heated: boolean;
    partialBasement: boolean;
    fullBasement: boolean;
    hasUndergroundGarage: boolean;
    isUndergroundGarageVentilated: boolean;
    isUndergroundGarageHeated: boolean;
  }
  
  export interface PhotovoltaicDetails {
    installed: boolean;
    panelArea: number;
    power: number;
    panelCount: number;
  }
  
  export interface ConsumptionDetails {
    electricity: string;
    heating: string;
    hotWater: string;
  }
  
  export interface Renovation {
    type: string;
    quantity: string;
    year: number | null;
  }
  
  export interface ConsumptionData {
    heating: number;
    warmWater: number;
    electricity: number;
    totalEnergy: number;
    energyCosts: number;
    co2Emissions: number;
    strandedAsset: boolean;
    co2Intensity: number;
    energyIntensity: number;
    co2Tax: number;
    co2TaxTotal: number;
    strandingPoint: number;
    strandingRisk: number;
  }
  
  export interface RenovationMeasure {
    type: string;
    description: string;
    details?: string;
    cost: number;
    funding: any; // Can be number or string
    savings: number;
  }
  
  export interface RenovationPlan {
    year: number;
    measures: string[];
    investment: number;
  }
  
  export interface SavingsPotential {
    energyCostSavings: number;
    energyBalanceSavings: number;
    co2TaxSavings: number;
    amortizationYears: number;
  }
  
  export interface ModernizationCosts {
    now: number;
    inTenYears: number;
    additionalCosts: number;
  }