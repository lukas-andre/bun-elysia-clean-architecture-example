import { NoteRepository } from "../infrastructure/providers/notes.provider";

export const deleteNote = async (id: number): Promise<boolean> => {
    const deleted = await NoteRepository.delete(id);

    return deleted ? true : false
  };