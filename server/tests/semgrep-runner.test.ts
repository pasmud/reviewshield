import { describe, it, expect } from 'vitest';
import { loadMockFindings } from '../src/services/semgrep-runner';

describe('Semgrep Runner', () => {
  it('should load mock findings for demo mode', () => {
    const findings = loadMockFindings();
    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0]).toHaveProperty('rule_id');
    expect(findings[0]).toHaveProperty('severity');
    expect(findings[0]).toHaveProperty('message');
    expect(findings[0]).toHaveProperty('remediation');
  });

  it('should have at least one CRITICAL finding', () => {
    const findings = loadMockFindings();
    const critical = findings.filter(f => f.severity === 'critical');
    expect(critical.length).toBeGreaterThanOrEqual(1);
  });

  it('should have remediation for all findings', () => {
    const findings = loadMockFindings();
    findings.forEach(f => {
      expect(f.remediation).toBeTruthy();
    });
  });
});
