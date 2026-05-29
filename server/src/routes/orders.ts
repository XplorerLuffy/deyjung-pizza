import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

// POST /api/orders — create order
router.post('/', (req: Request, res: Response) => {
  try {
    const { tableNumber, items, subtotal, gst, total, paymentMethod, specialInstructions } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must have at least one item' });
    }

    const orderNumber = `ORD${Date.now().toString().slice(-6)}`;

    const stmt = db.prepare(`
      INSERT INTO orders
        (order_number, table_number, items, subtotal, gst, total, payment_method, special_instructions, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'received')
    `);

    const result = stmt.run(
      orderNumber,
      tableNumber || 'Table 1',
      JSON.stringify(items),
      Math.round(subtotal || 0),
      Math.round(gst || 0),
      Math.round(total || 0),
      paymentMethod || 'cash',
      specialInstructions || ''
    );

    const orderId = result.lastInsertRowid as number;

    // Auto-advance order status
    setTimeout(() => advanceStatus(orderId, 'preparing'), 10_000);
    setTimeout(() => advanceStatus(orderId, 'ready'), 30_000);
    setTimeout(() => advanceStatus(orderId, 'delivered'), 60_000);

    res.status(201).json({ id: orderId, orderNumber });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// GET /api/orders/:id — get order
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as RawOrder | undefined;

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(parseOrder(order));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// PATCH /api/orders/:id/status — update status
router.patch('/:id/status', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['received', 'preparing', 'ready', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as RawOrder;
    res.json(parseOrder(order));
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

function advanceStatus(orderId: number, status: string) {
  try {
    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, orderId);
  } catch (err) {
    // order may have been deleted, ignore
  }
}

interface RawOrder {
  id: number;
  order_number: string;
  table_number: string;
  items: string;
  subtotal: number;
  gst: number;
  total: number;
  payment_method: string;
  special_instructions: string;
  status: string;
  created_at: string;
}

function parseOrder(order: RawOrder) {
  return {
    id: order.id,
    orderNumber: order.order_number,
    tableNumber: order.table_number,
    items: JSON.parse(order.items),
    subtotal: order.subtotal,
    gst: order.gst,
    total: order.total,
    paymentMethod: order.payment_method,
    specialInstructions: order.special_instructions,
    status: order.status,
    createdAt: order.created_at,
  };
}

export default router;
