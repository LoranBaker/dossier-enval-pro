// src/app/shared/components/data-table/data-table.component.ts
import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  header: string;
  width?: string;
  cellTemplate?: TemplateRef<any>;
  sortable?: boolean;
  editable?: boolean;
  type?: 'text' | 'number' | 'boolean' | 'select' | 'custom';
  options?: { value: any, label: string }[]; // For select type
}

export interface TableConfig {
  showHeader?: boolean;
  headerClass?: string;
  rowClass?: string;
  cellClass?: string;
  emptyMessage?: string;
  tableClass?: string;
  sortable?: boolean;
  responsive?: boolean;
  editMode?: boolean;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() config: TableConfig = {
    showHeader: true,
    headerClass: '',
    rowClass: '',
    cellClass: '',
    emptyMessage: 'No data available',
    tableClass: '',
    sortable: false,
    responsive: true,
    editMode: false
  };
  @Input() isLoading = false;
  @Input() showEditable = false;

  @Output() rowClick = new EventEmitter<any>();
  @Output() cellClick = new EventEmitter<{ row: any, column: TableColumn, value: any }>();
  @Output() edit = new EventEmitter<{ row: any, column: TableColumn, value: any }>();
  @Output() sort = new EventEmitter<{ column: TableColumn, direction: 'asc' | 'desc' }>();

  private _sortColumn: string | null = null;
  private _sortDirection: 'asc' | 'desc' = 'asc';

  get sortColumn(): string | null {
    return this._sortColumn;
  }

  get sortDirection(): 'asc' | 'desc' {
    return this._sortDirection;
  }

  handleRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  handleCellClick(row: any, column: TableColumn, value: any): void {
    this.cellClick.emit({ row, column, value });
  }

  handleEdit(row: any, column: TableColumn, value: any): void {
    this.edit.emit({ row, column, value });
  }
  
  // Event handler methods for different input types
  handleInputChange(event: Event, row: any, column: TableColumn): void {
    const inputElement = event.target as HTMLInputElement;
    this.handleEdit(row, column, inputElement.value);
  }

  handleNumberInputChange(event: Event, row: any, column: TableColumn): void {
    const inputElement = event.target as HTMLInputElement;
    this.handleEdit(row, column, inputElement.value);
  }

  handleCheckboxChange(event: Event, row: any, column: TableColumn): void {
    const checkboxElement = event.target as HTMLInputElement;
    this.handleEdit(row, column, checkboxElement.checked);
  }

  handleSelectChange(event: Event, row: any, column: TableColumn): void {
    const selectElement = event.target as HTMLSelectElement;
    this.handleEdit(row, column, selectElement.value);
  }

  sortBy(column: TableColumn): void {
    if (!this.config.sortable || !column.sortable) {
      return;
    }

    if (this._sortColumn === column.key) {
      this._sortDirection = this._sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this._sortColumn = column.key;
      this._sortDirection = 'asc';
    }

    this.sort.emit({ column, direction: this._sortDirection });
  }

  isSortedBy(columnKey: string): boolean {
    return this._sortColumn === columnKey;
  }

  getSortIcon(columnKey: string): string {
    if (!this.isSortedBy(columnKey)) {
      return 'sort';
    }

    return this._sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  // Helper method to safely get nested properties
  getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((prev, curr) => {
      return prev ? prev[curr] : null;
    }, obj);
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}