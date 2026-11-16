import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SETTINGS } from './src/data/initialData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const STORE_FILE = path.resolve(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface ServerStore {
  products: any[];
  categories: any[];
  settings: any;
  orders: any[];
  messages: any[];
}

function getInitialStore(): ServerStore {
  return {
    products: INITIAL_PRODUCTS,
    categories: INITIAL_CATEGORIES,
    settings: INITIAL_SETTINGS,
    orders: [
      {
        id: 'ord-101',
        order_number: 'DP-2026-1001',
        customer_name: 'Chioma Nnamdi',
        customer_phone: '+234 803 456 7890',
        customer_email: 'chioma.n@example.com',
        delivery_address: 'Flat 4B, Golf Estate, Peter Odili Road',
        city: 'Port Harcourt',
        state: 'Rivers State',
        order_notes: 'Please ring bell upon arrival at the gate.',
        payment_method: 'bank_transfer',
        payment_status: 'verified',
        order_status: 'processing',
        subtotal: 38000,
        delivery_fee: 2000,
        total_amount: 40000,
        created_at: '2026-03-07T11:20:00Z',
        items: [
          {
            id: 'item-1',
            product_id: 'prod-1',
            product_name: "Classic Breathable Kids' White & Gold Sneakers",
            price: 18500,
            quantity: 1,
            selected_size: '28 EU',
            selected_color: 'White/Gold',
          },
        ],
      },
    ],
    messages: [
      {
        id: 'msg-1',
        full_name: 'Efe Okonkwo',
        phone_number: '+234 809 332 1144',
        email: 'efe.okonkwo@example.com',
        subject: 'Bulk enquiry for School Shoes',
        message:
          'Hello DE-PEES, do you offer discount for purchasing 4 pairs of your orthopedic school shoes for my kids attending school in Port Harcourt?',
        created_at: '2026-03-06T15:30:00Z',
        status: 'read',
      },
    ],
  };
}

function readStore(): ServerStore {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const content = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      return {
        products: Array.isArray(parsed.products) ? parsed.products : INITIAL_PRODUCTS,
        categories: Array.isArray(parsed.categories) ? parsed.categories : INITIAL_CATEGORIES,
        settings: parsed.settings ? { ...INITIAL_SETTINGS, ...parsed.settings } : INITIAL_SETTINGS,
        orders: Array.isArray(parsed.orders) ? parsed.orders : [],
        messages: Array.isArray(parsed.messages) ? parsed.messages : [],
      };
    }
  } catch (err) {
    console.error('Error reading store.json, reinitializing:', err);
  }

  const initial = getInitialStore();
  writeStore(initial);
  return initial;
}

function writeStore(store: ServerStore) {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing store.json:', err);
  }
}

// Ensure store is initialized on start
readStore();

app.disable('x-powered-by');
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

const ALLOWED_ORDER_STATUSES = new Set(['pending', 'processing', 'shipped', 'completed', 'cancelled']);
const ALLOWED_PAYMENT_STATUSES = new Set(['unpaid', 'paid', 'verified']);
const ALLOWED_MESSAGE_STATUSES = new Set(['unread', 'read', 'replied']);
const ALLOWED_PAYMENT_METHODS = new Set(['whatsapp', 'bank_transfer']);

function pickSafeFields<T extends Record<string, any>>(source: any, allowedKeys: readonly string[]): Partial<T> {
  const result: Record<string, any> = {};
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return result as Partial<T>;
  }
  for (const key of allowedKeys) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
    if (Object.prototype.hasOwnProperty.call(source, key) && source[key] !== undefined) {
      result[key] = source[key];
    }
  }
  return result as Partial<T>;
}

const PRODUCT_FIELDS = [
  'id',
  'name',
  'slug',
  'category_id',
  'category_name',
  'description',
  'price',
  'original_price',
  'images',
  'videos',
  'sizes',
  'colors',
  'stock_quantity',
  'is_featured',
  'is_published',
  'is_latest',
  'created_at',
] as const;

const CATEGORY_FIELDS = ['id', 'name', 'slug', 'description', 'icon', 'item_count'] as const;

const SETTINGS_FIELDS = [
  'business_name',
  'location',
  'address',
  'phone',
  'whatsapp_number',
  'whatsapp_display',
  'email',
  'instagram',
  'facebook',
  'hero_headline',
  'hero_supporting_text',
  'promotional_banner',
  'bank_name',
  'account_name',
  'account_number',
  'bank_sort_code',
  'delivery_fee_ph',
  'delivery_fee_nationwide',
  'free_delivery_threshold',
  'supabase_url',
  'supabase_anon_key',
] as const;

// -----------------------------------------------------------------------------
// CENTRAL API ROUTES (Synchronized across ALL devices)
// -----------------------------------------------------------------------------

