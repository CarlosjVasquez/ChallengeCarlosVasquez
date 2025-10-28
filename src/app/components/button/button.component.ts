import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'custom-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() color: string = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() label: string = 'Button';
  @Input() disabled: boolean | null = false;
  @Input() type: 'button' | 'menu' | 'reset' | 'submit' = 'button';
  @Output() onEventClick: EventEmitter<void> = new EventEmitter();

  onHandleClick() {
    this.onEventClick.emit();
  }
}
