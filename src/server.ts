import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import routes from './routes'

const app = new Elysia()
  .use(swagger({
    documentation: {
      info: {
        title: 'Notes API',
        version: '1.0.0',
        description: 'API for managing notes'
      },
      tags: [
        { name: 'Notes', description: 'Note management endpoints' },
        { name: 'Users', description: 'User management endpoints' }
      ]
    }
  }))
  .use(routes)
  .listen(4000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
console.log(`Swagger documentation available at /swagger`)