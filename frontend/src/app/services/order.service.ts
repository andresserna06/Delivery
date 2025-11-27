import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  // LISTAR TODOS
  list(): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.url_backend}/orders`);
  }

  // VER UN PEDIDO POR ID
  view(id: number): Observable<Order> {
    return this.http.get<Order>(`${environment.url_backend}/orders/${id}`);
  }

  // CREAR UN NUEVO PEDIDO
  create(newOrder: Order): Observable<Order> {
    delete newOrder.id; // igual que en theaters
    return this.http.post<Order>(`${environment.url_backend}/orders`, newOrder);
  }

  // ACTUALIZAR UN PEDIDO
  update(order: Order): Observable<Order> {
    return this.http.put<Order>(`${environment.url_backend}/orders/${order.id}`, order);
  }

  // ELIMINAR UN PEDIDO
  delete(id: number): Observable<Order> {
    return this.http.delete<Order>(`${environment.url_backend}/orders/${id}`);
  }
}
