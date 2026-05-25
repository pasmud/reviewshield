import { describe, it, expect, beforeAll } from 'vitest';
import { migrate } from '../src/db/migrate';
import { createScan, insertFindings, getFindings, updateFindingStatus, getScan } from '../src/services/finding-service';
import { Finding } from '../src/types';

beforeAll(async () => {
  await migrate();
});

describe('Finding Service', () => {
  it('should create a scan and return it', async () => {
    const scan = await createScan('/test/repo', true);
    expect(scan.repo_path).toBe('/test/repo');
    expect(scan.is_baseline).toBe(1);
  });

  it('should insert findings and retrieve them', async () => {
    const scan = await createScan('/test/repo2', false);
    const findingsList: Finding[] = [
      { scan_id: scan.id!, rule_id: 'test-rule', file_path: 'test.js', line: 10, column: 1, severity: 'high', confidence: 'high', owasp: 'A03:2021 - Injection', cwe: 'CWE-89', message: 'Test finding', code_snippet: 'test code', remediation: 'fix it', status: 'open' },
    ];
    const inserted = await insertFindings(findingsList);
    expect(inserted.length).toBe(1);
    expect(inserted[0].rule_id).toBe('test-rule');
    expect(inserted[0].status).toBe('open');

    const retrieved = await getFindings(scan.id!);
    expect(retrieved.length).toBe(1);
  });

  it('should update finding status', async () => {
    const scan = await createScan('/test/repo3', false);
    const findingsList: Finding[] = [
      { scan_id: scan.id!, rule_id: 'test-rule', file_path: 'test.js', line: 5, column: 1, severity: 'low', confidence: 'medium', owasp: '', cwe: '', message: 'test', code_snippet: '', remediation: '', status: 'open' },
    ];
    const [inserted] = await insertFindings(findingsList);

    const updated = await updateFindingStatus(inserted.id!, 'false_positive');
    expect(updated).not.toBeNull();
    expect(updated!.status).toBe('false_positive');
  });

  it('should filter findings by severity', async () => {
    const scan = await createScan('/test/repo4', false);
    await insertFindings([
      { scan_id: scan.id!, rule_id: 'r1', file_path: 'a.js', line: 1, column: 1, severity: 'critical', confidence: 'high', owasp: '', cwe: '', message: 'critical', code_snippet: '', remediation: '', status: 'open' },
      { scan_id: scan.id!, rule_id: 'r2', file_path: 'b.js', line: 2, column: 1, severity: 'low', confidence: 'high', owasp: '', cwe: '', message: 'low', code_snippet: '', remediation: '', status: 'open' },
    ]);
    const criticalFindings = await getFindings(scan.id!, undefined, 'critical');
    expect(criticalFindings.length).toBe(1);
    expect(criticalFindings[0].severity).toBe('critical');
  });
});
