import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Address } from '../models/address.model';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private http: HttpClient) { }

  list(): Observable<Address[]> {
    return this.http.get<Address[]>(`${environment.url_backend}/addresses`);
  }

  view(id: number): Observable<Address> {
    return this.http.get<Address>(`${environment.url_backend}/addresses/${id}`);
  }

  create(newAddress: Address): Observable<Address> {
    delete newAddress.id;
    return this.http.post<Address>(`${environment.url_backend}/addresses`, newAddress);
  }

  update(theAddress: Address): Observable<Address> {
    return this.http.put<Address>(`${environment.url_backend}/addresses/${theAddress.id}`, theAddress);
  }

  delete(id: number): Observable<Address> {
    return this.http.delete<Address>(`${environment.url_backend}/addresses/${id}`);
  }
}