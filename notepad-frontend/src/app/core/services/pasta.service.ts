import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateUpdatePastaDTO, Pasta } from "../models/pasta.model";
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
} )
export class PastaService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private apiService: ApiService
   ) {
    this.apiUrl = `${this.apiService.getApiUrl()}/pastas`;
  }

  getAll(): Observable<Pasta[]> {
    return this.http.get<Pasta[]>(this.apiUrl );
  }

  getById(id: number): Observable<Pasta> {
    return this.http.get<Pasta>(`${this.apiUrl}/${id}` );
  }

  create(nome: string): Observable<Pasta> {
    return this.http.post<Pasta>(this.apiUrl, { nome } );
  }

  update(id: number, nome: string): Observable<Pasta> {
    return this.http.put<Pasta>(`${this.apiUrl}/${id}`, { nome } );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}` );
  }
}
