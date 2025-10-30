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

    // Handle the constructor HTTP call
    const constructorReq = httpMock.expectOne(
      'http://localhost:3002/bp/products'
    );
    constructorReq.flush({ data: [] });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with products on construction', () => {
    // This test verifies the constructor behavior
    // The HTTP call is handled in the beforeEach
    expect(service.products$).toBeDefined();
    expect(service.filterProducts$).toBeDefined();
    expect(service.selectedProduct$).toBeDefined();
  });

  it('should get products via GET', () => {
    const mockProducts: Product[] = [
      new Product(
        '1',
        'Product1',
        'Desc1',
        'logo1.png',
        '2023-01-01',
        '2024-01-01'
      ),
    ];

    service.getProducts().subscribe((response) => {
      expect(response.data).toEqual(mockProducts);
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products');
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockProducts });
  });

  it('should handle error in getProducts', () => {
    const errorMessage = 'Server error';

    service.getProducts().subscribe({
      next: () => fail('Should have failed'),
      error: (error) => {
        expect(error.message).toBe(errorMessage);
      },
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products');
    req.flush(
      { message: errorMessage },
      { status: 500, statusText: 'Server Error' }
    );
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

  it('should select null product', () => {
    service.selectProduct(null);

    service.selectedProduct$.subscribe((selectedProduct) => {
      expect(selectedProduct).toBeNull();
    });
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

  it('should return empty array when search does not match', () => {
    const dummyProducts: Product[] = [
      new Product(
        '1',
        'Product1',
        'Description1',
        'logo1.png',
        '2023-01-01',
        '2024-01-01'
      ),
    ];

    service['productsSubject'].next(dummyProducts);

    service.searchProduct('NonExistent');

    service.filterProducts$.subscribe((filteredProducts) => {
      expect(filteredProducts.length).toBe(0);
    });
  });

  it('should add a product via POST', () => {
    const newProduct = new Product(
      '3',
      'New Product',
      'New Description',
      'logo3.png',
      '2023-03-01',
      '2024-03-01'
    );

    const mockProducts: Product[] = [
      new Product(
        '1',
        'Product1',
        'Desc1',
        'logo1.png',
        '2023-01-01',
        '2024-01-01'
      ),
      newProduct,
    ];

    service.addProduct(newProduct);

    const addReq = httpMock.expectOne('http://localhost:3002/bp/products');
    expect(addReq.request.method).toBe('POST');
    expect(addReq.request.body).toEqual(newProduct);
    addReq.flush({ data: newProduct });

    const getReq = httpMock.expectOne('http://localhost:3002/bp/products');
    expect(getReq.request.method).toBe('GET');
    getReq.flush({ data: mockProducts });
  });

  it('should handle error in addProduct', () => {
    const newProduct = new Product(
      '3',
      'New Product',
      'New Description',
      'logo3.png',
      '2023-03-01',
      '2024-03-01'
    );
    const errorMessage = 'Validation error';

    service.addProduct(newProduct);

    const req = httpMock.expectOne('http://localhost:3002/bp/products');
    req.flush(
      { message: errorMessage },
      { status: 400, statusText: 'Bad Request' }
    );
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

    const mockProducts: Product[] = [updatedProduct];

    service.updateProduct(updatedProduct);

    const updateReq = httpMock.expectOne(
      `http://localhost:3002/bp/products/${updatedProduct.id}`
    );
    expect(updateReq.request.method).toBe('PUT');
    expect(updateReq.request.body).toEqual(updatedProduct);
    updateReq.flush({ data: updatedProduct });

    const getReq = httpMock.expectOne('http://localhost:3002/bp/products');
    expect(getReq.request.method).toBe('GET');
    getReq.flush({ data: mockProducts });
  });

  it('should handle error in updateProduct', () => {
    const updatedProduct = new Product(
      '1',
      'Updated Product',
      'Updated Description',
      'logo1.png',
      '2023-01-01',
      '2024-01-01'
    );
    const errorMessage = 'Update error';

    service.updateProduct(updatedProduct);

    const req = httpMock.expectOne(
      `http://localhost:3002/bp/products/${updatedProduct.id}`
    );
    req.flush(
      { message: errorMessage },
      { status: 400, statusText: 'Bad Request' }
    );
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

    const mockProducts: Product[] = [];

    service.deleteProduct();

    const deleteReq = httpMock.expectOne(
      `http://localhost:3002/bp/products/${productToDelete.id}`
    );
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush({ data: productToDelete });

    const getReq = httpMock.expectOne('http://localhost:3002/bp/products');
    expect(getReq.request.method).toBe('GET');
    getReq.flush({ data: mockProducts });
  });

  it('should return null when trying to delete without selected product', () => {
    service.selectProduct(null);

    const result = service.deleteProduct();

    expect(result).toBeNull();
  });

  it('should handle error in deleteProduct', () => {
    const productToDelete = new Product(
      '1',
      'Product1',
      'Description1',
      'logo1.png',
      '2023-01-01',
      '2024-01-01'
    );
    const errorMessage = 'Delete error';

    service.selectProduct(productToDelete);

    service.deleteProduct();

    const req = httpMock.expectOne(
      `http://localhost:3002/bp/products/${productToDelete.id}`
    );
    req.flush(
      { message: errorMessage },
      { status: 400, statusText: 'Bad Request' }
    );
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

  it('should handle error in verificationID', () => {
    const productId = '1';
    const errorMessage = 'Verification error';

    service.verificationID(productId).subscribe({
      next: () => fail('Should have failed'),
      error: (error) => {
        expect(error.message).toBe(errorMessage);
      },
    });

    const req = httpMock.expectOne(
      `http://localhost:3002/bp/products/verification/${productId}`
    );
    req.flush(
      { message: errorMessage },
      { status: 500, statusText: 'Server Error' }
    );
  });
});
