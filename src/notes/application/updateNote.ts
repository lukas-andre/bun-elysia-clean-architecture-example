import sql from "../../shared/infraestructure/db";
import { Note } from "../domain/note.type";

export const updateNote = async (id: number, title: string, content: string): Promise<Note | null> => {
    const [note] = await sql<[Note?]>`
      UPDATE notes
      SET title = ${title}, content = ${content}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return note || null;
  };

  export const deleteNote = async (id: number): Promise<boolean> => {
    const result = await sql`DELETE FROM notes WHERE id = ${id}`;
    return result.count > 0;
  };
  
  