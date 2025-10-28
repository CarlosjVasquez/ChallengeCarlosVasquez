import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductComponent } from './product.component';
import { of } from 'rxjs';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { FormProductComponent } from '../../components/form-product/form-product.component';
import { ButtonComponent } from '../../components/button/button.component';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let compiled: HTMLElement;
  let productServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    productServiceMock = {
      selectedProduct$: of(new Product('', '', '', '', '', '')),
      selectProduct: jest.fn(),
      updateProduct: jest.fn(),
      addProduct: jest.fn(),
    };

    routerMock = {
      url: '/product/update',
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      providers: [
        ProductComponent,
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock },
        FormProductComponent,
        ButtonComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should redirect to /products if no selected product on update', () => {
    component.selectedProduct = new Product('', '', '', '', '', '');
    component.ngOnInit();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
  });

  test('should update title if in edit mode', () => {
    component.selectedProduct = new Product(
      '1',
      'Product',
      'Description',
      'logo.png',
      '2023-01-01',
      '2024-01-01'
    );
    component.ngOnInit();
    expect(component.title).toBe('Actualizar Producto');
  });

  test('should clear selected product and navigate to /products', () => {
    component.clearSelectProduct();
    expect(productServiceMock.selectProduct).toHaveBeenCalledWith(
      new Product('', '', '', '', '', '')
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
  });

  test('should call addProduct on submit when not in edit mode', () => {
    component.edit = false;
    const product = new Product(
      '1',
      'Product',
      'Description',
      'logo.png',
      '2023-01-01',
      '2024-01-01'
    );
    component.onSubmitForm(product);
    expect(productServiceMock.addProduct).toHaveBeenCalledWith(product);
    expect(productServiceMock.selectProduct).toHaveBeenCalledWith(
      new Product('', '', '', '', '', '')
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
  });

  test('should call updateProduct on submit when in edit mode', () => {
    component.edit = true;
    const product = new Product(
      '1',
      'Product',
      'Description',
      'logo.png',
      '2023-01-01',
      '2024-01-01'
    );
    component.onSubmitForm(product);
    expect(productServiceMock.updateProduct).toHaveBeenCalledWith(product);
    expect(productServiceMock.selectProduct).toHaveBeenCalledWith(
      new Product('', '', '', '', '', '')
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
  });

  test('should unsubscribe from selectedProduct$ on destroy', () => {
    const subscriptionSelectedProductSpy = jest.spyOn(
      component['subscriptionSelectedProduct'],
      'unsubscribe'
    );
    component.ngOnDestroy();
    expect(subscriptionSelectedProductSpy).toHaveBeenCalled();
  });
});
