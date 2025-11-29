import { Component, OnInit } from '@angular/core';
import { Motorcycle } from 'src/app/models/motorcycle.model';
import { MotorcyclesService } from 'src/app/services/motorcycles.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-motorcycles-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  motorcycles: Motorcycle[] = [];  // lista inicial vacía
  loading = false;
  error = '';

  constructor(
    private motorcyclesService: MotorcyclesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.motorcyclesService.list().subscribe({
      next: (data) => {
        console.log('Motocicletas recibidas:', data);
        this.motorcycles = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al cargar las motocicletas';
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
        this.motorcyclesService.delete(id).subscribe({
          next: () => {
            // eliminar de la lista
            this.motorcycles = this.motorcycles.filter(m => m.id !== id);

            Swal.fire({
              title: '¡Eliminado!',
              text: 'La motocicleta ha sido eliminada.',
              icon: 'success',
              timer: 1800
            });
          },
          error: () => {
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar la motocicleta.',
              icon: 'error'
            });
          }
        });
      }

    });
  }

  update(id: number) {
    this.router.navigate(['/motorcycles/update', id]);
  }

  create() {
    this.router.navigate(['/motorcycles/create']);
  }

  issues(id: number) {
    this.router.navigate(['/motorcycles/issues', id]);
  }
}



