import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from 'src/environments/environment';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MotorcycleTrackingService {

   private socket = io(environment.url_backend); // URL backend
  //private api = environment.url_backend ;        // REST backend

  constructor(private http: HttpClient) { }

  // --- REST ---

  getMotorcycles() {
    return this.http.get<any[]>(`${environment.url_backend}/motorcycles`);
  }

  startTracking(plate: string) {
    return this.http.post(`${environment.url_backend}/motorcycles/track/${plate}`, {});
  }

  stopTracking(plate: string) {
    return this.http.post(`${environment.url_backend}/motorcycles/stop/${plate}`, {});
  }

  // --- SOCKET ---

  listenToPlate(plate: string): Observable<any> {
    return new Observable(observer => {
      this.socket.on(plate, coord => {
        observer.next(coord);
      });
    });
  }
}
