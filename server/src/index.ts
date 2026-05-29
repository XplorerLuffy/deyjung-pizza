import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './db';
import categoriesRouter from './routes/categories';
import menuRouter from './routes/menu';
import ordersRouter from './routes/orders';

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize DB
initializeDatabase();

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

// Routes
app.use('/api/categories', categoriesRouter);
app.use('/api/menu', menuRouter);
app.use('/api/orders', ordersRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🍕 DEYJUNG API running on http://localhost:${PORT}`);
});

export default app;
