import { api } from './api';

import type { CreateNoteDTO, Note, UpdateNoteDTO } from '../types/note';

type SummaryResponse = {
  noteId: number;
  resumo: string;
};

export async function getNotes(): Promise<Note[]> {
  const response = await api.get<Note[]>('/notas');
  return response.data;
}

export async function getNoteById(id: number): Promise<Note> {
  const response = await api.get<Note>(`/notas/${id}`);
  return response.data;
}

export async function createNote(data: CreateNoteDTO): Promise<Note> {
  const response = await api.post<Note>('/notas', data);
  return response.data;
}

export async function updateNote(
  id: number,
  data: UpdateNoteDTO
): Promise<Note> {
  const response = await api.put<Note>(`/notas/${id}`, data);
  return response.data;
}

export async function deleteNote(id: number): Promise<void> {
  await api.delete(`/notas/${id}`);
}

export async function generateNoteSummary(noteId: number): Promise<string> {
  const response = await api.post<SummaryResponse>(`/notas/${noteId}/resumo`);
  return response.data.resumo;
}