import { Note } from '../domain/note.type';
import { NoteRepository } from '../infrastructure/note.repository';

export const getAllNotesUseCase = async (): Promise<Note[]> => {
  const notes = await NoteRepository.getAll();

  return {
    ...notes,
  };
};
