import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Photo } from '../models/photo.model';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  private baseUrl = `${environment.url_backend}/photos`;

  constructor(private http: HttpClient) { }

  // Listar fotos
  list(): Observable<Photo[]> {
    return this.http.get<Photo[]>(this.baseUrl);
  }

  // Ver foto por ID
  view(id: number): Observable<Photo> {
    return this.http.get<Photo>(`${this.baseUrl}/${id}`);
  }

  // Crear foto con FormData
  uploadPhoto(photoData: Partial<Photo>, file: File): Observable<Photo> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    if (photoData.issue_id) formData.append('issue_id', photoData.issue_id.toString());
    if (photoData.caption) formData.append('caption', photoData.caption);
    if (photoData.taken_at) formData.append('taken_at', new Date(photoData.taken_at).toISOString());

    return this.http.post<Photo>(`${environment.url_backend}/photos/upload`, formData);
  }

  // Actualizar solo la descripción (JSON)
  updatePhotoDescription(id: number, caption: string): Observable<Photo> {
    return this.http.put<Photo>(`${this.baseUrl}/${id}`, { caption });
  }

  // Eliminar foto
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
