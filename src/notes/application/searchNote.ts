
import { Note } from "../domain/note.type";
import { NoteRepository } from "../infrastructure/providers/notes.provider";



  export const searchNote = async (query: string): Promise<Note[]> => {
    return await NoteRepository.searchByTerm(query);
  } 