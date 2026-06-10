export type RootStackParamList = {
  NotesList: undefined;
  NoteDetails: {
    noteId: number;
  };
  NoteForm:
    | {
        noteId?: number;
      }
    | undefined;
  Folders: undefined;
  Tags: undefined;
};