import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Driver } from '../models/driver.model';

@Injectable({
  providedIn: 'root'
})
export class DriversService {
  getDrivers() {
    throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient) {}

  list(): Observable<Driver[]> {
    return this.http.get<Driver[]>(`${environment.url_backend}/drivers`);
  }

  view(id: number): Observable<Driver> {
    return this.http.get<Driver>(`${environment.url_backend}/drivers/${id}`);
  }

  create(newDriver: Driver): Observable<Driver> {
    delete newDriver.id; // el backend genera el id
    return this.http.post<Driver>(`${environment.url_backend}/drivers`, newDriver);
  }

  update(driver: Driver): Observable<Driver> {
    return this.http.put<Driver>(`${environment.url_backend}/drivers/${driver.id}`, driver);
  }

  delete(id: number) {
    return this.http.delete(`${environment.url_backend}/drivers/${id}`);
  }
}
