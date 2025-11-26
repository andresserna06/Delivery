import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { create } from 'domain';
import { Restaurant } from 'src/app/models/restaurant.model';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-restaurant-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; // 1: view, 2: create, 3: update
  restaurant: Restaurant;
  theFormGroup: FormGroup;
  trySend: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private restaurantsService: RestaurantsService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.trySend = false;
    this.restaurant = { id: 0 };
    this.configFormGroup();
  }

  ngOnInit(): void {
    const currentUrl = this.activatedRoute.snapshot.url.join('/');

    if (currentUrl.includes('view')) this.mode = 1;
    else if (currentUrl.includes('create')) this.mode = 2;
    else if (currentUrl.includes('update')) this.mode = 3;

    if (this.activatedRoute.snapshot.params.id) {
      this.restaurant.id = this.activatedRoute.snapshot.params.id;
      this.getRestaurant(this.restaurant.id);
    }
  }

  configFormGroup() {
  this.theFormGroup = this.fb.group({
    id: [{ value: 0, disabled: true }],
    name: ['', [Validators.required, Validators.minLength(2)]],
    address: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10,}$/)]],
    created_at: [{ value: '', disabled: true }]
  });
}

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getRestaurant(id: number) {
    this.restaurantsService.view(id).subscribe({
      next: (response) => {
        this.restaurant = response;

        this.theFormGroup.patchValue({
          id: this.restaurant.id,
          name: this.restaurant.name,
          address: this.restaurant.address,
          email: this.restaurant.email,
          phone: this.restaurant.phone,
          created_at: this.restaurant.created_at
        });
      },
      error: (error) => {
        console.error('Error fetching restaurant:', error);
      }
    });
  }

  back() {
    this.router.navigate(['/restaurants/list']);
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

    const restaurantData = this.theFormGroup.getRawValue();

    this.restaurantsService.create(restaurantData).subscribe({
      next: () => {
        Swal.fire({
          title: 'Creado!',
          text: 'Restaurante creado correctamente.',
          icon: 'success',
        });
        this.router.navigate(['/restaurants/list']);
      },
      error: (error) => {
        console.error('Error creating restaurant:', error);
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

    const restaurantData = this.theFormGroup.getRawValue();

    this.restaurantsService.update(restaurantData).subscribe({
      next: () => {
        Swal.fire({
          title: 'Actualizado!',
          text: 'Restaurante actualizado correctamente.',
          icon: 'success',
        });
        this.router.navigate(['/restaurants/list']);
      },
      error: (error) => {
        console.error('Error updating restaurant:', error);
      }
    });
  }
}
