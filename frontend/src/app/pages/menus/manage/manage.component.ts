import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Menu } from 'src/app/models/menu.model';
import { Product } from 'src/app/models/product.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { MenusService } from 'src/app/services/menus.service';
import { ProductsService } from 'src/app/services/products.service';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; // 1: view, 2: create, 3: update
  menu: Menu;
  theFormGroup: FormGroup;
  trySend: boolean;
  products: Product[];
  restaurants: Restaurant[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private menusService: MenusService,
    private router: Router,
    private fb: FormBuilder,
    private productsService: ProductsService,
    private restaurantsService: RestaurantsService
  ) {
    this.products = [];
    this.restaurants = [];
    this.trySend = false;
    this.mode = 1;
    this.menu = {
      id: 0
    };
    this.configFormGroup();
  }

  onProductChange(event: any) {
    const selectedProductId = event.target.value;

    const selectedProduct = this.products.find(p => p.id == selectedProductId);

    if (selectedProduct) {
      this.theFormGroup.patchValue({
        price: selectedProduct.price
      });

      // También actualizamos el objeto menu (si lo usas)
      if (this.menu) {
        this.menu.price = selectedProduct.price;
      }
    }
  }
  ngOnInit(): void {
    this.productsList();
    this.restaurantsList();
    const currentUrl = this.activatedRoute.snapshot.url.join('/');

    if (currentUrl.includes('view')) this.mode = 1;
    else if (currentUrl.includes('create')) this.mode = 2;
    else if (currentUrl.includes('update')) this.mode = 3;

    if (this.activatedRoute.snapshot.params.id) {
      this.menu.id = this.activatedRoute.snapshot.params.id;
      this.getMenu(this.menu.id);
    }

  }

  productsList() {
    this.productsService.list().subscribe(data => {
      this.products = data;
    });
  }
  restaurantsList() {
    this.restaurantsService.list().subscribe(data => {
      this.restaurants = data;
    });
  }

  configFormGroup() {
    this.theFormGroup = this.fb.group({
      id: [{ value: 0, disabled: true }],
      price: [0, [Validators.required, Validators.min(0)]],
      availability: [true, Validators.required],
      product_id: [null, Validators.required],
      restaurant_id: [null, Validators.required],
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getMenu(id: number) {
    this.menusService.view(id).subscribe({
      next: (response) => {
        this.menu = response;

        this.theFormGroup.patchValue({
          id: this.menu.id,
          price: this.menu.price,
          availability: this.menu.availability,
          product_id: this.menu.product.id,
          restaurant_id: this.menu.restaurant.id
        });
      },
      error: (error) => {
        console.error('Error fetching menu:', error);
      }
    });
  }

  back() {
    this.router.navigate(['/menus/list']);
  }

  create() {
    this.trySend = true;

    if (this.theFormGroup.invalid) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, completa todos los campos requeridos.',
        icon: 'error',
      });
      return;
    }

    const menuData = this.theFormGroup.getRawValue();
    console.log('Payload enviado:', menuData);

    this.menusService.create(menuData).subscribe({
      next: () => {
        Swal.fire({
          title: 'Creado!',
          text: 'Menú creado correctamente.',
          icon: 'success',
        });
        this.router.navigate(['/menus/list']);
      },
      error: (error) => {
        console.error('Error creating menu:', error);
      }
    });
  }

  update() {
    this.trySend = true;

    if (this.theFormGroup.invalid) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, completa todos los campos requeridos.',
        icon: 'error',
      });
      return;
    }

    const menuData = this.theFormGroup.getRawValue();

    this.menusService.update(menuData).subscribe({
      next: () => {
        Swal.fire({
          title: 'Actualizado!',
          text: 'Menú actualizado correctamente.',
          icon: 'success',
        });
        this.router.navigate(['/menus/list']);
      },
      error: (error) => {
        console.error('Error updating menu:', error);
      }
    });
  }
}
