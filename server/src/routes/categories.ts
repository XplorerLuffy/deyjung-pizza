import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  try {
    const categories = db
      .prepare('SELECT id, name, icon, slug FROM categories ORDER BY sort_order ASC')
      .all();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

export default router;
