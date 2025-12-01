import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment';
import { env } from 'process';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {

  constructor(private http: HttpClient) { }

  getCircular(chart: string): Observable<any> {
    return this.http.get(`${environment.url_charts}/circular/${chart}`);
  }

  getBarras(chart: string): Observable<any> {
    return this.http.get(`${environment.url_charts}/barras/${chart}`);
  }

  getSeries(chart: string): Observable<any> {
    return this.http.get(`${environment.url_charts}/series/${chart}`);
  }
}
