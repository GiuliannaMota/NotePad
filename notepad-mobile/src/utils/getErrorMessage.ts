import axios from 'axios';

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    if (error.response?.status) {
      return `Erro ${error.response.status} ao comunicar com o servidor.`;
    }

    if (error.request) {
      return 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
    }
  }

  return 'Ocorreu um erro inesperado.';
}