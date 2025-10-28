import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export interface Option {
  id: number;
  label: string;
}

@Component({
  selector: 'dropdown',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
})
export class DropdownComponent {
  @Input() icon: string = '';
  @Input() size: number = 15;
  @Input() label?: string = '';
  @Input() options: Option[] = [];
  @Output() onClickEventEmitter: EventEmitter<number> = new EventEmitter();

  onClick(id: number) {
    this.onClickEventEmitter.emit(id);
  }
}
