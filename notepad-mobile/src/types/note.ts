import type { Folder } from './folder';
import type { Tag } from './tag';

export type Note = {
  id: number;
  titulo: string;
  conteudo: string;
  resumo?: string | null;
  dataCriacao: string;
  pasta: Folder | null;
  tags: Tag[];
};

export type CreateNoteDTO = {
  titulo: string;
  conteudo: string;
  pastaId: number;
  tagIds: number[];
};

export type UpdateNoteDTO = CreateNoteDTO;