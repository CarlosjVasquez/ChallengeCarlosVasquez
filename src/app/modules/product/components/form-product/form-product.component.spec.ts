import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormProductComponent } from './form-product.component';
import { ReactiveFormsModule, FormsModule, NgForm } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { of } from 'rxjs';
import { ButtonComponent } from '@components/button/button.component';
import { InputComponent } from '@components/input/input.component';
import { By } from '@angular/platform-browser';
import { Product } from '../../models/product';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('FormProductComponent', () => {
  let component: FormProductComponent;
  let fixture: ComponentFixture<FormProductComponent>;
  let productService: ProductService;

  beforeEach(async () => {
    const productServiceMock = {
      selectedProduct$: of(
        new Product(
          '1',
          'Product 1',
          'Description',
          'logo.png',
          '2023-01-01',
          '2024-01-01'
        )
      ),
      verificationID: jest.fn().mockReturnValue(of(false)),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        InputComponent,
        ButtonComponent,
        FormProductComponent,
      ],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    productService = TestBed.inject(ProductService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should initialize form with product input data', () => {
    component.product = new Product(
      '1',
      'Product 1',
      'Description',
      'logo.png',
      '2023-01-01',
      '2024-01-01'
    );
    component.ngOnInit();

    expect(component.form.value).toEqual({
      id: '1',
      name: 'Product 1',
      description: 'Description',
      logo: 'logo.png',
      date_release: '2023-01-01',
      date_revision: '2024-01-01',
    });
  });

  test('should emit submit event with form data on submit', () => {
    jest.spyOn(component.submitEventEmitter, 'emit');
    component.onSubmit();
    expect(component.submitEventEmitter.emit).toHaveBeenCalledWith(
      component.form.value
    );
  });

  test('should validate ID field with verificationID service', fakeAsync(() => {
    const idControl = component.form.get('id');
    idControl?.setValue('valid-id');

    tick(500);

    fixture.detectChanges();

    expect(productService.verificationID).toHaveBeenCalledWith('valid-id');
  }));

  test('should return search control errors from the form', () => {
    const mockForm = {
      controls: {
        search: {
          errors: { required: true },
        },
      },
    } as unknown as NgForm;
    const errors = component.getSearchErrors(mockForm);
    expect(errors).toEqual({ required: true });
  });

  test('should return null if search control is not present in the form', () => {
    const mockForm = {
      controls: {},
    } as unknown as NgForm;
    const errors = component.getSearchErrors(mockForm);
    expect(errors).toBeNull();
  });

  test('should return the current date in YYYY-MM-DD format', () => {
    const currentDate = new Date().toISOString().split('T')[0];
    expect(component.currentDate()).toEqual(currentDate);
  });

  test('should calculate date_revision as one year after date_release', () => {
    component.form.patchValue({ date_release: '2023-01-01' });
    component.calcdate_revision();
    expect(component.form.value.date_revision).toBe('2024-01-01');
  });

  test('should disable id field when edit is true', () => {
    component.edit = true;
    component.product = new Product(
      '1',
      'Product 1',
      'Description',
      'logo.png',
      '2023-01-01',
      '2024-01-01'
    );
    component.ngOnInit();

    expect(component.form.get('id')?.disabled).toBe(true);
  });

  test('should enable id field when edit is false', () => {
    component.edit = false;
    component.product = new Product(
      '1',
      'Product 1',
      'Description',
      'logo.png',
      '2023-01-01',
      '2024-01-01'
    );
    component.ngOnInit();

    expect(component.form.get('id')?.disabled).toBe(false);
  });

  test('should initialize form with null product', () => {
    component.edit = false;
    component.product = null;
    component.ngOnInit();

    expect(component.form.value).toEqual({
      id: null,
      name: null,
      description: null,
      logo: null,
      date_release: null,
      date_revision: null,
    });
  });

  test('should set idValidation error when verificationID returns true', fakeAsync(() => {
    jest.spyOn(productService, 'verificationID').mockReturnValue(of(true));
    const idControl = component.form.get('id');
    idControl?.setValue('existing-id');

    tick(500);
    fixture.detectChanges();

    expect(idControl?.errors?.['idValidation']).toBe(true);
  }));

  test('should clear idValidation error when verificationID returns false', fakeAsync(() => {
    jest.spyOn(productService, 'verificationID').mockReturnValue(of(false));
    const idControl = component.form.get('id');
    idControl?.setValue('new-id');

    tick(500);
    fixture.detectChanges();

    expect(idControl?.errors?.['idValidation']).toBeUndefined();
  }));

  test('should return form control for given key', () => {
    const control = component.formControlType('id');
    expect(control).toBe(component.form.get('id'));
  });

  test('should emit submit event with correct data structure', () => {
    component.form.patchValue({
      id: 'test-id',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'test-logo.png',
      date_release: '2023-01-01',
      date_revision: '2024-01-01',
    });

    jest.spyOn(component.submitEventEmitter, 'emit');
    component.onSubmit();

    expect(component.submitEventEmitter.emit).toHaveBeenCalledWith({
      id: 'test-id',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'test-logo.png',
      date_release: '2023-01-01',
      date_revision: '2024-01-01',
    });
  });

  test('should render input components', () => {
    const inputs = fixture.debugElement.queryAll(By.directive(InputComponent));
    expect(inputs.length).toBe(6);
  });

  test('should render button components', () => {
    const buttons = fixture.debugElement.queryAll(
      By.directive(ButtonComponent)
    );
    expect(buttons.length).toBe(2);
  });

  test('should handle errors when verificationID service fails', fakeAsync(() => {
    jest.spyOn(productService, 'verificationID').mockReturnValue(of(true));
    const idControl = component.form.get('id');
    idControl?.setValue('error-id');

    tick(500);
    fixture.detectChanges();

    expect(idControl?.errors).toBeTruthy();
  }));
});
