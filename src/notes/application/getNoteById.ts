import sql from "../../shared/infraestructure/db";
import { Note } from "../domain/note.type";

export const getNoteById = async (id: number): Promise<Note | null> => {
    const [note] = await sql<[Note?]>`SELECT * FROM notes WHERE id = ${id}`;
    return note || null;
  };