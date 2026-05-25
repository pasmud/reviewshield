import { getDb, saveDb } from '../db';
import { triageEvents } from '../db/schema';
import { eq } from 'drizzle-orm';
import { TriageEvent } from '../types';

export async function createTriageEvent(
  findingId: number,
  fromStatus: string,
  toStatus: string,
  reviewer: string,
  justification: string
): Promise<TriageEvent> {
  const db = getDb();
  const now = new Date().toISOString();
  const [event] = await db.insert(triageEvents).values({
    finding_id: findingId,
    from_status: fromStatus,
    to_status: toStatus,
    reviewer,
    justification,
    created_at: now,
  }).returning();
  saveDb();
  return event as TriageEvent;
}

export async function getTriageHistory(findingId: number): Promise<TriageEvent[]> {
  const db = getDb();
  const result = await db
    .select()
    .from(triageEvents)
    .where(eq(triageEvents.finding_id, findingId))
    .orderBy(triageEvents.created_at);
  return result as TriageEvent[];
}
