import { Elysia, t } from 'elysia'
import postgres from 'postgres'

const sql = postgres();

const app = new Elysia()
  .decorate('db', sql)

  // Create a new note
  .post('/notes', async ({ body, db }) => {
    const { user_id, title, content, tags } = body
    return db.begin(async (sql) => {
      const [note] = await sql`
        INSERT INTO notes (user_id, title, content)
        VALUES (${user_id}, ${title}, ${content})
        RETURNING *
      `
      if (tags && tags.length > 0) {
        await sql`
          INSERT INTO tags (name)
          VALUES ${sql(tags.map(tag => [tag]))}
          ON CONFLICT (name) DO NOTHING
        `
        await sql`
          INSERT INTO note_tags (note_id, tag_id)
          SELECT ${note.id}, id FROM tags WHERE name IN ${sql(tags)}
        `
      }
      return note
    })
  }, {
    body: t.Object({
      user_id: t.Number(),
      title: t.String(),
      content: t.String(),
      tags: t.Optional(t.Array(t.String()))
    })
  })

  // Get a note by id
  .get('/notes/:id', async ({ params, db }) => {
    const [note] = await db`
      SELECT n.*, array_remove(array_agg(t.name), NULL) as tags
      FROM notes n
      LEFT JOIN note_tags nt ON n.id = nt.note_id
      LEFT JOIN tags t ON nt.tag_id = t.id
      WHERE n.id = ${params.id}
      GROUP BY n.id
    `
    return note || { error: 'Note not found' }
  })

  // Search notes
  .get('/notes/search', async ({ query, db }) => {
    const { q = '' } = query
    const notes = await db`
      SELECT n.*, array_remove(array_agg(t.name), NULL) as tags
      FROM notes n
      LEFT JOIN note_tags nt ON n.id = nt.note_id
      LEFT JOIN tags t ON nt.tag_id = t.id
      WHERE n.search_vector @@ plainto_tsquery('english', ${q})
      GROUP BY n.id
      ORDER BY ts_rank(n.search_vector, plainto_tsquery('english', ${q})) DESC
    `
    return notes
  })

  // Update a note
  .put('/notes/:id', async ({ params, body, db }) => {
    const { title, content, tags } = body
    return db.begin(async (sql) => {
      const [updatedNote] = await sql`
        UPDATE notes
        SET title = ${title}, content = ${content}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${params.id}
        RETURNING *
      `
      if (!updatedNote) {
        throw new Error('Note not found')
      }
      if (tags !== undefined) {
        await sql`DELETE FROM note_tags WHERE note_id = ${updatedNote.id}`
        if (tags.length > 0) {
          await sql`
            INSERT INTO tags (name)
            VALUES ${sql(tags.map(tag => [tag]))}
            ON CONFLICT (name) DO NOTHING
          `
          await sql`
            INSERT INTO note_tags (note_id, tag_id)
            SELECT ${updatedNote.id}, id FROM tags WHERE name IN ${sql(tags)}
          `
        }
      }
      return updatedNote
    })
  }, {
    body: t.Object({
      title: t.String(),
      content: t.String(),
      tags: t.Optional(t.Array(t.String()))
    })
  })

  // Delete a note
  .delete('/notes/:id', async ({ params, db }) => {
    const [deletedNote] = await db`
      DELETE FROM notes
      WHERE id = ${params.id}
      RETURNING *
    `
    return deletedNote || { error: 'Note not found' }
  })

  .listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)


console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)