import { describe, it, expect } from 'vitest';
import { generatePRReport } from '../src/services/export-service';
import { Scan, Finding } from '../src/types';

describe('Export Service', () => {
  it('should generate a markdown report', () => {
    const scan: Scan = {
      id: 1, repo_path: '/test', is_baseline: 1,
      total_findings: 2, critical: 0, high: 1, medium: 1, low: 0, new_findings: 2,
      created_at: '2025-01-01T00:00:00Z',
    };
    const findings: Finding[] = [
      { id: 1, scan_id: 1, rule_id: 'no-eval', file_path: 'app.js', line: 10, column: 1, severity: 'high', confidence: 'high', owasp: 'A03:2021', cwe: 'CWE-95', message: 'Eval detected', code_snippet: 'eval(x)', remediation: 'Avoid eval', status: 'open', created_at: '', updated_at: '' },
    ];

    const report = generatePRReport(scan, findings);
    expect(report).toContain('# ReviewShield PR Review Report');
    expect(report).toContain('no-eval');
    expect(report).toContain('HIGH');
    expect(report).toContain('Avoid eval');
  });
});
