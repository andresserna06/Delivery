import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Issue } from '../models/issue.model';

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  constructor(private http: HttpClient) { }

  list(): Observable<Issue[]> {
    return this.http.get<Issue[]>(`${environment.url_backend}/issues`);
  }

  view(id: number): Observable<Issue> {
    return this.http.get<Issue>(`${environment.url_backend}/issues/${id}`);
  }

  create(data: Issue): Observable<Issue> {
    delete data.id;
    return this.http.post<Issue>(`${environment.url_backend}/issues`, data);
  }

  update(data: Issue): Observable<Issue> {
    return this.http.put<Issue>(
      `${environment.url_backend}/issues/${data.id}`, data
    );
  }

  delete(id: number) {
    return this.http.delete(`${environment.url_backend}/issues/${id}`);
  }
}
