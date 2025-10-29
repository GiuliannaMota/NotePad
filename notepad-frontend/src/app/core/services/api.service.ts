import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    //URL base da API do backend
    public readonly API_BASE_URL = 'http://localhost:8080/api';

    constructor(private http: HttpClient) {}

    
   //Realiza uma requisição GET
  get<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    
    // Adiciona parâmetros de query se fornecidos
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http.get<T>(`${this.API_BASE_URL}${endpoint}`, { params: httpParams });
  }

  //Realiza uma requisição POST
    post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.API_BASE_URL}${endpoint}`, data);
  }

  //Realiza uma requisição PUT
    put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.API_BASE_URL}${endpoint}`, data);
  }

  //Realiza uma requisição DELETE
    delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.API_BASE_URL}${endpoint}`);
  }

}