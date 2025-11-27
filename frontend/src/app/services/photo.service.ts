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

  list(): Observable<Photo[]> {
    return this.http.get<Photo[]>(this.baseUrl);
  }

  view(id: number): Observable<Photo> {
    return this.http.get<Photo>(`${this.baseUrl}/${id}`);
  }

  create(data: FormData | any): Observable<Photo> {
    return this.http.post<Photo>(this.baseUrl, data);
  }

  update(id: number, data: FormData | any): Observable<Photo> {
    return this.http.put<Photo>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
