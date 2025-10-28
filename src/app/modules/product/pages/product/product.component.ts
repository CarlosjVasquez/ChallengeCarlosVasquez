import { Component, OnInit } from '@angular/core';
import { FormProductComponent } from '../../components/form-product/form-product.component';
import { Router } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

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

  constructor(private readonly router: Router, private readonly productService: ProductService) {
    if (this.router.url === '/product/update') this.edit = true;
  }

  ngOnInit(): void {
    if (this.edit) {
      this.title = 'Actualizar Producto';
    }
  }

  clearSelectProduct() {
    this.productService.selectProduct(new Product('', '', '', '', '', ''));
    this.router.navigate(['/products']);
  }

  onSubmitForm(product: Product) {
    this.edit
      ? this.productService.updateProduct(product)
      : this.productService.addProduct(product);
    this.clearSelectProduct();
  }
}
