import { Note } from '../domain/note.type';
import { NoteProvider } from '../infrastructure/providers/notes.provider';

export const getAllNotes = async (): Promise<Note[]> => {
  const notes = await NoteProvider.getAll();

  return {
    ...notes,
  };
};
