import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Menu } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenusService {

  constructor(private http: HttpClient) { }

  list(): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${environment.url_backend}/menus`);
  }

  view(id: number): Observable<Menu> {
    return this.http.get<Menu>(`${environment.url_backend}/menus/${id}`);
  }

  create(newMenu: Menu): Observable<Menu> {
    delete newMenu.id; // aseguramos que el backend genere el ID
    return this.http.post<Menu>(`${environment.url_backend}/menus`, newMenu);
  }

  update(theMenu: Menu): Observable<Menu> {
    return this.http.put<Menu>(`${environment.url_backend}/menus/${theMenu.id}`, theMenu);
  }

  delete(id: number): Observable<Menu> {
    return this.http.delete<Menu>(`${environment.url_backend}/menus/${id}`);
  }
}
