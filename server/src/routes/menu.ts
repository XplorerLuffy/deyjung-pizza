import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

// GET /api/menu?category=pizza&search=...
router.get('/', (req: Request, res: Response) => {
  try {
    const { category, search } = req.query as { category?: string; search?: string };

    let query = `
      SELECT
        m.id,
        m.name,
        m.description,
        m.base_price,
        m.sizes,
        m.rating,
        m.review_count,
        m.is_available,
        m.is_bestseller,
        m.is_new,
        c.name as category_name,
        c.icon as category_icon,
        c.slug as category_slug
      FROM menu_items m
      JOIN categories c ON m.category_id = c.id
      WHERE m.is_available = 1
    `;
    const params: string[] = [];

    if (category && category !== 'all') {
      query += ' AND c.slug = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (m.name LIKE ? OR m.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY m.is_bestseller DESC, m.id ASC';

    const items = db.prepare(query).all(...params);
    const parsed = items.map((item: unknown) => parseItem(item as RawItem));
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// GET /api/menu/:id
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = db
      .prepare(`
        SELECT
          m.id,
          m.name,
          m.description,
          m.base_price,
          m.sizes,
          m.rating,
          m.review_count,
          m.is_available,
          m.is_bestseller,
          m.is_new,
          c.name as category_name,
          c.icon as category_icon,
          c.slug as category_slug
        FROM menu_items m
        JOIN categories c ON m.category_id = c.id
        WHERE m.id = ?
      `)
      .get(id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(parseItem(item as RawItem));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
});

interface RawItem {
  id: number;
  name: string;
  description: string;
  base_price: number;
  sizes: string;
  rating: number;
  review_count: number;
  is_available: number;
  is_bestseller: number;
  is_new: number;
  category_name: string;
  category_icon: string;
  category_slug: string;
}

function parseItem(item: RawItem) {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    basePrice: item.base_price,
    sizes: JSON.parse(item.sizes),
    rating: item.rating,
    reviewCount: item.review_count,
    isAvailable: item.is_available === 1,
    isBestseller: item.is_bestseller === 1,
    isNew: item.is_new === 1,
    category: {
      name: item.category_name,
      icon: item.category_icon,
      slug: item.category_slug,
    },
  };
}

export default router;
