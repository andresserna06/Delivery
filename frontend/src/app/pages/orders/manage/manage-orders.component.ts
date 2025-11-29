import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/app/models/order.model';
import { Customer } from 'src/app/models/customer.model';
import { Motorcycle } from 'src/app/models/motorcycle.model';
import { OrderService } from 'src/app/services/order.service';
import { CustomersService } from 'src/app/services/customers.service';
import { MenusService } from 'src/app/services/menus.service'; // importa tu servicio de menús
import { MotoService } from 'src/app/services/motorcycles.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.scss']
})
export class ManageOrdersComponent implements OnInit {
  mode: number; // 1: view, 2: create, 3: update
  order: Order;
  theFormGroup: FormGroup;
  trySend: boolean;

  // Listas para los selects
  customers: Customer[] = [];
  motorcycles: Motorcycle[] = [];
  menus: any[] = []; // Aquí cargarías los menús disponibles

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private customersService: CustomersService,
    private menusService: MenusService,
    private motoService: MotoService,
    private router: Router,
    private theFormBuilder: FormBuilder
  ) {
    this.trySend = false;
    this.order = new Order();
    this.configFormGroup();
  }

  ngOnInit(): void {
    const currentUrl = this.activatedRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    // Cargar datos necesarios para los selects
    this.loadCustomers();
    this.loadMotorcycles();
    this.loadMenus();

    if (this.activatedRoute.snapshot.params.id) {
      this.order.id = this.activatedRoute.snapshot.params.id;
      this.getOrder(this.order.id);
    }
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      id: [null, []],
      customer_id: [0, [Validators.required, Validators.min(1)]],
      menu_id: [0, [Validators.required, Validators.min(1)]],
      motorcycle_id: [0, [Validators.required, Validators.min(1)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      status: ['pending', [Validators.required]],
      total_price: [0, [Validators.required, Validators.min(0)]]
    });

    // Listener para calcular el total automáticamente
    this.theFormGroup.get('menu_id')?.valueChanges.subscribe(() => {
      this.calculateTotal();
    });
    this.theFormGroup.get('quantity')?.valueChanges.subscribe(() => {
      this.calculateTotal();
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  loadCustomers(): void {
    this.customersService.list().subscribe({
      next: (data) => {
        this.customers = data;
      },
      error: (error) => {
        console.error('Error loading customers:', error);
      }
    });
  }

  loadMotorcycles(): void {
    this.motoService.list().subscribe({
      next: (data) => {
        this.motorcycles = data;
      },
      error: (error) => {
        console.error('Error loading motorcycles:', error);
      }
    });
  }

  loadMenus(): void {
    this.menusService.list().subscribe({
      next: (data) => {
        this.menus = data;
      },
      error: (error) => {
        console.error('Error loading menus:', error);
      }
    });
  }
  calculateTotal(): void {
    const menuId = this.theFormGroup.get('menu_id')?.value;
    const quantity = this.theFormGroup.get('quantity')?.value;

    if (menuId && quantity) {
      const selectedMenu = this.menus.find(m => m.id === parseInt(menuId));
      if (selectedMenu) {
        const total = selectedMenu.price * quantity;
        this.theFormGroup.patchValue({ total_price: total });
      }
    }
  }

  getOrder(id: number) {
    this.orderService.view(id).subscribe({
      next: (response) => {
        this.order = response;
        this.theFormGroup.patchValue({
          id: this.order.id,
          customer_id: this.order.customer_id,
          menu_id: this.order.menu_id,
          motorcycle_id: this.order.motorcycle_id,
          quantity: this.order.quantity,
          status: this.order.status,
          total_price: this.order.total_price
        });
        console.log('Order fetched successfully:', this.order);
      },
      error: (error) => {
        console.error('Error fetching order:', error);
        Swal.fire({
          title: 'Error!',
          text: 'No se pudo cargar la orden.',
          icon: 'error',
        });
      }
    });
  }

  back() {
    this.router.navigate(['/orders/list']);
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, complete todos los campos requeridos.',
        icon: 'error',
      });
      return;
    }

    this.orderService.create(this.theFormGroup.value).subscribe({
      next: (order) => {
        console.log('Order created successfully:', order);
        Swal.fire({
          title: 'Creado!',
          text: 'Orden creada correctamente.',
          icon: 'success',
        });
        this.router.navigate(['/orders/list']);
      },
      error: (error) => {
        console.error('Error creating order:', error);
        Swal.fire({
          title: 'Error!',
          text: 'No se pudo crear la orden.',
          icon: 'error',
        });
      }
    });
  }

  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, complete todos los campos requeridos.',
        icon: 'error',
      });
      return;
    }

    this.orderService.update(this.theFormGroup.value).subscribe({
      next: (order) => {
        console.log('Order updated successfully:', order);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Orden actualizada correctamente.',
          icon: 'success',
        });
        this.router.navigate(['/orders/list']);
      },
      error: (error) => {
        console.error('Error updating order:', error);
        Swal.fire({
          title: 'Error!',
          text: 'No se pudo actualizar la orden.',
          icon: 'error',
        });
      }
    });
  }

  getCustomerName(customerId: number): string {
    const customer = this.customers.find(c => c.id === customerId);
    return customer ? `${customer.name} (${customer.email})` : '';
  }

  getMotorcycleName(motorcycleId: number): string {
    const motorcycle = this.motorcycles.find(m => m.id === motorcycleId);
    return motorcycle ? `ID: ${motorcycle.id} - ${motorcycle.brand}` : '';
  }
}