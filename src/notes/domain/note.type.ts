import { Static, t } from 'elysia';

export const NoteSchema = t.Object({
  id: t.Number(),
  user_id: t.Number(),
  title: t.String(),
  content: t.String(),
  tags: t.Optional(t.Array(t.String())),
});

export type Note = Static<typeof NoteSchema>;
