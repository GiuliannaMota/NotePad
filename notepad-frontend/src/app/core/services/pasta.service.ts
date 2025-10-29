import { Injectable  } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";
import { CreateUpdatePastaDTO, Pasta } from "../models/pasta.model";
import { CreateUpdateNotaDTO } from "../models/nota.model";

@Injectable({
  providedIn: 'root'
})
export class PastaService {
      // Endpoint da API para pastas
  private readonly ENDPOINT = '/pastas';

  constructor(private apiService: ApiService) {}

  //Lista todas as pastas
  listarPasta(): Observable<Pasta[]> {
    return this.apiService.get<Pasta[]>(this.ENDPOINT);
  }

  //Pasta específica por ID
  obterPastaPorId(id: number): Observable<Pasta> {
    return this.apiService.get<Pasta>('${this.ENDPOINT}/${id}');
  }

  //Criar uma nota pasta
  criarPasta(pasta: CreateUpdatePastaDTO): Observable<Pasta> {
    return this.apiService.post<Pasta>(this.ENDPOINT, pasta);
  }

  //Atualizar uma pasta existente
  atualizarPasta(id: number, pasta: CreateUpdatePastaDTO): Observable<Pasta> {
    return this.apiService.put<Pasta>('${this.ENDPOINT}/${id}', pasta);
  }

  //Deletar uma pasta
  deletarPasta(id: number): Observable<any> {
    return this.apiService.delete<any>('${this.ENDPOINT}/${id}');
  }
}
