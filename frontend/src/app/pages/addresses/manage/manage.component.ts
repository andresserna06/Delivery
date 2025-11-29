import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Navigation } from '@angular/router';
import { Address } from 'src/app/models/address.model';
import { AddressService } from 'src/app/services/address.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-addresses',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageAddressesComponent implements OnInit {

  mode!: number; // 1=view, 2=create, 3=update
  address!: Address;
  theFormGroup!: FormGroup;
  trySend: boolean = false;

  orderId: number | null = null; // Si venimos desde crear orden

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private addressService: AddressService
  ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      this.orderId = +params['order_id']; // + para convertir a número
      console.log('Orden ID:', this.orderId); // verificar que esté correcto
    });
    const url = this.activatedRoute.snapshot.url.join('/');
    if (url.includes('view')) this.mode = 1;
    else if (url.includes('create')) this.mode = 2;
    else if (url.includes('update')) this.mode = 3;

    this.configFormGroup();

    // Recibir orderId si venimos de crear orden
    const navigation: Navigation | null = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.orderId) {
      this.orderId = navigation.extras.state.orderId;
    }

    const addressId = this.activatedRoute.snapshot.params['id'];
    if (addressId) {
      this.loadAddress(Number(addressId));
    }
  }

  configFormGroup() {
    this.theFormGroup = this.fb.group({
      id: [0, []],
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postal_code: ['', [Validators.required]],
      additional_info: [''],
      order_id: [this.orderId || 0] // Se asigna automáticamente si venimos de crear orden
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  loadAddress(id: number) {
    this.addressService.view(id).subscribe({
      next: res => {
        this.address = res;
        this.theFormGroup.patchValue(res);
      },
      error: err => {
        console.error(err);
        Swal.fire('Error', 'No se pudo cargar la dirección', 'error');
      }
    });
  }

  create() {
    this.trySend = true;

    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Complete los campos requeridos', 'error');
      return;
    }

    const data = { ...this.theFormGroup.value };
    delete data.id;

    this.addressService.create(data).subscribe({
      next: res => {
        this.address = res;

        Swal.fire('Creada', 'Dirección creada correctamente', 'success').then(() => {
          // Volvemos a ManageOrders pasando addressId
          if (this.orderId) {
            this.router.navigate(['/orders/list']);
          } else {
            this.router.navigate(['/addresses/view', res.id]);
          }
        });
      },
      error: err => Swal.fire('Error', 'No se pudo crear la dirección', 'error')
    });
  }

  update() {
    this.trySend = true;

    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Complete los campos requeridos', 'error');
      return;
    }

    this.addressService.update(this.theFormGroup.value).subscribe({
      next: res => {
        this.address = res;
        Swal.fire('Actualizada', 'Dirección actualizada correctamente', 'success').then(() => {
          this.router.navigate(['/orders/list']);
        });
      },
      error: err => Swal.fire('Error', 'No se pudo actualizar la dirección', 'error')
    });
  }

  delete(id: number) {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Desea eliminar esta dirección?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.addressService.delete(id).subscribe(() => {
          Swal.fire('Eliminada', 'Dirección eliminada correctamente', 'success');
          this.router.navigate(['/orders/list']);

        });
      }
    });
  }


  back() {
    this.router.navigate(['/orders/list']);
  }

}
