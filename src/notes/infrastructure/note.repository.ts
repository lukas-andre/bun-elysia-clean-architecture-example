import sql from '../../shared/infrastructure/db';
import { Note } from '../domain/note.type';

export interface NoteRecord {
  id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  tags?: string[];
}

export interface CreateNoteParms {
  user_id: number;
  title: string;
  content: string;
  tags?: string[];
}

export interface UpdateNoteParms {
  title?: string;
  content?: string;
  tags?: string[];
}

export class NoteRepository {
  static async create(note: CreateNoteParms): Promise<NoteRecord> {
    return sql.begin(async (transaction) => {
      const [newNote] = await transaction<NoteRecord[]>`
        INSERT INTO notes (user_id, title, content)
        VALUES (${note.user_id}, ${note.title}, ${note.content})
        RETURNING *
      `;

      if (note.tags && note.tags.length > 0) {
        await transaction`
          INSERT INTO tags (name)
          VALUES ${sql(note.tags.map((tag) => [tag]))}
          ON CONFLICT (name) DO NOTHING
        `;

        await transaction`
          INSERT INTO note_tags (note_id, tag_id)
          SELECT ${newNote.id}, id FROM tags WHERE name IN ${sql(note.tags)}
        `;
      }

      return newNote;
    });
  }

  static async getById(id: number): Promise<NoteRecord | undefined> {
    const [note] = await sql<NoteRecord[]>`
      SELECT n.*, array_remove(array_agg(t.name), NULL) as tags
      FROM notes n
      LEFT JOIN note_tags nt ON n.id = nt.note_id
      LEFT JOIN tags t ON nt.tag_id = t.id
      WHERE n.id = ${id}
      GROUP BY n.id
    `;
    return note;
  }

  static async getAll(): Promise<NoteRecord[]> {
    return await sql<NoteRecord[]>`
      SELECT n.*, array_remove(array_agg(t.name), NULL) as tags
      FROM notes n
      LEFT JOIN note_tags nt ON n.id = nt.note_id
      LEFT JOIN tags t ON nt.tag_id = t.id
      GROUP BY n.id
      ORDER BY n.created_at DESC
    `;
  }

  static async update(
    id: number,
    note: UpdateNoteParms,
  ): Promise<NoteRecord | undefined> {
    return sql.begin(async (transaction) => {
      const [updatedNote] = await transaction<NoteRecord[]>`
        UPDATE notes
        SET 
          title = COALESCE(${note.title!}, title), 
          content = COALESCE(${note.content!}, content), 
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `;

      if (!updatedNote) {
        return undefined;
      }

      if (note.tags !== undefined) {
        await transaction`DELETE FROM note_tags WHERE note_id = ${id}`;

        if (note.tags.length > 0) {
          await transaction`
            INSERT INTO tags (name)
            VALUES ${sql(note.tags.map((tag) => [tag]))}
            ON CONFLICT (name) DO NOTHING
          `;

          await transaction`
            INSERT INTO note_tags (note_id, tag_id)
            SELECT ${id}, id FROM tags WHERE name IN ${sql(note.tags)}
          `;
        }
      }

      return updatedNote;
    });
  }

  static async delete(id: number): Promise<NoteRecord | undefined> {
    const [deletedNote] = await sql<NoteRecord[]>`
      DELETE FROM notes
      WHERE id = ${id}
      RETURNING *
    `;
    return deletedNote;
  }

  static async deleteAllByUserId(userId: number): Promise<number> {
    const result = await sql`
      DELETE FROM notes
      WHERE user_id = ${userId}
    `;
    return result.count;
  }

  static async searchByTerm(term: string) {
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
      WHERE n.search_vector @@ plainto_tsquery('english', ${term})
      GROUP BY n.id, n.user_id, n.title, n.content, n.created_at, n.updated_at
      ORDER BY ts_rank(n.search_vector, plainto_tsquery('english', ${term})) DESC
    `;

    const parsedResult = result.slice(0, result.count) as Note[];
    return parsedResult;
  }
}
