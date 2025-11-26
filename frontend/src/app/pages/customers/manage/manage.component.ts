import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from 'src/app/models/customer.model';
import { CustomersService } from 'src/app/services/customers.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; // 1: view, 2: create, 3: update
  customer: Customer;
  theFormGroup: FormGroup;
  trySend: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private customersService: CustomersService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.trySend = false;
    this.customer = { id: 0 };
    this.configFormGroup();
  }

  ngOnInit(): void {
    const currentUrl = this.activatedRoute.snapshot.url.join('/');

    if (currentUrl.includes('view')) this.mode = 1;
    else if (currentUrl.includes('create')) this.mode = 2;
    else if (currentUrl.includes('update')) this.mode = 3;

    if (this.activatedRoute.snapshot.params.id) {
      this.customer.id = this.activatedRoute.snapshot.params.id;
      this.getCustomer(this.customer.id);
    }
  }

  configFormGroup() {
    this.theFormGroup = this.fb.group({
      id: [{ value: 0, disabled: true }],
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getCustomer(id: number) {
    this.customersService.view(id).subscribe({
      next: (response) => {
        this.customer = response;

        this.theFormGroup.patchValue({
          id: this.customer.id,
          name: this.customer.name,
          email: this.customer.email,
          phone: this.customer.phone
        });
      },
      error: (error) => {
        console.error('Error fetching customer:', error);
      }
    });
  }

  back() {
    this.router.navigate(['/customers/list']);
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

    const customerData = this.theFormGroup.getRawValue();

    this.customersService.create(customerData).subscribe({
      next: () => {
        Swal.fire({
          title: 'Creado!',
          text: 'Cliente creado correctamente.',
          icon: 'success',
        });
        this.router.navigate(['/customers/list']);
      },
      error: (error) => {
        console.error('Error creating customer:', error);
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

    const customerData = this.theFormGroup.getRawValue();

    this.customersService.update(customerData).subscribe({
      next: () => {
        Swal.fire({
          title: 'Actualizado!',
          text: 'Cliente actualizado correctamente.',
          icon: 'success',
        });
        this.router.navigate(['/customers/list']);
      },
      error: (error) => {
        console.error('Error updating customer:', error);
      }
    });
  }
}
