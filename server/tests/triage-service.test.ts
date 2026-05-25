import { describe, it, expect, beforeAll } from 'vitest';
import { migrate } from '../src/db/migrate';
import { createTriageEvent, getTriageHistory } from '../src/services/triage-service';

beforeAll(async () => {
  await migrate();
});

describe('Triage Service', () => {
  it('should create a triage event and retrieve history', async () => {
    const event = await createTriageEvent(1, 'open', 'false_positive', 'Alice', 'Not exploitable');
    expect(event.finding_id).toBe(1);
    expect(event.from_status).toBe('open');
    expect(event.to_status).toBe('false_positive');
    expect(event.reviewer).toBe('Alice');
    expect(event.justification).toBe('Not exploitable');
  });

  it('should return triage history', async () => {
    const history = await getTriageHistory(1);
    expect(history.length).toBeGreaterThanOrEqual(1);
    expect(history[0].finding_id).toBe(1);
  });
});
