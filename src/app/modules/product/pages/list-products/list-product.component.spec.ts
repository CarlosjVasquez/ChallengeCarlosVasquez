import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { ListProductComponent } from './list-product.component';
import { HeaderListProductComponent } from '../../components/header-list-product/header-list-product.component';
import { TableComponent } from '@components/table/table.component';
import { ResultsComponent } from '@components/results/results.component';
import { SelectComponent } from '@components/select/select.component';
import { ModalComponent } from '@components/modal/modal.component';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

describe('ListProductComponent', () => {
  let component: ListProductComponent;
  let fixture: ComponentFixture<ListProductComponent>;
  let productServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    const mockProducts = [
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
    ];

    productServiceMock = {
      filterProducts$: of(mockProducts),
      selectedProduct$: of(null),
      deleteProduct: jest.fn(),
      selectProduct: jest.fn(),
      searchProduct: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        ListProductComponent,
        HeaderListProductComponent,
        TableComponent,
        ResultsComponent,
        SelectComponent,
        ModalComponent,
      ],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.listColumns.length).toBe(5);
    expect(component.optionsItemPage.length).toBe(3);
    expect(component.options.length).toBe(2);
    expect(component.showModal).toBe(false);
  });

  it('should subscribe to product service observables on init', () => {
    expect(component.listData.length).toBe(2);
    expect(component.filterListData.length).toBe(2); // sliced to first option value (5) but mock has only 2 items
    expect(component.selectedProduct).toBe(null);
  });

  it('should filter list data on item page selection', () => {
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

  it('should open and close modal', () => {
    component.openModal();
    expect(component.showModal).toBe(true);

    component.closeModal();
    expect(component.showModal).toBe(false);
  });

  it('should cancel modal and clear selection', () => {
    component.selectedProduct = new Product(
      '1',
      'Test',
      'Desc',
      'logo.png',
      '2023-01-01',
      '2024-01-01'
    );
    component.showModal = true;

    component.cancelModal();

    expect(component.showModal).toBe(false);
    expect(productServiceMock.selectProduct).toHaveBeenCalledWith(null);
  });

  it('should confirm delete and close modal', () => {
    component.showModal = true;

    component.confirmDelete();

    expect(productServiceMock.deleteProduct).toHaveBeenCalled();
    expect(component.showModal).toBe(false);
  });

  it('should handle select product', () => {
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

  it('should handle update and navigate', () => {
    const product = new Product(
      '1',
      'Product 1',
      'Description 1',
      'logo1.png',
      '2023-01-01',
      '2024-01-01'
    );
    component.onHandleUpdate(product);
    expect(productServiceMock.selectProduct).toHaveBeenCalledWith(product);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/products/update']);
  });

  it('should handle delete product event', () => {
    const product = new Product(
      '1',
      'Product 1',
      'Description 1',
      'logo1.png',
      '2023-01-01',
      '2024-01-01'
    );

    component.onDeleteProduct(product);

    expect(productServiceMock.selectProduct).toHaveBeenCalledWith(product);
    expect(component.showModal).toBe(true);
  });

  it('should handle control events for delete', () => {
    const product = new Product(
      '1',
      'Product 1',
      'Description 1',
      'logo1.png',
      '2023-01-01',
      '2024-01-01'
    );

    component.onControlEvents({ id: 1, data: product });

    expect(productServiceMock.selectProduct).toHaveBeenCalledWith(product);
    expect(component.showModal).toBe(true);
  });

  it('should handle control events for update', () => {
    const product = new Product(
      '1',
      'Product 1',
      'Description 1',
      'logo1.png',
      '2023-01-01',
      '2024-01-01'
    );

    component.onControlEvents({ id: 2, data: product });

    expect(productServiceMock.selectProduct).toHaveBeenCalledWith(product);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/products/update']);
  });

  it('should search product', () => {
    const search = 'Test';
    component.onSearch(search);
    expect(productServiceMock.searchProduct).toHaveBeenCalledWith(search);
  });

  it('should unsubscribe on destroy', () => {
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
