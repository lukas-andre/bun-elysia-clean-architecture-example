import { Static, t } from 'elysia';

export const UserSchema = t.Object({
  id: t.Number(),
  username: t.String(),
  email: t.String(),
  password: t.String()
});

export type User = Static<typeof UserSchema>;