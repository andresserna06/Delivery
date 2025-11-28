import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoService } from 'src/app/services/photo.service';
import { IssueService } from 'src/app/services/issue.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Photo } from 'src/app/models/photo.model';
import { Issue } from 'src/app/models/issue.model';

@Component({
  selector: 'app-manage-photos',
  templateUrl: './manage-photos.component.html',
  styleUrls: ['./manage-photos.component.scss']
})
export class ManagePhotosComponent implements OnInit {

  issueId!: number;
  motoId!: number;
  mode!: 'view' | 'create' | 'edit';
  issue!: Issue;                        // ← USAMOS EL MODELO ISSUE
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

    this.photoForm = this.fb.group({
      caption: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      issue_id: [this.issueId, Validators.required],
      taken_at: ['']
    });

    if (this.router.url.includes('edit')) {
      this.mode = 'edit';
      this.selectedPhotoId = Number(this.activatedRoute.snapshot.paramMap.get('photoId'));
      this.loadIssueForEdit(this.selectedPhotoId);
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
      error: () => Swal.fire('Error', 'No se pudo cargar el problema', 'error')
    });
  }

  loadIssueForEdit(photoId: number) {
    this.issueService.view(this.issueId).subscribe({
      next: issue => {
        this.issue = issue;

        const photo: Photo | undefined = issue.photos.find((p: Photo) => p.id === photoId);

        if (photo) {
          this.photoForm.patchValue({
            caption: photo.caption,
            issue_id: photo.issue_id,
            taken_at: photo.taken_at ? photo.taken_at.split('T')[0] : ''
          });
          this.imagePreview = this.getPhotoUrl(photo.image_url!);
        } else {
          Swal.fire('Error', 'Foto no encontrada', 'error');
          this.back();
        }
      },
      error: () => Swal.fire('Error', 'No se pudo cargar el problema', 'error')
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      Swal.fire('Error', 'Selecciona un archivo válido', 'warning');
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e: any) => this.imagePreview = e.target.result;
    reader.readAsDataURL(file);
  }

  createPhoto() {
    if (this.photoForm.invalid || !this.selectedFile) {
      Swal.fire('Error', 'Debes llenar todos los campos', 'warning');
      return;
    }

    this.photoService.uploadPhoto(this.photoForm.value, this.selectedFile)
      .subscribe({
        next: () => Swal.fire('Éxito', 'Foto creada', 'success')
          .then(() => this.navigateToView()),
        error: () => Swal.fire('Error', 'No se pudo crear', 'error')
      });
  }

  updatePhoto() {
    if (this.photoForm.invalid) {
      Swal.fire('Error', 'La descripción es obligatoria', 'warning');
      return;
    }

    this.photoService.updatePhoto(
      this.selectedPhotoId,
      this.photoForm.value.caption,
      this.photoForm.value.taken_at
    ).subscribe({
      next: () => Swal.fire('Éxito', 'Foto actualizada', 'success')
        .then(() => this.navigateToView()),
      error: () => Swal.fire('Error', 'No se pudo actualizar', 'error')
    });
  }

  deletePhoto(photoId: number) {
    Swal.fire({
      title: '¿Eliminar foto?',
      icon: 'warning',
      showCancelButton: true
    }).then(result => {
      if (result.isConfirmed) {
        this.photoService.delete(photoId).subscribe({
          next: () => Swal.fire('Eliminada', 'Foto eliminada', 'success')
            .then(() => this.loadIssue()),
          error: () => Swal.fire('Error', 'No se pudo eliminar', 'error')
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
    this.router.navigate([`/issues/moto/${this.motoId}`]);
  }

  onSubmit() {
    if (this.mode === 'create') this.createPhoto();
    else if (this.mode === 'edit') this.updatePhoto();
  }

  openModal(url: string) { this.selectedPhotoUrl = url; this.showModal = true; }
  closeModal() { this.showModal = false; }
}
