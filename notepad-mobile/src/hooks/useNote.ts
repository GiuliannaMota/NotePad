import { useCallback, useState } from 'react';

import { getNoteById } from '../services/notesService';
import type { Note } from '../types/note';
import { getErrorMessage } from '../utils/getErrorMessage';

export function useNote(noteId: number) {
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadNote = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const data = await getNoteById(noteId);

      setNote(data);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [noteId]);

  return {
    note,
    isLoading,
    errorMessage,
    loadNote,
  };
}