// Products API
app.get('/api/products', (req, res) => {
  const store = readStore();
  res.json(store.products);
});

app.post('/api/products', (req, res) => {
  const store = readStore();
  const safe = pickSafeFields<any>(req.body, PRODUCT_FIELDS);
  if (!safe.name || typeof safe.name !== 'string' || Number(safe.price) <= 0 || Number.isNaN(Number(safe.price))) {
    return res.status(400).json({ error: 'Valid product name and positive price are required' });
  }
  const newProduct = {
    ...safe,
    price: Number(safe.price),
    original_price: safe.original_price != null ? Number(safe.original_price) : undefined,
    stock_quantity: Math.max(0, Number(safe.stock_quantity ?? 0)),
    id: typeof safe.id === 'string' && safe.id ? safe.id : `prod-${Date.now()}`,
    created_at: typeof safe.created_at === 'string' && safe.created_at ? safe.created_at : new Date().toISOString(),
  };
  store.products = [newProduct, ...store.products];
  writeStore(store);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const store = readStore();
  const { id } = req.params;
  const index = store.products.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const safe = pickSafeFields<any>(req.body, PRODUCT_FIELDS);
  if (safe.price !== undefined && (Number(safe.price) <= 0 || Number.isNaN(Number(safe.price)))) {
    return res.status(400).json({ error: 'Price must be a positive number' });
  }
  store.products[index] = {
    ...store.products[index],
    ...safe,
    ...(safe.price !== undefined ? { price: Number(safe.price) } : {}),
    ...(safe.stock_quantity !== undefined ? { stock_quantity: Math.max(0, Number(safe.stock_quantity)) } : {}),
    updated_at: new Date().toISOString(),
  };
  writeStore(store);
  res.json(store.products[index]);
});

app.delete('/api/products/:id', (req, res) => {
  const store = readStore();
  const { id } = req.params;
  store.products = store.products.filter((p) => p.id !== id);
  writeStore(store);
  res.json({ success: true, id });
});

// Categories API
app.get('/api/categories', (req, res) => {
  const store = readStore();
  res.json(store.categories);
});

app.post('/api/categories', (req, res) => {
  const store = readStore();
  const safe = pickSafeFields<any>(req.body, CATEGORY_FIELDS);
  if (!safe.name || typeof safe.name !== 'string') {
    return res.status(400).json({ error: 'Category name is required' });
  }
  const newCat = {
    ...safe,
    id: typeof safe.id === 'string' && safe.id ? safe.id : `cat-${Date.now()}`,
  };
  store.categories = [...store.categories, newCat];
  writeStore(store);
  res.status(201).json(newCat);
});

