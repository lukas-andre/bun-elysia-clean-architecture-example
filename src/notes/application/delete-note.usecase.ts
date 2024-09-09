import { NoteRepository } from '../infrastructure/note.repository';

export const deleteNoteUsecase = async (id: number): Promise<boolean> => {
  const deleted = await NoteRepository.delete(id);

  return deleted ? true : false;
};
