# ReviewShield

Secure code review and SAST triage dashboard using Semgrep-style findings.

## Features

- **Repository Scanning** - Enter a local repo path and scan with custom Semgrep rules
- **Demo Mode** - Try the full workflow without Semgrep installed
- **Findings Dashboard** - Browse, filter, and inspect security findings
- **Triage Workflow** - Classify findings: Open, Needs Developer, Accepted Risk, False Positive, Fixed
- **PR Review Reports** - Export findings as Markdown reports
- **Secure Review Checklist** - Auth, access control, input validation, logging, secrets, dependencies
- **Baseline Support** - Track new findings only

## Custom Semgrep Rules (Bundled)

- **Hardcoded Secrets** - API keys, passwords, tokens in code
- **Unsafe eval()** - Dynamic code execution
- **SQL Injection** - String concatenation in queries
- **Command Injection** - Shell exec with user input
- **Missing Security Headers** - Express apps without helmet/CSP
- **Weak JWT Configuration** - Insecure algorithms, empty secrets

## Quick Start

### Prerequisites

- Node.js 20+
- npm

### Without Docker

```bash
# Install dependencies
cd server && npm install
cd ../frontend && npm install

# Start development servers
cd .. && npm run dev
```

The frontend runs on port 3000, backend on port 42000.

### With Docker

```bash
docker compose up --build
```

Access the app at http://localhost:42000

### Semgrep Setup (Optional)

Install Semgrep for real repository scanning:

```bash
pip install semgrep
```

Without Semgrep, the app runs in demo mode with pre-seeded findings.

## Usage

1. Open the dashboard
2. Enter a repository path or enable Demo Mode
3. Click "Start Scan"
4. View findings in the Scan Results page
5. Triage findings (classify status, add justification)
6. Export PR Review Report as Markdown
7. Use the Secure Review Checklist for manual review

## Safety

- **Local only** - All scanning is local. No code leaves your machine.
- **No auto-apply** - Generated patches are suggestions only, never auto-applied.
- **Authorization required** - Only scan systems you own or are authorized to test.

## Project Structure

```
reviewshield/
├── frontend/          # React + Vite + TypeScript + Tailwind
├── server/            # Node.js + Express + TypeScript + SQLite/Drizzle
├── rules/             # Custom Semgrep YAML rules
├── fixtures/          # Demo vulnerable app + mock data
├── e2e/               # Playwright end-to-end tests
├── docker-compose.yml
├── Dockerfile
└── .github/workflows/ci.yml
```

## License

MIT
