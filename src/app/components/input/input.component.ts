import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { DEFAULT_ERROR_MESSAGES } from '@utils/constants/forms.constant';

@Component({
  selector: 'custom-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() id!: string;
  @Input() name!: string;
  @Input() disabled: boolean = false;
  @Input() required!: boolean;
  @Input() minlength!: number;
  @Input() maxlength!: number;
  @Input() min!: number | string;
  @Input() max!: number;
  @Input() onlyLetters: boolean = false;
  @Input() formControl!: FormControl;
  @Output() onChangeEventEmitter: EventEmitter<string> = new EventEmitter();
  @Output() onInputEventEmitter: EventEmitter<string> = new EventEmitter();
  value: any;

  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(value: any): void {
    this.value = value;
    this.onChange(value);
    this.onTouch(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  updateValue(event: string) {
    this.onChange(event);
    this.onTouch(event);
  }

  onHandleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.onChangeEventEmitter.emit(target.value);
  }

  onHandleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.onlyLetters)
      input.value = input.value.replace(/[^a-zA-Z0-9.\-\sáéíóúÁÉÍÓÚ]/g, '');
    this.onInputEventEmitter.emit(input.value);
  }

  getErrorMessage(): string | null {
    const errors = this.formControl.errors;
    if (!errors) return null;

    const errorKey = Object.keys(errors)[0];
    const errorValue = errors[errorKey];

    if (typeof errorValue === 'string') {
      return errorValue;
    }

    if (DEFAULT_ERROR_MESSAGES[errorKey]) {
      return DEFAULT_ERROR_MESSAGES[errorKey].replace(
        /\{(\w+)\}/g,
        (_, key) => errorValue[key] || ''
      );
    }

    return null;
  }
}
