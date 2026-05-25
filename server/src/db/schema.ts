import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const scans = sqliteTable('scans', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  repo_path: text('repo_path').notNull(),
  is_baseline: integer('is_baseline').notNull().default(0),
  total_findings: integer('total_findings').notNull().default(0),
  critical: integer('critical').notNull().default(0),
  high: integer('high').notNull().default(0),
  medium: integer('medium').notNull().default(0),
  low: integer('low').notNull().default(0),
  new_findings: integer('new_findings').notNull().default(0),
  created_at: text('created_at').notNull(),
});

export const findings = sqliteTable('findings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  scan_id: integer('scan_id').notNull().references(() => scans.id),
  rule_id: text('rule_id').notNull(),
  file_path: text('file_path').notNull(),
  line: integer('line').notNull(),
  column: integer('column').notNull().default(0),
  severity: text('severity').notNull(),
  confidence: text('confidence').notNull(),
  owasp: text('owasp').notNull().default(''),
  cwe: text('cwe').notNull().default(''),
  message: text('message').notNull(),
  code_snippet: text('code_snippet').notNull().default(''),
  remediation: text('remediation').notNull().default(''),
  status: text('status').notNull().default('open'),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
});

export const triageEvents = sqliteTable('triage_events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  finding_id: integer('finding_id').notNull().references(() => findings.id),
  from_status: text('from_status').notNull(),
  to_status: text('to_status').notNull(),
  reviewer: text('reviewer').notNull(),
  justification: text('justification').notNull(),
  created_at: text('created_at').notNull(),
});

export const baselines = sqliteTable('baselines', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  scan_id: integer('scan_id').notNull().references(() => scans.id),
  finding_ids: text('finding_ids').notNull(),
  created_at: text('created_at').notNull(),
});
