import { Note } from "../domain/note.type";
import { NoteRepository } from "../infrastructure/providers/notes.provider";

export const getAllNotes = async (): Promise<Note[]> => {
  const notes = await NoteRepository.getAll();

  return {
    ...notes
  }
};
  