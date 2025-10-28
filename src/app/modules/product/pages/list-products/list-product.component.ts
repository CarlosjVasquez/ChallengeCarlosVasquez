import { Component, OnDestroy } from '@angular/core';
import { HeaderListProductComponent } from '../../components/header-list-product/header-list-product.component';
import {
  Columns,
  Data,
  DropdownEvent,
  TableComponent,
} from '@components/table/table.component';
import { ResultsComponent } from '@components/results/results.component';
import { OtionsSelect, SelectComponent } from '@components/select/select.component';
import { ModalComponent } from '@components/modal/modal.component';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { Option } from '@components/dropdown/dropdown.component';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'list-product',
  standalone: true,
  imports: [
    HeaderListProductComponent,
    TableComponent,
    ResultsComponent,
    SelectComponent,
    ModalComponent,
  ],
  templateUrl: './list-product.component.html',
  styleUrl: './list-product.component.scss',
})
export class ListProductComponent implements OnDestroy {
  private subscriptionProducts: Subscription;
  private subscriptionSelectedProduct: Subscription;
  listColumns: Columns[] = [
    {
      key: 'logo',
      label: 'Logo',
      type: 'image',
      align: 'center',
      width: 100,
    },
    {
      key: 'name',
      label: 'Nombre del Producto',
      type: 'text',
      align: 'center',
      width: 100,
    },
    {
      key: 'description',
      label: 'Descripción',
      type: 'text',
      align: 'center',
      width: 100,
      popover: 'Descripción corta del producto',
    },
    {
      key: 'date_release',
      label: 'Fecha de liberación',
      type: 'date',
      align: 'start',
      width: 100,
      popover: 'Fecha de liberación del producto',
    },
    {
      key: 'date_revision',
      label: 'Fecha de restructuración',
      type: 'date',
      align: 'start',
      width: 100,
      popover:
        'Fecha de restructuración del producto 1 año después de la fecha de liberación',
    },
  ];
  listData: Product[] = [];
  filterListData: Product[] = [];
  selectedProduct: Product = new Product('', '', '', '', '', '');
  optionsItemPage: OtionsSelect[] = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '20', value: 20 },
  ];
  showModal: boolean = false;
  options: Option[] = [
    {
      id: 1,
      label: 'Eliminar',
    },
    {
      id: 2,
      label: 'Actualizar',
    },
  ];

  constructor(private router: Router, private productService: ProductService) {
    this.subscriptionProducts = this.productService.filterProducts$.subscribe(
      (value) => {
        this.listData = value;
        this.filterListData = value.slice(0, this.optionsItemPage[0].value);
      }
    );
    this.subscriptionSelectedProduct =
      this.productService.selectedProduct$.subscribe((value) => {
        this.selectedProduct = value;
      });
  }

  onHandleSelectItemPage(value: string | number) {
    this.filterListData = this.listData.slice(0, value as number);
  }

  onDeleteProduct(data: Data) {
    this.onHandleSelectProduct(data);
    this.openModal();
  }

  confirmDelete() {
    this.productService.deleteProduct();
    this.cancelModal();
  }

  onHandleSelectProduct(data: Data) {
    const product: Product = data as Product;
    this.productService.selectProduct(product);
  }

  onHandleUpdate(data: Data) {
    const productUpdate: Product = data as Product;
    this.onHandleSelectProduct(productUpdate);
    this.router.navigate(['/products/update']);
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  cancelModal() {
    const product = new Product('', '', '', '', '', '');
    this.onHandleSelectProduct(product);
    this.closeModal();
  }

  onControlEvents({ id, data }: DropdownEvent) {
    if (id === 1) this.onDeleteProduct(data);
    if (id === 2) this.onHandleUpdate(data);
  }

  ngOnDestroy(): void {
    this.subscriptionProducts.unsubscribe();
    this.subscriptionSelectedProduct.unsubscribe();
  }

  onSearch(search: string) {
    this.productService.searchProduct(search);
  }
}
