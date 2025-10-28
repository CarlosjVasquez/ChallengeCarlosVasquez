import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { BadRequestError, ResponseSuccessfully } from '../models/codeResponse';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productsSubject = new BehaviorSubject<Product[]>([]);
  private readonly filterProductsSubject = new BehaviorSubject<Product[]>([]);
  private readonly selectedProductSubject = new BehaviorSubject<Product>(
    new Product('', '', '', '', '', '')
  );

  products$ = this.productsSubject.asObservable();
  filterProducts$ = this.filterProductsSubject.asObservable();
  selectedProduct$ = this.selectedProductSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    this.getProducts().subscribe(({ data }) => {
      this.productsSubject.next(data as Product[]);
      this.filterProductsSubject.next(data as Product[]);
    });
  }

  getProducts(): Observable<ResponseSuccessfully<Product>> {
    return this.http
      .get<ResponseSuccessfully<Product>>('http://localhost:3002/bp/products')
      .pipe(
        map((response: ResponseSuccessfully<Product>) => {
          return response;
        }),
        catchError((error: BadRequestError) => {
          return throwError(() => error);
        })
      );
  }

  selectProduct(product: Product) {
    this.selectedProductSubject.next(product);
  }

  searchProduct(search: string) {
    const products = this.productsSubject.getValue();
    const newProducts = products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );

    this.filterProductsSubject.next(newProducts);
  }

  addProduct(product: Product) {
    return this.http
      .post<ResponseSuccessfully<Product>>(
        'http://localhost:3002/bp/products',
        product
      )
      .pipe(
        map((response: ResponseSuccessfully<Product>) => {
          return response;
        }),
        catchError((error: BadRequestError) => {
          return throwError(() => error);
        })
      )
      .subscribe(() => {
        this.getProducts().subscribe(({ data }) => {
          this.productsSubject.next(data as Product[]);
          this.filterProductsSubject.next(data as Product[]);
        });
      });
  }

  updateProduct(product: Product) {
    return this.http
      .put<ResponseSuccessfully<Product>>(
        `http://localhost:3002/bp/products/${product.id}`,
        product
      )
      .pipe(
        map((response: ResponseSuccessfully<Product>) => {
          return response;
        }),
        catchError((error: BadRequestError) => {
          return throwError(() => error);
        })
      )
      .subscribe(() => {
        this.getProducts().subscribe(({ data }) => {
          this.productsSubject.next(data as Product[]);
          this.filterProductsSubject.next(data as Product[]);
        });
      });
  }

  deleteProduct() {
    const product = this.selectedProductSubject.getValue();
    const resp = this.http
      .delete<ResponseSuccessfully<Product>>(
        `http://localhost:3002/bp/products/${product.id}`
      )
      .pipe(
        map((response: ResponseSuccessfully<Product>) => {
          return response;
        }),
        catchError((error: BadRequestError) => {
          return throwError(() => error);
        })
      )
      .subscribe(() => {
        this.getProducts().subscribe(({ data }) => {
          this.productsSubject.next(data as Product[]);
          this.filterProductsSubject.next(data as Product[]);
        });
      });

    return resp;
  }

  verificationID(id: string): Observable<boolean> {
    return this.http.get<boolean>(
      `http://localhost:3002/bp/products/verification/${id}`
    );
  }
}
