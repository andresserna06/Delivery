import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoService } from 'src/app/services/photo.service';
import { IssueService } from 'src/app/services/issue.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-manage-photos',
  templateUrl: './manage-photos.component.html',
  styleUrls: ['./manage-photos.component.scss']
})
export class ManagePhotosComponent implements OnInit {

  issueId!: number;
  motoId!: number;
  mode!: 'view' | 'create' | 'edit';

  issue: any;
  photoForm!: FormGroup;
  selectedPhotoId!: number;

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  showModal = false;
  selectedPhotoUrl = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private issueService: IssueService,
    private photoService: PhotoService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.issueId = Number(this.activatedRoute.snapshot.paramMap.get('issueId'));
    this.motoId = Number(this.activatedRoute.snapshot.paramMap.get('motoId'));

    // FormGroup con taken_at opcional
    this.photoForm = this.fb.group({
      caption: ['', Validators.required],
      issue_id: [this.issueId, Validators.required],
      taken_at: ['']  // fecha opcional
    });

    if (this.router.url.includes('edit')) {
      this.mode = 'edit';
      this.selectedPhotoId = Number(this.activatedRoute.snapshot.paramMap.get('photoId'));
      if (this.selectedPhotoId && !isNaN(this.selectedPhotoId)) {
        this.loadIssueForEdit(this.selectedPhotoId);
      } else {
        Swal.fire('Error', 'ID de foto inválido', 'error');
        this.back();
      }
    } else if (this.router.url.includes('create')) {
      this.mode = 'create';
    } else {
      this.mode = 'view';
      this.loadIssue();
    }
  }

  loadIssue() {
    this.issueService.view(this.issueId).subscribe({
      next: issue => this.issue = issue,
      error: err => Swal.fire('Error', 'No se pudo cargar el problema', 'error')
    });
  }

  loadIssueForEdit(photoId: number) {
    this.issueService.view(this.issueId).subscribe({
      next: issue => {
        this.issue = issue;
        const photo = issue.photos.find((p: any) => p.id === photoId);
        if (photo) {
          this.photoForm.patchValue({
            caption: photo.caption,
            issue_id: photo.issue_id,
            taken_at: photo.taken_at ? photo.taken_at.split('T')[0] : '' // fecha para input
          });
          this.imagePreview = this.getPhotoUrl(photo.image_url);
        } else {
          Swal.fire('Error', 'Foto no encontrada en el problema', 'error');
          this.back();
        }
      },
      error: err => Swal.fire('Error', 'No se pudo cargar el problema', 'error')
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      Swal.fire('Error', 'Por favor selecciona un archivo de imagen válido', 'warning');
      return;
    }

    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e: any) => this.imagePreview = e.target.result;
    reader.readAsDataURL(file);
  }

  createPhoto() {
    if (this.photoForm.invalid || !this.selectedFile) {
      Swal.fire('Error', 'Todos los campos son obligatorios y debes seleccionar un archivo', 'warning');
      return;
    }

    // Enviar directamente todo el form, incluido taken_at
    this.photoService.uploadPhoto(this.photoForm.value, this.selectedFile)
      .subscribe({
        next: () => Swal.fire('Éxito', 'Foto creada correctamente', 'success')
          .then(() => this.navigateToView()),
        error: () => Swal.fire('Error', 'No se pudo crear la foto', 'error')
      });
  }

  updatePhoto() {
    if (this.photoForm.invalid) {
      Swal.fire('Error', 'La descripción es obligatoria', 'warning');
      return;
    }

    // Actualizar caption y taken_at
    this.photoService.updatePhoto(
      this.selectedPhotoId,
      this.photoForm.value.caption,
      this.photoForm.value.taken_at
    ).subscribe({
      next: () => Swal.fire('Éxito', 'Foto actualizada correctamente', 'success')
        .then(() => this.navigateToView()),
      error: () => Swal.fire('Error', 'No se pudo actualizar la foto', 'error')
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
          next: () => Swal.fire('Eliminada', 'Foto eliminada correctamente', 'success')
            .then(() => this.loadIssue()),
          error: () => Swal.fire('Error', 'No se pudo eliminar la foto', 'error')
        });
      }
    });
  }

  getPhotoUrl(filename: string) {
    return `${environment.url_backend}/${filename.replace(/\\/g, '/')}`;
  }

  navigateToView() {
    this.router.navigate([`/photos/issue/${this.issueId}/moto/${this.motoId}`]);
  }

  back() {
    this.router.navigate([`/issues/moto/${this.motoId}`]); // ruta consistente
  }

  onSubmit() {
    if (this.mode === 'create') this.createPhoto();
    else if (this.mode === 'edit') this.updatePhoto();
  }

  openModal(url: string) { this.selectedPhotoUrl = url; this.showModal = true; }
  closeModal() { this.showModal = false; }
}
