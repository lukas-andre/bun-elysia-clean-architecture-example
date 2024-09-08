import { Note } from "../domain/note.type";
import { NoteRepository } from "../infrastructure/providers/notes.provider";

export const getNoteById = async (id: number): Promise<Note | null> => {
    const note = await NoteRepository.getById(id);
    return note || null;
  };