const API_BASE = '/api';

export interface Finding {
  id: number;
  scan_id: number;
  rule_id: string;
  file_path: string;
  line: number;
  column: number;
  severity: string;
  confidence: string;
  owasp: string;
  cwe: string;
  message: string;
  code_snippet: string;
  remediation: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Scan {
  id: number;
  repo_path: string;
  is_baseline: number;
  total_findings: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  new_findings: number;
  created_at: string;
}

export async function checkStatus(): Promise<{ semgrepInstalled: boolean }> {
  const res = await fetch(`${API_BASE}/scan/status`);
  return res.json();
}

export async function startScan(repoPath: string, useDemo: boolean): Promise<{ scan: Scan; findings: Finding[]; demoMode: boolean }> {
  const res = await fetch(`${API_BASE}/scan/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repoPath, useDemo }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Scan failed');
  }
  return res.json();
}

export async function getFindings(scanId?: number, status?: string, severity?: string): Promise<Finding[]> {
  const params = new URLSearchParams();
  if (scanId) params.set('scanId', String(scanId));
  if (status) params.set('status', status);
  if (severity) params.set('severity', severity);
  const res = await fetch(`${API_BASE}/findings?${params}`);
  return res.json();
}

export async function triageFinding(findingId: number, status: string, reviewer: string, justification: string): Promise<Finding> {
  const res = await fetch(`${API_BASE}/triage/${findingId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, reviewer, justification }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Triage failed');
  }
  return res.json();
}

export async function getTriageHistory(findingId: number): Promise<any[]> {
  const res = await fetch(`${API_BASE}/triage/${findingId}/history`);
  return res.json();
}

export async function getChecklist(): Promise<Record<string, { item: string; status: string }[]>> {
  const res = await fetch(`${API_BASE}/checklist`);
  return res.json();
}

export function downloadPRReport(scanId: number) {
  window.open(`${API_BASE}/export/pr-report/${scanId}`, '_blank');
}
