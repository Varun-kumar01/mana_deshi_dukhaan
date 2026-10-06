import React, { useEffect, useState } from 'react';
import {
  Check,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Store,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  bulkUploadProducts,
  createProduct,
  deleteProduct,
  fetchAdminStats,
  fetchAllOrders,
  fetchCategories,
  fetchInventory,
  fetchProducts,
  updateOrderStatus,
  updateProduct,
  updateVariantStock,
} from '../services/api';
import {
  AdminStats,
  Category,
  Order,
  Product,
} from '../types';

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
    {
      title: '250g',
      price: 150,
      stock_quantity: 50,
    },
    {
      title: '500g',
      price: 290,
      stock_quantity: 40,
    },
  ],
};

type AdminTab =
  | 'overview'
  | 'orders'
  | 'products'
  | 'inventory';

export const AdminDashboard: React.FC<
  AdminDashboardProps
> = ({ onBackToStore, onCatalogChange }) => {
  const [activeTab, setActiveTab] =
    useState<AdminTab>('overview');

  const [stats, setStats] =
    useState<AdminStats | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState('all');

  const [statusUpdateSuccess, setStatusUpdateSuccess] =
    useState<string | null>(null);

  const [productModalOpen, setProductModalOpen] =
    useState(false);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [form, setForm] = useState({
    ...emptyForm,
  });

  const [bulkText, setBulkText] = useState('');
  const [bulkOpen, setBulkOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);

    try {
      const [
        statsData,
        ordersData,
        productsData,
        cats,
        inv,
      ] = await Promise.all([
        fetchAdminStats(),
        fetchAllOrders(orderFilter),
        fetchProducts(),
        fetchCategories(),
        fetchInventory(),
      ]);

      if (statsData) {
        setStats(statsData);
      }

      setOrders(ordersData || []);
      setProducts(productsData || []);
      setCategories(cats || []);
      setInventory(inv || []);
    } catch {
      setOrders([]);
      setProducts([]);
      setCategories([]);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [orderFilter]);

  const notify = (message: string) => {
    setStatusUpdateSuccess(message);

    window.setTimeout(() => {
      setStatusUpdateSuccess(null);
    }, 3000);
  };

  const handleStatusChange = async (
    orderId: number,
    newStatus: string
  ) => {
    const success = await updateOrderStatus(
      orderId,
      newStatus
    );

    if (success) {
      notify(
        `Order #${orderId} marked as ${newStatus}`
      );
      await loadData();
    }
  };

  const openAdd = () => {
    setEditingId(null);

    setForm({
      ...emptyForm,
      category_id: categories[0]?.id || 1,
      variants: emptyForm.variants.map((variant) => ({
        ...variant,
      })),
    });

    setProductModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);

    setForm({
      name: product.name,
      category_id: product.category_id,
      base_price: product.base_price,
      compare_at_price:
        product.compare_at_price || product.base_price,
      tagline: product.tagline || '',
      description: product.description || '',
      ingredients: product.ingredients || '',
      is_featured: !!product.is_featured,
      is_bestseller: !!product.is_bestseller,
      variants:
        product.variants && product.variants.length
          ? product.variants.map((variant) => ({
              title: variant.title,
              price: variant.price,
              stock_quantity:
                variant.stock_quantity,
            }))
          : emptyForm.variants.map((variant) => ({
              ...variant,
            })),
    });

    setProductModalOpen(true);
  };

  const handleSaveProduct = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!form.name.trim() || !form.base_price) {
      notify('Product name and base price are required');
      return;
    }

    const payload = {
      ...form,
      name: form.name.trim(),
    };

    const result = editingId
      ? await updateProduct(editingId, payload)
      : await createProduct(payload);

    if (result.success) {
      setProductModalOpen(false);

      notify(
        editingId
          ? 'Product updated'
          : 'Product added'
      );

      await loadData();
      onCatalogChange?.();
    } else {
      notify(
        result.message || 'Could not save product'
      );
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (
      !window.confirm(
        'Delete this product from inventory?'
      )
    ) {
      return;
    }

    const success = await deleteProduct(id);

    if (success) {
      notify('Product deleted');
      await loadData();
      onCatalogChange?.();
    }
  };

  const handleBulkUpload = async () => {
    const lines = bulkText
      .trim()
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    if (!lines.length) {
      notify('Please enter CSV product data');
      return;
    }

    const header = lines[0].toLowerCase();

    const hasHeader =
      header.includes('name') &&
      header.includes('price');

    const rows = hasHeader
      ? lines.slice(1)
      : lines;

    const parsed = rows
      .map((line) => {
        const [
          name,
          category_id,
          base_price,
          tagline,
          stock,
        ] = line
          .split(',')
          .map((value) => value.trim());

        return {
          name,
          category_id: Number(category_id) || 1,
          base_price: Number(base_price),
          tagline: tagline || '',
          variants: [
            {
              title: 'Standard',
              price: Number(base_price),
              stock_quantity:
                Number(stock) || 50,
            },
          ],
        };
      })
      .filter(
        (product) =>
          product.name &&
          product.base_price
      );

    if (!parsed.length) {
      notify('No valid products found in CSV');
      return;
    }

    const result =
      await bulkUploadProducts(parsed);

    if (result.success) {
      notify(
        result.message ||
          `Uploaded ${result.count} products`
      );

      setBulkOpen(false);
      setBulkText('');

      await loadData();
      onCatalogChange?.();
    } else {
      notify(
        result.message || 'Bulk upload failed'
      );
    }
  };

  const handleStockSave = async (
    variantId: number,
    stock: number
  ) => {
    const success = await updateVariantStock(
      variantId,
      stock
    );

    if (success) {
      notify('Stock updated');
      await loadData();
    } else {
      notify('Could not update stock');
    }
  };

  const tabs: {
    key: AdminTab;
    label: string;
  }[] = [
    {
      key: 'overview',
      label: 'Overview',
    },
    {
      key: 'orders',
      label: 'Orders',
    },
    {
      key: 'products',
      label: 'Products',
    },
    {
      key: 'inventory',
      label: 'Stock',
    },
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-[#FAF7F2] text-[#1A2318]">
      {/* Header */}
      <header className="sticky top-0 z-40 flex shrink-0 items-center justify-between gap-3 bg-[#1E3A27] px-4 py-3.5 text-white shadow-lg sm:px-6">
        <div className="min-w-0">
          <div className="font-display text-xl font-extrabold sm:text-[22px]">
            Inventory
          </div>

          <p className="mt-0.5 truncate text-[10px] text-white/70 sm:text-xs">
            ManaDeshi Dukaan · Admin
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            aria-label="Refresh dashboard"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <RefreshCw
              size={16}
              className={
                loading ? 'animate-spin' : ''
              }
            />
          </button>

          <button
            type="button"
            onClick={onBackToStore}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-3.5 py-2.5 text-xs font-bold text-[#1E3A27] transition hover:bg-[#EEF5F0] sm:px-4 sm:text-sm"
          >
            <Store size={15} />
            <span>Store</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="sticky top-[69px] z-30 overflow-x-auto border-b border-[#E7DEC8] bg-white px-3 py-2 shadow-sm sm:top-[72px] sm:px-4">
        <div className="mx-auto flex min-w-max gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() =>
                setActiveTab(tab.key)
              }
              className={`rounded-full px-4 py-2 text-xs font-bold transition sm:text-[13px] ${
                activeTab === tab.key
                  ? 'bg-[#1E3A27] text-white shadow-sm'
                  : 'text-[#4B5563] hover:bg-[#F4EFE6] hover:text-[#1E3A27]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-3 pb-12 pt-5 sm:px-5 lg:px-6">
        {/* Notification */}
        {statusUpdateSuccess && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs font-semibold text-green-800 sm:text-[13px]">
            <Check size={15} />
            <span>{statusUpdateSuccess}</span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-[#E7DEC8] bg-white px-4 py-3 text-xs text-stone-500">
            <RefreshCw
              size={14}
              className="animate-spin"
            />
            Loading dashboard data...
          </div>
        )}

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B35427]">
                Dashboard
              </p>

              <h2 className="mt-1 font-display text-2xl font-extrabold text-[#1E3A27] sm:text-3xl">
                Store Overview
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Revenue"
                value={`₹${(
                  stats?.totalRevenue || 0
                ).toLocaleString()}`}
              />

              <StatCard
                label="Orders"
                value={String(
                  stats?.totalOrders ||
                    orders.length
                )}
              />

              <StatCard
                label="Customers"
                value={String(
                  stats?.totalCustomers || 0
                )}
              />

              <StatCard
                label="Products"
                value={String(products.length)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-[22px] border border-[#E7DEC8] bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Orders
                    </p>
                    <h3 className="mt-1 font-display text-lg font-bold text-[#1E3A27]">
                      Recent Orders
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveTab('orders')
                    }
                    className="text-xs font-bold text-[#B35427] hover:underline"
                  >
                    View all
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  {orders
                    .slice(0, 5)
                    .map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between gap-3 rounded-xl bg-[#FAF7F2] p-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-stone-800">
                            {order.order_number}
                          </p>
                          <p className="truncate text-[10px] text-stone-500">
                            {order.customer_name}
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-xs font-bold text-[#1E3A27]">
                            ₹{order.total_amount}
                          </p>
                          <p className="text-[10px] text-stone-500">
                            {order.order_status}
                          </p>
                        </div>
                      </div>
                    ))}

                  {!orders.length && (
                    <p className="py-6 text-center text-xs text-stone-400">
                      No orders found.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-[22px] border border-[#E7DEC8] bg-white p-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Catalog
                  </p>

                  <h3 className="mt-1 font-display text-lg font-bold text-[#1E3A27]">
                    Store Catalog
                  </h3>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveTab('products')
                    }
                    className="rounded-2xl border border-[#E7DEC8] bg-[#FAF7F2] p-4 text-left transition hover:border-[#1E3A27]"
                  >
                    <Package
                      size={20}
                      className="text-[#B35427]"
                    />
                    <p className="mt-3 text-2xl font-extrabold text-[#1E3A27]">
                      {products.length}
                    </p>
                    <p className="text-xs text-stone-500">
                      Products
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveTab('inventory')
                    }
                    className="rounded-2xl border border-[#E7DEC8] bg-[#FAF7F2] p-4 text-left transition hover:border-[#1E3A27]"
                  >
                    <Store
                      size={20}
                      className="text-[#B35427]"
                    />
                    <p className="mt-3 text-2xl font-extrabold text-[#1E3A27]">
                      {inventory.length}
                    </p>
                    <p className="text-xs text-stone-500">
                      Stock Rows
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === 'orders' && (
          <section>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B35427]">
                  Management
                </p>

                <h2 className="mt-1 font-display text-2xl font-extrabold text-[#1E3A27]">
                  Orders
                </h2>
              </div>
            </div>

            <div className="overflow-hidden rounded-[22px] border border-[#E7DEC8] bg-white">
              {/* Filters */}
              <div className="flex gap-2 overflow-x-auto border-b border-[#E7DEC8] p-4">
                {[
                  'all',
                  'Pending',
                  'Confirmed',
                  'Packed',
                  'Shipped',
                  'Delivered',
                ].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() =>
                      setOrderFilter(status)
                    }
                    className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
                      orderFilter === status
                        ? 'border-[#1E3A27] bg-[#1E3A27] text-white'
                        : 'border-[#D8CEB9] bg-white text-[#1A2318] hover:border-[#1E3A27]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse text-[13px]">
                  <thead>
                    <tr className="border-b border-[#E7DEC8]">
                      <th className="px-4 py-3 text-left font-bold text-[#4B5563]">
                        Order
                      </th>
                      <th className="px-4 py-3 text-left font-bold text-[#4B5563]">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left font-bold text-[#4B5563]">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left font-bold text-[#4B5563]">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-[#E7DEC8] last:border-0 hover:bg-[#FAF7F2]"
                      >
                        <td className="px-4 py-3">
                          <span className="font-bold text-[#1E3A27]">
                            {order.order_number}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-semibold">
                            {order.customer_name}
                          </div>
                          <div className="text-xs text-[#9CA3AF]">
                            {order.customer_phone}
                          </div>
                        </td>

                        <td className="px-4 py-3 font-semibold">
                          ₹{order.total_amount}
                        </td>

                        <td className="px-4 py-3">
                          <OrderStatusSelect
                            value={order.order_status}
                            onChange={(value) =>
                              handleStatusChange(
                                order.id,
                                value
                              )
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="divide-y divide-[#E7DEC8] md:hidden">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="space-y-3 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-[#1E3A27]">
                          {order.order_number}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-stone-800">
                          {order.customer_name}
                        </p>

                        <p className="text-[10px] text-stone-500">
                          {order.customer_phone}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-extrabold text-[#1E3A27]">
                        ₹{order.total_amount}
                      </p>
                    </div>

                    <OrderStatusSelect
                      value={order.order_status}
                      onChange={(value) =>
                        handleStatusChange(
                          order.id,
                          value
                        )
                      }
                    />
                  </div>
                ))}

                {!orders.length && (
                  <p className="p-8 text-center text-xs text-stone-400">
                    No orders found.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Products */}
        {activeTab === 'products' && (
          <section>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B35427]">
                  Catalog
                </p>

                <h2 className="mt-1 font-display text-2xl font-extrabold text-[#1E3A27]">
                  Products
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex">
                <button
                  type="button"
                  onClick={() => setBulkOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#1E3A27] bg-white px-3 py-2.5 text-xs font-bold text-[#1E3A27] transition hover:bg-[#EEF5F0] sm:px-4 sm:text-sm"
                >
                  <Upload size={14} />
                  Bulk Upload
                </button>

                <button
                  type="button"
                  onClick={openAdd}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3A27] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[#2B5336] sm:px-4 sm:text-sm"
                >
                  <Plus size={14} />
                  Add Product
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-[22px] border border-[#E7DEC8] bg-white">
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse text-[13px]">
                  <thead>
                    <tr className="border-b border-[#E7DEC8]">
                      <th className="px-4 py-3 text-left font-bold text-[#4B5563]">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left font-bold text-[#4B5563]">
                        Price
                      </th>
                      <th className="px-4 py-3 text-right font-bold text-[#4B5563]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-[#E7DEC8] last:border-0 hover:bg-[#FAF7F2]"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                product.images?.[0] ||
                                '/visiting_card.png'
                              }
                              alt=""
                              className="h-11 w-11 rounded-xl border border-stone-200 object-cover"
                            />

                            <div className="min-w-0">
                              <div className="truncate font-bold text-stone-800">
                                {product.name}
                              </div>

                              <div className="mt-0.5 text-xs text-[#9CA3AF]">
                                {product.category_name}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 font-semibold">
                          ₹{product.base_price}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            <ProductActionButton
                              label="Edit"
                              onClick={() =>
                                openEdit(product)
                              }
                            >
                              <Pencil size={15} />
                            </ProductActionButton>

                            <ProductActionButton
                              label="Delete"
                              danger
                              onClick={() =>
                                handleDeleteProduct(
                                  product.id
                                )
                              }
                            >
                              <Trash2 size={15} />
                            </ProductActionButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="divide-y divide-[#E7DEC8] md:hidden">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-4"
                  >
                    <img
                      src={
                        product.images?.[0] ||
                        '/visiting_card.png'
                      }
                      alt=""
                      className="h-14 w-14 shrink-0 rounded-xl border border-stone-200 object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-stone-800">
                        {product.name}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-stone-400">
                        {product.category_name ||
                          'Uncategorized'}
                      </p>

                      <p className="mt-1 text-sm font-extrabold text-[#1E3A27]">
                        ₹{product.base_price}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-1">
                      <ProductActionButton
                        label="Edit"
                        onClick={() =>
                          openEdit(product)
                        }
                      >
                        <Pencil size={14} />
                      </ProductActionButton>

                      <ProductActionButton
                        label="Delete"
                        danger
                        onClick={() =>
                          handleDeleteProduct(
                            product.id
                          )
                        }
                      >
                        <Trash2 size={14} />
                      </ProductActionButton>
                    </div>
                  </div>
                ))}

                {!products.length && (
                  <p className="p-8 text-center text-xs text-stone-400">
                    No products found.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Inventory */}
        {activeTab === 'inventory' && (
          <section>
            <div className="mb-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B35427]">
                Inventory
              </p>

              <h2 className="mt-1 font-display text-2xl font-extrabold text-[#1E3A27]">
                Stock by Variant
              </h2>
            </div>

            <div className="overflow-hidden rounded-[22px] border border-[#E7DEC8] bg-white">
              {/* Desktop */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse text-[13px]">
                  <thead>
                    <tr className="border-b border-[#E7DEC8]">
                      <th className="px-4 py-3 text-left font-bold text-[#4B5563]">
                        SKU / Product
                      </th>
                      <th className="px-4 py-3 text-left font-bold text-[#4B5563]">
                        Variant
                      </th>
                      <th className="px-4 py-3 text-left font-bold text-[#4B5563]">
                        Qty
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {inventory.map((row, index) => (
                      <InventoryRow
                        key={`${row.variantId}-${index}`}
                        row={row}
                        onSave={handleStockSave}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="divide-y divide-[#E7DEC8] md:hidden">
                {inventory.map((row, index) => (
                  <InventoryMobileRow
                    key={`${row.variantId}-${index}`}
                    row={row}
                    onSave={handleStockSave}
                  />
                ))}

                {!inventory.length && (
                  <div className="flex flex-col items-center justify-center gap-2 p-10 text-center text-xs text-[#9CA3AF]">
                    <Package size={24} />
                    No stock rows yet.
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Add/Edit Product Modal */}
      {productModalOpen && (
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center overflow-y-auto bg-black/50 p-3 backdrop-blur-sm sm:p-4"
          onClick={() =>
            setProductModalOpen(false)
          }
        >
          <div
            className="max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-[28px] border border-[#E7DEC8] bg-white p-5 shadow-2xl sm:p-6"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#B35427]">
                  Catalog
                </p>

                <h3 className="mt-1 font-display text-xl font-extrabold text-[#1A2318]">
                  {editingId
                    ? 'Edit Product'
                    : 'Add Product'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  setProductModalOpen(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 transition hover:bg-[#F4EFE6]"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSaveProduct}
              className="space-y-4"
            >
              <AdminField label="Name">
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      name: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border-[1.5px] border-[#D8CEB9] bg-[#FAF7F2] px-3.5 py-[0.7rem] text-sm text-[#1A2318] outline-none transition-all duration-150 focus:border-[#1E3A27] focus:ring-[3px] focus:ring-[#1E3A27]/10"
                />
              </AdminField>

              <AdminField label="Category">
                <select
                  value={form.category_id}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      category_id: Number(
                        event.target.value
                      ),
                    })
                  }
                  className="w-full rounded-xl border-[1.5px] border-[#D8CEB9] bg-[#FAF7F2] px-3.5 py-[0.7rem] text-sm text-[#1A2318] outline-none transition-all duration-150 focus:border-[#1E3A27] focus:ring-[3px] focus:ring-[#1E3A27]/10"
                >
                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </AdminField>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <AdminField label="Base Price">
                  <input
                    type="number"
                    min="0"
                    required
                    value={form.base_price}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        base_price: Number(
                          event.target.value
                        ),
                      })
                    }
                    className="w-full rounded-xl border-[1.5px] border-[#D8CEB9] bg-[#FAF7F2] px-3.5 py-[0.7rem] text-sm text-[#1A2318] outline-none transition-all duration-150 focus:border-[#1E3A27] focus:ring-[3px] focus:ring-[#1E3A27]/10"
                  />
                </AdminField>

                <AdminField label="Compare Price">
                  <input
                    type="number"
                    min="0"
                    value={form.compare_at_price}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        compare_at_price:
                          Number(
                            event.target.value
                          ),
                      })
                    }
                    className="w-full rounded-xl border-[1.5px] border-[#D8CEB9] bg-[#FAF7F2] px-3.5 py-[0.7rem] text-sm text-[#1A2318] outline-none transition-all duration-150 focus:border-[#1E3A27] focus:ring-[3px] focus:ring-[#1E3A27]/10"
                  />
                </AdminField>
              </div>

              <AdminField label="Tagline">
                <input
                  value={form.tagline}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      tagline: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border-[1.5px] border-[#D8CEB9] bg-[#FAF7F2] px-3.5 py-[0.7rem] text-sm text-[#1A2318] outline-none transition-all duration-150 focus:border-[#1E3A27] focus:ring-[3px] focus:ring-[#1E3A27]/10"
                />
              </AdminField>

              <AdminField label="Description">
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description:
                        event.target.value,
                    })
                  }
                  className="w-full resize-none rounded-xl border-[1.5px] border-[#D8CEB9] bg-[#FAF7F2] px-3.5 py-[0.7rem] text-sm text-[#1A2318] outline-none transition-all duration-150 focus:border-[#1E3A27] focus:ring-[3px] focus:ring-[#1E3A27]/10"
                />
              </AdminField>

              <AdminField label="Ingredients">
                <textarea
                  rows={3}
                  value={form.ingredients}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      ingredients:
                        event.target.value,
                    })
                  }
                  className="w-full resize-none rounded-xl border-[1.5px] border-[#D8CEB9] bg-[#FAF7F2] px-3.5 py-[0.7rem] text-sm text-[#1A2318] outline-none transition-all duration-150 focus:border-[#1E3A27] focus:ring-[3px] focus:ring-[#1E3A27]/10"
                />
              </AdminField>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#E7DEC8] bg-[#FAF7F2] p-3 text-xs font-bold text-stone-700">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        is_featured:
                          event.target.checked,
                      })
                    }
                    className="h-4 w-4 accent-[#1E3A27]"
                  />
                  Featured Product
                </label>

                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#E7DEC8] bg-[#FAF7F2] p-3 text-xs font-bold text-stone-700">
                  <input
                    type="checkbox"
                    checked={form.is_bestseller}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        is_bestseller:
                          event.target.checked,
                      })
                    }
                    className="h-4 w-4 accent-[#1E3A27]"
                  />
                  Bestseller
                </label>
              </div>

              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setProductModalOpen(false)
                  }
                  className="inline-flex items-center justify-center rounded-xl border border-[#1E3A27] bg-white px-5 py-3 text-sm font-bold text-[#1E3A27] transition hover:bg-[#EEF5F0]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3A27] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2B5336]"
                >
                  <Save size={15} />
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {bulkOpen && (
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center overflow-y-auto bg-black/50 p-3 backdrop-blur-sm sm:p-4"
          onClick={() => setBulkOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-[28px] border border-[#E7DEC8] bg-white p-5 shadow-2xl sm:p-6"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#B35427]">
                  Catalog Import
                </p>

                <h3 className="mt-1 font-display text-xl font-extrabold text-[#1A2318]">
                  Bulk Upload
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setBulkOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 transition hover:bg-[#F4EFE6]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-3 rounded-xl border border-[#E7DEC8] bg-[#FAF7F2] p-3">
              <p className="text-[11px] font-bold text-stone-700">
                CSV format
              </p>

              <code className="mt-1 block overflow-x-auto text-[10px] text-stone-500">
                name, category_id, base_price, tagline, stock
              </code>
            </div>

            <textarea
              className="min-h-[200px] w-full rounded-xl border border-[#D8CEB9] bg-[#FAF7F2] px-3.5 py-3 text-sm text-[#1A2318] outline-none transition focus:border-[#1E3A27] focus:ring-2 focus:ring-[#1E3A27]/15"
              placeholder={
                'name,category_id,base_price,tagline,stock\nGongura Pickle,1,180,Homemade,40'
              }
              value={bulkText}
              onChange={(event) =>
                setBulkText(event.target.value)
              }
            />

            <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setBulkOpen(false)}
                className="rounded-xl border border-[#1E3A27] bg-white px-5 py-3 text-sm font-bold text-[#1E3A27] transition hover:bg-[#EEF5F0]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleBulkUpload}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3A27] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2B5336]"
              >
                <Upload size={15} />
                Upload Products
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[20px] border border-[#E7DEC8] bg-white p-4 shadow-sm sm:p-[18px]">
      <span className="mb-1.5 block text-[11px] text-[#4B5563] sm:text-xs">
        {label}
      </span>

      <strong className="block truncate text-xl font-extrabold text-[#1E3A27] sm:text-[22px]">
        {value}
      </strong>
    </div>
  );
}

function OrderStatusSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      className="w-full rounded-lg border border-[#D8CEB9] bg-white px-2.5 py-2 text-xs font-semibold text-[#1A2318] outline-none focus:border-[#1E3A27] focus:ring-2 focus:ring-[#1E3A27]/10 sm:w-auto"
    >
      {[
        'Pending',
        'Confirmed',
        'Packed',
        'Shipped',
        'Delivered',
        'Cancelled',
      ].map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}

function ProductActionButton({
  children,
  label,
  onClick,
  danger = false,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
        danger
          ? 'text-stone-500 hover:bg-red-50 hover:text-red-600'
          : 'text-stone-500 hover:bg-[#EEF5F0] hover:text-[#1E3A27]'
      }`}
    >
      {children}
    </button>
  );
}

