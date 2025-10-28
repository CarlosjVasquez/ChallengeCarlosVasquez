import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, InputComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should render label when provided', () => {
    const label = 'Test Label';
    component.label = label;
    fixture.detectChanges();

    const labelEl = fixture.debugElement.query(By.css('label'));
    expect(labelEl).toBeTruthy();
    expect(labelEl.nativeElement.textContent).toContain(label);
  });

  test('writeValue should set value and call onChange/onTouch', () => {
    const onChangeMock = jest.fn();
    const onTouchMock = jest.fn();
    component.registerOnChange(onChangeMock);
    component.registerOnTouched(onTouchMock);

    component.writeValue('abc');
    expect(component['value']).toBe('abc');
    expect(onChangeMock).toHaveBeenCalledWith('abc');
    expect(onTouchMock).toHaveBeenCalledWith('abc');
  });

  test('updateValue should call onChange and onTouch', () => {
    const onChangeMock = jest.fn();
    const onTouchMock = jest.fn();
    component.registerOnChange(onChangeMock);
    component.registerOnTouched(onTouchMock);

    component.updateValue('newVal');
    expect(onChangeMock).toHaveBeenCalledWith('newVal');
    expect(onTouchMock).toHaveBeenCalledWith('newVal');
  });

  test('onHandleChange should emit onChangeEventEmitter with input value', () => {
    const value = 'New Value';
    const event = { target: { value } } as unknown as Event;
    const spy = jest.spyOn(component.onChangeEventEmitter, 'emit');

    component.onHandleChange(event);
    expect(spy).toHaveBeenCalledWith(value);
  });

  test('onHandleInput should emit onInputEventEmitter with input value', () => {
    const value = 'New Input Value';
    const event = { target: { value } } as unknown as Event;
    const spy = jest.spyOn(component.onInputEventEmitter, 'emit');

    component.onHandleInput(event);
    expect(spy).toHaveBeenCalledWith(value);
  });

  test('onHandleInput should clean non-allowed chars when onlyLetters is true', () => {
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

  test('getErrorMessage returns null when no errors', () => {
    component.formControl = new FormControl(null);
    expect(component.getErrorMessage()).toBeNull();
  });

  test('getErrorMessage returns string error when error value is string', () => {
    component.formControl = new FormControl(null);
    // setErrors accepts any shape; using a string value triggers the string branch
    (component.formControl as any).setErrors({ customError: 'Custom error message' });

    const msg = component.getErrorMessage();
    expect(msg).toBe('Custom error message');
  });
});
