import { getDb, saveDb } from '../db';
import { findings, scans } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { Finding, Scan } from '../types';

export async function createScan(repoPath: string, isBaseline: boolean): Promise<Scan> {
  const db = getDb();
  const now = new Date().toISOString();
  const [scan] = await db.insert(scans).values({
    repo_path: repoPath,
    is_baseline: isBaseline ? 1 : 0,
    total_findings: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    new_findings: 0,
    created_at: now,
  }).returning();
  saveDb();
  return scan as Scan;
}

export async function insertFindings(findingsList: Finding[]): Promise<Finding[]> {
  const db = getDb();
  const now = new Date().toISOString();
  const rows = findingsList.map(f => ({
    scan_id: f.scan_id!,
    rule_id: f.rule_id,
    file_path: f.file_path,
    line: f.line,
    column: f.column || 0,
    severity: f.severity,
    confidence: f.confidence,
    owasp: f.owasp || '',
    cwe: f.cwe || '',
    message: f.message,
    code_snippet: f.code_snippet || '',
    remediation: f.remediation || '',
    status: 'open',
    created_at: now,
    updated_at: now,
  }));
  const inserted = await db.insert(findings).values(rows).returning();
  saveDb();
  return inserted as Finding[];
}

export async function getFindings(scanId?: number, status?: string, severity?: string): Promise<Finding[]> {
  const db = getDb();
  const conditions: any[] = [];
  if (scanId) conditions.push(eq(findings.scan_id, scanId));
  if (status) conditions.push(eq(findings.status, status));
  if (severity) conditions.push(eq(findings.severity, severity));

  const query = db.select().from(findings);
  if (conditions.length > 0) {
    (query as any).where(and(...conditions));
  }
  const result = await query;
  return result as Finding[];
}

export async function updateFindingStatus(
  findingId: number,
  newStatus: string
): Promise<Finding | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const [updated] = await db.update(findings)
    .set({ status: newStatus, updated_at: now })
    .where(eq(findings.id, findingId))
    .returning();
  saveDb();
  return (updated as Finding) || null;
}

export async function updateScanCounts(scanId: number): Promise<void> {
  const db = getDb();
  const allFindings = await db.select().from(findings).where(eq(findings.scan_id, scanId));
  const counts = {
    total_findings: allFindings.length,
    critical: allFindings.filter(f => f.severity === 'critical').length,
    high: allFindings.filter(f => f.severity === 'high').length,
    medium: allFindings.filter(f => f.severity === 'medium').length,
    low: allFindings.filter(f => f.severity === 'low').length,
  };
  await db.update(scans)
    .set(counts)
    .where(eq(scans.id, scanId));
  saveDb();
}

export async function getScan(scanId: number): Promise<Scan | null> {
  const db = getDb();
  const [scan] = await db.select().from(scans).where(eq(scans.id, scanId));
  return (scan as Scan) || null;
}

export async function getAllScans(): Promise<Scan[]> {
  const db = getDb();
  const result = await db.select().from(scans).orderBy(scans.created_at);
  return result as Scan[];
}
