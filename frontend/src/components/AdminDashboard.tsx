import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Trash2,
  RefreshCw,
  Store,
  Check,
  Upload,
  Pencil,
  Save,
} from 'lucide-react';
import {
  fetchAdminStats,
  fetchAllOrders,
  updateOrderStatus,
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUploadProducts,
  fetchInventory,
  updateVariantStock,
  fetchCategories,
} from '../services/api';
import { Product, Order, AdminStats, Category } from '../types';

interface AdminDashboardProps {
  onBackToStore: () => void;
  onCatalogChange?: () => void;
}

const emptyForm = {
  name: '',
  category_id: 1,
  base_price: 150,
  compare_at_price: 180,
  tagline: '',
  description: '',
  ingredients: '',
  is_featured: false,
  is_bestseller: false,
  variants: [
    { title: '250g', price: 150, stock_quantity: 50 },
    { title: '500g', price: 290, stock_quantity: 40 },
  ],
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToStore,
  onCatalogChange,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'inventory'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState('all');
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState<string | null>(null);

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [bulkText, setBulkText] = useState('');
  const [bulkOpen, setBulkOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, ordersData, productsData, cats, inv] = await Promise.all([
        fetchAdminStats(),
        fetchAllOrders(orderFilter),
        fetchProducts(),
        fetchCategories(),
        fetchInventory(),
      ]);
      if (statsData) setStats(statsData);
      setOrders(ordersData);
      setProducts(productsData);
      setCategories(cats);
      setInventory(inv);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [orderFilter]);

  const notify = (msg: string) => {
    setStatusUpdateSuccess(msg);
    setTimeout(() => setStatusUpdateSuccess(null), 3000);
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      notify(`Order #${orderId} marked as ${newStatus}`);
      loadData();
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm, category_id: categories[0]?.id || 1 });
    setProductModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      category_id: p.category_id,
      base_price: p.base_price,
      compare_at_price: p.compare_at_price || p.base_price,
      tagline: p.tagline || '',
      description: p.description || '',
      ingredients: p.ingredients || '',
      is_featured: !!p.is_featured,
      is_bestseller: !!p.is_bestseller,
      variants: (p.variants && p.variants.length
        ? p.variants.map(v => ({ title: v.title, price: v.price, stock_quantity: v.stock_quantity }))
        : emptyForm.variants) as typeof emptyForm.variants,
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.base_price) return;

    const payload = { ...form };
    const result = editingId
      ? await updateProduct(editingId, payload)
      : await createProduct(payload);

    if (result.success) {
      setProductModalOpen(false);
      notify(editingId ? 'Product updated' : 'Product added');
      await loadData();
      onCatalogChange?.();
    } else {
      notify(result.message || 'Could not save product');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('Delete this product from inventory?')) return;
    const ok = await deleteProduct(id);
    if (ok) {
      notify('Product deleted');
      await loadData();
      onCatalogChange?.();
    }
  };

  const handleBulkUpload = async () => {
    const lines = bulkText.trim().split('\n').filter(Boolean);
    if (!lines.length) return;

    const header = lines[0].toLowerCase();
    const hasHeader = header.includes('name') && header.includes('price');
    const rows = hasHeader ? lines.slice(1) : lines;

    const parsed = rows.map(line => {
      const [name, category_id, base_price, tagline, stock] = line.split(',').map(s => s.trim());
      return {
        name,
        category_id: Number(category_id) || 1,
        base_price: Number(base_price),
        tagline: tagline || '',
        variants: [{ title: 'Standard', price: Number(base_price), stock_quantity: Number(stock) || 50 }],
      };
    }).filter(p => p.name && p.base_price);

    const result = await bulkUploadProducts(parsed);
    if (result.success) {
      notify(result.message || `Uploaded ${result.count} products`);
      setBulkOpen(false);
      setBulkText('');
      await loadData();
      onCatalogChange?.();
    } else {
      notify(result.message || 'Bulk upload failed');
    }
  };

  const handleStockSave = async (variantId: number, stock: number) => {
    const ok = await updateVariantStock(variantId, stock);
    if (ok) notify('Stock updated');
    else notify('Could not update stock');
  };

  return (
    <div className="admin-wrap">
      <header className="admin-topbar">
        <div>
          <div className="admin-title">Inventory</div>
          <p style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>ManaDeshi Dukaan · Admin</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={loadData} className="topbar-btn" style={{ color: '#fff', background: 'rgba(255,255,255,.12)', borderColor: 'transparent' }}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={onBackToStore} className="btn-primary" style={{ background: '#fff', color: 'var(--green)' }}>
            <Store size={15} /> Store
          </button>
        </div>
      </header>

      <div className="admin-tabs">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'orders', label: 'Orders' },
          { key: 'products', label: 'Products' },
          { key: 'inventory', label: 'Stock' },
        ].map(tab => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? 'active' : ''}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <main className="admin-main">
        {statusUpdateSuccess && (
          <div className="admin-toast">
            <Check size={14} /> {statusUpdateSuccess}
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="admin-kpis">
            <div className="admin-card">
              <span>Revenue</span>
              <strong>₹{(stats?.totalRevenue || 0).toLocaleString()}</strong>
            </div>
            <div className="admin-card">
              <span>Orders</span>
              <strong>{stats?.totalOrders || orders.length}</strong>
            </div>
            <div className="admin-card">
              <span>Customers</span>
              <strong>{stats?.totalCustomers || 0}</strong>
            </div>
            <div className="admin-card">
              <span>Products</span>
              <strong>{products.length}</strong>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="admin-card" style={{ overflowX: 'auto' }}>
            <div className="filter-bar" style={{ border: 0, paddingTop: 0 }}>
              {['all', 'Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'].map(st => (
                <button
                  key={st}
                  className={`filter-pill${orderFilter === st ? ' active-green' : ''}`}
                  onClick={() => setOrderFilter(st)}
                >
                  {st}
                </button>
              ))}
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td>{o.order_number}</td>
                    <td>
                      <div>{o.customer_name}</div>
                      <div className="muted">{o.customer_phone}</div>
                    </td>
                    <td>₹{o.total_amount}</td>
                    <td>
                      <select value={o.order_status} onChange={e => handleStatusChange(o.id, e.target.value)}>
                        {['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div className="admin-toolbar">
              <h3>Catalog</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn-secondary" onClick={() => setBulkOpen(true)}>
                  <Upload size={14} /> Bulk upload
                </button>
                <button className="btn-primary" onClick={openAdd}>
                  <Plus size={14} /> Add product
                </button>
              </div>
            </div>

            <div className="admin-card" style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                          <img src={(p.images && p.images[0]) || '/visiting_card.png'} alt="" className="admin-thumb" />
                          <div>
                            <div className="strong">{p.name}</div>
                            <div className="muted">{p.category_name}</div>
                          </div>
                        </div>
                      </td>
                      <td>₹{p.base_price}</td>
                      <td>
                        <button className="icon-btn" onClick={() => openEdit(p)} aria-label="Edit">
                          <Pencil size={15} />
                        </button>
                        <button className="icon-btn danger" onClick={() => handleDeleteProduct(p.id)} aria-label="Delete">
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="admin-card" style={{ overflowX: 'auto' }}>
            <h3 style={{ marginBottom: 16 }}>Stock by variant</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>SKU / Product</th>
                  <th>Variant</th>
                  <th>Qty</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((row, i) => (
                  <InventoryRow key={`${row.variantId}-${i}`} row={row} onSave={handleStockSave} />
                ))}
              </tbody>
            </table>
            {inventory.length === 0 && (
              <p className="muted" style={{ padding: 24, textAlign: 'center' }}>
                <Package size={20} /> No stock rows yet.
              </p>
            )}
          </div>
        )}
      </main>

      {productModalOpen && (
        <div className="modal-overlay" onClick={() => setProductModalOpen(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingId ? 'Edit product' : 'Add product'}</h3>
              <button onClick={() => setProductModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveProduct} className="auth-form">
              <label className="field-label">Name
                <input className="field-input" style={{ paddingLeft: 14 }} required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </label>
              <label className="field-label">Category
                <select className="field-input" style={{ paddingLeft: 14 }} value={form.category_id} onChange={e => setForm({ ...form, category_id: Number(e.target.value) })}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
              <label className="field-label">Base price
                <input className="field-input" style={{ paddingLeft: 14 }} type="number" required value={form.base_price} onChange={e => setForm({ ...form, base_price: Number(e.target.value) })} />
              </label>
              <label className="field-label">Tagline
                <input className="field-input" style={{ paddingLeft: 14 }} value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} />
              </label>
              <label className="field-label">Description
                <textarea className="field-input" style={{ paddingLeft: 14 }} rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </label>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" onClick={() => setProductModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary"><Save size={14} /> Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {bulkOpen && (
        <div className="modal-overlay" onClick={() => setBulkOpen(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Bulk upload</h3>
              <button onClick={() => setBulkOpen(false)}>✕</button>
            </div>
            <p className="muted" style={{ marginBottom: 12, fontSize: 13 }}>
              CSV: name, category_id, base_price, tagline, stock
            </p>
            <textarea
              className="field-input"
              style={{ paddingLeft: 14, minHeight: 180 }}
              placeholder={'name,category_id,base_price,tagline,stock\nGongura Pickle,1,180,Homemade,40'}
              value={bulkText}
              onChange={e => setBulkText(e.target.value)}
            />
            <button className="btn-primary w-full mt-4" onClick={handleBulkUpload}>
              Upload
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function InventoryRow({
  row,
  onSave,
}: {
  row: any;
  onSave: (variantId: number, stock: number) => void;
}) {
  const [qty, setQty] = useState(row.stockQuantity ?? 0);
  return (
    <tr>
      <td>
        <div className="strong">{row.productName}</div>
        <div className="muted">{row.sku}</div>
      </td>
      <td>{row.variantTitle}</td>
      <td>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input
            type="number"
            className="field-input"
            style={{ paddingLeft: 10, width: 88 }}
            value={qty}
            onChange={e => setQty(Number(e.target.value))}
          />
          <button className="btn-primary" style={{ padding: '8px 12px' }} onClick={() => onSave(row.variantId, qty)}>
            Save
          </button>
        </div>
      </td>
    </tr>
  );
}
