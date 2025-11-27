import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService { // Inyeccion de dependencia: (No depender de implementaciones concretas si no de una interfaz)

  constructor(private http: HttpClient) { }

  
  list(): Observable<Product[]> { // No hay un await o Async si no Observable 
    return this.http.get<Product[]>(`${environment.url_backend}/products`);
  }

  view(id: number): Observable<Product> {
    return this.http.get<Product>(`${environment.url_backend}/products/${id}`);
  }

  create(newProduct: Product): Observable<Product> {
    delete newProduct.id;
    return this.http.post<Product>(`${environment.url_backend}/products`, newProduct);
  }

  update(theProduct: Product): Observable<Product> {
    return this.http.put<Product>(`${environment.url_backend}/products/${theProduct.id}`, theProduct);
  }

  delete(id: number) {
    return this.http.delete<Product>(`${environment.url_backend}/products/${id}`);
  }
}
