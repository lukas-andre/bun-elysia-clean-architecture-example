# Notes API

## Project Description

Notes API is a backend application that provides an interface for managing notes with full-text search capabilities. It uses modern and efficient technologies to offer optimal performance and a pleasant development experience.

### Key Features:
- Full CRUD operations for notes
- Full-text search in notes
- Tagging system for categorizing notes
- User authentication

## Technologies Used

1. **Bun**: Fast all-in-one JavaScript runtime
   - Runs JavaScript and TypeScript
   - Includes package manager, bundler, and test runner

2. **Elysia**: Minimal and efficient web framework for Bun
   - Static typing
   - High performance
   - Declarative API

3. **Postgres.js**: Native PostgreSQL client for Node.js and Bun
   - Full support for PostgreSQL features
   - High performance
   - Simple and powerful API

4. **PostgreSQL**: Relational database management system
   - Robust and reliable
   - Support for full-text search

## Project Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-username/notes-api.git
   cd notes-api
   ```

2. Install dependencies:
   ```
   bun install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Edit `.env` with your configurations

4. Start PostgreSQL database:
   ```
   bun run db:up
   ```

5. Run migrations:
   ```
   bun run db:migrate
   ```

6. Start the development server:
   ```
   bun run dev
   ```

The server will be available at `http://localhost:3000`

## Project Structure

```
/
├── src/
│   ├── routes/
│   │   ├── notes.ts
│   │   └── users.ts
│   ├── db/
│   │   └── index.ts
│   ├── middleware/
│   │   └── auth.ts
│   └── index.ts
├── migrations/
│   └── schema.sql
├── docker-compose.yml
├── .env
├── .env.example
├── package.json
└── README.md
```

## Useful Commands

- Start development server:
  ```
  bun run dev
  ```

- Run tests:
  ```
  bun test
  ```

- Run migrations:
  ```
  bun run db:migrate
  ```

- Build for production:
  ```
  bun run build
  ```

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the LICENSE file for details.