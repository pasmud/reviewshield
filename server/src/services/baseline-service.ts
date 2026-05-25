import { getDb, saveDb } from '../db';
import { baselines } from '../db/schema';
import { eq } from 'drizzle-orm';
import { Baseline, Finding } from '../types';

export async function createBaseline(scanId: number, findingIds: number[]): Promise<Baseline> {
  const db = getDb();
  const now = new Date().toISOString();
  const [baseline] = await db.insert(baselines).values({
    scan_id: scanId,
    finding_ids: JSON.stringify(findingIds),
    created_at: now,
  }).returning();
  saveDb();
  return baseline as Baseline;
}

export async function getLatestBaseline(): Promise<Baseline | null> {
  const db = getDb();
  const [baseline] = await db
    .select()
    .from(baselines)
    .orderBy(baselines.created_at);
  return (baseline as Baseline) || null;
}

export function filterNewFindings(findingsList: Finding[], baselineFindingIds: number[]): Finding[] {
  return findingsList.filter(f => !baselineFindingIds.includes(f.id!));
}
