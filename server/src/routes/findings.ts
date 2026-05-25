import { Router, Request, Response } from 'express';
import { getFindings } from '../services/finding-service';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const scanId = req.query.scanId ? Number(req.query.scanId) : undefined;
    const status = req.query.status as string | undefined;
    const severity = req.query.severity as string | undefined;
    const results = await getFindings(scanId, status, severity);
    res.json(results);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
