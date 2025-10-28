import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface OtionsSelect {
  value: number;
  label: string;
}

@Component({
  selector: 'custom-select',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent implements OnInit {
  @Output() onChangeEventEmmiter: EventEmitter<string | number> =
    new EventEmitter();
  @Input() options: OtionsSelect[] = [];
  @Input() defaultValue: string | number = '';
  selectedOption: string | number = '';

  ngOnInit(): void {
    if (this.defaultValue) this.selectedOption = this.defaultValue;
    else this.selectedOption = this.options[0].value;
  }

  onHandleChange(value: string | number) {
    this.onChangeEventEmmiter.emit(value);
  }
}
