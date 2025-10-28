import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PopoverComponent } from '../popover/popover.component';
import { DropdownComponent, Option } from '../dropdown/dropdown.component';

export type CustomType = 'number' | 'date' | 'text' | 'image';

export interface Columns {
  key: string;
  label: string;
  type: CustomType;
  align: 'start' | 'center' | 'end';
  width: number;
  popover?: string;
}

export interface DropdownEvent {
  id: number;
  data: Data;
}

export interface Data {
  [key: string]: any;
}

@Component({
  selector: 'custom-table',
  standalone: true,
  imports: [CommonModule, PopoverComponent, DropdownComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input() data: Data[] = [];
  @Input() columns: Columns[] = [];
  @Input() options: Option[] = [];
  @Output() onDropdownClickEventEmitter: EventEmitter<DropdownEvent> =
    new EventEmitter();

  onDropdownClick(id: number, data: Data) {
    const dropdownEvent: DropdownEvent = {
      id,
      data,
    };
    this.onDropdownClickEventEmitter.emit(dropdownEvent);
  }
}
