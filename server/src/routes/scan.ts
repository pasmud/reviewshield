import { Router, Request, Response } from 'express';
import path from 'path';
import { isSemgrepInstalled, runSemgrepScan, loadMockFindings } from '../services/semgrep-runner';
import { createScan, insertFindings, updateScanCounts, getScan, getAllScans } from '../services/finding-service';
import { createBaseline } from '../services/baseline-service';
import { Finding } from '../types';
import fs from 'fs';

const router = Router();

router.get('/status', (_req: Request, res: Response) => {
  res.json({ semgrepInstalled: isSemgrepInstalled() });
});

router.post('/start', async (req: Request, res: Response) => {
  try {
    const { repoPath, useDemo } = req.body;
    const semgrepInstalled = isSemgrepInstalled();

    if (!useDemo && !semgrepInstalled) {
      return res.status(400).json({
        error: 'Semgrep is not installed. Enable demo mode or install Semgrep.',
        semgrepInstalled: false,
      });
    }

    if (useDemo || !semgrepInstalled) {
      const mockFindings = loadMockFindings();
      const scan = await createScan(repoPath || 'demo-mode', true);
      const findingsWithScanId = mockFindings.map(f => ({ ...f, scan_id: scan.id! }));
      const inserted = await insertFindings(findingsWithScanId);
      await updateScanCounts(scan.id!);
      await createBaseline(scan.id!, inserted.map(f => f.id!));
      const updatedScan = await getScan(scan.id!);
      return res.json({ scan: updatedScan, findings: inserted, demoMode: true });
    }

    const rulesDir = process.env.CUSTOM_RULES_PATH || path.join(process.cwd(), '..', 'rules');
    if (!fs.existsSync(repoPath)) {
      return res.status(400).json({ error: 'Repository path does not exist' });
    }

    const resolvedRulesDir = path.resolve(rulesDir);
    const semgrepFindings = runSemgrepScan(repoPath, resolvedRulesDir);

    const isBaseline = true; // First scan is always baseline
    const scan = await createScan(repoPath, isBaseline);
    const findingsWithScanId = semgrepFindings.map(f => ({ ...f, scan_id: scan.id! }));
    const inserted = await insertFindings(findingsWithScanId);
    await updateScanCounts(scan.id!);
    await createBaseline(scan.id!, inserted.map(f => f.id!));
    const updatedScan = await getScan(scan.id!);

    res.json({ scan: updatedScan, findings: inserted, demoMode: false });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/history', async (_req: Request, res: Response) => {
  try {
    const allScans = await getAllScans();
    res.json(allScans);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const scan = await getScan(Number(req.params.id));
    if (!scan) return res.status(404).json({ error: 'Scan not found' });
    res.json(scan);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
