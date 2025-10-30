import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display modal when show is true', () => {
    component.show = true;
    component.description = 'Test description';
    fixture.detectChanges();

    const modalElement = fixture.debugElement.query(By.css('.modal'));
    expect(modalElement).toBeTruthy();
  });

  it('should not display modal when show is false', () => {
    component.show = false;
    fixture.detectChanges();

    const modalElement = fixture.debugElement.query(By.css('.modal'));
    expect(modalElement).toBeFalsy();
  });

  it('should display description in modal body', () => {
    component.show = true;
    component.description = 'Test description';
    fixture.detectChanges();

    const descriptionElement = fixture.debugElement.query(By.css('p'));
    expect(descriptionElement.nativeElement.textContent).toBe(
      'Test description'
    );
  });

  it('should emit onCancelEventEmmiter when cancel button is clicked', () => {
    component.show = true;
    fixture.detectChanges();

    jest.spyOn(component.onCancelEventEmmiter, 'emit');

    const cancelButton = fixture.debugElement.query(
      By.css('custom-button[label="Cancelar"]')
    );
    cancelButton.triggerEventHandler('onEventClick', null);

    expect(component.onCancelEventEmmiter.emit).toHaveBeenCalled();
  });

  it('should emit onSuccessEventEmmiter when success button is clicked', () => {
    component.show = true;
    fixture.detectChanges();

    jest.spyOn(component.onSuccessEventEmmiter, 'emit');

    const successButton = fixture.debugElement.query(
      By.css('custom-button[label="Confirmar"]')
    );
    successButton.triggerEventHandler('onEventClick', null);

    expect(component.onSuccessEventEmmiter.emit).toHaveBeenCalled();
  });

  it('should call onCancel when onCancel method is invoked', () => {
    jest.spyOn(component.onCancelEventEmmiter, 'emit');

    component.onCancel();

    expect(component.onCancelEventEmmiter.emit).toHaveBeenCalled();
  });

  it('should call onSuccess when onSuccess method is invoked', () => {
    jest.spyOn(component.onSuccessEventEmmiter, 'emit');

    component.onSuccess();

    expect(component.onSuccessEventEmmiter.emit).toHaveBeenCalled();
  });
});
