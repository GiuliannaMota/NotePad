// Serviço de Tags - Fornece métodos para realizar operações CRUD (Create, Read, Update, Delete)

import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";
import { Tag, CreateUpdateTagDTO } from "../models/tag.model";

@Injectable({ providedIn: 'root' })
export class TagService {
    //Endpoint da API para tags
    private readonly ENDPOINT = '/tags'
    
    constructor(private apiService: ApiService) {}

    //Listar todas as tags
    listarTags(): Observable<Tag[]> {
    return this.apiService.get<Tag[]>(this.ENDPOINT);
  }

    //Listar tag específica pelo ID
    obterTagPorId(id: number): Observable<Tag> {
    return this.apiService.get<Tag>(`${this.ENDPOINT}/${id}`);
  }

    //Criar uma nova tag
    criarTag(tag: CreateUpdateTagDTO): Observable<Tag> {
        return this.apiService.post<Tag>(this.ENDPOINT, tag);
    }

    //Atualizar uma tag existente
    atualizarTag(id: number, tag: CreateUpdateTagDTO): Observable<Tag> {
        return this.apiService.put<Tag>('${this.ENDPOINT}/${id}', tag);
    }

    //Deletar uma tag
    deletarTag(id: number): Observable<any> {
        return this.apiService.delete<any>('${this.ENDPOINT}/${id}');
    }
}
