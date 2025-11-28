import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag, CreateUpdateTagDTO } from "../models/tag.model";
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
} )
export class TagService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private apiService: ApiService
   ) {
    this.apiUrl = `${this.apiService.getApiUrl()}/tags`;
  }

  getAll(): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.apiUrl );
  }

  getById(id: number): Observable<Tag> {
    return this.http.get<Tag>(`${this.apiUrl}/${id}` );
  }

  create(nome: string): Observable<Tag> {
    return this.http.post<Tag>(this.apiUrl, { nome } );
  }

  update(id: number, nome: string): Observable<Tag> {
    return this.http.put<Tag>(`${this.apiUrl}/${id}`, { nome } );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}` );
  }
}
