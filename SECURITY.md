# Security Policy

## Responsible Use

ReviewShield is a defensive security tool for local code review and SAST triage.

## Supported Scope

- Your own repositories
- Repositories you have explicit permission to scan
- Local code on your machine

## What This Tool Does NOT Do

- Executes exploit code
- Modifies code without explicit user action
- Sends code to third parties
- Performs unauthorized scanning
- Stores secrets

## Vulnerability Reporting

If you find a security issue in ReviewShield, please open a GitHub issue.

## Data Handling

- Scan results are stored locally in SQLite
- No code leaves your machine
- Reports are generated locally
- No external API calls unless configured

## Secret Redaction

Findings containing potential secrets are automatically redacted.
