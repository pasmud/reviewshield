# ReviewShield Test Plan

## Unit Tests (Vitest)

### Backend
- SemgrepRunner: parse output, handle errors, mock mode
- FindingService: CRUD, filtering, status transitions
- TriageService: status change validation, audit trail
- BaselineService: create baseline, diff new findings
- ExportService: generate Markdown PR report
- DemoDataProvider: seeded data consistency

### Frontend
- Component rendering tests
- Status badge colors and labels
- Report export formatting
- Filter interactions

## Integration Tests (Vitest)
- API endpoints: scan, findings, triage, export
- SQLite database operations
- Scan -> triage -> export workflow

## E2E Tests (Playwright)
1. Dashboard loads with demo data
2. User scans a repo (demo mode)
3. User views findings table
4. User triages a finding (all status transitions)
5. User views triage history
6. User generates PR review report
7. User views secure review checklist
8. Baseline filtering works

## Test Fixtures
- `fixtures/vulnerable-app/` - Demo vulnerable code
- `fixtures/mock-semgrep-output.json` - Pre-baked scan results
- `fixtures/custom-rules/` - Test Semgrep rules
