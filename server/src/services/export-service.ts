import { Finding, Scan } from '../types';

export function generatePRReport(scan: Scan, findingsList: Finding[]): string {
  const lines: string[] = [];
  lines.push(`# ReviewShield PR Review Report`);
  lines.push(``);
  lines.push(`**Repository:** ${scan.repo_path}`);
  lines.push(`**Scan Date:** ${scan.created_at}`);
  lines.push(`**Total Findings:** ${scan.total_findings}`);
  lines.push(``);
  lines.push(`## Severity Summary`);
  lines.push(``);
  lines.push(`| Severity | Count |`);
  lines.push(`|----------|-------|`);
  lines.push(`| Critical | ${scan.critical} |`);
  lines.push(`| High     | ${scan.high} |`);
  lines.push(`| Medium   | ${scan.medium} |`);
  lines.push(`| Low      | ${scan.low} |`);
  lines.push(``);
  lines.push(`## Findings`);
  lines.push(``);

  const sorted = [...findingsList].sort((a, b) => {
    const order: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
    return (order[a.severity] ?? 99) - (order[b.severity] ?? 99);
  });

  for (const f of sorted) {
    lines.push(`### ${f.severity.toUpperCase()}: ${f.rule_id}`);
    lines.push(``);
    lines.push(`- **File:** ${f.file_path}:${f.line}`);
    lines.push(`- **Severity:** ${f.severity}`);
    lines.push(`- **Confidence:** ${f.confidence}`);
    lines.push(`- **OWASP:** ${f.owasp || 'N/A'}`);
    lines.push(`- **CWE:** ${f.cwe || 'N/A'}`);
    lines.push(`- **Status:** ${f.status}`);
    lines.push(``);
    lines.push(`**Message:** ${f.message}`);
    lines.push(``);
    if (f.code_snippet) {
      lines.push('```javascript');
      lines.push(f.code_snippet);
      lines.push('```');
      lines.push(``);
    }
    if (f.remediation) {
      lines.push(`**Recommended Fix:** ${f.remediation}`);
      lines.push(``);
    }
    lines.push(`---`);
    lines.push(``);
  }

  return lines.join('\n');
}
