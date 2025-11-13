// Interface para a entidade Tag
export interface Tag {
  id: number;
  nome: string;
}

// Interface para criar/atualizar uma tag
export interface CreateUpdateTagDTO {
  nome: string;
}