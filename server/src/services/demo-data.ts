import { Finding, Scan } from '../types';

export function getDemoScan(): Scan {
  return {
    id: 1,
    repo_path: 'fixtures/vulnerable-app/',
    is_baseline: 1,
    total_findings: 8,
    critical: 2,
    high: 4,
    medium: 2,
    low: 0,
    new_findings: 8,
    created_at: new Date().toISOString(),
  };
}

export const demoFindings: Finding[] = [
  { id: 1, scan_id: 1, rule_id: 'no-hardcoded-secrets', file_path: 'fixtures/vulnerable-app/app.js', line: 7, column: 1, severity: 'high', confidence: 'medium', owasp: 'A02:2021 - Cryptographic Failures', cwe: 'CWE-798', message: 'Hardcoded secret detected. Use environment variables instead.', code_snippet: "const SECRET = 'hardcoded-secret-key-12345';", remediation: 'Move secrets to environment variables: const SECRET = process.env.JWT_SECRET;', status: 'open', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 2, scan_id: 1, rule_id: 'no-hardcoded-secrets', file_path: 'fixtures/vulnerable-app/app.js', line: 27, column: 1, severity: 'high', confidence: 'high', owasp: 'A02:2021 - Cryptographic Failures', cwe: 'CWE-798', message: 'Hardcoded password detected.', code_snippet: "password: 'supersecret123'", remediation: 'Use hashed passwords stored in a database.', status: 'open', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 3, scan_id: 1, rule_id: 'weak-jwt-configuration', file_path: 'fixtures/vulnerable-app/app.js', line: 24, column: 1, severity: 'high', confidence: 'high', owasp: 'A02:2021 - Cryptographic Failures', cwe: 'CWE-345', message: 'JWT with insecure algorithm. Avoid "none" algorithm.', code_snippet: "jwt.sign({ id: user.id, username: user.username }, SECRET, { algorithm: 'none' })", remediation: 'Use RS256 or ES256 with proper key management.', status: 'open', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 4, scan_id: 1, rule_id: 'no-sql-injection', file_path: 'fixtures/vulnerable-app/app.js', line: 31, column: 1, severity: 'critical', confidence: 'high', owasp: 'A03:2021 - Injection', cwe: 'CWE-89', message: 'SQL injection vulnerability. Use parameterized queries.', code_snippet: "const query = 'SELECT * FROM users WHERE id = ' + req.params.id;", remediation: 'Use parameterized queries: db.get("SELECT * FROM users WHERE id = ?", [req.params.id], ...)', status: 'open', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 5, scan_id: 1, rule_id: 'no-command-injection', file_path: 'fixtures/vulnerable-app/app.js', line: 37, column: 1, severity: 'critical', confidence: 'high', owasp: 'A03:2021 - Injection', cwe: 'CWE-78', message: 'Command injection vulnerability. Avoid passing user input to exec().', code_snippet: "exec(cmd, (error, stdout, stderr) => {", remediation: 'Use safer APIs or validate/sanitize input strictly.', status: 'open', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 6, scan_id: 1, rule_id: 'no-unsafe-eval', file_path: 'fixtures/vulnerable-app/app.js', line: 44, column: 1, severity: 'high', confidence: 'high', owasp: 'A03:2021 - Injection', cwe: 'CWE-95', message: 'Unsafe eval() usage. Can lead to code injection.', code_snippet: "const greeting = eval('\"' + name + '\"');", remediation: 'Avoid eval(). Use JSON.parse() or other safe parsers.', status: 'open', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 7, scan_id: 1, rule_id: 'no-hardcoded-secrets', file_path: 'fixtures/vulnerable-app/app.js', line: 50, column: 1, severity: 'high', confidence: 'medium', owasp: 'A02:2021 - Cryptographic Failures', cwe: 'CWE-798', message: 'Hardcoded API key detected.', code_snippet: "api_key: 'sk-1234567890abcdef'", remediation: 'Use environment variables and a secrets manager.', status: 'open', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 8, scan_id: 1, rule_id: 'missing-security-headers', file_path: 'fixtures/vulnerable-app/app.js', line: 4, column: 1, severity: 'medium', confidence: 'medium', owasp: 'A05:2021 - Security Misconfiguration', cwe: 'CWE-693', message: 'No security headers detected. Consider using helmet().', code_snippet: 'const app = express();', remediation: 'Add helmet middleware: app.use(require("helmet")())', status: 'open', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];
