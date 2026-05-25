# ReviewShield Architecture

## System Overview
```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│  React + Vite + TypeScript + Tailwind CSS                   │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP (REST API)
┌─────────────────────▼───────────────────────────────────────┐
│                   Express API Server                         │
│  TypeScript + Drizzle ORM + SQLite                          │
│                                                             │
│  ┌─────────────────┐  ┌──────────────────┐                  │
│  │ Semgrep Runner  │  │ Findings Service  │                  │
│  │ (CLI wrapper)   │  │ Triage Workflow   │                  │
│  └────────┬────────┘  └──────────────────┘                  │
│           │                                                  │
│  ┌────────▼────────┐                                        │
│  │ Custom Rules    │                                        │
│  │ (YAML)          │                                        │
│  └─────────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture
- React 18 with hooks-based components
- React Router for navigation
- Tailwind CSS for styling
- Fetch API for backend communication
- Pages: Dashboard, Scan Results, Triage, Report Export, Settings

## Backend Architecture
- Express.js REST API
- SQLite database via Drizzle ORM
- Service layer: ScanService, FindingService, TriageService, ExportService, BaselineService
- Semgrep CLI wrapper for actual scanning
- Demo/mock data provider when Semgrep not available

## Data Flow
1. User submits scan request with repo path
2. Server validates path, runs Semgrep (or loads mock data)
3. Findings parsed and stored in SQLite
4. First scan auto-establishes baseline
5. Findings returned to frontend for display
6. User triages findings -> status changes stored with audit trail
7. User exports PR review report -> generated as Markdown

## Security
- Local-only execution
- No external network calls from the scanner
- Input validation on repo paths (no command injection)
- All processing is local
