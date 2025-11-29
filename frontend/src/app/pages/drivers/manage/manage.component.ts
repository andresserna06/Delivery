import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DriversService } from 'src/app/services/drivers.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-drivers-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  theFormGroup!: FormGroup;
  mode: number = 2; // 1 = detalle, 2 = crear, 3 = editar
  trySend = false;
  id!: number;

  constructor(
    private fb: FormBuilder,
    private driversService: DriversService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    const url = this.route.snapshot.url.map(seg => seg.path);

    if (url.includes('create')) this.mode = 2;
    else if (url.includes('update')) this.mode = 3;
    else if (url.includes('detail')) this.mode = 1;

    this.setupForm();

    if (this.mode !== 2) {
      this.id = Number(this.route.snapshot.paramMap.get('id'));
      this.loadDriver();
    }
  }

  setupForm() {
    this.theFormGroup = this.fb.group({
      id: [{ value: '', disabled: true }],
      name: ['', Validators.required],
      license_number: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      status: ['', Validators.required],
      created_at: [{ value: '', disabled: true }]
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  loadDriver() {
    this.driversService.view(this.id).subscribe({
      next: (data) => {
        this.theFormGroup.patchValue(data);
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cargar el conductor', 'error');
      }
    });
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid) return;

    const newDriver = this.theFormGroup.value;

    this.driversService.create(newDriver).subscribe({
      next: () => {
        Swal.fire('Creado', 'Conductor registrado exitosamente', 'success');
        this.router.navigate(['/drivers/list']);
      },
      error: () => {
        Swal.fire('Error', 'No se pudo crear el conductor', 'error');
      }
    });
  }

  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid) return;

    const updatedDriver = this.theFormGroup.getRawValue(); // incluye id

    this.driversService.update(updatedDriver).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'Conductor modificado exitosamente', 'success');
        this.router.navigate(['/drivers/list']);
      },
      error: () => {
        Swal.fire('Error', 'No se pudo actualizar el conductor', 'error');
      }
    });
  }

  back() {
    this.router.navigate(['/drivers/list']);
  }
}
