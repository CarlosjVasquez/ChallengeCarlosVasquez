import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InputComponent } from '@components/input/input.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Product } from '../../models/product';
import { ButtonComponent } from '@components/button/button.component';
import { ProductService } from '../../services/product.service';
import { debounceTime, filter, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'form-product',
  standalone: true,
  imports: [InputComponent, FormsModule, ButtonComponent, ReactiveFormsModule],
  templateUrl: './form-product.component.html',
  styleUrl: './form-product.component.scss',
})
export class FormProductComponent implements OnInit {
  @Input() edit: boolean = false;
  @Output() submitEventEmitter: EventEmitter<Product> = new EventEmitter();
  private readonly subscriptionSelectedProduct: Subscription;
  private selectedProduct: Product = new Product('', '', '', '', '', '');
  form!: FormGroup;

  constructor(
    private readonly productService: ProductService,
    private readonly _fb: FormBuilder
  ) {
    this.subscriptionSelectedProduct =
      this.productService.selectedProduct$.subscribe((value) => {
        this.selectedProduct = value;
      });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this._fb.group({
      id: new FormControl(this.selectedProduct.id, [Validators.minLength(3), Validators.maxLength(10), Validators.required]),
      name: new FormControl(this.selectedProduct.name),
      description: new FormControl(this.selectedProduct.description),
      logo: new FormControl(this.selectedProduct.logo),
      date_release: new FormControl(this.selectedProduct.date_release),
      date_revision: new FormControl(this.selectedProduct.date_revision),
    });
    this.form.get('id')?.valueChanges.pipe(
      debounceTime(500),
      filter(id => id?.length > 2),
      switchMap(id => this.productService.verificationID(id))
    ).subscribe({
      next: (result) => {
        const control = this.form.get('id');
        if (result) {
          const currentErrors = control?.errors ? { ...control.errors } : {};
          currentErrors['idValidation'] = true;
          control?.setErrors(currentErrors);
        } else if (control?.errors) {
          const currentErrors = { ...control.errors };
          delete currentErrors['idValidation'];
          control?.setErrors(Object.keys(currentErrors).length ? currentErrors : null);
        } else {
          control?.setErrors(null);
        }

      }

    });
  }

  onSubmit() {
    this.submitEventEmitter.emit(this.form.value);
  }

  getSearchErrors(form: NgForm) {
    const searchControl = form.controls['search'];
    return searchControl ? searchControl.errors : null;
  }

  currentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  calcdate_revision(): void {
    const date_release = new Date(this.form.value.date_release);
    date_release.setFullYear(date_release.getFullYear() + 1);
    this.form.patchValue({
      date_revision: date_release.toISOString().split('T')[0],
    });
  }

  formControlType(key: string) {
    return this.form.controls[key] as FormControl;
  }

  ngOnDestroy(): void {
    this.subscriptionSelectedProduct.unsubscribe();
  }
}
