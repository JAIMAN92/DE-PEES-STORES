import React, { useState, useEffect } from 'react';
import {
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Users,
  Layers,
  Settings,
  Database,
  KeyRound,
  LogOut,
  Plus,
  Upload,
  Video,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Check,
  Download,
  Search,
  ExternalLink,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  FolderPlus,
  RefreshCw,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, Category, OrderStatus, ProductImage, ProductVideo } from '../types';
import { BrandedPlaceholder } from '../components/BrandedPlaceholder';
import { getWhatsAppUrl } from '../lib/whatsapp';
import { SUPABASE_SQL_SCRIPT } from '../lib/supabaseSql';
import {
  getSupabase,
  resetSupabaseClient,
  sanitizeSupabaseUrl,
  sanitizeSupabaseKey,
} from '../lib/supabase';
import { sanitizeMediaUrl } from '../lib/sanitizeUrl';

export const AdminPage: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    orders,
    updateOrderStatus,
    updatePaymentStatus,
    messages,
    markMessageStatus,
    settings,
    updateSettings,
    logoutAdmin,
    changeAdminPassword,
    navigateTo,
    isAdminLoggedIn,
    showNotification,
  } = useStore();

  // If not logged in, show gate
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 max-w-md w-full text-center space-y-4">
          <ShieldCheck className="w-12 h-12 text-[#DB2777] mx-auto" />
          <h2 className="text-xl font-bold text-white">Administrator Access Required</h2>
          <p className="text-xs text-slate-400">
            You must log in to view and manage DE-PEES BABY & MOTHER CARE.
          </p>
          <button
            onClick={() => navigateTo('admin-login')}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#DB2777] to-[#1E3A8A] text-white text-xs font-bold"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  // Active Admin Tabs
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'categories' | 'orders' | 'messages' | 'content' | 'supabase' | 'profile'
  >('overview');

  // Product Form Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState(categories[0]?.id || '');
  const [formPrice, setFormPrice] = useState(0);
  const [formOriginalPrice, setFormOriginalPrice] = useState(0);
  const [formDescription, setFormDescription] = useState('');
  const [formSizes, setFormSizes] = useState('');
  const [formColors, setFormColors] = useState('');
  const [formStock, setFormStock] = useState(10);
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [formImages, setFormImages] = useState<ProductImage[]>([]);
  const [formVideos, setFormVideos] = useState<ProductVideo[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  // Category Modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');

  // Password Change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(
    null
  );

  // Settings State
  const [editSettings, setEditSettings] = useState(settings);
  useEffect(() => {
    setEditSettings(settings);
  }, [settings]);
  const [copiedSql, setCopiedSql] = useState(false);
  const [supabaseTesting, setSupabaseTesting] = useState(false);
  const [supabaseTestMsg, setSupabaseTestMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Filters for orders
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Products filter
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('all');

  // Open modal for adding
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setFormName('');
    setFormCategory(categories[0]?.id || '');
    setFormPrice(15000);
    setFormOriginalPrice(18000);
    setFormDescription('');
    setFormSizes('24 EU, 26 EU, 28 EU, 30 EU');
    setFormColors('White, Gold, Navy');
    setFormStock(15);
    setFormIsFeatured(false);
    setFormIsPublished(true);
    setFormImages([]);
    setFormVideos([]);
    setImageUrlInput('');
    setVideoUrlInput('');
    setIsProductModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setFormName(prod.name);
    setFormCategory(prod.category_id);
    setFormPrice(prod.price);
    setFormOriginalPrice(prod.original_price || 0);
    setFormDescription(prod.description);
    setFormSizes(prod.sizes.join(', '));
    setFormColors(prod.colors.join(', '));
    setFormStock(prod.stock_quantity);
    setFormIsFeatured(prod.is_featured);
    setFormIsPublished(prod.is_published);
    setFormImages(prod.images || []);
    setFormVideos(prod.videos || []);
    setImageUrlInput('');
    setVideoUrlInput('');
    setIsProductModalOpen(true);
  };

  const readFileAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          resolve(event.target.result);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });

  const uploadMediaToSupabaseOrFallback = async (file: File, folder: 'images' | 'videos'): Promise<string> => {
    const sb = getSupabase(settings.supabase_url, settings.supabase_anon_key);
    if (sb) {
      try {
        const ext = (file.name.split('.').pop() || (folder === 'images' ? 'jpg' : 'mp4')).replace(/[^a-z0-9]/gi, '');
        const filePath = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: uploadError } = await sb.storage
          .from('product-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type || undefined,
          });

        if (!uploadError) {
          const { data: pubData } = sb.storage.from('product-images').getPublicUrl(filePath);
          if (pubData?.publicUrl) {
            return pubData.publicUrl;
          }
        }
      } catch (err) {
        console.warn('Supabase Storage upload fallback to inline data URL:', err);
      }
    }
    return readFileAsDataUrl(file);
  };

  // Handle local image file upload (uploads to Supabase Storage if connected, else Data URL)
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingMedia(true);
    try {
      const fileArray = Array.from(files);
      const uploaded: ProductImage[] = [];
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const url = await uploadMediaToSupabaseOrFallback(file, 'images');
        uploaded.push({
          id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          url,
          is_primary: formImages.length === 0 && i === 0,
          alt_text: formName || file.name,
        });
      }
      setFormImages((prev) => [...prev, ...uploaded]);
    } finally {
      setIsUploadingMedia(false);
      e.target.value = '';
    }
  };

  // Handle local video file upload (uploads to Supabase Storage if connected, else Data URL)
  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploadingMedia(true);
    try {
      const url = await uploadMediaToSupabaseOrFallback(file, 'videos');
      const newVideo: ProductVideo = {
        id: `vid-${Date.now()}`,
        url,
        title: file.name,
      };
      setFormVideos([newVideo]);
    } finally {
      setIsUploadingMedia(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = () => {
    const safeUrl = sanitizeMediaUrl(imageUrlInput);
    if (!safeUrl) {
      if (imageUrlInput.trim()) {
        showNotification('Please enter a valid http(s) image URL.');
      }
      return;
    }
    const newImage: ProductImage = {
      id: `img-${Date.now()}`,
      url: safeUrl,
      is_primary: formImages.length === 0,
      alt_text: formName,
    };
    setFormImages((prev) => [...prev, newImage]);
    setImageUrlInput('');
  };

  const handleAddVideoUrl = () => {
    const safeUrl = sanitizeMediaUrl(videoUrlInput);
    if (!safeUrl) {
      if (videoUrlInput.trim()) {
        showNotification('Please enter a valid http(s) video URL.');
      }
      return;
    }
    const newVideo: ProductVideo = {
      id: `vid-${Date.now()}`,
      url: safeUrl,
      title: 'Product Demonstration Video',
    };
    setFormVideos([newVideo]);
    setVideoUrlInput('');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formPrice <= 0) return;

    const catObj = categories.find((c) => c.id === formCategory);
    const categoryName = catObj ? catObj.name : "Children's Clothing";

    const parsedSizes = formSizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedColors = formColors
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const productPayload = {
      name: formName.trim(),
      slug: formName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category_id: formCategory,
      category_name: categoryName,
      description: formDescription.trim(),
      price: Number(formPrice),
      original_price: Number(formOriginalPrice) || undefined,
      images: formImages,
      videos: formVideos,
      sizes: parsedSizes,
      colors: parsedColors,
      stock_quantity: Number(formStock),
      is_featured: formIsFeatured,
      is_published: formIsPublished,
      is_latest: true,
    };

    if (editingProductId) {
      updateProduct(editingProductId, productPayload);
    } else {
      addProduct(productPayload);
    }

    setIsProductModalOpen(false);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    addCategory({
      name: categoryName.trim(),
      slug: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: categoryDesc.trim(),
    });

    setCategoryName('');
    setCategoryDesc('');
    setIsCategoryModalOpen(false);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    const res = changeAdminPassword(oldPassword, newPassword);
    if (res.success) {
      setPasswordMsg({ type: 'success', text: res.message });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordMsg({ type: 'error', text: res.message });
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(editSettings);
    if (editSettings.supabase_url && editSettings.supabase_anon_key) {
      resetSupabaseClient(editSettings.supabase_url.trim(), editSettings.supabase_anon_key.trim());
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([SUPABASE_SQL_SCRIPT], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'depees_supabase_schema.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleTestSupabase = async () => {
    const rawUrl = editSettings.supabase_url?.trim() || '';
    const rawKey = editSettings.supabase_anon_key?.trim() || '';

    if (!rawUrl || !rawKey) {
      setSupabaseTestMsg({
        type: 'error',
        text: 'Please enter both your Supabase Project URL and Anon API Key.',
      });
      return;
    }

    if (rawUrl.startsWith('postgresql://') || rawUrl.startsWith('postgres://')) {
      setSupabaseTestMsg({
        type: 'error',
        text: 'You entered a PostgreSQL connection URI instead of your Project URL. Your Project URL looks like: https://yourprojectref.supabase.co (find it in Supabase under Project Settings → API).',
      });
      return;
    }

    if (rawKey.startsWith('sbp_')) {
      setSupabaseTestMsg({
        type: 'error',
        text: 'You entered a personal management token (starts with "sbp_..."). Your website needs the "anon public" API key (starts with "eyJ..."). Find it in Supabase under Project Settings → API.',
      });
      return;
    }

    if (!rawKey.startsWith('ey') && rawKey.length < 40) {
      setSupabaseTestMsg({
        type: 'error',
        text: 'The key you entered looks like a database password. Supabase "anon public" key is a long JWT key starting with "eyJ...". Find it in Supabase under Project Settings → API.',
      });
      return;
    }

    setSupabaseTesting(true);
    setSupabaseTestMsg(null);

    const cleanUrl = sanitizeSupabaseUrl(rawUrl);
    const cleanKey = sanitizeSupabaseKey(rawKey);

    try {
      const client = resetSupabaseClient(cleanUrl, cleanKey);
      if (!client) {
        throw new Error('Could not initialize Supabase client. Please check the URL format.');
      }

      // Quick test query to check categories table
      const { data, error } = await client.from('categories').select('id').limit(1);
      if (error) {
        const msg = (error.message || '').toLowerCase();
        const code = error.code || '';

        if (
          code === 'PGRST116' ||
          code === 'PGRST204' ||
          code === 'PGRST205' ||
          code === '42P01' ||
          msg.includes('relation') ||
          msg.includes('not exist') ||
          msg.includes('schema cache') ||
          msg.includes('could not find the table')
        ) {
          setSupabaseTestMsg({
            type: 'error',
            text: 'Connected to your Supabase project, but the tables have not been created yet! Click the "Copy SQL Script" button below, open the SQL Editor in Supabase, paste it, and click "Run".',
          });
        } else if (msg.includes('apikey') || msg.includes('jwt') || msg.includes('unauthorized') || code === 'PGRST301') {
          setSupabaseTestMsg({
            type: 'error',
            text: 'Invalid API Key or unauthorized. Please ensure you copied the "anon public" key from Project Settings → API in your Supabase project.',
          });
        } else if (msg.includes('failed to fetch') || msg.includes('networkerror')) {
          setSupabaseTestMsg({
            type: 'error',
            text: 'Could not reach Supabase. Please verify that your project is active and that the URL is correct (e.g. https://xyz.supabase.co).',
          });
        } else {
          setSupabaseTestMsg({
            type: 'error',
            text: `Supabase returned: ${error.message}`,
          });
        }
      } else {
        const updated = {
          ...editSettings,
          supabase_url: cleanUrl,
          supabase_anon_key: cleanKey,
        };
        setEditSettings(updated);
        updateSettings(updated);
        setSupabaseTestMsg({
          type: 'success',
          text: '🎉 Connected successfully! Your Supabase database is active, tables verified, and cross-device sync is enabled.',
        });
      }
    } catch (err: any) {
      setSupabaseTestMsg({
        type: 'error',
        text: err.message || 'Connection failed. Verify your Supabase URL and Anon Key.',
      });
    } finally {
      setSupabaseTesting(false);
    }
  };

  // Stats calculation
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.order_status === 'pending').length;
  const completedOrders = orders.filter((o) => o.order_status === 'completed').length;
  const totalStock = products.reduce((acc, p) => acc + p.stock_quantity, 0);
  const unreadMessages = messages.filter((m) => m.status === 'unread').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Admin Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-pink-400/80 bg-white shrink-0">
            <img
              src="/images/depees_logo.jpg"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://i.ibb.co/mr0VXG8j/Whats-App-Image-2026-10-23-at-2-10-31-PM.jpg';
              }}
              alt="DE-PEES Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              <span>DE-PEES CONTROL DASHBOARD</span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Port Harcourt HQ
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Administrator: Secure Management Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('home')}
            className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Public Store</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="text-xs text-rose-300 hover:text-rose-100 flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Admin Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200/90 shadow-2xs flex items-center gap-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'products'
                ? 'bg-[#DB2777] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({totalProducts})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'categories'
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders</span>
            {pendingOrders > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] flex items-center justify-center font-bold">
                {pendingOrders}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'messages'
                ? 'bg-[#0891B2] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Enquiries</span>
            {unreadMessages > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#DB2777] text-white text-[9px] flex items-center justify-center font-bold">
                {unreadMessages}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'content'
                ? 'bg-[#D4AF37] text-slate-900 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Website Content</span>
          </button>

          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'supabase'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Supabase Cloud Database</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Security & Password</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Supabase Cross-Device Sync Notice Banner */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-[#1E3A8A] text-white p-4 sm:p-5 rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Supabase Cloud Database & Cross-Device Sync</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {settings.supabase_url && settings.supabase_anon_key ? 'Connected & Active' : 'Cross-Device Sync'}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {settings.supabase_url && settings.supabase_anon_key
                      ? 'Your store is connected to Supabase PostgreSQL. All product uploads, edits, and orders sync automatically across every device.'
                      : 'Connect your Supabase database so all newly uploaded products and edits reflect across every phone and computer immediately.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('supabase')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors whitespace-nowrap flex items-center gap-1.5 shrink-0"
              >
                <span>{settings.supabase_url && settings.supabase_anon_key ? 'Manage Supabase' : 'Setup Supabase'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* KPI Cards Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold">Total Products</span>
                  <Package className="w-4 h-4 text-[#DB2777]" />
                </div>
                <div className="text-2xl font-bold text-slate-900 tabular-nums">
                  {totalProducts}
                </div>
                <span className="text-[11px] text-slate-400">Available in catalogue</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold">Total Orders</span>
                  <ShoppingBag className="w-4 h-4 text-[#1E3A8A]" />
                </div>
                <div className="text-2xl font-bold text-slate-900 tabular-nums">{totalOrders}</div>
                <span className="text-[11px] text-slate-400">Across Nigeria</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-amber-600">
                  <span className="text-xs font-semibold">Pending Orders</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-amber-700 tabular-nums">
                  {pendingOrders}
                </div>
                <span className="text-[11px] text-amber-600/80">Requires dispatch</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-emerald-600">
                  <span className="text-xs font-semibold">Completed Orders</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-emerald-700 tabular-nums">
                  {completedOrders}
                </div>
                <span className="text-[11px] text-emerald-600/80">Delivered successfully</span>
              </div>
            </div>

            {/* Sub-row: Stock & Customers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500">Available Stock Units</span>
                  <div className="text-xl font-bold text-slate-900 mt-1 tabular-nums">
                    {totalStock} items in Port Harcourt store
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('products')}
                  className="text-xs font-semibold text-[#1E3A8A] hover:underline"
                >
                  Manage Inventory →
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500">Customer Messages</span>
                  <div className="text-xl font-bold text-slate-900 mt-1 tabular-nums">
                    {unreadMessages} new customer inquiries
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('messages')}
                  className="text-xs font-semibold text-[#0891B2] hover:underline"
                >
                  View Enquiries →
                </button>
              </div>
            </div>

            {/* Quick Actions & Recent Orders Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Recent Orders (7 Cols) */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">Recent Customer Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold text-[#1E3A8A] hover:underline"
                  >
                    View All Orders
                  </button>
                </div>

                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {orders.slice(0, 5).map((ord) => (
                    <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                          <span>{ord.order_number}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              ord.order_status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.order_status === 'processing'
                                ? 'bg-blue-100 text-blue-800'
                                : ord.order_status === 'shipped'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ord.order_status}
                          </span>
                        </div>
                        <div className="text-slate-500 mt-0.5">
                          {ord.customer_name} · {ord.city}, {ord.state}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900 tabular-nums">
                          ₦{ord.total_amount.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400 capitalize">
                          {ord.payment_method.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Latest Products & Quick Buttons (5 Cols) */}
              <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">Latest Uploaded Products</h3>
                  <button
                    onClick={handleOpenAddProduct}
                    className="text-xs font-bold text-[#DB2777] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload New</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {products.slice(0, 4).map((p) => (
                    <div key={p.id} className="py-2.5 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                        {p.images[0]?.url ? (
                          <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-400">
                            DE-PEES
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-slate-800 truncate">{p.name}</h4>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2">
                          <span className="font-bold text-[#1E3A8A]">₦{p.price.toLocaleString()}</span>
                          <span>·</span>
                          <span>{p.stock_quantity} in stock</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Action Bar with CLEARLY VISIBLE BUTTONS as requested in Section 8 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Product Search & Category Filter */}
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products by name or description..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-[#DB2777]"
                  />
                </div>

                <select
                  value={productCatFilter}
                  onChange={(e) => setProductCatFilter(e.target.value)}
                  className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* PRIMARY ACTION BUTTONS (MANDATORY IN BRIEF) */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleOpenAddProduct}
                  className="py-2.5 px-4 rounded-xl text-xs font-bold bg-[#DB2777] hover:bg-[#BE185D] text-white shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD NEW PRODUCT</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Item & Photograph</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price (₦)</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Sizes & Colours</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products
                      .filter((p) => {
                        if (productCatFilter !== 'all' && p.category_id !== productCatFilter)
                          return false;
                        if (
                          productSearch &&
                          !p.name.toLowerCase().includes(productSearch.toLowerCase())
                        )
                          return false;
                        return true;
                      })
                      .map((p) => {
                        return (
                          <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0 relative">
                                  {p.images[0]?.url ? (
                                    <img
                                      src={p.images[0].url}
                                      alt=""
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center p-1 text-[7px] text-slate-400 text-center">
                                      <span>Image</span>
                                      <span>Coming</span>
                                    </div>
                                  )}
                                </div>
                                <div className="max-w-xs">
                                  <div className="font-bold text-slate-900 line-clamp-1">
                                    {p.name}
                                  </div>
                                  <div className="text-[10px] text-slate-400 line-clamp-1">
                                    {p.description}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-4 font-medium text-slate-700">
                              {p.category_name}
                            </td>

                            <td className="py-3 px-4 font-bold text-slate-900 tabular-nums">
                              ₦{p.price.toLocaleString()}
                            </td>

                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  p.stock_quantity > 0
                                    ? 'bg-emerald-50 text-emerald-800'
                                    : 'bg-rose-50 text-rose-800'
                                }`}
                              >
                                {p.stock_quantity} available
                              </span>
                            </td>

                            <td className="py-3 px-4 text-[11px] text-slate-500 max-w-[180px]">
                              <div>Sizes: {p.sizes.join(', ') || 'None'}</div>
                              <div>Colours: {p.colors.join(', ') || 'None'}</div>
                            </td>

                            <td className="py-3 px-4">
                              <div className="space-y-1">
                                <button
                                  onClick={() =>
                                    updateProduct(p.id, { is_published: !p.is_published })
                                  }
                                  className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase transition-colors block ${
                                    p.is_published
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-slate-200 text-slate-600'
                                  }`}
                                >
                                  {p.is_published ? 'Published' : 'Draft'}
                                </button>
                                {p.is_featured && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold block">
                                    Featured
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenEditProduct(p)}
                                  className="p-1.5 rounded-lg bg-blue-50 text-[#1E3A8A] hover:bg-blue-100 transition-colors"
                                  title="Edit Product"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                      deleteProduct(p.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORY MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Product Categories</h3>
                <p className="text-xs text-slate-500">
                  Organize children's shoes, clothing, school bags, and mother care products.
                </p>
              </div>

              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="py-2.5 px-4 rounded-xl text-xs font-bold bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>CREATE CATEGORY</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const count = products.filter((p) => p.category_id === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-sm text-slate-900">{cat.name}</h4>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {count} items
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{cat.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono text-[10px]">slug: {cat.slug}</span>
                      <button
                        onClick={() => {
                          if (confirm(`Delete category "${cat.name}"?`)) {
                            deleteCategory(cat.id);
                          }
                        }}
                        className="text-rose-600 hover:text-rose-800 text-[11px] font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by order ID, customer name, phone, address..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-600">Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {orders
                .filter((ord) => {
                  if (orderStatusFilter !== 'all' && ord.order_status !== orderStatusFilter)
                    return false;
                  if (orderSearch) {
                    const q = orderSearch.toLowerCase();
                    const matchNum = ord.order_number.toLowerCase().includes(q);
                    const matchName = ord.customer_name.toLowerCase().includes(q);
                    const matchPhone = ord.customer_phone.includes(q);
                    const matchCity = ord.city.toLowerCase().includes(q);
                    if (!matchNum && !matchName && !matchPhone && !matchCity) return false;
                  }
                  return true;
                })
                .map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{ord.order_number}</span>
                          <span
                            className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                              ord.order_status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.order_status === 'processing'
                                ? 'bg-blue-100 text-blue-800'
                                : ord.order_status === 'shipped'
                                ? 'bg-purple-100 text-purple-800'
                                : ord.order_status === 'cancelled'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            Status: {ord.order_status}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          Placed on: {new Date(ord.created_at).toLocaleString()}
                        </span>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-base font-bold text-[#1E3A8A] tabular-nums">
                          ₦{ord.total_amount.toLocaleString()}
                        </span>
                        <div className="text-[11px] text-slate-500">
                          Method: {ord.payment_method.replace('_', ' ')} (Payment:{' '}
                          <span className="font-semibold">{ord.payment_status}</span>)
                        </div>
                      </div>
                    </div>

                    {/* Customer and Delivery Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl">
                      <div>
                        <span className="font-semibold text-slate-700 block mb-1">
                          Customer Information:
                        </span>
                        <div>Name: {ord.customer_name}</div>
                        <div>Phone: {ord.customer_phone}</div>
                        <div>Email: {ord.customer_email || 'Not given'}</div>
                      </div>

                      <div>
                        <span className="font-semibold text-slate-700 block mb-1">
                          Delivery Destination:
                        </span>
                        <div>{ord.delivery_address}</div>
                        <div>
                          {ord.city}, {ord.state}
                        </div>
                        {ord.order_notes && (
                          <div className="text-amber-800 mt-1 italic">Notes: "{ord.order_notes}"</div>
                        )}
                      </div>
                    </div>

                    {/* Ordered Items List */}
                    <div className="space-y-1.5 text-xs">
                      <span className="font-semibold text-slate-700">Items Ordered:</span>
                      {ord.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-slate-600 pl-2 border-l-2 border-pink-200"
                        >
                          <span>
                            {item.quantity}x {item.product_name}{' '}
                            {item.selected_size ? `(Size: ${item.selected_size})` : ''}{' '}
                            {item.selected_color ? `(Color: ${item.selected_color})` : ''}
                          </span>
                          <span className="font-medium tabular-nums">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Status Action Controls */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700">Update Status:</span>
                        {(['pending', 'processing', 'shipped', 'completed', 'cancelled'] as OrderStatus[]).map(
                          (st) => (
                            <button
                              key={st}
                              onClick={() => updateOrderStatus(ord.id, st)}
                              className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                                ord.order_status === st
                                  ? 'bg-slate-900 text-white font-bold'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {st}
                            </button>
                          )
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700">Payment:</span>
                        {(['unpaid', 'paid', 'verified'] as const).map((payStatus) => (
                          <button
                            key={payStatus}
                            onClick={() => updatePaymentStatus(ord.id, payStatus)}
                            className={`px-2 py-1 rounded text-[11px] capitalize transition-colors ${
                              ord.payment_status === payStatus
                                ? 'bg-emerald-600 text-white font-bold'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {payStatus}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 5: MESSAGES & ENQUIRIES */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900">Customer Messages & Enquiries</h3>
              <p className="text-xs text-slate-500">
                Submitted directly from the Contact Us page on the DE-PEES website.
              </p>
            </div>

            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="bg-white p-10 rounded-2xl text-center text-xs text-slate-500">
                  No inquiries received yet.
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">{msg.full_name}</span>
                        <div className="text-slate-500">
                          Phone: {msg.phone_number} {msg.email ? `· Email: ${msg.email}` : ''}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            msg.status === 'unread'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {msg.status}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs">
                      <div className="font-semibold text-slate-800 mb-1">Subject: {msg.subject}</div>
                      <p className="text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                        {msg.message}
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      {msg.status === 'unread' && (
                        <button
                          onClick={() => markMessageStatus(msg.id, 'read')}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
                        >
                          Mark as Read
                        </button>
                      )}
                      <a
                        href={getWhatsAppUrl(msg.phone_number, `Hello ${msg.full_name}, this is DE-PEES BABY & MOTHER CARE responding to your enquiry.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#25D366] hover:bg-[#20BD5A] text-white flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Reply on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 6: WEBSITE CONTENT MANAGEMENT */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900">Website Content Management</h3>
              <p className="text-xs text-slate-500">
                Any updates made here automatically reflect across the live storefront.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
              {/* Business Identity */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A] pb-2 border-b border-slate-100">
                  Business Details & Port Harcourt Location
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={editSettings.business_name}
                      onChange={(e) =>
                        setEditSettings({ ...editSettings, business_name: e.target.value })
                      }
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      City / Location
                    </label>
                    <input
                      type="text"
                      value={editSettings.location}
                      onChange={(e) =>
                        setEditSettings({ ...editSettings, location: e.target.value })
                      }
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Physical Address (Port Harcourt)
                  </label>
                  <input
                    type="text"
                    value={editSettings.address}
                    onChange={(e) =>
                      setEditSettings({ ...editSettings, address: e.target.value })
                    }
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Telephone Call Line
                    </label>
                    <input
                      type="text"
                      value={editSettings.phone}
                      onChange={(e) =>
                        setEditSettings({ ...editSettings, phone: e.target.value })
                      }
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      WhatsApp Number (e.g. 08100809719 or 2348100809719)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 08100809719"
                      value={editSettings.whatsapp_number}
                      onChange={(e) =>
                        setEditSettings({
                          ...editSettings,
                          whatsapp_number: e.target.value,
                          whatsapp_display: e.target.value,
                        })
                      }
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editSettings.email}
                      onChange={(e) =>
                        setEditSettings({ ...editSettings, email: e.target.value })
                      }
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Homepage Headlines */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#DB2777] pb-2 border-b border-slate-100">
                  Homepage Headlines & Promotional Message
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Main Hero Headline
                  </label>
                  <input
                    type="text"
                    value={editSettings.hero_headline}
                    onChange={(e) =>
                      setEditSettings({ ...editSettings, hero_headline: e.target.value })
                    }
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Supporting Hero Text
                  </label>
                  <textarea
                    rows={2}
                    value={editSettings.hero_supporting_text}
                    onChange={(e) =>
                      setEditSettings({ ...editSettings, hero_supporting_text: e.target.value })
                    }
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Top Announcement Banner
                  </label>
                  <input
                    type="text"
                    value={editSettings.promotional_banner}
                    onChange={(e) =>
                      setEditSettings({ ...editSettings, promotional_banner: e.target.value })
                    }
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
              </div>

              {/* Bank Transfer Details & Delivery Pricing */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] pb-2 border-b border-slate-100">
                  Bank Details & Delivery Charges (₦)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={editSettings.bank_name}
                      onChange={(e) =>
                        setEditSettings({ ...editSettings, bank_name: e.target.value })
                      }
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={editSettings.account_number}
                      onChange={(e) =>
                        setEditSettings({ ...editSettings, account_number: e.target.value })
                      }
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Account Name
                    </label>
                    <input
                      type="text"
                      value={editSettings.account_name}
                      onChange={(e) =>
                        setEditSettings({ ...editSettings, account_name: e.target.value })
                      }
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Port Harcourt Delivery Fee (₦)
                    </label>
                    <input
                      type="number"
                      value={editSettings.delivery_fee_ph}
                      onChange={(e) =>
                        setEditSettings({ ...editSettings, delivery_fee_ph: Number(e.target.value) })
                      }
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nationwide Delivery Fee (₦)
                    </label>
                    <input
                      type="number"
                      value={editSettings.delivery_fee_nationwide}
                      onChange={(e) =>
                        setEditSettings({
                          ...editSettings,
                          delivery_fee_nationwide: Number(e.target.value),
                        })
                      }
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Free Delivery Threshold (₦)
                    </label>
                    <input
                      type="number"
                      value={editSettings.free_delivery_threshold}
                      onChange={(e) =>
                        setEditSettings({
                          ...editSettings,
                          free_delivery_threshold: Number(e.target.value),
                        })
                      }
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="py-3 px-8 rounded-xl font-bold text-xs sm:text-sm bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white shadow-md transition-colors"
                >
                  SAVE ALL CHANGES
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 7: SUPABASE CLOUD DATABASE & SQL SCRIPT */}
        {activeTab === 'supabase' && (
          <div className="space-y-6">
            {/* Header Action Bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-600" />
                  <span>Supabase Cloud Database & Cross-Device Synchronization</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Connect your live Supabase PostgreSQL database to ensure products, categories, orders, and store settings sync across every phone and computer.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySql}
                  className="py-2 px-3.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1.5 transition-colors"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copied SQL Script!' : 'Copy SQL Script'}</span>
                </button>

                <button
                  onClick={handleDownloadSql}
                  className="py-2 px-3.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .sql File</span>
                </button>
              </div>
            </div>

            {/* Quick 3-Step Setup Instructions */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl border border-slate-700 shadow-sm space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Quick 3-Step Supabase Setup Guide
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                    1
                  </div>
                  <div className="font-semibold text-white">Create Supabase Project</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Go to{' '}
                    <a
                      href="https://supabase.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 underline font-medium"
                    >
                      supabase.com
                    </a>{' '}
                    and create a free project named <strong>depees-store</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                    2
                  </div>
                  <div className="font-semibold text-white">Run SQL Script</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Click <strong>SQL Editor</strong> on the left menu, paste the SQL script below, and click <strong>Run</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                    3
                  </div>
                  <div className="font-semibold text-white">Paste API Credentials</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    In <strong>Project Settings → API</strong>, copy your <strong>Project URL</strong> & <strong>anon key</strong> into the fields below and click Test Connection.
                  </p>
                </div>
              </div>
            </div>

            {/* Supabase Connection Setup Panel */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Supabase Project Connection Credentials
                </h4>
                <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Real-time Cross-Device Sync
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Supabase Project URL (e.g. https://xyz.supabase.co)
                  </label>
                  <input
                    type="text"
                    value={editSettings.supabase_url || ''}
                    onChange={(e) =>
                      setEditSettings({ ...editSettings, supabase_url: e.target.value })
                    }
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 font-mono outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Supabase Anon Public API Key (anon key)
                  </label>
                  <input
                    type="password"
                    value={editSettings.supabase_anon_key || ''}
                    onChange={(e) =>
                      setEditSettings({ ...editSettings, supabase_anon_key: e.target.value })
                    }
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 font-mono outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {supabaseTestMsg && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                    supabaseTestMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {supabaseTestMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  )}
                  <span>{supabaseTestMsg.text}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <p className="text-[11px] text-slate-500">
                  Tip: The anon key is safe to use in frontend websites with the Row Level Security (RLS) policies provided.
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestSupabase}
                    disabled={supabaseTesting}
                    className="py-2.5 px-5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>{supabaseTesting ? 'Testing Connection...' : 'Save & Test Connection'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* SQL Script Viewer */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-emerald-400 font-bold">supabase_schema.sql</span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">PostgreSQL 15+</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopySql}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'Copied!' : 'Copy Script'}</span>
                  </button>
                  <button
                    onClick={handleDownloadSql}
                    className="text-xs text-slate-300 hover:text-white font-medium flex items-center gap-1 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              <pre className="text-[11px] font-mono text-emerald-300 max-h-96 overflow-y-auto p-3 bg-slate-950 rounded-xl leading-relaxed select-all">
                {SUPABASE_SQL_SCRIPT}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 8: ADMIN PROFILE & SECURITY */}
        {activeTab === 'profile' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#DB2777] block mb-1">
                  Administrator Security
                </span>
                <h3 className="text-lg font-bold text-slate-900">Change Admin Password</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Update the password used to access the DE-PEES owner dashboard.
                </p>
              </div>

              {passwordMsg && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                    passwordMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {passwordMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{passwordMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-bold bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white shadow-md transition-colors"
                >
                  UPDATE PASSWORD
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* PRODUCT ADD / EDIT MODAL */}
      {isProductModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn"
          onClick={() => setIsProductModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingProductId ? 'Edit Product Record' : 'Add New Product to Store'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Classic Kids White & Gold Sneakers"
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#DB2777]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none bg-white font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price (₦)</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Original Price (₦ - for discount)
                  </label>
                  <input
                    type="number"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe material, comfort, durability, and features..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Available Sizes (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formSizes}
                    onChange={(e) => setFormSizes(e.target.value)}
                    placeholder="24 EU, 26 EU, 28 EU or 0-6M"
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Available Colours (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formColors}
                    onChange={(e) => setFormColors(e.target.value)}
                    placeholder="Pink, Gold, Navy Blue"
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
              </div>

              {/* IMAGE UPLOAD SECTION (AS REQUIRED IN SECTION 8) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-[#DB2777]" />
                    Product Photographs (Owner Upload)
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {formImages.length} photo(s) selected
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <label className="w-full sm:w-auto py-2 px-4 rounded-xl bg-white border border-slate-300 hover:border-[#DB2777] font-semibold text-slate-700 cursor-pointer text-center transition-colors">
                    <span>Choose Photo Files</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>

                  <span className="text-slate-400">or enter image URL:</span>

                  <div className="flex-1 flex gap-1 w-full">
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="https://.../photo.jpg"
                      className="flex-1 p-2 rounded-xl border border-slate-200 outline-none bg-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="py-2 px-3 rounded-xl bg-slate-800 text-white font-medium"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Previews */}
                {formImages.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto pt-2">
                    {formImages.map((img, i) => (
                      <div
                        key={img.id || i}
                        className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-300 group shrink-0"
                      >
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormImages(formImages.filter((_, idx) => idx !== i))}
                          className="absolute inset-0 bg-rose-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* VIDEO UPLOAD SECTION (AS REQUIRED IN SECTION 8) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-[#0891B2]" />
                    Product Video (Optional)
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {formVideos.length} video(s)
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <label className="w-full sm:w-auto py-2 px-4 rounded-xl bg-white border border-slate-300 hover:border-[#0891B2] font-semibold text-slate-700 cursor-pointer text-center transition-colors">
                    <span>Choose Video File</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileUpload}
                      className="hidden"
                    />
                  </label>

                  <span className="text-slate-400">or enter video URL:</span>

                  <div className="flex-1 flex gap-1 w-full">
                    <input
                      type="url"
                      value={videoUrlInput}
                      onChange={(e) => setVideoUrlInput(e.target.value)}
                      placeholder="https://.../video.mp4"
                      className="flex-1 p-2 rounded-xl border border-slate-200 outline-none bg-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddVideoUrl}
                      className="py-2 px-3 rounded-xl bg-slate-800 text-white font-medium"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {formVideos.length > 0 && (
                  <div className="text-[11px] text-emerald-700 flex items-center justify-between bg-emerald-50 p-2 rounded-lg">
                    <span>Video attached: {formVideos[0].title || 'Product Clip'}</span>
                    <button
                      type="button"
                      onClick={() => setFormVideos([])}
                      className="text-rose-600 underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="rounded text-[#DB2777]"
                  />
                  <span className="font-semibold text-slate-700">Mark as Featured Product</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsPublished}
                    onChange={(e) => setFormIsPublished(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span className="font-semibold text-slate-700">Publish immediately</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="py-2.5 px-5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingMedia}
                  className="py-2.5 px-6 rounded-xl bg-[#DB2777] hover:bg-[#BE185D] disabled:opacity-50 text-white font-bold shadow-md transition-colors"
                >
                  {isUploadingMedia
                    ? 'Uploading media...'
                    : editingProductId
                      ? 'Update Product'
                      : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY CREATE MODAL */}
      {isCategoryModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setIsCategoryModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add New Category</h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Children's Shoes / Baby Essentials"
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={categoryDesc}
                  onChange={(e) => setCategoryDesc(e.target.value)}
                  placeholder="Short summary of items in this category"
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="py-2 px-4 rounded-xl border border-slate-200 text-slate-600 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-[#1E3A8A] text-white font-bold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
