import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Shift } from '../models/shift.model';

@Injectable({
  providedIn: 'root'
})
export class ShiftsService {

  constructor(private http: HttpClient) { }

  list(): Observable<Shift[]> {
    return this.http.get<Shift[]>(`${environment.url_backend}/shifts`);
  }

  view(id: number): Observable<Shift> {
    return this.http.get<Shift>(`${environment.url_backend}/shifts/${id}`);
  }

  create(newShift: Shift): Observable<Shift> {
    delete newShift.id; // el backend genera el id
    return this.http.post<Shift>(`${environment.url_backend}/shifts`, newShift);
  }

  update(shift: Shift): Observable<Shift> {
    return this.http.put<Shift>(`${environment.url_backend}/shifts/${shift.id}`, shift);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.url_backend}/shifts/${id}`);
  }
}