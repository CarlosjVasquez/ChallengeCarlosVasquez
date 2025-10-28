import { Component, Input } from '@angular/core';

@Component({
  selector: 'results',
  standalone: true,
  imports: [],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
})
export class ResultsComponent {
  @Input() results: number = 0;
  @Input() label: string = '';
}
