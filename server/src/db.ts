import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', 'restaurant.db');

const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initializeDatabase(): void {
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      base_price INTEGER NOT NULL,
      sizes TEXT NOT NULL DEFAULT '[]',
      rating REAL NOT NULL DEFAULT 4.5,
      review_count INTEGER NOT NULL DEFAULT 0,
      is_available INTEGER NOT NULL DEFAULT 1,
      is_bestseller INTEGER NOT NULL DEFAULT 0,
      is_new INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT NOT NULL UNIQUE,
      table_number TEXT NOT NULL DEFAULT 'Table 1',
      items TEXT NOT NULL DEFAULT '[]',
      subtotal INTEGER NOT NULL DEFAULT 0,
      gst INTEGER NOT NULL DEFAULT 0,
      total INTEGER NOT NULL DEFAULT 0,
      payment_method TEXT NOT NULL DEFAULT 'cash',
      special_instructions TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'received',
      created_at DATETIME NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Seed if empty
  const catCount = (db.prepare('SELECT COUNT(*) as cnt FROM categories').get() as { cnt: number }).cnt;
  if (catCount === 0) {
    seedData();
  }
}

function seedData(): void {
  // Insert categories
  const insertCat = db.prepare(
    'INSERT INTO categories (name, icon, slug, sort_order) VALUES (?, ?, ?, ?)'
  );

  const cats = [
    { name: 'Pizza', icon: '🍕', slug: 'pizza', order: 1 },
    { name: 'Burgers', icon: '🍔', slug: 'burgers', order: 2 },
    { name: 'Pasta', icon: '🍝', slug: 'pasta', order: 3 },
    { name: 'Drinks', icon: '🥤', slug: 'drinks', order: 4 },
    { name: 'Desserts', icon: '🍰', slug: 'desserts', order: 5 },
  ];

  const catIds: Record<string, number> = {};
  for (const cat of cats) {
    const result = insertCat.run(cat.name, cat.icon, cat.slug, cat.order);
    catIds[cat.slug] = result.lastInsertRowid as number;
  }

  const sizes = JSON.stringify([
    { label: 'S', multiplier: 0.85 },
    { label: 'M', multiplier: 1 },
    { label: 'L', multiplier: 1.2 },
  ]);

  const drinkSizes = JSON.stringify([
    { label: 'S', multiplier: 0.85 },
    { label: 'M', multiplier: 1 },
    { label: 'L', multiplier: 1.2 },
  ]);

  const insertItem = db.prepare(`
    INSERT INTO menu_items
      (category_id, name, description, base_price, sizes, rating, review_count, is_available, is_bestseller, is_new)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
  `);

  const menuItems = [
    // Pizza
    {
      cat: 'pizza',
      name: 'Margherita',
      desc: 'Classic tomato sauce, fresh mozzarella, and fragrant basil on our hand-tossed crust.',
      price: 299,
      rating: 4.8,
      reviews: 312,
      bestseller: 1,
      isNew: 0,
    },
    {
      cat: 'pizza',
      name: 'BBQ Chicken',
      desc: 'Smoky BBQ sauce, tender grilled chicken, red onions, and melted cheese.',
      price: 399,
      rating: 4.9,
      reviews: 245,
      bestseller: 1,
      isNew: 0,
    },
    {
      cat: 'pizza',
      name: 'Pepperoni',
      desc: 'Generous layers of premium pepperoni over rich tomato sauce and mozzarella.',
      price: 349,
      rating: 4.7,
      reviews: 189,
      bestseller: 0,
      isNew: 0,
    },
    {
      cat: 'pizza',
      name: 'Veggie Supreme',
      desc: 'A rainbow of fresh vegetables — bell peppers, mushrooms, olives, and onions.',
      price: 279,
      rating: 4.5,
      reviews: 134,
      bestseller: 0,
      isNew: 0,
    },
    {
      cat: 'pizza',
      name: 'Truffle Mushroom',
      desc: 'Earthy wild mushrooms, truffle oil drizzle, caramelized onions, and aged parmesan.',
      price: 449,
      rating: 4.9,
      reviews: 78,
      bestseller: 0,
      isNew: 1,
    },
    // Burgers
    {
      cat: 'burgers',
      name: 'Classic Beef',
      desc: 'Juicy 150g beef patty, lettuce, tomato, pickles, and our secret sauce.',
      price: 199,
      rating: 4.6,
      reviews: 201,
      bestseller: 0,
      isNew: 0,
    },
    {
      cat: 'burgers',
      name: 'Crispy Chicken',
      desc: 'Golden fried chicken fillet, coleslaw, jalapeño mayo, and toasted brioche bun.',
      price: 229,
      rating: 4.7,
      reviews: 178,
      bestseller: 1,
      isNew: 0,
    },
    {
      cat: 'burgers',
      name: 'Double Smash',
      desc: 'Two smashed beef patties, double cheese, caramelized onions, and burger sauce.',
      price: 299,
      rating: 4.8,
      reviews: 142,
      bestseller: 0,
      isNew: 0,
    },
    {
      cat: 'burgers',
      name: 'Veggie Burger',
      desc: 'Spiced chickpea and quinoa patty, avocado spread, fresh greens, and tomato.',
      price: 179,
      rating: 4.5,
      reviews: 89,
      bestseller: 0,
      isNew: 0,
    },
    // Pasta
    {
      cat: 'pasta',
      name: 'Carbonara',
      desc: 'Classic Roman pasta with guanciale, egg yolk, pecorino romano, and black pepper.',
      price: 249,
      rating: 4.8,
      reviews: 156,
      bestseller: 1,
      isNew: 0,
    },
    {
      cat: 'pasta',
      name: 'Penne Arrabbiata',
      desc: 'Penne in a fiery tomato sauce with garlic, red chillies, and fresh parsley.',
      price: 199,
      rating: 4.6,
      reviews: 112,
      bestseller: 0,
      isNew: 0,
    },
    {
      cat: 'pasta',
      name: 'Truffle Cream',
      desc: 'Silky cream sauce with black truffle paste, mushrooms, and parmesan on tagliatelle.',
      price: 349,
      rating: 4.9,
      reviews: 67,
      bestseller: 0,
      isNew: 1,
    },
    {
      cat: 'pasta',
      name: 'Spaghetti Bolognese',
      desc: 'Slow-cooked meat ragu with a rich tomato base, served on al dente spaghetti.',
      price: 279,
      rating: 4.7,
      reviews: 198,
      bestseller: 0,
      isNew: 0,
    },
    // Drinks
    {
      cat: 'drinks',
      name: 'Lime Soda',
      desc: 'Freshly squeezed lime with sparkling soda, mint, and a pinch of salt.',
      price: 89,
      rating: 4.6,
      reviews: 234,
      bestseller: 0,
      isNew: 0,
    },
    {
      cat: 'drinks',
      name: 'Mango Lassi',
      desc: 'Thick and creamy mango yogurt drink with cardamom and a touch of honey.',
      price: 129,
      rating: 4.8,
      reviews: 187,
      bestseller: 1,
      isNew: 0,
    },
    {
      cat: 'drinks',
      name: 'Cold Coffee',
      desc: 'Rich espresso blended with chilled milk and ice, sweetened to your preference.',
      price: 149,
      rating: 4.7,
      reviews: 145,
      bestseller: 0,
      isNew: 0,
    },
    {
      cat: 'drinks',
      name: 'Sparkling Water',
      desc: 'Premium sparkling mineral water, chilled and refreshing.',
      price: 79,
      rating: 4.5,
      reviews: 56,
      bestseller: 0,
      isNew: 0,
    },
    // Desserts
    {
      cat: 'desserts',
      name: 'Tiramisu',
      desc: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone cream.',
      price: 199,
      rating: 4.9,
      reviews: 167,
      bestseller: 1,
      isNew: 0,
    },
    {
      cat: 'desserts',
      name: 'Chocolate Brownie',
      desc: 'Warm fudgy brownie with a gooey center, served with vanilla ice cream.',
      price: 179,
      rating: 4.8,
      reviews: 143,
      bestseller: 0,
      isNew: 0,
    },
    {
      cat: 'desserts',
      name: 'Cheesecake',
      desc: 'New York style baked cheesecake with a buttery graham cracker crust and berry coulis.',
      price: 229,
      rating: 4.7,
      reviews: 98,
      bestseller: 0,
      isNew: 0,
    },
    {
      cat: 'desserts',
      name: 'Gulab Jamun',
      desc: 'Soft milk-solid dumplings soaked in rose-scented sugar syrup, served warm.',
      price: 99,
      rating: 4.8,
      reviews: 210,
      bestseller: 0,
      isNew: 0,
    },
  ];

  for (const item of menuItems) {
    const sz = item.cat === 'drinks' ? drinkSizes : sizes;
    insertItem.run(
      catIds[item.cat],
      item.name,
      item.desc,
      item.price,
      sz,
      item.rating,
      item.reviews,
      item.bestseller,
      item.isNew
    );
  }
}

export default db;
