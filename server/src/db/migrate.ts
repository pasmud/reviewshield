import { initDb, getSqlite, saveDb } from './index';

export async function migrate() {
  await initDb();
  
  const sqlite = getSqlite();
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS scans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      repo_path TEXT NOT NULL,
      is_baseline INTEGER NOT NULL DEFAULT 0,
      total_findings INTEGER NOT NULL DEFAULT 0,
      critical INTEGER NOT NULL DEFAULT 0,
      high INTEGER NOT NULL DEFAULT 0,
      medium INTEGER NOT NULL DEFAULT 0,
      low INTEGER NOT NULL DEFAULT 0,
      new_findings INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS findings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scan_id INTEGER NOT NULL REFERENCES scans(id),
      rule_id TEXT NOT NULL,
      file_path TEXT NOT NULL,
      line INTEGER NOT NULL,
      column INTEGER NOT NULL DEFAULT 0,
      severity TEXT NOT NULL,
      confidence TEXT NOT NULL,
      owasp TEXT NOT NULL DEFAULT '',
      cwe TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL,
      code_snippet TEXT NOT NULL DEFAULT '',
      remediation TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'open',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS triage_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      finding_id INTEGER NOT NULL REFERENCES findings(id),
      from_status TEXT NOT NULL,
      to_status TEXT NOT NULL,
      reviewer TEXT NOT NULL,
      justification TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS baselines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scan_id INTEGER NOT NULL REFERENCES scans(id),
      finding_ids TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
  
  saveDb();
}
