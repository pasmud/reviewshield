export interface Finding {
  id?: number;
  scan_id?: number;
  rule_id: string;
  file_path: string;
  line: number;
  column: number;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  confidence: 'high' | 'medium' | 'low';
  owasp: string;
  cwe: string;
  message: string;
  code_snippet: string;
  remediation: string;
  status: 'open' | 'needs_developer' | 'accepted_risk' | 'false_positive' | 'fixed';
  created_at?: string;
  updated_at?: string;
}

export interface Scan {
  id?: number;
  repo_path: string;
  is_baseline: number;
  total_findings: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  new_findings: number;
  created_at?: string;
}

export interface TriageEvent {
  id?: number;
  finding_id: number;
  from_status: string;
  to_status: string;
  reviewer: string;
  justification: string;
  created_at?: string;
}

export interface Baseline {
  id?: number;
  scan_id: number;
  finding_ids: string;
  created_at?: string;
}

export interface SemgrepResult {
  results: SemgrepMatch[];
  errors: any[];
}

export interface SemgrepMatch {
  check_id: string;
  path: string;
  start: { line: number; col: number };
  end: { line: number; col: number };
  extra: {
    message: string;
    severity: string;
    metadata: {
      owasp?: string;
      cwe?: string;
      confidence?: string;
      remediation?: string;
    };
    lines: string;
  };
}
