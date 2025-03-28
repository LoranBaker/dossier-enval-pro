// src/app/core/services/building.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
  Building, 
  ConsumptionData, 
  RenovationMeasure, 
  RenovationPlan, 
  SavingsPotential, 
  ModernizationCosts,
  Renovation
} from '../models/building.model';

@Injectable({
  providedIn: 'root'
})
export class BuildingService {
  // BehaviorSubjects to store and share state
  private buildingSubject = new BehaviorSubject<Building>(this.initBuildingData());
  private consumptionDataSubject = new BehaviorSubject<ConsumptionData>(this.initConsumptionData());
  private renovationMeasuresSubject = new BehaviorSubject<RenovationMeasure[]>(this.initRenovationMeasures());
  private renovationPlanSubject = new BehaviorSubject<RenovationPlan[]>(this.initRenovationPlan());
  private savingsPotentialSubject = new BehaviorSubject<SavingsPotential>(this.initSavingsPotential());
  private modernizationCostsSubject = new BehaviorSubject<ModernizationCosts>(this.initModernizationCosts());
  private buildingImageUrlSubject = new BehaviorSubject<string | null>(null);
  
  // Observable streams that components can subscribe to
  building$: Observable<Building> = this.buildingSubject.asObservable();
  consumptionData$: Observable<ConsumptionData> = this.consumptionDataSubject.asObservable();
  renovationMeasures$: Observable<RenovationMeasure[]> = this.renovationMeasuresSubject.asObservable();
  renovationPlan$: Observable<RenovationPlan[]> = this.renovationPlanSubject.asObservable();
  savingsPotential$: Observable<SavingsPotential> = this.savingsPotentialSubject.asObservable();
  modernizationCosts$: Observable<ModernizationCosts> = this.modernizationCostsSubject.asObservable();
  buildingImageUrl$: Observable<string | null> = this.buildingImageUrlSubject.asObservable();
  
  // Additional calculated properties that don't need to be reactive
  private _totalCosts = 146000;
  private _totalFunding = 32300;
  private _totalSavings = 7832;
  private _energyEfficiencyClass = 'F';
  
  constructor() { }
  
  // Getter methods for the values
  getBuilding(): Building {
    return this.buildingSubject.getValue();
  }
  
  getConsumptionData(): ConsumptionData {
    return this.consumptionDataSubject.getValue();
  }
  
  getRenovationMeasures(): RenovationMeasure[] {
    return this.renovationMeasuresSubject.getValue();
  }
  
  getRenovationPlan(): Observable<RenovationPlan[]> {
    return this.renovationPlanSubject.asObservable();
  }
  
  getRenovationPlanValue(): RenovationPlan[] {
    return this.renovationPlanSubject.getValue();
  }
  
  getSavingsPotential(): SavingsPotential {
    return this.savingsPotentialSubject.getValue();
  }
  
  getModernizationCosts(): ModernizationCosts {
    return this.modernizationCostsSubject.getValue();
  }
  
  getBuildingImageUrl(): string | null {
    return this.buildingImageUrlSubject.getValue();
  }
  
  getTotalCosts(): number {
    return this._totalCosts;
  }
  
  getTotalFunding(): number {
    return this._totalFunding;
  }
  
  getTotalSavings(): number {
    return this._totalSavings;
  }
  
  getEnergyEfficiencyClass(): string {
    return this._energyEfficiencyClass;
  }
  
  // Update methods
  updateBuilding(building: Building): void {
    this.buildingSubject.next(building);
  }
  
  updateBuildingImageUrl(url: string | null): void {
    this.buildingImageUrlSubject.next(url);
  }
  
  addRenovation(renovation: Renovation): void {
    const currentBuilding = this.getBuilding();
    const updatedRenovations = [...currentBuilding.renovations, renovation];
    
    this.updateBuilding({
      ...currentBuilding,
      renovations: updatedRenovations
    });
  }
  
  // Helper method to determine if a measure is in a specific year's plan
  isMeasureInYear(measure: string, year: number): boolean {
    const yearPlan = this.renovationPlanSubject.getValue().find(plan => plan.year === year);
    return yearPlan ? yearPlan.measures.includes(measure) : false;
  }
  
  // Get the measure cost by name
  getMeasureCost(measureName: string): number {
    const measure = this.renovationMeasuresSubject.getValue().find(m => 
      m.type === measureName || 
      (measureName === 'Schrägdach' && m.type === 'Dach') ||
      (measureName === 'Dämmung Fassade' && m.type === 'Fassade') ||
      (measureName === 'Dämmung Kellerdecke' && m.type === 'Keller') ||
      (measureName === 'Lüftungsanlage' && m.type === 'Lüftung')
    );
    return measure ? measure.cost : 0;
  }
  
