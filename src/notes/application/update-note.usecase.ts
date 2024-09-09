import { Note } from '../domain/note.type';
import { NoteRepository } from '../infrastructure/note.repository';

export const updateNoteUseCase = async (
  id: number,
  title: string,
  content: string,
): Promise<Note | null> => {
  const note = await NoteRepository.update(id, { title, content });
  return note || null;
};
