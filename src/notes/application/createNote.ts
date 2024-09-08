import sql from "../../shared/infraestructure/db";
import { Note } from "../domain/note.type";

export const createNote = async (title: string, content: string): Promise<Note> => {
    const [note] = await sql<[Note]>`
      INSERT INTO notes (title, content)
      VALUES (${title}, ${content})
      RETURNING *
    `;
    return note;
  };