import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ShiftsService } from 'src/app/services/shifts.service';
import { DriversService } from 'src/app/services/drivers.service';
import { MotorcyclesService } from 'src/app/services/motorcycles.service';
import { Shift } from 'src/app/models/shift.model';
import { Driver } from 'src/app/models/driver.model';
import { Motorcycle } from 'src/app/models/motorcycle.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  form!: FormGroup;
  shiftId: number | null = null;
  drivers: Driver[] = [];
  motorcycles: Motorcycle[] = [];

  constructor(
    private fb: FormBuilder,
    private shiftsService: ShiftsService,
    private driversService: DriversService,
    private motorcyclesService: MotorcyclesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadDrivers();
    this.loadMotorcycles();
    
    // Verificar si estamos en modo edición
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.shiftId = +params['id'];
        this.loadShift(this.shiftId);
      }
    });
  }

  buildForm(): void {
    this.form = this.fb.group({
      driver_id: ['', Validators.required],
      motorcycle_id: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: [''],
      status: ['active', Validators.required]
    });
  }

  loadDrivers(): void {
    this.driversService.list().subscribe({
      next: (data) => {
        console.log('✅ Drivers cargados:', data);
        this.drivers = data;
      },
      error: (err) => {
        console.error('❌ Error al cargar drivers:', err);
        Swal.fire('Error', 'No se pudieron cargar los conductores', 'error');
      }
    });
  }

  loadMotorcycles(): void {
    this.motorcyclesService.list().subscribe({
      next: (data) => {
        console.log('✅ Motocicletas cargadas:', data);
        console.log('Primera moto:', data[0]);
        this.motorcycles = data;
      },
      error: (err) => {
        console.error('❌ Error al cargar motocicletas:', err);
        Swal.fire('Error', 'No se pudieron cargar las motocicletas', 'error');
      }
    });
  }

  loadShift(id: number): void {
    this.shiftsService.view(id).subscribe({
      next: (shift) => {
        console.log('Shift cargado:', shift);
        // Convertir las fechas al formato datetime-local
        const startTime = this.formatDateTimeLocal(shift.start_time);
        const endTime = shift.end_time ? this.formatDateTimeLocal(shift.end_time) : '';

        this.form.patchValue({
          driver_id: shift.driver_id,
          motorcycle_id: shift.motorcycle_id,
          start_time: startTime,
          end_time: endTime,
          status: shift.status
        });
      },
      error: (err) => {
        console.error('Error al cargar turno:', err);
        Swal.fire('Error', 'No se pudo cargar el turno', 'error');
        this.router.navigate(['/admin/shifts/list']);
      }
    });
  }

  formatDateTimeLocal(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  save(): void {
    if (this.form.invalid) {
      Swal.fire('Formulario inválido', 'Por favor completa todos los campos requeridos', 'warning');
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    const shiftData: Shift = {
      ...this.form.value,
      driver_id: +this.form.value.driver_id,
      motorcycle_id: +this.form.value.motorcycle_id
    };

    this.router.navigate(['/shifts/list']);

    // Convertir end_time a null si está vacío
    if (!shiftData.end_time || shiftData.end_time === '') {
      shiftData.end_time = null;
    }

    console.log('Datos a enviar:', shiftData);

    if (this.shiftId) {
      // Actualizar
      shiftData.id = this.shiftId;
      this.shiftsService.update(shiftData).subscribe({
        next: () => {
          Swal.fire('Actualizado', 'El turno ha sido actualizado exitosamente', 'success');
          this.router.navigate(['/shifts/list']);
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          Swal.fire('Error', 'No se pudo actualizar el turno', 'error');
        }
      });
    } else {
      // Crear
      this.shiftsService.create(shiftData).subscribe({
        next: () => {
          Swal.fire('Creado', 'El turno ha sido creado exitosamente', 'success');
          this.router.navigate(['/shifts/list']);
        },
        error: (err) => {
          console.error('Error al crear:', err);
          Swal.fire('Error', 'No se pudo crear el turno', 'error');
        }
      });
    }
  }
}