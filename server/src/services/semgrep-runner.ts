import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { SemgrepResult, SemgrepMatch, Finding } from '../types';

const DEMO_MODE_FILE = path.join(__dirname, '..', '..', '..', 'fixtures', 'mock-semgrep-output.json');

export function isSemgrepInstalled(): boolean {
  try {
    execSync('semgrep --version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

export function runSemgrepScan(repoPath: string, rulesDir: string): Finding[] {
  const results: SemgrepMatch[] = [];

  if (!fs.existsSync(rulesDir)) {
    throw new Error(`Rules directory not found: ${rulesDir}`);
  }

  const ruleFiles = fs.readdirSync(rulesDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));

  for (const ruleFile of ruleFiles) {
    const rulePath = path.join(rulesDir, ruleFile);
    try {
      const output = execSync(
        `semgrep --config "${rulePath}" "${repoPath}" --json --no-rewrite-rule-ids`,
        { stdio: 'pipe', encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
      );
      const parsed: SemgrepResult = JSON.parse(output);
      results.push(...parsed.results);
    } catch (err: any) {
      if (err.stdout) {
        try {
          const parsed: SemgrepResult = JSON.parse(err.stdout);
          results.push(...parsed.results);
        } catch {
          console.warn(`Error parsing semgrep output for ${ruleFile}:`, err.message);
        }
      }
    }
  }

  return results.map(mapSemgrepMatchToFinding);
}

function mapSemgrepMatchToFinding(match: SemgrepMatch): Finding {
  return {
    rule_id: match.check_id,
    file_path: match.path,
    line: match.start.line,
    column: match.start.col,
    severity: mapSeverity(match.extra.severity),
    confidence: mapConfidence(match.extra.metadata?.confidence),
    owasp: match.extra.metadata?.owasp || '',
    cwe: match.extra.metadata?.cwe || '',
    message: match.extra.message,
    code_snippet: match.extra.lines || '',
    remediation: match.extra.metadata?.remediation || '',
    status: 'open',
  };
}

function mapSeverity(sev: string): 'critical' | 'high' | 'medium' | 'low' | 'info' {
  const s = sev?.toLowerCase() || 'medium';
  if (s === 'critical' || s === 'error') return 'critical';
  if (s === 'high' || s === 'warning') return 'high';
  if (s === 'medium') return 'medium';
  if (s === 'low') return 'low';
  return 'info';
}

function mapConfidence(conf?: string): 'high' | 'medium' | 'low' {
  const c = conf?.toLowerCase() || 'medium';
  if (c === 'high') return 'high';
  if (c === 'low') return 'low';
  return 'medium';
}

export function loadMockFindings(): Finding[] {
  return [
    { rule_id: 'no-hardcoded-secrets', file_path: 'fixtures/vulnerable-app/app.js', line: 7, column: 1, severity: 'high', confidence: 'medium', owasp: 'A02:2021 - Cryptographic Failures', cwe: 'CWE-798', message: 'Hardcoded secret detected. Use environment variables instead.', code_snippet: "const SECRET = 'hardcoded-secret-key-12345';", remediation: 'Move secrets to environment variables: const SECRET = process.env.JWT_SECRET;', status: 'open' },
    { rule_id: 'no-hardcoded-secrets', file_path: 'fixtures/vulnerable-app/app.js', line: 27, column: 1, severity: 'high', confidence: 'high', owasp: 'A02:2021 - Cryptographic Failures', cwe: 'CWE-798', message: 'Hardcoded password detected.', code_snippet: "password: 'supersecret123'", remediation: 'Use hashed passwords stored in a database.', status: 'open' },
    { rule_id: 'weak-jwt-configuration', file_path: 'fixtures/vulnerable-app/app.js', line: 24, column: 1, severity: 'high', confidence: 'high', owasp: 'A02:2021 - Cryptographic Failures', cwe: 'CWE-345', message: 'JWT with insecure algorithm. Avoid "none" algorithm.', code_snippet: "jwt.sign({ id: user.id, username: user.username }, SECRET, { algorithm: 'none' })", remediation: 'Use RS256 or ES256 with proper key management.', status: 'open' },
    { rule_id: 'no-sql-injection', file_path: 'fixtures/vulnerable-app/app.js', line: 31, column: 1, severity: 'critical', confidence: 'high', owasp: 'A03:2021 - Injection', cwe: 'CWE-89', message: 'SQL injection vulnerability. Use parameterized queries.', code_snippet: "const query = 'SELECT * FROM users WHERE id = ' + req.params.id;", remediation: 'Use parameterized queries: db.get("SELECT * FROM users WHERE id = ?", [req.params.id], ...)', status: 'open' },
    { rule_id: 'no-command-injection', file_path: 'fixtures/vulnerable-app/app.js', line: 37, column: 1, severity: 'critical', confidence: 'high', owasp: 'A03:2021 - Injection', cwe: 'CWE-78', message: 'Command injection vulnerability. Avoid passing user input to exec().', code_snippet: "exec(cmd, (error, stdout, stderr) => {", remediation: 'Use safer APIs or validate/sanitize input strictly.', status: 'open' },
    { rule_id: 'no-unsafe-eval', file_path: 'fixtures/vulnerable-app/app.js', line: 44, column: 1, severity: 'high', confidence: 'high', owasp: 'A03:2021 - Injection', cwe: 'CWE-95', message: 'Unsafe eval() usage. Can lead to code injection.', code_snippet: "const greeting = eval('\"' + name + '\"');", remediation: 'Avoid eval(). Use JSON.parse() or other safe parsers.', status: 'open' },
    { rule_id: 'no-hardcoded-secrets', file_path: 'fixtures/vulnerable-app/app.js', line: 50, column: 1, severity: 'high', confidence: 'medium', owasp: 'A02:2021 - Cryptographic Failures', cwe: 'CWE-798', message: 'Hardcoded API key detected.', code_snippet: "api_key: 'sk-1234567890abcdef'", remediation: 'Use environment variables and a secrets manager.', status: 'open' },
    { rule_id: 'missing-security-headers', file_path: 'fixtures/vulnerable-app/app.js', line: 4, column: 1, severity: 'medium', confidence: 'medium', owasp: 'A05:2021 - Security Misconfiguration', cwe: 'CWE-693', message: 'No security headers detected. Consider using helmet().', code_snippet: 'const app = express();', remediation: 'Add helmet middleware: app.use(require("helmet")())', status: 'open' },
  ];
}
