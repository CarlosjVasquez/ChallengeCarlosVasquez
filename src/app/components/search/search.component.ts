import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'search',
  standalone: true,
  imports: [InputComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  @Output() onInputEventemitter: EventEmitter<string> = new EventEmitter();

  public form!: FormGroup;

  ngOnInit(): void {
    this.form = new FormGroup({
      search: new FormControl(''),
    });
  }

  onInput(value: string) {
    this.onInputEventemitter.emit(value);
  }

  formControlType(key: string) {
    return this.form.controls[key] as FormControl;
  }
}
