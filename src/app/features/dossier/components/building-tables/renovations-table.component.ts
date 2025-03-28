// src/app/features/dossier/components/building-tables/renovations-table.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableComponent, TableColumn, TableConfig } from '../../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-renovations-table',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent],
  template: `
    <div class="data-table">
      <table>
        <tr>
          <th colspan="4">Folgende Sanierungen wurden bereits durchgeführt</th>
        </tr>
      </table>
      <app-data-table
        [columns]="columns"
        [data]="tableData"
        [config]="tableConfig"
        (edit)="onCellEdit($event)">
      </app-data-table>
      
      <!-- Add new renovation row in edit mode -->
      <table *ngIf="isEditMode">
        <tr>
          <td>
            <input type="text" [(ngModel)]="newRenovation.type" placeholder="Typ" class="edit-input">
          </td>
          <td>
            <input type="text" [(ngModel)]="newRenovation.quantity" placeholder="Menge" class="edit-input">
          </td>
          <td>Wann</td>
          <td>
            <input type="number" [(ngModel)]="newRenovation.year" placeholder="Jahr" class="edit-input">
          </td>
        </tr>
        <tr>
          <td colspan="4" class="add-row">
            <button class="add-button" (click)="addRenovation()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Sanierung hinzufügen
            </button>
          </td>
        </tr>
      </table>
    </div>
  `,
  styles: []
})
export class RenovationsTableComponent implements OnInit, OnChanges {
  @Input() building: any;
  @Input() editableBuilding: any;
  @Input() isEditMode = false;
  @Output() dataChanged = new EventEmitter<{object: any, property: string, value: any}>();
  @Output() addNewRenovation = new EventEmitter<any>();

  newRenovation = {
    type: '',
    quantity: '',
    year: null as number | null
  };

  columns: TableColumn[] = [];
  tableData: any[] = [];
  
  tableConfig: TableConfig = {
    showHeader: false,
    headerClass: '',
    rowClass: '',
    tableClass: '',
    editMode: false,
    responsive: true
  };

  ngOnInit() {
    this.initializeColumns();
    this.updateTableData();
  }

  ngOnChanges() {
    this.tableConfig = {
      ...this.tableConfig,
      editMode: this.isEditMode
    };
    this.updateTableData();
  }

  private initializeColumns() {
    this.columns = [
      { key: 'type', header: 'Typ', width: '25%', editable: true, type: 'text' },
      { key: 'quantity', header: 'Menge', width: '25%', editable: true, type: 'text' },
      { key: 'whenLabel', header: 'Wann', width: '25%' },
      { key: 'year', header: 'Jahr', width: '25%', editable: true, type: 'number' }
    ];
  }

  private updateTableData() {
    if (!this.building || !this.building.renovations) return;
    
    // Use either the editable or original building data based on edit mode
    const data = this.isEditMode ? this.editableBuilding : this.building;
    
    this.tableData = data.renovations.map((renovation: any, index: number) => ({
      ...renovation,
      whenLabel: 'Wann',
      index: index,
      original: renovation
    }));
  }

  onCellEdit(event: any) {
    const { row, column, value } = event;
    
    // Update the renovation in the editable building data
    if (this.isEditMode && this.editableBuilding && this.editableBuilding.renovations) {
      const index = row.index;
      
      if (index >= 0 && index < this.editableBuilding.renovations.length) {
        const renovation = this.editableBuilding.renovations[index];
        
        switch (column.key) {
          case 'type':
            renovation.type = value;
            break;
          case 'quantity':
            renovation.quantity = value;
            break;
          case 'year':
            renovation.year = value === '' ? null : Number(value);
            break;
        }
        
        // Notify parent component
        this.dataChanged.emit({
          object: this.editableBuilding.renovations,
          property: index.toString(),
          value: renovation
        });
      }
    }
  }
  
  addRenovation() {
    // Only add if there's at least a type
    if (this.newRenovation.type.trim()) {
      // Create a copy of the renovation to emit
      const renovation = { ...this.newRenovation };
      
      // Emit event to add the renovation
      this.addNewRenovation.emit(renovation);
      
      // Reset the form
      this.newRenovation = { 
        type: '', 
        quantity: '', 
        year: null 
      };
      
      // Update the table data
      this.updateTableData();
    }
  }
}