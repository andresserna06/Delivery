import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/models/order.model';
import { Customer } from 'src/app/models/customer.model';
import { Motorcycle } from 'src/app/models/motorcycle.model';
import { OrderService } from 'src/app/services/order.service';
import { CustomersService } from 'src/app/services/customers.service';
import { MotoService } from 'src/app/services/motorcycles.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.scss']
})
export class ListOrdersComponent implements OnInit {

  orders: Order[] = [];
  filteredOrders: Order[] = [];
  customers: Customer[] = [];
  motorcycles: Motorcycle[] = [];

  // Filtros
  filterType: string = 'none';
  filterValue: string = '';

  constructor(
    private service: OrderService,
    private customersService: CustomersService,
    private motoService: MotoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadOrders();
    this.loadCustomers();
    this.loadMotorcycles();
  }

  loadOrders(): void {
    this.service.list().subscribe(data => {
      this.orders = data;
      this.filteredOrders = data;
    });
  }

  loadCustomers(): void {
    this.customersService.list().subscribe(data => {
      this.customers = data;
    });
  }

  loadMotorcycles(): void {
    this.motoService.list().subscribe(data => {
      this.motorcycles = data;
    });
  }

  applyFilter(): void {
    if (this.filterType === 'none' || this.filterValue === '') {
      this.filteredOrders = this.orders;
      return;
    }

    this.filteredOrders = this.orders.filter(order => {
      switch (this.filterType) {
        case 'customer':
          return order.customer_id?.toString() === this.filterValue;

        case 'motorcycle':
          return order.motorcycle_id?.toString() === this.filterValue;

        case 'status':
          return order.status?.toLowerCase() === this.filterValue.toLowerCase();

        default:
          return true;
      }
    });
  }

  clearFilter(): void {
    this.filterType = 'none';
    this.filterValue = '';
    this.filteredOrders = this.orders;
  }

  edit(id: number): void {
    this.router.navigate(['/orders/update', id]);
  }

  create(): void {
    this.router.navigate(['/orders/create']);
  }

  delete(id: number): void {
    console.log("Delete order with id:", id);
    Swal.fire({
      title: 'Eliminar Orden',
      text: "¿Está seguro que quiere eliminar esta orden?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(id).subscribe(data => {
          Swal.fire(
            'Eliminado!',
            'Orden eliminada correctamente.',
            'success'
          );
          this.loadOrders();
        });
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'badge badge-warning';
      case 'completed':
        return 'badge badge-success';
      case 'cancelled':
        return 'badge badge-danger';
      case 'in_progress':
        return 'badge badge-info';
      default:
        return 'badge badge-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Pendiente';
      case 'completed':
        return 'Completada';
      case 'cancelled':
        return 'Cancelada';
      case 'in_progress':
        return 'En Progreso';
      default:
        return status;
    }
  }
}