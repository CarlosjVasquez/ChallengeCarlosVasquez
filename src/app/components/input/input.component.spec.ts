import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, InputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    component.formControl = new FormControl('');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label when provided', () => {
    const label = 'Test Label';
    component.label = label;
    fixture.detectChanges();

    const labelEl = fixture.debugElement.query(By.css('label'));
    expect(labelEl).toBeTruthy();
    expect(labelEl.nativeElement.textContent).toContain(label);
  });

  it('writeValue should set value and call onChange/onTouch', () => {
    const onChangeMock = jest.fn();
    const onTouchMock = jest.fn();
    component.registerOnChange(onChangeMock);
    component.registerOnTouched(onTouchMock);

    component.writeValue('abc');
    expect(component.value).toBe('abc');
    expect(onChangeMock).toHaveBeenCalledWith('abc');
    expect(onTouchMock).toHaveBeenCalledWith('abc');
  });

  it('registerOnChange should set onChange function', () => {
    const onChangeMock = jest.fn();
    component.registerOnChange(onChangeMock);
    expect(component.onChange).toBe(onChangeMock);
  });

  it('registerOnTouched should set onTouch function', () => {
    const onTouchMock = jest.fn();
    component.registerOnTouched(onTouchMock);
    expect(component.onTouch).toBe(onTouchMock);
  });

  it('setDisabledState should set disabled property', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBe(true);

    component.setDisabledState(false);
    expect(component.disabled).toBe(false);
  });

  it('updateValue should call onChange and onTouch', () => {
    const onChangeMock = jest.fn();
    const onTouchMock = jest.fn();
    component.registerOnChange(onChangeMock);
    component.registerOnTouched(onTouchMock);

    component.updateValue('newVal');
    expect(onChangeMock).toHaveBeenCalledWith('newVal');
    expect(onTouchMock).toHaveBeenCalledWith('newVal');
  });

  it('onHandleChange should emit onChangeEventEmitter with input value', () => {
    const value = 'New Value';
    const event = { target: { value } } as unknown as Event;
    const spy = jest.spyOn(component.onChangeEventEmitter, 'emit');

    component.onHandleChange(event);
    expect(spy).toHaveBeenCalledWith(value);
  });

  it('onHandleInput should emit onInputEventEmitter with input value', () => {
    const value = 'New Input Value';
    const event = { target: { value } } as unknown as Event;
    const spy = jest.spyOn(component.onInputEventEmitter, 'emit');

    component.onHandleInput(event);
    expect(spy).toHaveBeenCalledWith(value);
  });

  it('onHandleInput should clean non-allowed chars when onlyLetters is true', () => {
    const inputValue = 'abc123!@#á';
    // according to regex in component, allowed chars: a-zA-Z0-9 . - space and accented vowels
    const expected = 'abc123á';
    const event = { target: { value: inputValue } } as unknown as Event;

    const spy = jest.spyOn(component.onInputEventEmitter, 'emit');
    component.onlyLetters = true;
    component.onHandleInput(event);

    // the component modifies the input.value in-place
    const target = (event as any).target as HTMLInputElement;
    expect(target.value).toBe(expected);
    expect(spy).toHaveBeenCalledWith(expected);
  });

  it('getErrorMessage returns null when no errors', () => {
    component.formControl.setErrors(null);
    expect(component.getErrorMessage()).toBeNull();
  });

  it('getErrorMessage returns string error when error value is string', () => {
    component.formControl.setErrors({ customError: 'Custom error message' });

    const msg = component.getErrorMessage();
    expect(msg).toBe('Custom error message');
  });

  it('getErrorMessage returns default error message for known errors', () => {
    component.formControl.setErrors({ required: true });
    expect(component.getErrorMessage()).toBe('Este campo es requerido.');

    component.formControl.setErrors({ minlength: { requiredLength: 5 } });
    expect(component.getErrorMessage()).toBe('Mínimo de caracteres: 5.');
  });

  it('getErrorMessage returns null for unknown errors', () => {
    component.formControl.setErrors({ unknownError: { someValue: 'test' } });
    expect(component.getErrorMessage()).toBeNull();
  });
});
