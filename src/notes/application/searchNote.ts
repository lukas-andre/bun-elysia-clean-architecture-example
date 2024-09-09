import { Note } from '../domain/note.type';
import { NoteProvider } from '../infrastructure/providers/notes.provider';

export const searchNote = async (query: string): Promise<Note[]> => {
  return await NoteProvider.searchByTerm(query);
};
