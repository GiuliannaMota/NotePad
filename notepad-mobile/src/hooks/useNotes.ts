import { useCallback, useState } from 'react';

import { getNotes } from '../services/notesService';
import type { Note } from '../types/note';
import { getErrorMessage } from '../utils/getErrorMessage';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const data = await getNotes();

      setNotes(data);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    notes,
    isLoading,
    errorMessage,
    loadNotes,
  };
}