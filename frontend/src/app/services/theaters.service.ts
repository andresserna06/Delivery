import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Theater } from '../models/theater.model';

@Injectable({
  providedIn: 'root'
})
export class TheaterService { // Inyeccion de dependencia: (No depender de implementaciones concretas si no de una interfaz)

  constructor(private http: HttpClient) { }

  
  list(): Observable<Theater[]> { // No hay un await o Async si no Observable 
    return this.http.get<Theater[]>(`${environment.url_backend}/theaters`);
  }

  view(id: number): Observable<Theater> {
    return this.http.get<Theater>(`${environment.url_backend}/theaters/${id}`);
  }

  create(newTheater: Theater): Observable<Theater> {
    delete newTheater.id;
    return this.http.post<Theater>(`${environment.url_backend}/theaters`, newTheater);
  }

  update(theTheater: Theater): Observable<Theater> {
    return this.http.put<Theater>(`${environment.url_backend}/theaters/${theTheater.id}`, theTheater);
  }

  delete(id: number) {
    return this.http.delete<Theater>(`${environment.url_backend}/theaters/${id}`);
  }
}
