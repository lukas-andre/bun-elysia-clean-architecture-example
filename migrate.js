import postgres from 'postgres';
import fs from 'fs/promises';
import path from 'path';

const sql = postgres();

async function migrate() {
  try {
    console.log('Starting migration...');

    // Read the SQL file
    const sqlFile = await fs.readFile(path.join(process.cwd(), 'schema.sql'), 'utf-8');

    // Split the file into individual statements
    const statements = sqlFile.split(';').filter(statement => statement.trim() !== '');

    // Execute each statement
    for (const statement of statements) {
      await sql.unsafe(statement);
      console.log('Executed statement:', statement.slice(0, 50) + '...');
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sql.end();
  }
}

migrate();