import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { apiUrl } from './env.api';
@Injectable({
  providedIn: 'root',
})
export class Auth {
  apiUrl = apiUrl+"/api/user/";
  
  constructor(private http: HttpClient) {}

  register(username:string, email:string, password:string){
    const data = {username, email, password};
    return this.http.post(this.apiUrl+"register/", data);
  }

  login(email:string, password:string){
    const data = {email, password};
    return this.http.post<any>(this.apiUrl+"login/", data).pipe(
      tap(response => {
        localStorage.setItem("subasta_token", response.token);
      })
    );
  }

  logout(){
    localStorage.removeItem("subasta_token");
    return this.http.post(this.apiUrl+"logout/", {}).subscribe();
  }

}
