import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoService } from 'src/app/services/photo.service';
import { IssueService } from 'src/app/services/issue.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-photos',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManagePhotosComponent implements OnInit {

  issueId!: number;
  motoId!: number;
  mode!: 'view' | 'create';

  issue: any;
  photoForm!: FormGroup;   // <-- FORMULARIO REACTIVO

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private issueService: IssueService,
    private photoService: PhotoService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    // 1. Obtener los parámetros de la ruta
    this.issueId = Number(this.activatedRoute.snapshot.paramMap.get('issueId'));
    this.motoId = Number(this.activatedRoute.snapshot.paramMap.get('motoId'));

    // 2. Determinar el modo según la URL
    const url = this.router.url;
    this.mode = url.includes('create') ? 'create' : 'view';

    // 3. Crear formulario reactivo
    this.photoForm = this.fb.group({
      caption: ['', Validators.required],
      image_url: ['', Validators.required],
      issue_id: [this.issueId, Validators.required]
    });

    // 4. Cargar issue solo si estamos en modo view
    if (this.mode === 'view') {
      this.loadIssue();
    }
  }


  loadIssue() {
    this.issueService.view(this.issueId).subscribe({
      next: issue => {
        this.issue = issue;
        this.motoId = issue.motorcycle_id;
      },
      error: err => console.error(err)
    });
  }

  createPhoto() {
    if (this.photoForm.invalid) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'warning');
      return;
    }

    this.photoService.create(this.photoForm.value).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Foto creada correctamente', 'success');
        this.router.navigate(['/photos', 'issue', this.issueId, 'moto', this.motoId]);
      },
      error: err => console.error(err)
    });
  }

  deletePhoto(photoId: number) {
    Swal.fire({
      title: '¿Eliminar foto?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.photoService.delete(photoId).subscribe({
          next: () => {
            Swal.fire('Eliminada', 'Foto eliminada correctamente', 'success');
            this.loadIssue();
          },
          error: err => console.error(err)
        });
      }
    });
  }

  back() {
    this.router.navigate([`/issues/motoId/${this.motoId}`]);
  }
}
