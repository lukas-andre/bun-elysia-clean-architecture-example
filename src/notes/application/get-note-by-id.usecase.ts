import { Note } from '../domain/note.type';
import { NoteRepository } from '../infrastructure/note.repository';

export const getNoteByIdUseCase = async (id: number): Promise<Note | null> => {
  const note = await NoteRepository.getById(id);
  console.log({ note });
  return note || null;
};
