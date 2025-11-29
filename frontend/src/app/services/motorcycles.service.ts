import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Motorcycle } from '../models/motorcycle.model';

@Injectable({
  providedIn: 'root'
})
export class MotorcyclesService {
  getMotorcycles() {
    throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient) { }

  list(): Observable<Motorcycle[]> {
    return this.http.get<Motorcycle[]>(`${environment.url_backend}/motorcycles`);
  }

  view(id: number): Observable<Motorcycle> {
    return this.http.get<Motorcycle>(`${environment.url_backend}/motorcycles/${id}`);
  }

  create(newMotorcycle: Motorcycle): Observable<Motorcycle> {
    delete newMotorcycle.id; // el backend genera el id
    return this.http.post<Motorcycle>(`${environment.url_backend}/motorcycles`, newMotorcycle);
  }

  update(motorcycle: Motorcycle): Observable<Motorcycle> {
    return this.http.put<Motorcycle>(`${environment.url_backend}/motorcycles/${motorcycle.id}`, motorcycle);
  }

  delete(id: number) {
    return this.http.delete(`${environment.url_backend}/motorcycles/${id}`);
  }
}
