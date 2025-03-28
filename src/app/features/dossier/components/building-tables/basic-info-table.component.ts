// src/app/features/dossier/components/building-tables/basic-info-table.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, TableColumn, TableConfig } from '../../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-basic-info-table',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  template: `
    <div class="data-table">
      <app-data-table
        [columns]="columns"
        [data]="tableData"
        [config]="tableConfig"
        (edit)="onCellEdit($event)">
      </app-data-table>
    </div>
  `,
  styles: []
})
export class BasicInfoTableComponent implements OnInit, OnChanges {
  @Input() building: any;
  @Input() editableBuilding: any;
  @Input() isEditMode = false;
  @Output() dataChanged = new EventEmitter<{object: any, property: string, value: any}>();

  columns: TableColumn[] = [];
  tableData: any[] = [];
  
  tableConfig: TableConfig = {
    showHeader: true,
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
      { key: 'property1', header: 'Eigenschaft', width: '25%' },
      { key: 'value1', header: 'Wert', width: '25%', editable: true, 
        type: 'text' },
      { key: 'property2', header: 'Eigenschaft', width: '25%' },
      { key: 'value2', header: 'Wert', width: '25%', editable: true, 
        type: 'text' }
    ];
  }

  private updateTableData() {
    if (!this.building) return;
    
    // Use either the editable or original building data based on edit mode
    const data = this.isEditMode ? this.editableBuilding : this.building;
    
    this.tableData = [
      {
        property1: 'Eigentümerstruktur',
        value1: data.ownerStructure,
        property2: 'Gibt es nachträgliche Anbauten',
        value2: data.additionalConstruction ? 'Ja' : 'Nein',
        type1: 'text',
        type2: 'boolean',
        object1: data,
        property1Key: 'ownerStructure',
        object2: data,
        property2Key: 'additionalConstruction'
      },
      {
        property1: 'Baujahr',
        value1: data.buildingYear,
        property2: 'Anzahl Wohn-& Gewerbeeinheiten',
        value2: `${data.units.total} (davon ${data.units.commercial} gewerblich)`,
        type1: 'number',
        type2: 'complex',
        object1: data,
        property1Key: 'buildingYear',
        object2: data.units,
        property2Key: 'complex' // Special handling for this
      },
      {
        property1: 'Anzahl Vollgeschosse',
        value1: data.floors,
        property2: 'Wohnfläche in m²',
        value2: data.livingSpace,
        type1: 'number',
        type2: 'number',
        object1: data,
        property1Key: 'floors',
        object2: data,
        property2Key: 'livingSpace'
      },
      {
        property1: 'Angrenzende Gebäude',
        value1: data.adjacentBuildings ? 'Ja' : 'Nein',
        property2: 'Gewerbefläche in m² (beheizt)',
        value2: data.commercialSpace,
        type1: 'boolean',
        type2: 'number',
        object1: data,
        property1Key: 'adjacentBuildings',
        object2: data,
        property2Key: 'commercialSpace'
      },
      {
        property1: 'Anzahl Wohneinheiten',
        value1: 3, // Hardcoded value from original
        property2: 'Grundfläche',
        value2: `ca. ${data.baseArea} m²`,
        type1: 'number',
        type2: 'text',
        object1: data,
        property1Key: 'wohneinheiten', // Not in the model, just for display
        object2: data,
        property2Key: 'baseArea'
      },
      {
        property1: 'Davon Selbstbezug',
        value1: data.selfOccupied,
        property2: 'Wurde nachträglich gedämmt',
        value2: data.retrofittedInsulation ? 'Ja' : 'Nein',
        type1: 'number',
        type2: 'boolean',
        object1: data,
        property1Key: 'selfOccupied',
        object2: data,
        property2Key: 'retrofittedInsulation'
      },
      {
        property1: 'Selbstgenutzte Wohnfläche',
        value1: `${data.selfUsedLivingSpace} m²`,
        property2: 'Flurstücksgröße ca.',
        value2: `ca. ${data.plotSize} m²`,
        type1: 'text',
        type2: 'text',
        object1: data,
        property1Key: 'selfUsedLivingSpace',
        object2: data,
        property2Key: 'plotSize'
      },
      {
        property1: 'Anzahl Gewerbeeinheiten',
        value1: data.units.commercial,
        property2: 'Anzahl Personen im HH',
        value2: data.residents,
        type1: 'number',
        type2: 'number',
        object1: data.units,
        property1Key: 'commercial',
        object2: data,
        property2Key: 'residents'
      }
    ];
  }

  onCellEdit(event: any) {
    const { row, column, value } = event;
    
    // Determine which property to update based on the column
    if (column.key === 'value1') {
      this.dataChanged.emit({
        object: row.object1,
        property: row.property1Key,
        value: this.convertValue(value, row.type1)
      });
    } else if (column.key === 'value2') {
      if (row.property2Key === 'complex') {
        // Special handling for complex fields
        // For example, parse "5 (davon 1 gewerblich)" to update units
      } else {
        this.dataChanged.emit({
          object: row.object2,
          property: row.property2Key,
          value: this.convertValue(value, row.type2)
        });
      }
    }
  }
  
  private convertValue(value: any, type: string): any {
    switch (type) {
      case 'number':
        return Number(value);
      case 'boolean':
        return value === 'Ja' || value === true;
      default:
        return value;
    }
  }
}