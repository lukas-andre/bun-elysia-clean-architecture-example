
import sql from "../../shared/infraestructure/db";
import { Note } from "../domain/note.type";



  export const searchNote = async (query: string): Promise<Note[]> => {
    let result = await sql`
      SELECT 
        n.id,
        n.user_id,
        n.title,
        n.content,
        n.created_at,
        n.updated_at,
        array_remove(array_agg(t.name), NULL) as tags
      FROM notes n
      LEFT JOIN note_tags nt ON n.id = nt.note_id
      LEFT JOIN tags t ON nt.tag_id = t.id
      WHERE n.search_vector @@ plainto_tsquery('english', ${query})
      GROUP BY n.id, n.user_id, n.title, n.content, n.created_at, n.updated_at
      ORDER BY ts_rank(n.search_vector, plainto_tsquery('english', ${query})) DESC
    `;

     const parsedResult = result.slice(0, result.count) as Note[];
     return parsedResult;
  } 