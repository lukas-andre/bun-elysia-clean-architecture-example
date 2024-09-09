import postgres from 'postgres';

import { DATABASE_URL } from './env';

const sql = postgres(DATABASE_URL);

export default sql;