  // Initial data setup methods
  private initBuildingData(): Building {
    return {
      address: 'Karlstrasse 22 in 65510 Hünstetten',
      buildingType: 'EFH',
      buildingYear: 1994,
      selfOccupied: 1,
      ownerStructure: 'Privat',
      selfUsedLivingSpace: 120,
      floors: 2,
      adjacentBuildings: false,
      units: {
        total: 5,
        commercial: 1
      },
      livingSpace: 399,
      baseArea: 147,
      retrofittedInsulation: false,
      additionalConstruction: false,
      commercialSpace: 100,
      plotSize: 605,
      residents: 4,
      heating: {
        type: 'Gas',
        surfaces: 'Heizkörper',
        renovationYear: null,
        insulatedPipes: false
      },
      hotWater: {
        source: 'Nur über Heizung',
        renovationYear: null
      },
      roof: {
        form: 'versch. Dachtypen',
        usage: 'genutzt/beheizt',
        area: 190,
        orientation: {
          direction: 'SSO / ONO',
          area: {
            sso: 11.7,
            ono: 95.4
          }
        },
        skylights: 2
      },
      facade: {
        construction: 'Massiv',
        condition: 'solide'
      },
      windows: {
        glazing: '2-fach',
        frameMaterial: 'Kunststoff'
      },
      basement: {
        exists: true,
        heated: true,
        partialBasement: false,
        fullBasement: true,
        hasUndergroundGarage: false,
        isUndergroundGarageVentilated: true,
        isUndergroundGarageHeated: false
      },
      photovoltaic: {
        installed: false,
        panelArea: 0,
        power: 0,
        panelCount: 0
      },
      consumption: {
        electricity: 'Unbekannt',
        heating: 'Ca. 40.000 kWh*',
        hotWater: 'unbekannt'
      },
      renovations: [
        {
          type: 'Fenster & Türen',
          quantity: '5 Fenster',
          year: 1990
        },
        {
          type: 'Heizung',
          quantity: '',
          year: 1985
        }
      ]
    };
  }
  
  private initConsumptionData(): ConsumptionData {
    return {
      heating: 61400,
      warmWater: 8000,
      electricity: 9500,
      totalEnergy: 78900,
      energyCosts: 10785,
      co2Emissions: 17490,
      strandedAsset: true,
      co2Intensity: 43,
      energyIntensity: 197,
      co2Tax: 2.41,
      co2TaxTotal: 962,
      strandingPoint: 2018,
      strandingRisk: -7
    };
  }
  
  private initRenovationMeasures(): RenovationMeasure[] {
    return [
      { 
        type: 'Photovoltaik', 
        description: 'Kristallines Modul (20 %)', 
        details: 'mit Speicher 10 kWh, Lstg.11 kWp/25 Panele zu 450W inkl Wallbox',
        cost: 19500, 
        funding: 'siehe S.13 mögl.Bonus', 
        savings: 2741 
      },
      { 
        type: 'Dach', 
        description: 'Dämmen 20 cm mit WLG 0,035', 
        cost: 22000, 
        funding: 4400, 
        savings: 705 
      },
      { 
        type: 'Fenster & Türen', 
        description: '3-fach Verglasung (Wärmeschutz)', 
        cost: 12000, 
        funding: 2400, 
        savings: 391 
      },
      { 
        type: 'Lüftung', 
        description: 'Lüftungsanlage dezentral mit Wärmerückgewinnung', 
        cost: 9000, 
        funding: 1800, 
        savings: 548 
      },
      { 
        type: 'Heizung', 
        description: 'Luft-Wärmepumpe (14kW) +WW', 
        cost: 35000, 
        funding: 14000, 
        savings: 2271 
      },
      { 
        type: 'Keller', 
        description: 'Dämmung, 10 cm mit WLG 0,035', 
        cost: 10500, 
        funding: 2100, 
        savings: 235 
      },
      { 
        type: 'Fassade', 
        description: 'Dämmung, 16 cm mit WLG 0,035', 
        cost: 38000, 
        funding: 7600, 
        savings: 939 
      }
    ];
  }
  
  private initRenovationPlan(): RenovationPlan[] {
    return [
      { year: 2025, measures: ['Heizung', 'Photovoltaik', 'Schrägdach'], investment: 76500 },
      { year: 2026, measures: ['Fenster & Türen', 'Dämmung Fassade', 'Dämmung Kellerdecke', 'Lüftungsanlage'], investment: 69500 },
      { year: 2027, measures: [], investment: 0 },
      { year: 2028, measures: [], investment: 0 },
      { year: 2029, measures: [], investment: 0 }
    ];
  }
  
  private initSavingsPotential(): SavingsPotential {
    return {
      energyCostSavings: 73,
      energyBalanceSavings: 95,
      co2TaxSavings: 100,
      amortizationYears: 13
    };
  }
  
  private initModernizationCosts(): ModernizationCosts {
    return {
      now: 146000,
      inTenYears: 238000,
      additionalCosts: 92000
    };
  }
}