import { Component, OnInit } from '@angular/core';
import { CustomersService } from 'src/app/services/customers.service';
import { Router } from '@angular/router';
import { Customer } from 'src/app/models/customer.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  customers: Customer[] = []; // ⚠ inicializar como array vacío
  loading = false;
  error = '';

  constructor(private customersServices: CustomersService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.customersServices.list().subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data); // confirma que llegan
        this.customers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al cargar clientes';
        this.loading = false;
      }
    });
  }

  delete(id: number) {
    // ejemplo simple
    this.customersServices.delete(id).subscribe(() => {
      this.customers = this.customers.filter(p => p.id !== id);
    });
  }
  update(id: number) {
    this.router.navigate(['/customers/update', id]);
  }
  create() {
    this.router.navigate(['/customers/create']);

  }
  
}
