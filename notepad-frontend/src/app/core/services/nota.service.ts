import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Nota, CreateUpdateNotaDTO } from '../models/nota.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
} )
export class NotaService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private apiService: ApiService
   ) {
    this.apiUrl = `${this.apiService.getApiUrl()}/notas`;
  }

  getAll(): Observable<Nota[]> {
    return this.http.get<Nota[]>(this.apiUrl );
  }

  getById(id: number): Observable<Nota> {
    return this.http.get<Nota>(`${this.apiUrl}/${id}` );
  }

  getByPasta(pastaId: number): Observable<Nota[]> {
    const params = new HttpParams().set('pastaId', pastaId.toString());
    return this.http.get<Nota[]>(this.apiUrl, { params } );
  }

  getByTag(tagId: number): Observable<Nota[]> {
    const params = new HttpParams().set('tagId', tagId.toString());
    return this.http.get<Nota[]>(this.apiUrl, { params } );
  }

  create(nota: CreateUpdateNotaDTO): Observable<Nota> {
    return this.http.post<Nota>(this.apiUrl, nota );
  }

  update(id: number, nota: CreateUpdateNotaDTO): Observable<Nota> {
    return this.http.put<Nota>(`${this.apiUrl}/${id}`, nota );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}` );
  }
}
