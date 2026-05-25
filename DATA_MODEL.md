# ReviewShield Data Model

## Entities

### Finding
| Field | Type | Description |
|-------|------|-------------|
| id | integer | Primary key |
| rule_id | text | Rule identifier (e.g., `no-hardcoded-secrets`) |
| file_path | text | File path relative to repo root |
| line | integer | Line number of finding |
| column | integer | Column number |
| severity | text | critical, high, medium, low, info |
| confidence | text | high, medium, low |
| owasp | text | OWASP category mapping |
| cwe | text | CWE identifier |
| message | text | Human-readable description |
| code_snippet | text | Source code at finding location (5 lines context) |
| remediation | text | Fix guidance |
| status | text | open, needs_developer, accepted_risk, false_positive, fixed |
| created_at | text | ISO timestamp |
| updated_at | text | ISO timestamp |

### Scan
| Field | Type | Description |
|-------|------|-------------|
| id | integer | Primary key |
| repo_path | text | Scanned repository path |
| is_baseline | integer | 1 if this scan is the baseline |
| total_findings | integer | Count of findings |
| critical | integer | Count by severity |
| high | integer | Count by severity |
| medium | integer | Count by severity |
| low | integer | Count by severity |
| new_findings | integer | New since baseline |
| created_at | text | ISO timestamp |

### TriageEvent
| Field | Type | Description |
|-------|------|-------------|
| id | integer | Primary key |
| finding_id | integer | Foreign key to Finding |
| from_status | text | Previous status |
| to_status | text | New status |
| reviewer | text | Person who triaged |
| justification | text | Reason for status change |
| created_at | text | ISO timestamp |

### Baseline
| Field | Type | Description |
|-------|------|-------------|
| id | integer | Primary key |
| scan_id | integer | Foreign key to Scan |
| finding_ids | text | JSON array of finding IDs in baseline |
| created_at | text | ISO timestamp |
