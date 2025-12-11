import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from './env.api';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  apiUrl = apiUrl + "api/user/";

  constructor(private http: HttpClient) {}

  register(username: string, email: string, password: string, password2: string): Observable<any> {
    const data = { username, email, password, password2 };
    return this.http.post(this.apiUrl + "register/", data, { withCredentials: true });
  }

  login(email: string, password: string): Observable<any> {
    const data = { email, password };
    return this.http.post(this.apiUrl + "login/", data, { withCredentials: true });
    // no necesitas tap ni guardar token localmente
  }

  logout(): Observable<any> {
    return this.http.post(this.apiUrl + "logout/", {}, { withCredentials: true });
  }
}
