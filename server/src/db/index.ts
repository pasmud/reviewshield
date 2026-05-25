import { drizzle } from 'drizzle-orm/sql-js';
import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let _sqlite: SqlJsDatabase | null = null;
let _initialized = false;

export async function initDb() {
  if (_initialized) return;
  
  const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'reviewshield.db');
  const dbDir = path.dirname(dbPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const SQL = await initSqlJs();
  
  let buffer: Buffer | null = null;
  if (fs.existsSync(dbPath)) {
    buffer = fs.readFileSync(dbPath);
  }
  
  _sqlite = new SQL.Database(buffer);
  _sqlite.run('PRAGMA foreign_keys = ON');
  _db = drizzle(_sqlite, { schema });
  _initialized = true;
}

export function getDb() {
  if (!_db) throw new Error('Database not initialized. Call initDb() first.');
  return _db;
}

export function getSqlite() {
  if (!_sqlite) throw new Error('Database not initialized. Call initDb() first.');
  return _sqlite;
}

export function saveDb() {
  if (!_sqlite) throw new Error('Database not initialized.');
  const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'reviewshield.db');
  const data = _sqlite.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}
