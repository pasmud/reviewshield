import { Router, Request, Response } from 'express';
import { updateFindingStatus } from '../services/finding-service';
import { createTriageEvent, getTriageHistory } from '../services/triage-service';

const router = Router();

router.post('/:findingId', async (req: Request, res: Response) => {
  try {
    const findingId = Number(req.params.findingId);
    const { status, reviewer, justification } = req.body;

    const validStatuses = ['open', 'needs_developer', 'accepted_risk', 'false_positive', 'fixed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    if (!reviewer || !justification) {
      return res.status(400).json({ error: 'Reviewer and justification are required' });
    }

    const updated = await updateFindingStatus(findingId, status);
    if (!updated) return res.status(404).json({ error: 'Finding not found' });

    await createTriageEvent(findingId, updated.status, status, reviewer, justification);

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:findingId/history', async (req: Request, res: Response) => {
  try {
    const history = await getTriageHistory(Number(req.params.findingId));
    res.json(history);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
