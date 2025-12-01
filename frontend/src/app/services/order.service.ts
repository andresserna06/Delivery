import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Order } from '../models/order.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) { }

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
    delete newOrder.id;
    return this.http.post<Order>(`${environment.url_backend}/orders`, newOrder).pipe(
      tap((order) => {
        // 🔔 Emitir notificación con sonido cuando se crea el pedido
        console.log('🎉 Nuevo pedido creado:', order);
        this.notificationService.notifyNewOrder(order.id!);
      })
    );
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