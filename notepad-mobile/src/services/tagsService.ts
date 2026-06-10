import { api } from './api';

import type { Tag } from '../types/tag';

export async function getTags(): Promise<Tag[]> {
  const response = await api.get<Tag[]>('/tags');
  return response.data;
}

export async function getTagById(id: number): Promise<Tag> {
  const response = await api.get<Tag>(`/tags/${id}`);
  return response.data;
}

export async function createTag(nome: string): Promise<Tag> {
  const response = await api.post<Tag>('/tags', { nome });
  return response.data;
}

export async function updateTag(id: number, nome: string): Promise<Tag> {
  const response = await api.put<Tag>(`/tags/${id}`, { nome });
  return response.data;
}

export async function deleteTag(id: number): Promise<void> {
  await api.delete(`/tags/${id}`);
}