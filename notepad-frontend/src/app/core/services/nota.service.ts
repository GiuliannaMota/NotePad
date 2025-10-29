 //Serviço de Notas - Fornece métodos para realizar operações CRUD (Create, Read, Update, Delete) em notas, bem como filtros por pasta e tag.

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Nota, CreateUpdateNotaDTO } from '../models/nota.model';

@Injectable({
    providedIn: 'root'
})
export class NotaService {
    // Endpoint da API para notas
    private readonly ENDPOINT = '/notas';

    constructor(private apiService: ApiService) {}

    //Lista todas as notas
    listarNotas(): Observable<Nota[]> {
        return this.apiService.get<Nota[]>(this.ENDPOINT);
    }

    //Obtém uma nota específica pelo ID
    bterNotaPorId(id: number): Observable<Nota> {
        return this.apiService.get<Nota>(`${this.ENDPOINT}/${id}`);
    }

    //Cria uma nova nota
    criarNota(nota: CreateUpdateNotaDTO): Observable<Nota> {
        return this.apiService.post<Nota>(this.ENDPOINT, nota);
    }

    //Atualiza uma nota existente
    atualizarNota(id: number, nota: CreateUpdateNotaDTO): Observable<Nota> {
        return this.apiService.put<Nota>(`${this.ENDPOINT}/${id}`, nota);
    }

    //Deleta uma nota
    deletarNota(id: number): Observable<any> {
        return this.apiService.delete<any>(`${this.ENDPOINT}/${id}`);
    }

    //Lista notas filtradas por pasta
    listarNotasPorPasta(pastaId: number): Observable<Nota[]> {
        return this.apiService.get<Nota[]>(this.ENDPOINT, { pastaId });
    }

    //Lista notas filtradas por tag
    listarNotasPorTag(tagId: number): Observable<Nota[]> {
        return this.apiService.get<Nota[]>(this.ENDPOINT, { tagId });
    }
   


}