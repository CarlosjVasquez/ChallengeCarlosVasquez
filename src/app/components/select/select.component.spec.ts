import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { SelectComponent, OtionsSelect } from './select.component';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set selectedOption to defaultValue if provided', () => {
    const mockOptions: OtionsSelect[] = [
      { value: 1, label: 'Option 1' },
      { value: 2, label: 'Option 2' },
    ];
    component.options = mockOptions;
    component.defaultValue = 2;

    component.ngOnInit();

    expect(component.selectedOption).toBe(2);
  });

  it('should set selectedOption to first option value if no defaultValue', () => {
    const mockOptions: OtionsSelect[] = [
      { value: 1, label: 'Option 1' },
      { value: 2, label: 'Option 2' },
    ];
    component.options = mockOptions;
    component.defaultValue = '';

    component.ngOnInit();

    expect(component.selectedOption).toBe(1);
  });

  it('should emit onChangeEventEmmiter when onHandleChange is called', () => {
    jest.spyOn(component.onChangeEventEmmiter, 'emit');

    component.onHandleChange('test value');

    expect(component.onChangeEventEmmiter.emit).toHaveBeenCalledWith(
      'test value'
    );
  });
});
