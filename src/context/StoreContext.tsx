import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  Product,
  Category,
  CartItem,
  Order,
  OrderStatus,
  ContactMessage,
  SiteSettings,
  PageView,
} from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/initialData';
import { getSupabase, sanitizeSupabaseUrl, sanitizeSupabaseKey } from '../lib/supabase';

interface StoreContextType {
  // Navigation & UI
  currentPage: PageView;
  navigateTo: (page: PageView) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  categoryFilter: string | null;
  setCategoryFilter: (slug: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'created_at'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartItemCount: number;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'order_number' | 'created_at'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updatePaymentStatus: (orderId: string, status: 'unpaid' | 'paid' | 'verified') => void;

  // Contact Messages
  messages: ContactMessage[];
  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'created_at' | 'status'>) => void;
  markMessageStatus: (id: string, status: 'unread' | 'read' | 'replied') => void;

  // Site Settings
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;

  // Admin Auth
  isAdminLoggedIn: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPassword: (oldPass: string, newPass: string) => { success: boolean; message: string };

  // Notification helper
  notification: string | null;
  showNotification: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Simple secure hash simulation for admin password verification without plain-text storage
function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `depees_salt_${hash}_sec`;
}

const INITIAL_PASSWORD_HASH = hashPassword('pees123');

const INITIAL_ORDERS: Order[] = [
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
      {
        id: 'item-2',
        product_id: 'prod-2',
        product_name: 'Orthopedic Durable School Leather Shoes (Unisex)',
        price: 19500,
        quantity: 1,
        selected_size: '29 EU',
        selected_color: 'Polished Black',
      },
    ],
  },
  {
    id: 'ord-102',
    order_number: 'DP-2026-1002',
    customer_name: 'Mrs. Blessing Briggs',
    customer_phone: '+234 812 987 6543',
    customer_email: 'blessing.briggs@example.com',
    delivery_address: '18 Woji Road, GRA Phase 2',
    city: 'Port Harcourt',
    state: 'Rivers State',
    order_notes: 'Gift wrapping for 2-year-old birthday girl.',
    payment_method: 'whatsapp',
    payment_status: 'paid',
    order_status: 'completed',
    subtotal: 26000,
    delivery_fee: 2000,
    total_amount: 28000,
    created_at: '2026-03-05T14:15:00Z',
    items: [
      {
        id: 'item-3',
        product_id: 'prod-3',
        product_name: 'Embroidered Floral Birthday & Sunday Princess Dress',
        price: 26000,
        quantity: 1,
        selected_size: '2-3 Years',
        selected_color: 'Blush Pink',
      },
    ],
  },
  {
    id: 'ord-103',
    order_number: 'DP-2026-1003',
    customer_name: 'Amina Danjuma',
    customer_phone: '+234 802 111 2233',
    customer_email: 'amina.d@example.com',
    delivery_address: 'Maitama District',
    city: 'Abuja',
    state: 'Federal Capital Territory',
    order_notes: 'Deliver via courier express.',
    payment_method: 'bank_transfer',
    payment_status: 'unpaid',
    order_status: 'pending',
    subtotal: 34000,
    delivery_fee: 4500,
    total_amount: 38500,
    created_at: '2026-03-08T09:40:00Z',
    items: [
      {
        id: 'item-4',
        product_id: 'prod-7',
        product_name: 'Deluxe Newborn 7-Piece Hospital Welcome Hamper',
        price: 34000,
        quantity: 1,
        selected_size: '0-3 Months',
        selected_color: 'Unisex White/Gold',
      },
    ],
  },
];

