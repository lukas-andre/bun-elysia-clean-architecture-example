import { Note } from '../domain/note.type';
import { NoteRepository } from '../infrastructure/note.repository';

export const searchNoteUseCase = async (query: string): Promise<Note[]> => {
  return await NoteRepository.searchByTerm(query);
};
