import sql from '../config/database';
import { User, Note } from '../types';

interface UserRecord {
  id: number;
  username: string;
  email: string;
  password_hash?: string;
  created_at: Date;
  updated_at: Date;
}

interface NoteRecord {
  id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  tags?: string[];
}

export const UserModel = {
  create: async (user: User): Promise<UserRecord> => {
    const [newUser] = await sql<UserRecord[]>`
      INSERT INTO users (username, email, password_hash)
      VALUES (${user.username}, ${user.email}, hash_password(${user.password}))
      RETURNING id, username, email, created_at, updated_at
    `;
    return newUser;
  },
  getByUsername: async (username: string): Promise<UserRecord | undefined> => {
    const [user] = await sql<UserRecord[]>`
      SELECT id, username, email, password_hash, created_at, updated_at
      FROM users
      WHERE username = ${username}
    `;
    return user;
  },
};

export const NoteModel = {
  create: async (note: Note): Promise<NoteRecord> => {
    return sql.begin(async (transaction) => {
      const [newNote] = await transaction<NoteRecord[]>`
        INSERT INTO notes (user_id, title, content)
        VALUES (${note.user_id}, ${note.title!}, ${note.content})
        RETURNING *
      `;
      
      if (note.tags && note.tags.length > 0) {
        await transaction`
          INSERT INTO tags (name)
          VALUES ${sql(note.tags.map((tag: any) => [tag]))}
          ON CONFLICT (name) DO NOTHING
        `;
        
        await transaction`
          INSERT INTO note_tags (note_id, tag_id)
          SELECT ${newNote.id}, id FROM tags WHERE name IN ${sql(note.tags)}
        `;
      }
      
      return newNote;
    });
  },
  getById: async (id: number): Promise<NoteRecord | undefined> => {
    const [note] = await sql<NoteRecord[]>`
      SELECT n.*, array_remove(array_agg(t.name), NULL) as tags
      FROM notes n
      LEFT JOIN note_tags nt ON n.id = nt.note_id
      LEFT JOIN tags t ON nt.tag_id = t.id
      WHERE n.id = ${id}
      GROUP BY n.id
    `;
    return note;
  },
  search: async (query: string): Promise<NoteRecord[]> => {
    return sql<NoteRecord[]>`
      SELECT n.*, array_remove(array_agg(t.name), NULL) as tags
      FROM notes n
      LEFT JOIN note_tags nt ON n.id = nt.note_id
      LEFT JOIN tags t ON nt.tag_id = t.id
      WHERE n.search_vector @@ plainto_tsquery('english', ${query})
      GROUP BY n.id
      ORDER BY ts_rank(n.search_vector, plainto_tsquery('english', ${query})) DESC
    `;
  },
  update: async (id: number, note: Partial<Note>): Promise<NoteRecord | undefined> => {
    return sql.begin(async (transaction) => {
      const [updatedNote] = await transaction<NoteRecord[]>`
        UPDATE notes
        SET 
          title = COALESCE(${note.title!}, title), 
          content = COALESCE(${note.content}, content), 
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
            VALUES ${sql(note.tags.map((tag: any) => [tag]))}
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
  },
  delete: async (id: number): Promise<NoteRecord | undefined> => {
    const [deletedNote] = await sql<NoteRecord[]>`
      DELETE FROM notes
      WHERE id = ${id}
      RETURNING *
    `;
    return deletedNote;
  }
};