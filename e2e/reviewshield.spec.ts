import { test, expect } from '@playwright/test';

test.describe('ReviewShield E2E', () => {
  test('health endpoint returns OK', async ({ request }) => {
    const resp = await request.get('/api/health');
    expect(resp.ok()).toBeTruthy();
    const body = await resp.json();
    expect(body.status).toBe('ok');
  });

  test('semgrep status endpoint works', async ({ request }) => {
    const resp = await request.get('/api/scan/status');
    expect(resp.ok()).toBeTruthy();
    const body = await resp.json();
    expect(body).toHaveProperty('semgrepInstalled');
  });

  test('demo scan creates findings', async ({ request }) => {
    const resp = await request.post('/api/scan/start', {
      data: { repoPath: '', useDemo: true },
    });
    expect(resp.ok()).toBeTruthy();
    const body = await resp.json();
    expect(body.scan).toBeDefined();
    expect(body.findings).toBeDefined();
    expect(body.findings.length).toBe(8);
    expect(body.demoMode).toBe(true);
  });

  test('findings endpoint returns results', async ({ request }) => {
    const scanResp = await request.post('/api/scan/start', {
      data: { repoPath: '', useDemo: true },
    });
    const scanBody = await scanResp.json();
    const scanId = scanBody.scan.id;

    const resp = await request.get(`/api/findings?scanId=${scanId}`);
    expect(resp.ok()).toBeTruthy();
    const findings = await resp.json();
    expect(findings.length).toBe(8);
  });

  test('triage workflow works end-to-end', async ({ request }) => {
    const scanResp = await request.post('/api/scan/start', {
      data: { repoPath: '', useDemo: true },
    });
    const scanBody = await scanResp.json();
    const findingId = scanBody.findings[0].id;

    const triageResp = await request.post(`/api/triage/${findingId}`, {
      data: { status: 'false_positive', reviewer: 'TestUser', justification: 'Test justification' },
    });
    expect(triageResp.ok()).toBeTruthy();
    const triageBody = await triageResp.json();
    expect(triageBody.status).toBe('false_positive');

    const historyResp = await request.get(`/api/triage/${findingId}/history`);
    expect(historyResp.ok()).toBeTruthy();
    const history = await historyResp.json();
    expect(history.length).toBe(1);
    expect(history[0].reviewer).toBe('TestUser');
  });

  test('PR report export generates markdown', async ({ request }) => {
    const scanResp = await request.post('/api/scan/start', {
      data: { repoPath: '', useDemo: true },
    });
    const scanBody = await scanResp.json();
    const scanId = scanBody.scan.id;

    const resp = await request.get(`/api/export/pr-report/${scanId}`);
    expect(resp.ok()).toBeTruthy();
    const text = await resp.text();
    expect(text).toContain('# ReviewShield PR Review Report');
    expect(text).toContain('CRITICAL');
  });

  test('checklist endpoint returns categories', async ({ request }) => {
    const resp = await request.get('/api/checklist');
    expect(resp.ok()).toBeTruthy();
    const body = await resp.json();
    expect(body).toHaveProperty('authentication');
    expect(body).toHaveProperty('accessControl');
    expect(body).toHaveProperty('inputValidation');
    expect(body).toHaveProperty('secrets');
  });
});
