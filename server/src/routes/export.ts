import { Router, Request, Response } from 'express';
import { getScan, getFindings } from '../services/finding-service';
import { generatePRReport } from '../services/export-service';

const router = Router();

router.get('/pr-report/:scanId', async (req: Request, res: Response) => {
  try {
    const scanId = Number(req.params.scanId);
    const scan = await getScan(scanId);
    if (!scan) return res.status(404).json({ error: 'Scan not found' });

    const findingsList = await getFindings(scanId);
    const report = generatePRReport(scan, findingsList);

    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', `attachment; filename="pr-review-report-${scanId}.md"`);
    res.send(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
