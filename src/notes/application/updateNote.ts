import { Note } from '../domain/note.type';
import { NoteProvider } from '../infrastructure/providers/notes.provider';

export const updateNote = async (
  id: number,
  title: string,
  content: string,
): Promise<Note | null> => {
  const note = await NoteProvider.update(id, { title, content });
  return note || null;
};
