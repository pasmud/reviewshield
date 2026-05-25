# ReviewShield Product Specification

## Overview
ReviewShield is a secure code review and SAST triage dashboard that helps security engineers and developers manage Semgrep-style findings. It runs locally, no data leaves the machine.

## Core Features

### 1. Repository Scanning
- User enters a local repo path
- Detects if Semgrep is installed; if not, offers demo/mocked findings mode
- Scans with bundled custom rules + optional standard rules

### 2. Custom Semgrep Rules (Bundled)
- Hardcoded secrets detection
- Unsafe eval() usage
- SQL injection (parameterized query enforcement)
- Command injection (shell exec patterns)
- Missing security headers (Express)
- Weak JWT configuration

### 3. Findings Dashboard
- Table with columns: Rule ID, File, Line, Severity, OWASP Mapping, Confidence, Status
- Inline code snippet with line highlighted
- Expandable safe/unsafe context
- Filters by severity, status, rule

### 4. Triage Workflow
- Statuses: Open, Needs Developer, Accepted Risk, False Positive, Fixed
- Each status change records reviewer + timestamp + justification
- Track triage history per finding

### 5. Secure Review Checklist Generator
- Auth (authentication mechanisms, session management)
- Access Control (authorization checks, role enforcement)
- Input Validation (sanitization, encoding)
- Logging (sensitive data exposure, log levels)
- Secrets (hardcoded secrets, env var usage)
- Dependencies (known vulnerable versions)

### 6. PR Review Report Export
- Markdown format
- Summary statistics
- Severity breakdown chart
- Per-finding details with code snippets
- Remediation recommendations

### 7. Baseline Support
- First scan establishes baseline
- Subsequent scans only show new findings
- Option to review/reset baseline

### 8. Demo Mode
- Pre-seeded vulnerable code fixture
- Mocked scan results if Semgrep not installed
- Full triage workflow works in demo mode
