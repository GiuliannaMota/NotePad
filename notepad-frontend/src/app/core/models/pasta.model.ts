//Modelo de Pasta - Representa a estrutura de uma pasta no sistema NotePad.

// Interface para a entidade Pasta
export interface Pasta {
  id: number;
  nome: string;
}

// Interface para criar/atualizar uma pasta
export interface CreateUpdatePastaDTO {
  nome: string;
}