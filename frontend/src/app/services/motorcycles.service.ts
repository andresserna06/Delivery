import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Motorcycle } from '../models/motorcycle.model';

@Injectable({
  providedIn: 'root'
})
export class MotoService {

  constructor(private http: HttpClient) { }

  list(): Observable<Motorcycle[]> {
    return this.http.get<Motorcycle[]>(`${environment.url_backend}/motorcycles`);
  }
}