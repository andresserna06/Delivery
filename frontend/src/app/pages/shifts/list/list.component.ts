import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Shift } from 'src/app/models/shift.model';
import { ShiftsService } from 'src/app/services/shifts.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  shifts: Shift[] = [];
  loading: boolean = false;   // 🔥 Necesario para el HTML
  error: string = '';         // 🔥 Necesario para el HTML

  constructor(
    private shiftsService: ShiftsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadShifts();
  }

  loadShifts(): void {
    this.loading = true;
    this.error = '';

    this.shiftsService.list().subscribe({
      next: (data) => {
        this.shifts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar turnos:', err);
        this.error = 'No se pudieron cargar los turnos';
        this.loading = false;
        Swal.fire('Error', this.error, 'error');
      }
    });
  }

  create(): void {             // 🔥 Necesario para el botón "Crear turno"
    this.router.navigate(['/shifts/create']);
  }

  update(id: number | undefined): void {   // 🔥 Para el botón editar
    if (!id) return;
    this.router.navigate(['/shifts/update', id]);
  }

  delete(id: number | undefined): void {
    if (!id) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.shiftsService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El turno ha sido eliminado', 'success');
            this.loadShifts();
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire('Error', 'No se pudo eliminar el turno', 'error');
          }
        });
      }
    });
  }
}
