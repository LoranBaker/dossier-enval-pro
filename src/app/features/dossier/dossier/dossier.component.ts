// src/app/features/dossier/dossier.component.ts
import { Component, OnInit, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecimalPipe, CurrencyPipe } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormsModule } from '@angular/forms';

// Import child components
import { BuildingDataComponent } from '../components/building-data/building-data.component';
// Import other components when they're created

// Import service
import { BuildingService } from '../../../core/service/building.service';

@Component({
  selector: 'app-dossier',
  templateUrl: './dossier.component.html',
  styleUrls: ['./dossier.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    BuildingDataComponent
    // Add other components here
  ],
  animations: [
    trigger('tabAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class DossierComponent implements OnInit, AfterViewInit {
  activeTab = 'overview';
  scrolled = false;
  
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  
  // Building data from service
  building: any;
  consumptionData: any;
  renovationMeasures: any[];
  renovationPlan: any[];
  savingsPotential: any;
  modernizationCosts: any;
  
  totalCosts: number;
  totalFunding: number;
  totalSavings: number;
  energyEfficiencyClass: string;

  constructor(private buildingService: BuildingService) {
    // Initialize defaults
    this.building = this.buildingService.getBuilding();
    this.consumptionData = this.buildingService.getConsumptionData();
    this.renovationMeasures = this.buildingService.getRenovationMeasures();
    this.renovationPlan = [];  // Will be populated from service
    this.savingsPotential = this.buildingService.getSavingsPotential();
    this.modernizationCosts = this.buildingService.getModernizationCosts();
    
    this.totalCosts = this.buildingService.getTotalCosts();
    this.totalFunding = this.buildingService.getTotalFunding();
    this.totalSavings = this.buildingService.getTotalSavings();
    this.energyEfficiencyClass = this.buildingService.getEnergyEfficiencyClass();
  }

  // Listen for window scroll to add sticky effects
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 100;
  }

  ngOnInit(): void {
    // Subscribe to data changes
    this.buildingService.building$.subscribe(building => {
      this.building = building;
    });
    
    this.buildingService.consumptionData$.subscribe(data => {
      this.consumptionData = data;
    });
    
    this.buildingService.renovationMeasures$.subscribe(measures => {
      this.renovationMeasures = measures;
    });
    
    this.buildingService.getRenovationPlan().subscribe(plan => {
      this.renovationPlan = plan;
    });
    
    this.buildingService.savingsPotential$.subscribe(potential => {
      this.savingsPotential = potential;
    });
    
    this.buildingService.modernizationCosts$.subscribe(costs => {
      this.modernizationCosts = costs;
    });
  }
  
  ngAfterViewInit(): void {
    // Only initialize D3 chart if we're on the analysis tab and after view init
    if (this.activeTab === 'analysis' && this.chartContainer) {
      setTimeout(() => {
        this.initializeD3Chart();
      }, 300);
    }
  }
  
  setActiveTab(tab: string): void {
    this.activeTab = tab;
    
    // Initialize D3 chart if switching to analysis tab
    if (tab === 'analysis' && this.chartContainer) {
      setTimeout(() => {
        this.initializeD3Chart();
      }, 300); // Wait for tab animation to complete
    }
    
    // Smooth scroll to content
    setTimeout(() => {
      const element = document.querySelector('.tab-content');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
  
  // Helper method to determine if a measure is in a specific year's plan
  isMeasureInYear(measure: string, year: number): boolean {
    return this.buildingService.isMeasureInYear(measure, year);
  }
  
  // Get the measure cost by name
  getMeasureCost(measureName: string): number {
    return this.buildingService.getMeasureCost(measureName);
  }
  
  // Initialize D3 chart
  private initializeD3Chart(): void {
    // D3 chart initialization code would go here
    // This is a placeholder for the actual D3 chart implementation
    
    if (!this.chartContainer || !this.chartContainer.nativeElement) {
      return;
    }
    
    // Chart implementation...
  }
}