import { Component, Input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'popover',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './popover.component.html',
  styleUrl: './popover.component.scss',
})
export class PopoverComponent {
  @Input() description: string = '';
  @Input() icon: string = '';
  @Input() size: number = 15;
}
