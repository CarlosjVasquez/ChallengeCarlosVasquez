import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from '@components/button/button.component';
import { SearchComponent } from '@components/search/search.component';

import { HeaderListProductComponent } from './header-list-product.component';

describe('HeaderListProductComponent', () => {
  let component: HeaderListProductComponent;
  let fixture: ComponentFixture<HeaderListProductComponent>;
  let router: Router;

  beforeEach(async () => {
    const routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [HeaderListProductComponent, ButtonComponent, SearchComponent],
      providers: [{ provide: Router, useValue: routerMock }],
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderListProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render search component', () => {
    const searchElement = fixture.debugElement.query(
      By.directive(SearchComponent)
    );
    expect(searchElement).toBeTruthy();
  });

  it('should render button component', () => {
    const buttonElement = fixture.debugElement.query(
      By.directive(ButtonComponent)
    );
    expect(buttonElement).toBeTruthy();
  });

  it('should navigate to /products/create on add product', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.onAddProduct();
    expect(navigateSpy).toHaveBeenCalledWith(['/products/create']);
  });

  it('should emit search input event when onHandleSubmit is called', () => {
    const searchValue = 'test search';
    jest.spyOn(component.onInputEventemitter, 'emit');

    component.onHandleSubmit(searchValue);

    expect(component.onInputEventemitter.emit).toHaveBeenCalledWith(
      searchValue
    );
  });

  it('should call onAddProduct when button is clicked', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    const buttonElement = fixture.debugElement.query(
      By.directive(ButtonComponent)
    );
    buttonElement.triggerEventHandler('onEventClick', null);

    expect(navigateSpy).toHaveBeenCalledWith(['/products/create']);
  });

  it('should call onHandleSubmit when search component emits', () => {
    const searchValue = 'search term';
    jest.spyOn(component.onInputEventemitter, 'emit');

    const searchElement = fixture.debugElement.query(
      By.directive(SearchComponent)
    );
    searchElement.triggerEventHandler('onInputEventemitter', searchValue);

    expect(component.onInputEventemitter.emit).toHaveBeenCalledWith(
      searchValue
    );
  });
});
