import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProductComponent } from './list-product.component';
import { HeaderListProductComponent } from '../../components/header-list-product/header-list-product.component';
import { TableComponent } from '../../components/table/table.component';
import { ResultsComponent } from '../../components/results/results.component';
import { SelectComponent } from '../../components/select/select.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { of } from 'rxjs';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';

describe('ListProductComponent', () => {
  let component: ListProductComponent;
  let fixture: ComponentFixture<ListProductComponent>;
  let compiled: HTMLElement;
  let productServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    productServiceMock = {
      filterProducts$: of([]),
      selectedProduct$: of(new Product('', '', '', '', '', '')),
      deleteProduct: jest.fn(),
      selectProduct: jest.fn(),
      searchProduct: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      providers: [
        ListProductComponent,
        HeaderListProductComponent,
        TableComponent,
        ResultsComponent,
        SelectComponent,
        ModalComponent,
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProductComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });


  test('should filter list data on item page selection', () => {
    component.listData = [
      new Product(
        '1',
        'Product 1',
        'Description 1',
        'logo1.png',
        '2023-01-01',
        '2024-01-01'
      ),
      new Product(
        '2',
        'Product 2',
        'Description 2',
        'logo2.png',
        '2023-01-02',
        '2024-01-02'
      ),
      new Product(
        '3',
        'Product 3',
        'Description 3',
        'logo3.png',
        '2023-01-03',
        '2024-01-03'
      ),
    ];
    component.onHandleSelectItemPage(2);
    expect(component.filterListData.length).toBe(2);
  });

  test('should open and close modal', () => {
    component.openModal();
    expect(component.showModal).toBeTruthy();

    component.closeModal();
    expect(component.showModal).toBeFalsy();
  });

  test('should confirm delete', () => {
    component.confirmDelete();
    expect(productServiceMock.deleteProduct).toHaveBeenCalled();
    expect(component.showModal).toBeFalsy();
  });

  test('should open and close modal', () => {
    component.openModal();
    expect(component.showModal).toBeTruthy();

    component.closeModal();
    expect(component.showModal).toBeFalsy();
  });

  test('should confirm delete', () => {
    component.confirmDelete();
    expect(productServiceMock.deleteProduct).toHaveBeenCalled();
    expect(component.showModal).toBeFalsy();
  });

  test('should handle select product', () => {
    const product = new Product(
      '1',
      'Product 1',
      'Description 1',
      'logo1.png',
      '2023-01-01',
      '2024-01-01'
    );
    component.onHandleSelectProduct(product);
    expect(productServiceMock.selectProduct).toHaveBeenCalledWith(product);
  });

  test('should handle update', () => {
    const product = new Product(
      '1',
      'Product 1',
      'Description 1',
      'logo1.png',
      '2023-01-01',
      '2024-01-01'
    );
    component.onHandleUpdate(product);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/product/update']);
  });

  test('should handle control events', () => {
    const product = new Product(
      '1',
      'Product 1',
      'Description 1',
      'logo1.png',
      '2023-01-01',
      '2024-01-01'
    );

    component.onControlEvents({ id: 1, data: product });
    expect(component.showModal).toBeTruthy();

    component.onControlEvents({ id: 2, data: product });
    expect(routerMock.navigate).toHaveBeenCalledWith(['/product/update']);
  });

  test('should search product', () => {
    const search = 'Test';
    component.onSearch(search);
    expect(productServiceMock.searchProduct).toHaveBeenCalledWith(search);
  });

  test('should unsubscribe on destroy', () => {
    const subscriptionProductsSpy = jest.spyOn(
      component['subscriptionProducts'],
      'unsubscribe'
    );
    const subscriptionSelectedProductSpy = jest.spyOn(
      component['subscriptionSelectedProduct'],
      'unsubscribe'
    );

    component.ngOnDestroy();
    expect(subscriptionProductsSpy).toHaveBeenCalled();
    expect(subscriptionSelectedProductSpy).toHaveBeenCalled();
  });
});