function AdminField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-xs font-bold text-[#1A2318]">
      {label}
      {children}
    </label>
  );
}

function InventoryRow({
  row,
  onSave,
}: {
  row: any;
  onSave: (
    variantId: number,
    stock: number
  ) => void;
}) {
  const [qty, setQty] = useState(
    row.stockQuantity ?? 0
  );

  return (
    <tr className="border-b border-[#E7DEC8] last:border-0 hover:bg-[#FAF7F2]">
      <td className="px-4 py-3 align-middle">
        <div className="font-bold">
          {row.productName}
        </div>

        <div className="text-xs text-[#9CA3AF]">
          {row.sku}
        </div>
      </td>

      <td className="px-4 py-3 align-middle">
        {row.variantTitle}
      </td>

      <td className="px-4 py-3 align-middle">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            value={qty}
            onChange={(event) =>
              setQty(
                Math.max(
                  0,
                  Number(event.target.value)
                )
              )
            }
            className="w-24 rounded-lg border border-[#D8CEB9] bg-[#FAF7F2] px-2.5 py-2 text-sm outline-none focus:border-[#1E3A27] focus:ring-2 focus:ring-[#1E3A27]/10"
          />

          <button
            type="button"
            onClick={() =>
              onSave(row.variantId, qty)
            }
            className="rounded-lg bg-[#1E3A27] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#2B5336]"
          >
            Save
          </button>
        </div>
      </td>
    </tr>
  );
}

function InventoryMobileRow({
  row,
  onSave,
}: {
  row: any;
  onSave: (
    variantId: number,
    stock: number
  ) => void;
}) {
  const [qty, setQty] = useState(
    row.stockQuantity ?? 0
  );

  return (
    <div className="space-y-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-stone-800">
            {row.productName}
          </p>

          <p className="mt-0.5 text-[10px] text-stone-400">
            {row.sku}
          </p>

          <p className="mt-2 text-xs font-semibold text-[#B35427]">
            {row.variantTitle}
          </p>
        </div>

        <Package
          size={18}
          className="shrink-0 text-[#1E3A27]"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          value={qty}
          onChange={(event) =>
            setQty(
              Math.max(
                0,
                Number(event.target.value)
              )
            )
          }
          className="min-w-0 flex-1 rounded-lg border border-[#D8CEB9] bg-[#FAF7F2] px-3 py-2.5 text-sm font-semibold outline-none focus:border-[#1E3A27] focus:ring-2 focus:ring-[#1E3A27]/10"
        />

        <button
          type="button"
          onClick={() =>
            onSave(row.variantId, qty)
          }
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E3A27] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#2B5336]"
        >
          <Save size={13} />
          Save
        </button>
      </div>
    </div>
  );
}