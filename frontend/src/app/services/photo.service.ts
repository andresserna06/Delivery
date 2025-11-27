import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Photo } from '../models/photo.model';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(private http: HttpClient) { }

  list(): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${environment.url_backend}/photos`);
  }

  view(id: number): Observable<Photo> {
    return this.http.get<Photo>(`${environment.url_backend}/photos/${id}`);
  }

  create(data: Photo): Observable<Photo> {
    delete data.id;
    return this.http.post<Photo>(`${environment.url_backend}/photos`, data);
  }

  update(data: Photo): Observable<Photo> {
    return this.http.put<Photo>(`${environment.url_backend}/photos/${data.id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${environment.url_backend}/photos/${id}`);
  }
}
