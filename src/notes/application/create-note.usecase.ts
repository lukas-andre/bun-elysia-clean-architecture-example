import { Note } from '../domain/note.type';
import { NoteRepository } from '../infrastructure/note.repository';

export const createNoteUseCase = async (
  user_id: number,
  title: string,
  content: string,
): Promise<Note> => {
  return await NoteRepository.create({ user_id, title, content });
};
