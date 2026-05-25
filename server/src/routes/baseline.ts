import { Router, Request, Response } from 'express';
import { getLatestBaseline } from '../services/baseline-service';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const baseline = await getLatestBaseline();
    res.json(baseline || { finding_ids: '[]' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
