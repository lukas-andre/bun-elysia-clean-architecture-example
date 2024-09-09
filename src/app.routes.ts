import { route as AuthRoute } from './auth/infrastructure/auth.routes';
import { route as NoteRoute } from './notes/infrastructure/note.routes';
import Elysia from 'elysia';

const route = new Elysia({ prefix: 'api/v1' }).use(AuthRoute).use(NoteRoute);

export { route as AppRoutes };
