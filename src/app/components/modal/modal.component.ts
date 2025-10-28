import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'custom-modal',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @Input() description: string = '';
  @Input() show: boolean = false;
  @Output() onCancelEventEmmiter: EventEmitter<void> = new EventEmitter();
  @Output() onSuccessEventEmmiter: EventEmitter<void> = new EventEmitter();

  onCancel() {
    this.onCancelEventEmmiter.emit();
  }
  onSuccess() {
    this.onSuccessEventEmmiter.emit();
  }
}