app.put('/api/categories/:id', (req, res) => {
  const store = readStore();
  const { id } = req.params;
  const index = store.categories.findIndex((c) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  const safe = pickSafeFields<any>(req.body, CATEGORY_FIELDS);
  store.categories[index] = { ...store.categories[index], ...safe };
  writeStore(store);
  res.json(store.categories[index]);
});

app.delete('/api/categories/:id', (req, res) => {
  const store = readStore();
  const { id } = req.params;
  store.categories = store.categories.filter((c) => c.id !== id);
  writeStore(store);
  res.json({ success: true, id });
});

// Site Settings API
app.get('/api/settings', (req, res) => {
  const store = readStore();
  res.json(store.settings);
});

app.put('/api/settings', (req, res) => {
  const store = readStore();
  const safe = pickSafeFields<any>(req.body, SETTINGS_FIELDS);
  store.settings = { ...store.settings, ...safe, updated_at: new Date().toISOString() };
  writeStore(store);
  res.json(store.settings);
});

app.post('/api/settings', (req, res) => {
  const store = readStore();
  const safe = pickSafeFields<any>(req.body, SETTINGS_FIELDS);
  store.settings = { ...store.settings, ...safe, updated_at: new Date().toISOString() };
  writeStore(store);
  res.json(store.settings);
});

// Orders API
app.get('/api/orders', (req, res) => {
  const store = readStore();
  res.json(store.orders);
});

app.post('/api/orders', (req, res) => {
  const store = readStore();
  const body = req.body || {};
  if (
    !body.customer_name ||
    !body.customer_phone ||
    !body.delivery_address ||
    !Array.isArray(body.items) ||
    body.items.length === 0
  ) {
    return res.status(400).json({ error: 'Customer details and at least one order item are required' });
  }

  // Recompute prices server-side from authoritative catalog when product exists
  const sanitizedItems = body.items.map((item: any, idx: number) => {
    const qty = Math.max(1, Math.min(100, Math.floor(Number(item.quantity) || 1)));
    const catalogProduct = store.products.find((p) => p.id === item.product_id);
    const unitPrice = catalogProduct ? Number(catalogProduct.price) : Math.max(0, Number(item.price) || 0);
    return {
      id: typeof item.id === 'string' ? item.id : `item-${Date.now()}-${idx}`,
      product_id: String(item.product_id || ''),
      product_name: String(catalogProduct ? catalogProduct.name : item.product_name || 'Product'),
      price: unitPrice,
      quantity: qty,
      selected_size: item.selected_size ? String(item.selected_size) : undefined,
      selected_color: item.selected_color ? String(item.selected_color) : undefined,
      image_url: item.image_url ? String(item.image_url) : undefined,
    };
  });

  const subtotal = sanitizedItems.reduce((sum: number, it: any) => sum + it.price * it.quantity, 0);
  const stateStr = String(body.state || '');
  const cityStr = String(body.city || 'Port Harcourt');
  const isPH =
    stateStr.toLowerCase().includes('rivers') || cityStr.toLowerCase().includes('port harcourt');
  const freeThreshold = Number(store.settings?.free_delivery_threshold ?? 60000);
  const deliveryFee =
    subtotal >= freeThreshold
      ? 0
      : Number(isPH ? (store.settings?.delivery_fee_ph ?? 2000) : (store.settings?.delivery_fee_nationwide ?? 4500));

  const paymentMethod = ALLOWED_PAYMENT_METHODS.has(body.payment_method) ? body.payment_method : 'whatsapp';
  const orderNumber =
    typeof body.order_number === 'string' && body.order_number.trim()
      ? body.order_number.trim()
      : `DP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder = {
    id: typeof body.id === 'string' && body.id ? body.id : `ord-${Date.now()}`,
    order_number: orderNumber,
    customer_name: String(body.customer_name).trim(),
    customer_phone: String(body.customer_phone).trim(),
    customer_email: String(body.customer_email || 'Not provided').trim(),
    delivery_address: String(body.delivery_address).trim(),
    city: cityStr.trim(),
    state: stateStr.trim() || 'Rivers State (Port Harcourt)',
    order_notes: body.order_notes ? String(body.order_notes).trim() : '',
    payment_method: paymentMethod,
    payment_status: 'unpaid',
    order_status: 'pending',
    items: sanitizedItems,
    subtotal,
    delivery_fee: deliveryFee,
    total_amount: subtotal + deliveryFee,
    created_at: new Date().toISOString(),
  };
  store.orders = [newOrder, ...store.orders];
  writeStore(store);
  res.status(201).json(newOrder);
});

app.put('/api/orders/:id/status', (req, res) => {
  const store = readStore();
  const { id } = req.params;
  const { status } = req.body;
  if (!ALLOWED_ORDER_STATUSES.has(status)) {
    return res.status(400).json({ error: 'Invalid order status' });
  }
  const index = store.orders.findIndex((o) => o.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }
  store.orders[index].order_status = status;
  writeStore(store);
  res.json(store.orders[index]);
});

app.put('/api/orders/:id/payment', (req, res) => {
  const store = readStore();
  const { id } = req.params;
  const { status } = req.body;
  if (!ALLOWED_PAYMENT_STATUSES.has(status)) {
    return res.status(400).json({ error: 'Invalid payment status' });
  }
  const index = store.orders.findIndex((o) => o.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }
  store.orders[index].payment_status = status;
  writeStore(store);
  res.json(store.orders[index]);
});

// Contact Messages API
app.get('/api/messages', (req, res) => {
  const store = readStore();
  res.json(store.messages);
});

app.post('/api/messages', (req, res) => {
  const store = readStore();
  const body = req.body || {};
  if (!body.full_name || !body.phone_number || !body.message) {
    return res.status(400).json({ error: 'Name, phone number, and message are required' });
  }
  const newMsg = {
    id: `msg-${Date.now()}`,
    full_name: String(body.full_name).trim(),
    phone_number: String(body.phone_number).trim(),
    email: String(body.email || 'Not provided').trim(),
    subject: String(body.subject || 'General Customer Enquiry').trim(),
    message: String(body.message).trim(),
    created_at: new Date().toISOString(),
    status: 'unread',
  };
  store.messages = [newMsg, ...store.messages];
  writeStore(store);
  res.status(201).json(newMsg);
});

app.put('/api/messages/:id/status', (req, res) => {
  const store = readStore();
  const { id } = req.params;
  const { status } = req.body;
  if (!ALLOWED_MESSAGE_STATUSES.has(status)) {
    return res.status(400).json({ error: 'Invalid message status' });
  }
  const index = store.messages.findIndex((m) => m.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Message not found' });
  }
  store.messages[index].status = status;
  writeStore(store);
  res.json(store.messages[index]);
});

// -----------------------------------------------------------------------------
// VITE DEV SERVER OR STATIC PROD SERVING
// -----------------------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DE-PEES server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
