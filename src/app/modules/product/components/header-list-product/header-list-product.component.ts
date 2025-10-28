import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonComponent } from '@components/button/button.component';
import { SearchComponent } from '@components/search/search.component';
import { Router } from '@angular/router';

@Component({
  selector: 'header-list-product',
  standalone: true,
  imports: [ButtonComponent, SearchComponent],
  templateUrl: './header-list-product.component.html',
  styleUrl: './header-list-product.component.scss',
})
export class HeaderListProductComponent {
  @Output() onInputEventemitter: EventEmitter<string> = new EventEmitter();
  constructor(private readonly router: Router) {}

  onAddProduct() {
    this.router.navigate(['/products/create']);
  }

  onHandleSubmit(search: string) {
    this.onInputEventemitter.emit(search);
  }
}
