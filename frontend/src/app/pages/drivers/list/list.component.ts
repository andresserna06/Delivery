import { Component, OnInit } from '@angular/core';
import { Driver } from 'src/app/models/driver.model';
import { DriversService } from 'src/app/services/drivers.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-drivers-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  drivers: Driver[] = [];   // Lista inicial vacía
  loading = false;
  error = '';

  constructor(
    private driversService: DriversService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.driversService.list().subscribe({
      next: (data) => {
        console.log('Drivers recibidos:', data);
        this.drivers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al cargar los drivers';
        this.loading = false;
      }
    });
  }

  delete(id: number) {

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {

      if (result.isConfirmed) {

        this.driversService.delete(id).subscribe({
          next: () => {
            this.drivers = this.drivers.filter(d => d.id !== id);

            Swal.fire({
              title: '¡Eliminado!',
              text: 'El conductor ha sido eliminado.',
              icon: 'success',
              timer: 1800
            });
          },
          error: () => {
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar el conductor.',
              icon: 'error'
            });
          }
        });
      }

    });
  }

  update(id: number) {
    this.router.navigate(['/drivers/update', id]);
  }

  create() {
    this.router.navigate(['/drivers/create']);
  }
}
