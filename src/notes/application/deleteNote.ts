import { NoteProvider } from '../infrastructure/providers/notes.provider';

export const deleteNote = async (id: number): Promise<boolean> => {
  const deleted = await NoteProvider.delete(id);

  return deleted ? true : false;
};
