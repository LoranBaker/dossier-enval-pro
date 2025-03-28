// src/app/features/dossier/components/building-tables/heating-table.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, TableColumn, TableConfig } from '../../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-heating-table',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  template: `
    <div class="data-table">
      <table>
        <tr>
          <th colspan="4">Heizung</th>
        </tr>
      </table>
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
export class HeatingTableComponent implements OnInit, OnChanges {
  @Input() building: any;
  @Input() editableBuilding: any;
  @Input() isEditMode = false;
  @Output() dataChanged = new EventEmitter<{object: any, property: string, value: any}>();

  columns: TableColumn[] = [];
  tableData: any[] = [];
  
  tableConfig: TableConfig = {
    showHeader: false, // No header for this table
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
      { key: 'value1', header: 'Wert', width: '25%', editable: true, type: 'text' },
      { key: 'property2', header: 'Eigenschaft', width: '25%' },
      { key: 'value2', header: 'Wert', width: '25%', editable: true, type: 'text' }
    ];
  }

  private updateTableData() {
    if (!this.building) return;
    
    // Use either the editable or original building data based on edit mode
    const data = this.isEditMode ? this.editableBuilding : this.building;
    
    this.tableData = [
      {
        property1: 'Energieträger',
        value1: data.heating.type,
        property2: 'Sanierungsjahr (anderes als Haus)',
        value2: data.heating.renovationYear || 'Nein',
        type1: 'select',
        type2: 'number',
        object1: data.heating,
        property1Key: 'type',
        object2: data.heating,
        property2Key: 'renovationYear',
        options1: [
          { value: 'Gas', label: 'Gas' },
          { value: 'Öl', label: 'Öl' },
          { value: 'Strom', label: 'Strom' },
          { value: 'Fernwärme', label: 'Fernwärme' },
          { value: 'Wärmepumpe', label: 'Wärmepumpe' },
          { value: 'Pellets', label: 'Pellets' }
        ]
      },
      {
        property1: 'Heizflächen',
        value1: data.heating.surfaces,
        property2: 'Sind Rohre gedämmt',
        value2: data.heating.insulatedPipes ? 'Ja' : 'Nein',
        type1: 'select',
        type2: 'boolean',
        object1: data.heating,
        property1Key: 'surfaces',
        object2: data.heating,
        property2Key: 'insulatedPipes',
        options1: [
          { value: 'Heizkörper', label: 'Heizkörper' },
          { value: 'Fußbodenheizung', label: 'Fußbodenheizung' },
          { value: 'Wandheizung', label: 'Wandheizung' },
          { value: 'Gemischt', label: 'Gemischt' }
        ]
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
      this.dataChanged.emit({
        object: row.object2,
        property: row.property2Key,
        value: this.convertValue(value, row.type2)
      });
    }
  }
  
  private convertValue(value: any, type: string): any {
    switch (type) {
      case 'number':
        return value === 'Nein' ? null : Number(value);
      case 'boolean':
        return value === 'Ja' || value === true;
      default:
        return value;
    }
  }
}