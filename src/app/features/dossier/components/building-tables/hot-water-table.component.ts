// src/app/features/dossier/components/building-tables/hot-water-table.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, TableColumn, TableConfig } from '../../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-hot-water-table',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  template: `
    <div class="data-table">
      <table>
        <tr>
          <th colspan="4">Warmwasser</th>
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
export class HotWaterTableComponent implements OnInit, OnChanges {
  @Input() building: any;
  @Input() editableBuilding: any;
  @Input() isEditMode = false;
  @Output() dataChanged = new EventEmitter<{object: any, property: string, value: any}>();

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
        property1: 'Warmwasseraufbereitung',
        value1: data.hotWater.source,
        property2: 'Sanierungsjahr',
        value2: data.hotWater.renovationYear || 'Nein',
        type1: 'select',
        type2: 'number',
        object1: data.hotWater,
        property1Key: 'source',
        object2: data.hotWater,
        property2Key: 'renovationYear',
        options1: [
          { value: 'Nur über Heizung', label: 'Nur über Heizung' },
          { value: 'Separate Anlage', label: 'Separate Anlage' },
          { value: 'Durchlauferhitzer', label: 'Durchlauferhitzer' },
          { value: 'Boiler', label: 'Boiler' },
          { value: 'Warmwasserwärmepumpe', label: 'Warmwasserwärmepumpe' }
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