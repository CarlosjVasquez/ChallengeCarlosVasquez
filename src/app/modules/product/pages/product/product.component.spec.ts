import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { ProductComponent } from './product.component';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { FormProductComponent } from '../../components/form-product/form-product.component';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let productServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    productServiceMock = {
      selectedProduct$: of(null),
      selectProduct: jest.fn(),
      updateProduct: jest.fn(),
      addProduct: jest.fn(),
    };

    routerMock = {
      url: '/products/create',
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ProductComponent, FormProductComponent],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.title).toBe('Formulario de Registro');
    expect(component.edit).toBe(false);
    expect(component.selectedProduct).toBe(null);
  });

  it('should set edit mode and title when URL is /products/update', () => {
    routerMock.url = '/products/update';
    const newComponent = new ProductComponent(routerMock, productServiceMock);
    newComponent.ngOnInit();
    expect(newComponent.edit).toBe(true);
    expect(newComponent.title).toBe('Actualizar Producto');
  });

  it('should subscribe to selectedProduct$ observable', () => {
    const testProduct = new Product(
      '1',
      'Test',
      'Desc',
      'logo.png',
      '2023-01-01',
      '2024-01-01'
    );
    productServiceMock.selectedProduct$ = of(testProduct);

    const newComponent = new ProductComponent(routerMock, productServiceMock);
    expect(newComponent.selectedProduct).toBe(testProduct);
  });

  it('should redirect to /products if no selected product on update', () => {
    component.edit = true;
    component.selectedProduct = null;

    component.ngOnInit();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should not redirect if selected product exists on update', () => {
    component.edit = true;
    component.selectedProduct = new Product(
      '1',
      'Test',
      'Desc',
      'logo.png',
      '2023-01-01',
      '2024-01-01'
    );

    component.ngOnInit();

    expect(routerMock.navigate).not.toHaveBeenCalled();
    expect(component.title).toBe('Actualizar Producto');
  });

  it('should clear selected product and navigate to /products', () => {
    component.clearSelectProduct();

    expect(productServiceMock.selectProduct).toHaveBeenCalledWith(null);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should call addProduct on submit when not in edit mode', () => {
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
    expect(productServiceMock.selectProduct).toHaveBeenCalledWith(null);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should call updateProduct on submit when in edit mode', () => {
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
    expect(productServiceMock.selectProduct).toHaveBeenCalledWith(null);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should unsubscribe from selectedProduct$ on destroy', () => {
    const subscriptionSpy = jest.spyOn(
      component['subscriptionSelectedProduct'],
      'unsubscribe'
    );

    component.ngOnDestroy();

    expect(subscriptionSpy).toHaveBeenCalled();
  });

  it('should render form-product component', () => {
    const formElement = fixture.nativeElement.querySelector('form-product');
    expect(formElement).toBeTruthy();
  });

  it('should pass correct inputs to form-product component', () => {
    component.edit = true;
    component.selectedProduct = new Product(
      '1',
      'Test',
      'Desc',
      'logo.png',
      '2023-01-01',
      '2024-01-01'
    );
    fixture.detectChanges();

    const formElement = fixture.nativeElement.querySelector('form-product');
    expect(formElement).toBeTruthy();
  });
});
