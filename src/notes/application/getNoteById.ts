import { Note } from '../domain/note.type';
import { NoteProvider } from '../infrastructure/providers/notes.provider';

export const getNoteById = async (id: number): Promise<Note | null> => {
  const note = await NoteProvider.getById(id);
  return note || null;
};
