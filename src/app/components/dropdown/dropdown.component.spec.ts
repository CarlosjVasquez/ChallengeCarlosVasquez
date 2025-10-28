import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownComponent } from './dropdown.component';
import { IconComponent } from '../icon/icon.component';
import { By } from '@angular/platform-browser';

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [DropdownComponent, IconComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should icon', () => {
    component.icon = 'assets/icons/navegacion.png';
    fixture.detectChanges();
    const icon = fixture.debugElement.query(By.directive(IconComponent));
    expect(icon).toBeTruthy();
  });

  test('should emit event click', () => {
    jest.spyOn(component.onClickEventEmitter, 'emit');

    component.options = [
      {
        label: 'Option 1',
        id: 1,
      },
    ];
    fixture.detectChanges();
    const liElement = fixture.debugElement.query(By.css('li')).nativeElement;
    liElement.click();

    expect(component.onClickEventEmitter.emit).toHaveBeenCalled();
  });
});
