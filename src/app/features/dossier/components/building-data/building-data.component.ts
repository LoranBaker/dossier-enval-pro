// src/app/features/dossier/components/building-data/building-data.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BasicInfoTableComponent } from '../building-tables/basic-info-table.component';
import { HeatingTableComponent } from '../building-tables/heating-table.component';
import { HotWaterTableComponent } from '../building-tables/hot-water-table.component';
import { RenovationsTableComponent } from '../building-tables/renovations-table.component';
import { BuildingService } from '../../../../core/service/building.service';
@Component({
  selector: 'app-building-data',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BasicInfoTableComponent,
    HeatingTableComponent,
    HotWaterTableComponent,
    RenovationsTableComponent
  ],
  // Inline template instead of templateUrl to avoid missing file error
  template: `
    <div class="building-data-section">
      <div class="section-header">
        <h2>Ihre Angaben und Basisdaten</h2>
        <div class="edit-controls">
          <button *ngIf="!isEditMode" class="edit-button" (click)="toggleEditMode()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
            Bearbeiten
          </button>
          <div *ngIf="isEditMode" class="action-buttons">
            <button class="cancel-button" (click)="cancelChanges()">Abbrechen</button>
            <button class="save-button" (click)="saveChanges()">Speichern</button>
          </div>
        </div>
        <div id="saved-message" class="saved-message" [class.show]="savedMessageVisible">Änderungen gespeichert</div>
      </div>
      
      <h3>Objekt: {{building.buildingType}} {{building.address}}</h3>

      <!-- Building image -->
      <div class="building-image">
        <!-- Show uploaded image if available, otherwise show placeholder with upload option -->
        <div *ngIf="buildingImageUrl" class="image-container">
          <img [src]="buildingImageUrl" alt="Gebäudeansicht" class="building-preview">
          <button class="image-remove-btn" (click)="removeImage()" aria-label="Bild entfernen">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </button>
        </div>
        
        <div *ngIf="!buildingImageUrl" class="image-placeholder">
          <div class="upload-container">
            <div class="upload-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <p class="upload-text">Gebäudeansicht</p>
            <label for="building-image-upload" class="upload-btn">
              Bild hochladen
            </label>
            <input type="file" id="building-image-upload" accept="image/*" (change)="onImageUpload($event)" class="file-input">
          </div>
        </div>
      </div>

      <!-- Basic Building Info Table -->
      <app-basic-info-table
        [building]="building"
        [editableBuilding]="editableBuilding"
        [isEditMode]="isEditMode"
        (dataChanged)="onDataChange($event)">
      </app-basic-info-table>

      <!-- Heating Table -->
      <app-heating-table
        [building]="building"
        [editableBuilding]="editableBuilding"
        [isEditMode]="isEditMode"
        (dataChanged)="onDataChange($event)">
      </app-heating-table>

      <!-- Hot Water Table -->
      <app-hot-water-table
        [building]="building"
        [editableBuilding]="editableBuilding"
        [isEditMode]="isEditMode"
        (dataChanged)="onDataChange($event)">
      </app-hot-water-table>

      <!-- Renovations Table -->
      <app-renovations-table
        [building]="building"
        [editableBuilding]="editableBuilding"
        [isEditMode]="isEditMode"
        (dataChanged)="onDataChange($event)"
        (addNewRenovation)="addRenovation($event)">
      </app-renovations-table>
    </div>
  `,
  styleUrls: ['./building-data.component.scss']
})
export class BuildingDataComponent implements OnInit {
  building: any;
  buildingImageUrl: string | null = null;
  
  isEditMode = false;
  editableBuilding: any = null;
  savedMessageVisible = false; // Renamed from showSavedMessage to avoid conflict
  
  // For adding new renovations
  newRenovation = {
    type: '',
    quantity: '',
    year: null
  };
  
  constructor(private buildingService: BuildingService) {}
  
  ngOnInit(): void {
    // Get the building data from the service
    this.building = this.buildingService.getBuilding();
    this.buildingImageUrl = this.buildingService.getBuildingImageUrl();
    
    // Subscribe to changes
    this.buildingService.building$.subscribe(building => {
      this.building = building;
    });
    
    this.buildingService.buildingImageUrl$.subscribe(url => {
      this.buildingImageUrl = url;
    });
  }
  
  toggleEditMode(): void {
    if (this.isEditMode) {
      // If already in edit mode, we're canceling - reset data
      this.isEditMode = false;
      this.editableBuilding = null;
      this.newRenovation = { type: '', quantity: '', year: null };
    } else {
      // Entering edit mode - create a deep copy of the data
      this.isEditMode = true;
      this.editableBuilding = JSON.parse(JSON.stringify(this.building));
    }
  }
  
  // Save changes
  saveChanges(): void {
    // Update the building data in the service
    this.buildingService.updateBuilding(this.editableBuilding);
    
    // Exit edit mode
    this.isEditMode = false;
    this.editableBuilding = null;
    this.newRenovation = { type: '', quantity: '', year: null };
    
    // Show success message
    this.displaySavedMessage(); // Renamed from showSavedMessage to avoid conflict
  }
  
  // Cancel changes
  cancelChanges(): void {
    // Reset and exit edit mode
    this.isEditMode = false;
    this.editableBuilding = null;
    this.newRenovation = { type: '', quantity: '', year: null };
  }
  
  // Display a temporary saved message - renamed from showSavedMessage to avoid conflict
  displaySavedMessage(): void {
    this.savedMessageVisible = true;
    
    setTimeout(() => {
      this.savedMessageVisible = false;
    }, 3000);
  }
  
  // Handle data changes from table components
  onDataChange(event: {object: any, property: string, value: any}): void {
    const { object, property, value } = event;
    
    // Update the property in the object
    object[property] = value;
  }
  
  // Add a new renovation
  addRenovation(renovation: any): void {
    // Make sure renovations array exists
    if (!this.editableBuilding.renovations) {
      this.editableBuilding.renovations = [];
    }
    
    // Add the new renovation
    this.editableBuilding.renovations.push(renovation);
  }
  
  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Bitte nur Bilddateien hochladen.');
        return;
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Die Bilddatei darf nicht größer als 5MB sein.');
        return;
      }
      
      // Create a URL for the file
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        this.buildingImageUrl = imageUrl;
        this.buildingService.updateBuildingImageUrl(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  }
  
  // Remove the uploaded image
  removeImage(): void {
    this.buildingImageUrl = null;
    this.buildingService.updateBuildingImageUrl(null);
    
    // Reset the input
    const fileInput = document.getElementById('building-image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
  
  // Helper method for handling checkbox changes
  onCheckboxChange(event: Event, object: any, property: string): void {
    const checkbox = event.target as HTMLInputElement;
    object[property] = checkbox.checked;
  }
}