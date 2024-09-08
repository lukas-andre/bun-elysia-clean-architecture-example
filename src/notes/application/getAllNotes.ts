import sql from "../../shared/infraestructure/db";
import { Note } from "../domain/note.type";

export const getAllNotes = async (): Promise<Note[]> => {
    return await sql`SELECT * FROM notes ORDER BY created_at DESC`;
  };
  