const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    full_name: 'Efe Okonkwo',
    phone_number: '+234 809 332 1144',
    email: 'efe.okonkwo@example.com',
    subject: 'Bulk enquiry for School Shoes',
    message: 'Hello DE-PEES, do you offer discount for purchasing 4 pairs of your orthopedic school shoes for my kids attending school in Port Harcourt?',
    created_at: '2026-03-06T15:30:00Z',
    status: 'read',
  },
  {
    id: 'msg-2',
    full_name: 'Daba Amadi',
    phone_number: '+234 818 554 9988',
    email: 'daba.a@example.com',
    subject: 'Sizes for baby hospital hamper',
    message: 'Good day! I am expecting in April and would love to know if you can customize the newborn welcome hamper with specific pink blankets. Thank you!',
    created_at: '2026-03-07T16:45:00Z',
    status: 'unread',
  },
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & UI State
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('depees_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Categories
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('depees_categories');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('depees_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('depees_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Messages
  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem('depees_messages');
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  // Settings
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('depees_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        const isPlaceholder = (val?: string) =>
          Boolean(val && typeof val === 'string' && val.replace(/[^0-9]/g, '').includes('8031234567'));

        if (!parsed.whatsapp_number || isPlaceholder(parsed.whatsapp_number)) {
          parsed.whatsapp_number = INITIAL_SETTINGS.whatsapp_number;
        }
        if (!parsed.whatsapp_display || isPlaceholder(parsed.whatsapp_display)) {
          parsed.whatsapp_display = INITIAL_SETTINGS.whatsapp_display;
        }
        if (!parsed.phone || isPlaceholder(parsed.phone)) {
          parsed.phone = INITIAL_SETTINGS.phone;
        }
        if (!parsed.account_number || parsed.account_number === '0123456789') {
          parsed.account_number = INITIAL_SETTINGS.account_number;
        }
        if (!parsed.account_name || parsed.account_name === 'DE-PEES BABY & MOTHER CARE') {
          parsed.account_name = INITIAL_SETTINGS.account_name;
        }
        if (!parsed.bank_name || parsed.bank_name.includes('Guaranty') || parsed.bank_name.includes('GTBank')) {
          parsed.bank_name = INITIAL_SETTINGS.bank_name;
        }
        if (!parsed.address || parsed.address.includes('Peter Odili Road')) {
          parsed.address = INITIAL_SETTINGS.address;
        }
        if (!parsed.email || parsed.email === 'info@depeesmotherandchild.com') {
          parsed.email = INITIAL_SETTINGS.email;
        }
        if (!parsed.supabase_url) {
          parsed.supabase_url = INITIAL_SETTINGS.supabase_url;
        } else {
          parsed.supabase_url = sanitizeSupabaseUrl(parsed.supabase_url);
        }
        if (!parsed.supabase_anon_key) {
          parsed.supabase_anon_key = INITIAL_SETTINGS.supabase_anon_key;
        } else {
          parsed.supabase_anon_key = sanitizeSupabaseKey(parsed.supabase_anon_key);
        }
        const cleaned = { ...INITIAL_SETTINGS, ...parsed };
        try {
          localStorage.setItem('depees_settings', JSON.stringify(cleaned));
        } catch {
          // ignore
        }
        return cleaned;
      }
      return INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('depees_admin_session') === 'true';
  });

  const [passwordHash, setPasswordHash] = useState<string>(() => {
    return localStorage.getItem('depees_admin_hash') || INITIAL_PASSWORD_HASH;
  });

  // Synchronize state changes to localStorage as local cache
  useEffect(() => {
    try {
      localStorage.setItem('depees_products', JSON.stringify(products));
    } catch {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('depees_categories', JSON.stringify(categories));
    } catch {}
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('depees_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('depees_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('depees_messages', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem('depees_settings', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // Track which datasets have been synced from Supabase so slower /api/* fallback never overwrites cloud data
  const supabaseSyncedRef = useRef({
    products: false,
    categories: false,
    settings: false,
    orders: false,
    messages: false,
  });
  const lastSupabaseSyncRef = useRef<number>(0);

  // Central Server Synchronization on mount (fallback only when Supabase is not configured)
  useEffect(() => {
    const isSupabaseConfigured = Boolean(getSupabase(settings.supabase_url, settings.supabase_anon_key));
    if (isSupabaseConfigured) return;

    const parseJsonSafely = (res: Response) => {
      const ct = res.headers.get('content-type') || '';
      return res.ok && ct.includes('application/json') ? res.json() : null;
    };

    // 1. Fetch live products from central server
    fetch('/api/products')
      .then(parseJsonSafely)
      .then((data) => {
        if (!supabaseSyncedRef.current.products && Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(() => {});

    // 2. Fetch live categories from central server
    fetch('/api/categories')
      .then(parseJsonSafely)
      .then((data) => {
        if (!supabaseSyncedRef.current.categories && Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      })
      .catch(() => {});

    // 3. Fetch live site settings from central server
    fetch('/api/settings')
      .then(parseJsonSafely)
      .then((data) => {
        if (!supabaseSyncedRef.current.settings && data && typeof data === 'object') {
          setSettings((prev) => ({
            ...prev,
            ...data,
            supabase_url: sanitizeSupabaseUrl(data.supabase_url) || prev.supabase_url || INITIAL_SETTINGS.supabase_url,
            supabase_anon_key: sanitizeSupabaseKey(data.supabase_anon_key) || prev.supabase_anon_key || INITIAL_SETTINGS.supabase_anon_key,
          }));
        }
      })
      .catch(() => {});

    // 4. Fetch live orders from central server
    fetch('/api/orders')
      .then(parseJsonSafely)
      .then((data) => {
        if (!supabaseSyncedRef.current.orders && Array.isArray(data)) {
          setOrders(data);
        }
      })
      .catch(() => {});

    // 5. Fetch live messages from central server
    fetch('/api/messages')
      .then(parseJsonSafely)
      .then((data) => {
        if (!supabaseSyncedRef.current.messages && Array.isArray(data)) {
          setMessages(data);
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const syncFromSupabase = useCallback(
    (force = false) => {
      const client = getSupabase(settings.supabase_url, settings.supabase_anon_key);
      if (!client) return;

      const now = Date.now();
      if (!force && now - lastSupabaseSyncRef.current < 3000) return;
      lastSupabaseSyncRef.current = now;

      client
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error && Array.isArray(data) && data.length > 0) {
            supabaseSyncedRef.current.products = true;
            setProducts(
              data.map((p: any) => ({
                ...p,
                price: Number(p.price),
                original_price: p.original_price != null ? Number(p.original_price) : undefined,
                stock_quantity: Number(p.stock_quantity ?? 0),
                images: Array.isArray(p.images) ? p.images : [],
                videos: Array.isArray(p.videos) ? p.videos : [],
                sizes: Array.isArray(p.sizes) ? p.sizes : [],
                colors: Array.isArray(p.colors) ? p.colors : [],
              }))
            );
          }
        });

      client
        .from('categories')
        .select('*')
        .then(({ data, error }) => {
          if (!error && Array.isArray(data) && data.length > 0) {
            supabaseSyncedRef.current.categories = true;
            setCategories(
              data.map((c: any) => ({
                id: c.id,
                name: c.name,
                slug: c.slug,
                description: c.description || '',
                icon: c.icon || 'Sparkles',
                item_count: c.product_count ?? c.item_count ?? 0,
              }))
            );
          }
        });

      client
        .from('site_settings')
        .select('*')
        .eq('id', 'default')
        .maybeSingle()
        .then(({ data, error }) => {
          if (!error && data) {
            supabaseSyncedRef.current.settings = true;
            const { id: _id, updated_at: _upd, ...rest } = data as any;
            setSettings((prev) => ({
              ...prev,
              ...rest,
              delivery_fee_ph: Number(rest.delivery_fee_ph ?? prev.delivery_fee_ph),
              delivery_fee_nationwide: Number(rest.delivery_fee_nationwide ?? prev.delivery_fee_nationwide),
              free_delivery_threshold: Number(rest.free_delivery_threshold ?? prev.free_delivery_threshold),
              supabase_url: prev.supabase_url,
              supabase_anon_key: prev.supabase_anon_key,
            }));
          }
        });

      client
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error && Array.isArray(data) && data.length > 0) {
            supabaseSyncedRef.current.orders = true;
            setOrders(
              data.map((o: any) => ({
                ...o,
                subtotal: Number(o.subtotal),
                delivery_fee: Number(o.delivery_fee),
                total_amount: Number(o.total_amount),
                items: Array.isArray(o.items) ? o.items : [],
              }))
            );
          }
        });

      client
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error && Array.isArray(data) && data.length > 0) {
            supabaseSyncedRef.current.messages = true;
            setMessages(data);
          }
        });
    },
    [settings.supabase_url, settings.supabase_anon_key]
  );

  // Supabase Cloud Synchronization (mount, tab focus/visibility, and live Realtime updates)
  useEffect(() => {
    const client = getSupabase(settings.supabase_url, settings.supabase_anon_key);
    if (!client) return;

    syncFromSupabase(true);

    const handleFocusOrVisible = () => {
      if (document.visibilityState === 'visible') {
        syncFromSupabase(false);
      }
    };

    window.addEventListener('focus', handleFocusOrVisible);
    document.addEventListener('visibilitychange', handleFocusOrVisible);

    const channel = client
      .channel('depees-live-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        syncFromSupabase(true);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
        syncFromSupabase(true);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => {
        syncFromSupabase(true);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        syncFromSupabase(true);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        syncFromSupabase(true);
      })
      .subscribe();

    return () => {
      window.removeEventListener('focus', handleFocusOrVisible);
      document.removeEventListener('visibilitychange', handleFocusOrVisible);
      client.removeChannel(channel);
    };
  }, [settings.supabase_url, settings.supabase_anon_key, syncFromSupabase]);

  // Hidden admin entrance (via #admin, /admin, ?admin, or Ctrl+Shift+A) keeping it hidden from audience
  useEffect(() => {
    const checkAdminRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      if (
        hash === '#admin' ||
        hash === '#/admin' ||
        pathname === '/admin' ||
        search.includes('admin=true') ||
        search.includes('admin')
      ) {
        setCurrentPage(isAdminLoggedIn ? 'admin' : 'admin-login');
      }
    };
    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setCurrentPage(isAdminLoggedIn ? 'admin' : 'admin-login');
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAdminLoggedIn]);

  // Notifications
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((current) => (current === msg ? null : current));
    }, 3500);
  };

  const navigateTo = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
    const selectedSize = size || (product.sizes.length > 0 ? product.sizes[0] : undefined);
    const selectedColor = color || (product.colors.length > 0 ? product.colors[0] : undefined);

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selected_size === selectedSize &&
          item.selected_color === selectedColor
      );

      if (existingIndex > -1) {
        const next = [...prevCart];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }

      return [
        ...prevCart,
        {
          product,
          quantity,
          selected_size: selectedSize,
          selected_color: selectedColor,
        },
      ];
    });

    showNotification(`Added "${product.name}" to cart`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size?: string, color?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selected_size === size &&
            item.selected_color === color
          )
      )
    );
  };

  const updateCartQuantity = (productId: string, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          item.selected_size === size &&
          item.selected_color === color
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Product management
  const addProduct = (productData: Omit<Product, 'id' | 'created_at'>) => {
    const now = Date.now();
    const baseSlug = (productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^-|-$/g, '') || `product-${now}`;
    const uniqueSlug = products.some((p) => p.slug === baseSlug)
      ? `${baseSlug}-${String(now).slice(-4)}`
      : baseSlug;

    const newProduct: Product = {
      ...productData,
      slug: uniqueSlug,
      id: `prod-${now}`,
      created_at: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    showNotification(`Product "${newProduct.name}" added successfully`);

    // Synchronize to Central Server for all devices
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    }).catch((err) => console.error('Failed to sync product to server:', err));

    // Synchronize to Supabase Cloud Database
    const sb = getSupabase(settings.supabase_url, settings.supabase_anon_key);
    if (sb) {
      sb.from('products')
        .upsert(
          {
            id: newProduct.id,
            name: newProduct.name,
            slug: newProduct.slug,
            category_id: newProduct.category_id,
            category_name: newProduct.category_name,
            description: newProduct.description,
            price: newProduct.price,
            original_price: newProduct.original_price ?? null,
            stock_quantity: newProduct.stock_quantity,
            images: newProduct.images,
            videos: newProduct.videos ?? [],
            sizes: newProduct.sizes,
            colors: newProduct.colors,
            is_featured: newProduct.is_featured,
            is_latest: newProduct.is_latest ?? true,
            is_published: newProduct.is_published,
            created_at: newProduct.created_at,
          },
          { onConflict: 'id' }
        )
        .then(({ error }) => {
          if (error) console.error('Supabase addProduct error:', error);
        });
    }
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updatedAt = new Date().toISOString();
    const existing = products.find((p) => p.id === id);
    const merged = existing ? { ...existing, ...updates, updated_at: updatedAt } : null;

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updated_at: updatedAt } : p))
    );
    showNotification('Product updated successfully');

    fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch((err) => console.error('Failed to update product on server:', err));

    const sb = getSupabase(settings.supabase_url, settings.supabase_anon_key);
    if (sb) {
      if (merged) {
        sb.from('products')
          .upsert(
            {
              id: merged.id,
              name: merged.name,
              slug: merged.slug,
              category_id: merged.category_id,
              category_name: merged.category_name,
              description: merged.description,
              price: merged.price,
              original_price: merged.original_price ?? null,
              stock_quantity: merged.stock_quantity,
              images: merged.images,
              videos: merged.videos ?? [],
              sizes: merged.sizes,
              colors: merged.colors,
              is_featured: merged.is_featured,
              is_latest: merged.is_latest ?? true,
              is_published: merged.is_published,
              created_at: merged.created_at,
              updated_at: updatedAt,
            },
            { onConflict: 'id' }
          )
          .then(({ error }) => {
            if (error) console.error('Supabase updateProduct error:', error);
          });
      } else {
        sb.from('products')
          .update({
            ...updates,
            ...(Object.prototype.hasOwnProperty.call(updates, 'original_price')
              ? { original_price: updates.original_price ?? null }
              : {}),
            updated_at: updatedAt,
          })
          .eq('id', id)
          .then(({ error }) => {
            if (error) console.error('Supabase updateProduct error:', error);
          });
      }
    }
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showNotification('Product deleted');

    fetch(`/api/products/${id}`, {
      method: 'DELETE',
    }).catch((err) => console.error('Failed to delete product on server:', err));

    const sb = getSupabase(settings.supabase_url, settings.supabase_anon_key);
    if (sb) {
      sb.from('products')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.error('Supabase deleteProduct error:', error);
        });
    }
  };

  // Category management
  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const now = Date.now();
    const baseSlug = (categoryData.slug || categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^-|-$/g, '') || `category-${now}`;
    const uniqueSlug = categories.some((c) => c.slug === baseSlug)
      ? `${baseSlug}-${String(now).slice(-4)}`
      : baseSlug;

    const newCategory: Category = {
      ...categoryData,
      slug: uniqueSlug,
      id: `cat-${now}`,
    };
    setCategories((prev) => [...prev, newCategory]);
    showNotification(`Category "${newCategory.name}" created`);

    fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCategory),
    }).catch((err) => console.error('Failed to sync category to server:', err));

    const sb = getSupabase(settings.supabase_url, settings.supabase_anon_key);
    if (sb) {
      sb.from('categories')
        .upsert(
          {
            id: newCategory.id,
            name: newCategory.name,
            slug: newCategory.slug,
            description: newCategory.description,
            icon: newCategory.icon || 'Sparkles',
            product_count: newCategory.item_count || 0,
          },
          { onConflict: 'id' }
        )
        .then(({ error }) => {
          if (error) console.error('Supabase addCategory error:', error);
        });
    }
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    showNotification('Category updated');

    fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch((err) => console.error('Failed to update category on server:', err));

    const sb = getSupabase(settings.supabase_url, settings.supabase_anon_key);
    if (sb) {
      const { item_count, ...rest } = updates;
      const payload: Record<string, any> = { ...rest };
      if (item_count !== undefined) payload.product_count = item_count;
      sb.from('categories')
        .update(payload)
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.error('Supabase updateCategory error:', error);
        });
    }
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showNotification('Category deleted');

    fetch(`/api/categories/${id}`, {
      method: 'DELETE',
    }).catch((err) => console.error('Failed to delete category on server:', err));

    const sb = getSupabase(settings.supabase_url, settings.supabase_anon_key);
    if (sb) {
      sb.from('categories')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.error('Supabase deleteCategory error:', error);
        });
    }
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'order_number' | 'created_at'>) => {
    const orderNumber = `DP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      payment_status: 'unpaid',
      order_status: 'pending',
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      created_at: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    }).catch((err) => console.error('Failed to sync order to server:', err));

    const sb = getSupabase(settings.supabase_url, settings.supabase_anon_key);
    if (sb) {
      sb.from('orders')
        .insert(newOrder)
        .then(({ error }) => {
          if (error) console.error('Supabase createOrder error:', error);
        });
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, order_status: status } : ord))
    );
    showNotification(`Order status updated to ${status}`);

    fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch((err) => console.error('Failed to update order status on server:', err));

    const sb = getSupabase(settings.supabase_url, settings.supabase_anon_key);
    if (sb) {
      sb.from('orders')
        .update({ order_status: status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .then(({ error }) => {
          if (error) console.error('Supabase updateOrderStatus error:', error);
        });
    }
  };

  const updatePaymentStatus = (orderId: string, status: 'unpaid' | 'paid' | 'verified') => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, payment_status: status } : ord))
    );
    showNotification(`Payment status updated to ${status}`);

    fetch(`/api/orders/${orderId}/payment`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch((err) => console.error('Failed to update payment status on server:', err));

    const sb = getSupabase(settings.supabase_url, settings.supabase_anon_key);
    if (sb) {
      sb.from('orders')
        .update({ payment_status: status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .then(({ error }) => {
          if (error) console.error('Supabase updatePaymentStatus error:', error);
        });
    }
  };

  // Messages
  const submitContactMessage = (msgData: Omit<ContactMessage, 'id' | 'created_at' | 'status'>) => {
    const newMessage: ContactMessage = {
      ...msgData,
      id: `msg-${Date.now()}`,
      created_at: new Date().toISOString(),
      status: 'unread',
    };
    setMessages((prev) => [newMessage, ...prev]);
    showNotification('Thank you! Your message has been sent to DE-PEES.');

    fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMessage),
    }).catch((err) => console.error('Failed to sync message to server:', err));

    const sb = getSupabase(settings.supabase_url, settings.supabase_anon_key);
    if (sb) {
      sb.from('messages')
        .insert(newMessage)
        .then(({ error }) => {
          if (error) console.error('Supabase submitContactMessage error:', error);
        });
    }
  };

  const markMessageStatus = (id: string, status: 'unread' | 'read' | 'replied') => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));

    fetch(`/api/messages/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch((err) => console.error('Failed to update message status on server:', err));

    const sb = getSupabase(settings.supabase_url, settings.supabase_anon_key);
    if (sb) {
      sb.from('messages')
        .update({ status })
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.error('Supabase markMessageStatus error:', error);
        });
    }
  };

  // Settings
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    const merged = {
      ...settings,
      ...newSettings,
      supabase_url: sanitizeSupabaseUrl(newSettings.supabase_url ?? settings.supabase_url),
      supabase_anon_key: sanitizeSupabaseKey(newSettings.supabase_anon_key ?? settings.supabase_anon_key),
    };
    setSettings(merged);
    showNotification('Website settings saved successfully');

    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(merged),
    }).catch((err) => console.error('Failed to sync settings to server:', err));

    const sb = getSupabase(merged.supabase_url, merged.supabase_anon_key);
    if (sb) {
      const { supabase_url: _u, supabase_anon_key: _k, ...dbSettings } = merged;
      sb.from('site_settings')
        .upsert(
          {
            id: 'default',
            ...dbSettings,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        )
        .then(({ error }) => {
          if (error) console.error('Supabase updateSettings error:', error);
        });
    }
  };

  // Admin Auth
  const loginAdmin = (password: string): boolean => {
    const testHash = hashPassword(password);
    if (testHash === passwordHash) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('depees_admin_session', 'true');
      showNotification('Welcome back, Administrator!');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('depees_admin_session');
    setCurrentPage('home');
    showNotification('Logged out from Admin Dashboard');
  };

  const changeAdminPassword = (
    oldPass: string,
    newPass: string
  ): { success: boolean; message: string } => {
    if (hashPassword(oldPass) !== passwordHash) {
      return { success: false, message: 'Current password is incorrect' };
    }
    if (newPass.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters' };
    }

    const newHash = hashPassword(newPass);
    setPasswordHash(newHash);
    localStorage.setItem('depees_admin_hash', newHash);
    return { success: true, message: 'Password updated successfully' };
  };

  return (
    <StoreContext.Provider
      value={{
        currentPage,
        navigateTo,
        selectedProductId,
        setSelectedProductId,
        isCartOpen,
        setIsCartOpen,
        categoryFilter,
        setCategoryFilter,
        searchQuery,
        setSearchQuery,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartItemCount,
        orders,
        createOrder,
        updateOrderStatus,
        updatePaymentStatus,
        messages,
        submitContactMessage,
        markMessageStatus,
        settings,
        updateSettings,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        notification,
        showNotification,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
