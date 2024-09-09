import fs from 'fs/promises';
import path from 'path';
import postgres from 'postgres';

const sql = postgres();

async function migrate() {
  try {
    console.log('Starting migration...');

    const sqlFile = await fs.readFile(
      path.join(process.cwd(), 'db/schema.sql'),
      'utf-8',
    );

    await sql.unsafe(sqlFile);

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sql.end();
  }
}

migrate();
