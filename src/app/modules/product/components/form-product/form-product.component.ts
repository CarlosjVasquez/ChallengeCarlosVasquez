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
  @Input() edit!: boolean;
  @Input() product!: Product | null;
  @Output() submitEventEmitter: EventEmitter<Product> = new EventEmitter();
  form!: FormGroup;

  constructor(
    private readonly productService: ProductService,
    private readonly _fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this._fb.group({
      id: new FormControl(this.product?.id, [
        Validators.minLength(3),
        Validators.maxLength(10),
        Validators.required,
      ]),
      name: new FormControl(this.product?.name),
      description: new FormControl(this.product?.description),
      logo: new FormControl(this.product?.logo),
      date_release: new FormControl(this.product?.date_release),
      date_revision: new FormControl(this.product?.date_revision),
    });
    if (this.edit) this.form.get('id')?.disable();
    this.form
      .get('id')
      ?.valueChanges.pipe(
        debounceTime(500),
        filter((id) => id?.length > 2),
        switchMap((id) => this.productService.verificationID(id))
      )
      .subscribe({
        next: (result) => {
          const control = this.form.get('id');
          if (result) {
            const currentErrors = control?.errors ? { ...control.errors } : {};
            currentErrors['idValidation'] = true;
            control?.setErrors(currentErrors);
          } else if (control?.errors) {
            const currentErrors = { ...control.errors };
            delete currentErrors['idValidation'];
            control?.setErrors(
              Object.keys(currentErrors).length ? currentErrors : null
            );
          } else {
            control?.setErrors(null);
          }
        },
      });
  }

  onSubmit() {
    this.submitEventEmitter.emit({
      id: this.form.get('id')?.value,
      ...this.form.value,
    });
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
}
