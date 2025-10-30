import { Component, OnInit } from '@angular/core';
import { FormProductComponent } from '../../components/form-product/form-product.component';
import { Router } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [FormProductComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  title: string = 'Formulario de Registro';
  edit: boolean = false;
  selectedProduct!: Product | null;
  private readonly subscriptionSelectedProduct: Subscription;

  constructor(
    private readonly router: Router,
    private readonly productService: ProductService
  ) {
    this.subscriptionSelectedProduct =
      this.productService.selectedProduct$.subscribe((value) => {
        this.selectedProduct = value;
      });
    if (this.router.url === '/products/update') this.edit = true;
  }

  ngOnInit(): void {
    if (!this.selectedProduct && this.edit) this.router.navigate(['/products']);
    if (this.edit) this.title = 'Actualizar Producto';
  }

  clearSelectProduct() {
    this.productService.selectProduct(null);
    this.router.navigate(['/products']);
  }

  onSubmitForm(product: Product) {
    this.edit
      ? this.productService.updateProduct(product)
      : this.productService.addProduct(product);
    this.clearSelectProduct();
  }

  ngOnDestroy(): void {
    this.subscriptionSelectedProduct.unsubscribe();
  }
}
