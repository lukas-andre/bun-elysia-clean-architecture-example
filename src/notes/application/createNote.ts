import { Note } from "../domain/note.type";
import { NoteProvider } from "../infrastructure/providers/notes.provider";

export const createNote = async (user_id: number, title: string, content: string): Promise<Note> => {
  return await NoteProvider.create({ user_id, title, content });
};