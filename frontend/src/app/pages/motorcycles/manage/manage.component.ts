import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Motorcycle } from 'src/app/models/motorcycle.model';
import { MotorcyclesService } from 'src/app/services/motorcycles.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-motorcycle-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; // 1: view, 2: create, 3: update
  motorcycle: Motorcycle;
  theFormGroup: FormGroup;
  trySend: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private motorcyclesService: MotorcyclesService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.trySend = false;
    this.motorcycle = { id: 0, license_plate: '', brand: '', year: 0, status: '' };
    this.configFormGroup();
  }

  ngOnInit(): void {
    const currentUrl = this.activatedRoute.snapshot.url.join('/');

    if (currentUrl.includes('view')) this.mode = 1;
    else if (currentUrl.includes('create')) this.mode = 2;
    else if (currentUrl.includes('update')) this.mode = 3;

    if (this.activatedRoute.snapshot.params.id) {
      this.motorcycle.id = this.activatedRoute.snapshot.params.id;
      this.getMotorcycle(this.motorcycle.id);
    }
  }

  configFormGroup() {
    this.theFormGroup = this.fb.group({
      id: [{ value: 0, disabled: true }],
      license_plate: ['', [Validators.required, Validators.minLength(5)]],
      brand: ['', [Validators.required]],
      year: [0, [Validators.required, Validators.min(1900)]],
      status: ['', [Validators.required]]
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getMotorcycle(id: number) {
    this.motorcyclesService.view(id).subscribe({
      next: (response) => {
        this.motorcycle = response;

        this.theFormGroup.patchValue({
          id: this.motorcycle.id,
          license_plate: this.motorcycle.license_plate,
          brand: this.motorcycle.brand,
          year: this.motorcycle.year,
          status: this.motorcycle.status
        });
      },
      error: (error) => {
        console.error('Error fetching motorcycle:', error);
      }
    });
  }

  back() {
    this.router.navigate(['/motorcycles/list']);
  }

  create() {
    this.trySend = true;

    if (this.theFormGroup.invalid) {
      Swal.fire({
        title: 'Error!',
        text: 'Debes completar todos los campos.',
        icon: 'error',
      });
      return;
    }

    const motorcycleData = this.theFormGroup.getRawValue();

    this.motorcyclesService.create(motorcycleData).subscribe({
      next: () => {
        Swal.fire({
          title: 'Creada!',
          text: 'Motocicleta creada correctamente.',
          icon: 'success',
        });
        this.router.navigate(['/motorcycles/list']);
      },
      error: (error) => {
        console.error('Error creating motorcycle:', error);
      }
    });
  }

  update() {
    this.trySend = true;

    if (this.theFormGroup.invalid) {
      Swal.fire({
        title: 'Error!',
        text: 'Debes completar todos los campos.',
        icon: 'error',
      });
      return;
    }

    const motorcycleData = this.theFormGroup.getRawValue();

    this.motorcyclesService.update(motorcycleData).subscribe({
      next: () => {
        Swal.fire({
          title: 'Actualizada!',
          text: 'Motocicleta actualizada correctamente.',
          icon: 'success',
        });
        this.router.navigate(['/motorcycles/list']);
      },
      error: (error) => {
        console.error('Error updating motorcycle:', error);
      }
    });
  }
}
