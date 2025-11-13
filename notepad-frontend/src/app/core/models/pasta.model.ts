// Interface para a entidade Pasta
export interface Pasta {
  id: number;
  nome: string;
}

// Interface para criar/atualizar uma pasta
export interface CreateUpdatePastaDTO {
  nome: string;
}