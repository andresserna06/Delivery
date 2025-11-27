import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoService } from 'src/app/services/photo.service';
import { Photo } from 'src/app/models/photo.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-photos',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManagePhotosComponent implements OnInit {
  issueId!: number;   // ID del issue actual
  motoId!: number;    // ID de la moto asociada
  allPhotos: Photo[] = [];
  photos: Photo[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private photoService: PhotoService
  ) { }

  ngOnInit(): void {
    // Obtenemos issueId de la URL
    const paramIssue = this.activatedRoute.snapshot.paramMap.get('issueId');
    this.issueId = paramIssue ? Number(paramIssue) : 0;

    // Obtenemos motoId de queryParams
    const paramMoto = this.activatedRoute.snapshot.queryParamMap.get('motoId');
    this.motoId = paramMoto ? Number(paramMoto) : 0;

    this.loadPhotos();
  }

  loadPhotos() {
    this.photoService.list().subscribe({
      next: photos => {
        this.allPhotos = photos;
        this.filterPhotosByIssue();
      },
      error: err => console.error('Error loading photos:', err)
    });
  }

  filterPhotosByIssue() {
    this.photos = this.allPhotos.filter(photo => photo.issue_id === this.issueId);
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
            this.loadPhotos();
          },
          error: err => console.error('Error deleting photo:', err)
        });
      }
    });
  }

  back() {
    // Siempre volvemos al listado de issues de la moto actual
    this.router.navigate([`/issues/motoId/${this.motoId}`]);
  }
}
