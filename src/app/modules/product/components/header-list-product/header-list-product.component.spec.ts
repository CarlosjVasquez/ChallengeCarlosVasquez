import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderListProductComponent } from './header-list-product.component';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from '../../../../components/button/button.component';
import { InputComponent } from '../../../../components/input/input.component';
import { Router, RouterModule } from '@angular/router';
import { ProductComponent } from '../../pages/product/product.component';

describe('HeaderListProductComponent', () => {
  let component: HeaderListProductComponent;
  let fixture: ComponentFixture<HeaderListProductComponent>;
  let compiled: HTMLElement;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        HeaderListProductComponent,
        ButtonComponent,
        ProductComponent,
      ],
      imports: [
        RouterModule.forRoot([
          { path: 'product/create', component: ProductComponent },
        ]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderListProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should button', () => {
    const button = fixture.debugElement.query(By.directive(ButtonComponent));
    expect(button).toBeTruthy();
  });

  test('should input', () => {
    const input = fixture.debugElement.query(By.directive(InputComponent));
    expect(input).toBeTruthy();
  });

  test('should input', () => {
    const input = fixture.debugElement.query(By.directive(InputComponent));
    expect(input).toBeTruthy();
  });

  test('should navigate to /product/create on add product', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.onAddProduct();
    expect(navigateSpy).toHaveBeenCalledWith(['/product/create']);
  });

  test('should emit search input event', () => {
    const searchValue = 'test search';
    let emittedSearch: string | undefined;

    component.onInputEventemitter.subscribe((value) => {
      emittedSearch = value;
    });

    component.onHandleSubmit(searchValue);

    expect(emittedSearch).toEqual(searchValue);
  });

  test('should emit search input event from button click', () => {
    const searchValue = 'test search';
    let emittedSearch: string | undefined;

    component.onInputEventemitter.subscribe((value) => {
      emittedSearch = value;
    });

    const button = fixture.debugElement.query(By.directive(ButtonComponent));
    button.triggerEventHandler('click', null);

    fixture.whenStable().then(() => {
      expect(emittedSearch).toEqual(searchValue);
    });
  });
});
