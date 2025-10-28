import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product';
import { BadRequestError, ResponseSuccessfully } from '../models/codeResponse';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update a product via PUT', () => {
    const updatedProduct = new Product(
      '1',
      'Updated Product',
      'Updated Description',
      'logo1.png',
      '2023-01-01',
      '2024-01-01'
    );

    service.updateProduct(updatedProduct);

    const req = httpMock.expectOne(
      `http://localhost:3002/bp/products/${updatedProduct.id}`
    );
    expect(req.request.method).toBe('PUT');
    req.flush({ data: updatedProduct });
  });

  it('should delete a product via DELETE', () => {
    const productToDelete = new Product(
      '1',
      'Product1',
      'Description1',
      'logo1.png',
      '2023-01-01',
      '2024-01-01'
    );

    service.selectProduct(productToDelete);

    service.deleteProduct();

    const req = httpMock.expectOne(
      `http://localhost:3002/bp/products/${productToDelete.id}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({ data: productToDelete });
  });

  it('should verify product ID', () => {
    const productId = '1';

    service.verificationID(productId).subscribe((response) => {
      expect(response).toBe(true);
    });

    const req = httpMock.expectOne(
      `http://localhost:3002/bp/products/verification/${productId}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('should filter products based on search criteria', () => {
    const dummyProducts: Product[] = [
      new Product(
        '1',
        'Product1',
        'Description1',
        'logo1.png',
        '2023-01-01',
        '2024-01-01'
      ),
      new Product(
        '2',
        'Product2',
        'Description2',
        'logo2.png',
        '2023-02-01',
        '2024-02-01'
      ),
    ];

    service['productsSubject'].next(dummyProducts);

    service.searchProduct('Product1');

    service.filterProducts$.subscribe((filteredProducts) => {
      expect(filteredProducts.length).toBe(1);
      expect(filteredProducts[0].name).toBe('Product1');
    });
  });

  it('should select a product', () => {
    const product = new Product(
      '1',
      'Product1',
      'Description1',
      'logo1.png',
      '2023-01-01',
      '2024-01-01'
    );

    service.selectProduct(product);

    service.selectedProduct$.subscribe((selectedProduct) => {
      expect(selectedProduct).toEqual(product);
    });
  });
});
