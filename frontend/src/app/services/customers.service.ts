import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(private http: HttpClient) { }

  list(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${environment.url_backend}/customers`);
  }

  view(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${environment.url_backend}/customers/${id}`);
  }

  create(newCustomer: Customer): Observable<Customer> {
    delete newCustomer.id;
    return this.http.post<Customer>(`${environment.url_backend}/customers`, newCustomer);
  }

  update(theCustomer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${environment.url_backend}/customers/${theCustomer.id}`, theCustomer);
  }

  delete(id: number) {
    return this.http.delete<Customer>(`${environment.url_backend}/customers/${id}`);
  }
}
