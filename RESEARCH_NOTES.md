# Research Notes: ReviewShield

## Semgrep SAST
- Semgrep is a lightweight, multi-language static analysis tool
- Uses YAML rules with pattern matching and data-flow analysis
- Supports cross-function (interprocedural) analysis within single files
- Community Edition does single-function analysis
- Rules can detect OWASP vulnerabilities, hardcoded secrets, injection flaws
- Custom rules use Semgrep syntax: patterns, metavariables, ellipsis operators
- Registry has community-contributed rules for many languages/frameworks

## Secure Code Review
- Review checklist should cover: authentication, access control, input validation, logging, secrets management, dependency checks
- OWASP Top 10 (2021): Broken Access Control (#1), Cryptographic Failures (#2), Injection (#3), Insecure Design (#4), Security Misconfiguration (#5)
- Findings need: severity, confidence, OWASP mapping, code snippet, remediation guidance

## Finding Triage
- 30-70% of SAST findings are false positives
- Effective triage workflow: Open -> Needs Developer -> Accepted Risk -> False Positive -> Fixed
- Baseline support critical: mark existing findings as baseline, only show new findings in future scans
- Suppression must include justification for audit compliance

## Developer Remediation Workflows
- Focus on architectural fixes over tactical patches
- Risk-based prioritization: Critical/High first
- Provide concrete, language-specific fix guidance
- Track time-to-remediate, not just finding count
- PR review reports should include summary, severity breakdown, and per-finding details

## Tech Stack Decisions
- Frontend: React 18+, Vite, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: SQLite via Drizzle ORM
- Testing: Vitest (unit/integration), Playwright (E2E)
- Container: Docker multi-stage build, docker-compose
- CI: GitHub Actions (lint, typecheck, test, build)
