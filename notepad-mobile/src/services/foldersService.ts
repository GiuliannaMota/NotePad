import { api } from './api';

import type { Folder } from '../types/folder';

export async function getFolders(): Promise<Folder[]> {
  const response = await api.get<Folder[]>('/pastas');
  return response.data;
}

export async function getFolderById(id: number): Promise<Folder> {
  const response = await api.get<Folder>(`/pastas/${id}`);
  return response.data;
}

export async function createFolder(nome: string): Promise<Folder> {
  const response = await api.post<Folder>('/pastas', { nome });
  return response.data;
}

export async function updateFolder(id: number, nome: string): Promise<Folder> {
  const response = await api.put<Folder>(`/pastas/${id}`, { nome });
  return response.data;
}

export async function deleteFolder(id: number): Promise<void> {
  await api.delete(`/pastas/${id}`);
}