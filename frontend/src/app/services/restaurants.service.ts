import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Restaurant } from '../models/restaurant.model';

@Injectable({
  providedIn: 'root'
})
export class RestaurantsService { // Inyeccion de dependencia: (No depender de implementaciones concretas si no de una interfaz)

  constructor(private http: HttpClient) { }


  list(): Observable<Restaurant[]> { // No hay un await o Async si no Observable 
    return this.http.get<Restaurant[]>(`${environment.url_backend}/restaurants`);
  }

  view(id: number): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${environment.url_backend}/restaurants/${id}`);
  }

  create(newRestaurant: Restaurant): Observable<Restaurant> {
    delete newRestaurant.id;
    return this.http.post<Restaurant>(`${environment.url_backend}/restaurants`, newRestaurant);
  }

  update(theRestaurant: Restaurant): Observable<Restaurant> {
    return this.http.put<Restaurant>(`${environment.url_backend}/restaurants/${theRestaurant.id}`, theRestaurant);
  }

  delete(id: number) {
    return this.http.delete<Restaurant>(`${environment.url_backend}/restaurants/${id}`);
  }
}
