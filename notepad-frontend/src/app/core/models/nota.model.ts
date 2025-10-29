import { Pasta } from './pasta.model';
import { Tag } from './tag.model';

// Interface para a entidade Nota
export interface Nota {
  id: number;
  titulo: string;
  conteudo: string; // HTML gerado pelo Quill
  dataCriacao: string; // ISO 8601 format
  pasta: Pasta;
  tags: Tag[];
}

// Interface para criar/atualizar uma nota
export interface CreateUpdateNotaDTO {
  titulo: string;
  conteudo: string;
  pastaId: number;
  tagIds: number[];
}
