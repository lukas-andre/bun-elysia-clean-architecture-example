import { t } from 'elysia';

export const UserSchema = t.Object({
  username: t.String(),
  email: t.String(),
  password: t.String()
});

export const NoteSchema = t.Object({
  user_id: t.Number(),
  title: t.String(),
  content: t.String(),
  tags: t.Optional(t.Array(t.String()))
});

export type User = typeof UserSchema;
export type Note = typeof NoteSchema;