import { route as UserRoute} from './users/infrastructure/routes'
import { route as NoteRoute} from './notes/infrastructure/routes'
import Elysia from 'elysia'

const route = new Elysia({ prefix: '/api' })
    .use(UserRoute)
    .use(NoteRoute)

export { route as APIRoute }