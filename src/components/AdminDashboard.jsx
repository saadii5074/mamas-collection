import React, { useState, useMemo } from 'react';
import { 
  Crown, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  ShoppingBag, 
  ShieldCheck, 
  Sliders, 
  Trash2, 
  Check, 
  X, 
  Store, 
  Users, 
  FileText,
  AlertTriangle,
  MapPin,
  Clock,
  Table as TableIcon,
  Download,
  Printer,
  Search,
  Filter,
  ArrowUpDown,
  Edit3,
  Save,
  LogOut,
  CheckCircle2,
  Package,
  RefreshCw,
  Eye,
  Sparkles
} from 'lucide-react';

export default function AdminDashboard({
  products,
  onDeleteProduct,
  onApproveProduct,
  onUpdateProduct,
  orders,
  onUpdateOrderStatus,
  onDeleteOrder,
  commissionRates,
  onUpdateCommissionRates,
  onClose,
  onLogout
}) {
  const [activeTab, setActiveTab] = useState('sheet'); // 'sheet', 'overview', 'products', 'orders', 'commission'
  const [rentalCommPercent, setRentalCommPercent] = useState(commissionRates.rentalCommissionPercent);
  const [saleCommPercent, setSaleCommPercent] = useState(commissionRates.saleCommissionPercent);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Live Sheet States
  const [sheetSearch, setSheetSearch] = useState('');
  const [sheetCategory, setSheetCategory] = useState('all');
  const [sheetArea, setSheetArea] = useState('all');
  const [sortField, setSortField] = useState('id');
  const [sortAsc, setSortAsc] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editDailyRent, setEditDailyRent] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  const formatPKR = (num) => Number(num || 0).toLocaleString('en-PK');

  // Compute Platform Metrics from Live Orders
  const totalRevenue = orders.reduce((acc, o) => acc + (o.grandTotal || 0), 0);
  
  // Real-time Commission earned by Mamas Collection on peer rentals/sales
  const estimatedCommissionEarned = orders.reduce((acc, o) => {
    return acc + (o.items || []).reduce((itemAcc, item) => {
      if (!item.product?.isOfficial) {
        const rate = item.bookingMode === 'rent' ? (rentalCommPercent / 100) : (saleCommPercent / 100);
        return itemAcc + Math.round(((item.rentAmount || item.totalPrice) || 0) * rate);
      }
      return itemAcc;
    }, 0);
  }, 0);

  const officialProducts = products.filter(p => p.isOfficial);
  const peerProducts = products.filter(p => !p.isOfficial);

  const handleSaveCommission = (e) => {
    e.preventDefault();
    onUpdateCommissionRates({
      rentalCommissionPercent: Number(rentalCommPercent),
      saleCommissionPercent: Number(saleCommPercent),
      officialStoreCommission: 0
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Live Data Sheet Filtered & Sorted
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = sheetSearch === '' || 
        p.title.toLowerCase().includes(sheetSearch.toLowerCase()) ||
        p.id.toLowerCase().includes(sheetSearch.toLowerCase()) ||
        p.vendor.name.toLowerCase().includes(sheetSearch.toLowerCase()) ||
        p.quettaArea.toLowerCase().includes(sheetSearch.toLowerCase());

      const matchCategory = sheetCategory === 'all' || p.category === sheetCategory;
      const matchArea = sheetArea === 'all' || p.quettaArea === sheetArea;

      return matchSearch && matchCategory && matchArea;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'dailyRent') {
        valA = a.rentRate?.daily || 0;
        valB = b.rentRate?.daily || 0;
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [products, sheetSearch, sheetCategory, sheetArea, sortField, sortAsc]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Inline Editing in Sheet
  const handleStartEdit = (product) => {
    setEditingId(product.id);
    setEditPrice(product.price || 0);
    setEditDailyRent(product.rentRate?.daily || 0);
  };

  const handleSaveEdit = (product) => {
    const updated = {
      ...product,
      price: Number(editPrice),
      rentRate: product.rentRate ? {
        ...product.rentRate,
        daily: Number(editDailyRent)
      } : null
    };
    onUpdateProduct(updated);
    setEditingId(null);
  };

  const handleToggleStock = (product) => {
    onUpdateProduct({
      ...product,
      inStock: !product.inStock
    });
  };

  const handleToggleFeatured = (product) => {
    onUpdateProduct({
      ...product,
      featured: !product.featured
    });
  };

  // Export to CSV / Excel
  const handleExportCSV = () => {
    const headers = [
      'Product ID',
      'Title',
      'Category',
      'Type',
      'Event',
      'Quetta Area',
      'Vendor Name',
      'Vendor Phone',
      'Sale Price (PKR)',
      'Daily Rent (PKR)',
      'Security Deposit (PKR)',
      'In Stock',
      'Official Store',
      'Condition'
    ];

    const rows = filteredProducts.map(p => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      p.category,
      p.listingType,
      p.eventType,
      p.quettaArea,
      `"${p.vendor.name.replace(/"/g, '""')}"`,
      p.vendor.phone,
      p.price || 0,
      p.rentRate?.daily || 0,
      p.securityDeposit || 0,
      p.inStock ? 'Yes' : 'No',
      p.isOfficial ? 'Mamas Official' : 'Peer Host',
      `"${p.condition || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mamas_collection_catalog_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Bulk Selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProductIds(filteredProducts.map(p => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleToggleSelectOne = (id) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter(item => item !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  const handleBulkMarkStock = (inStockVal) => {
    selectedProductIds.forEach(id => {
      const prod = products.find(p => p.id === id);
      if (prod) onUpdateProduct({ ...prod, inStock: inStockVal });
    });
    setSelectedProductIds([]);
  };

  return (
    <div className="bg-[#FAF5F3] min-h-screen py-6 sm:py-8 px-4 sm:px-6 animate-fadeIn">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Control Room Bar */}
        <div className="bg-gradient-to-r from-[#4A0B16] via-[#6B1222] to-[#4A0B16] text-white p-5 sm:p-6 rounded-3xl shadow-xl border border-festiva-gold/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-festiva-gold/20 border border-festiva-gold/40 flex items-center justify-center text-festiva-gold shadow-sm">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-xl sm:text-2xl text-white">
                  Super Admin Control Room
                </h1>
                <span className="bg-festiva-gold text-festiva-maroon font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live Quetta Engine
                </span>
              </div>
              <p className="text-xs text-white/80">
                100% Real-time Inventory & Booking Operations • Mamas Collection Quetta
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="Download Full Catalog as CSV"
            >
              <Download className="w-4 h-4 text-festiva-lightgold" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onLogout}
              className="bg-red-500/20 hover:bg-red-500/40 border border-red-400/40 text-red-200 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Lock & Logout Admin Panel"
            >
              <LogOut className="w-4 h-4" />
              <span>Lock / Logout</span>
            </button>

            <button
              onClick={onClose}
              className="bg-festiva-gold hover:bg-festiva-lightgold text-festiva-maroon px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <X className="w-4 h-4" />
              <span>Exit Admin</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('sheet')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all ${
              activeTab === 'sheet'
                ? 'bg-festiva-burgundy text-white shadow-md'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <TableIcon className="w-4 h-4 text-festiva-lightgold" />
            <span>Live Data Sheet (Mamas Collection Grid)</span>
            <span className="bg-white/20 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all ${
              activeTab === 'overview'
                ? 'bg-festiva-burgundy text-white shadow-md'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Financials & Quetta Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all ${
              activeTab === 'orders'
                ? 'bg-festiva-burgundy text-white shadow-md'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Bookings & Orders Management</span>
            <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all ${
              activeTab === 'products'
                ? 'bg-festiva-burgundy text-white shadow-md'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Card Catalog View</span>
          </button>

          <button
            onClick={() => setActiveTab('commission')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all ${
              activeTab === 'commission'
                ? 'bg-festiva-burgundy text-white shadow-md'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Commission Engine</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {commissionRates.rentalCommissionPercent}%
            </span>
          </button>
        </div>

        {/* TAB 1: LIVE DATA SHEET (AMAZON / OLX / EBAY SELLER CENTRAL STYLE) */}
        {activeTab === 'sheet' && (
          <div className="bg-white rounded-3xl border border-festiva-sand shadow-sm overflow-hidden space-y-4">
            
            {/* Sheet Toolbar */}
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5 flex-1">
                {/* Search */}
                <div className="relative min-w-[220px]">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by title, ID, vendor, or area..."
                    value={sheetSearch}
                    onChange={(e) => setSheetSearch(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-800 outline-none focus:border-festiva-burgundy"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={sheetCategory}
                  onChange={(e) => setSheetCategory(e.target.value)}
                  className="bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-800 outline-none focus:border-festiva-burgundy"
                >
                  <option value="all">All Categories</option>
                  <option value="bridal">Bridal Wear</option>
                  <option value="garments">Party Garments</option>
                  <option value="jewellery">Jewellery Sets</option>
                  <option value="perfume">Royal Perfumes</option>
                  <option value="cars">Wedding Cars</option>
                  <option value="furniture">Royal Furniture</option>
                </select>

                {/* Area Filter */}
                <select
                  value={sheetArea}
                  onChange={(e) => setSheetArea(e.target.value)}
                  className="bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-800 outline-none focus:border-festiva-burgundy"
                >
                  <option value="all">All Quetta Areas</option>
                  <option value="Satellite Town">Satellite Town</option>
                  <option value="Jinnah Road">Jinnah Road</option>
                  <option value="Quetta Cantt">Quetta Cantt</option>
                  <option value="Zarghoon Road">Zarghoon Road</option>
                  <option value="Model Town">Model Town</option>
                  <option value="Brewery Road">Brewery Road</option>
                  <option value="Samungli Road">Samungli Road</option>
                </select>
              </div>

              {/* Bulk Actions */}
              <div className="flex items-center gap-2">
                {selectedProductIds.length > 0 && (
                  <div className="flex items-center gap-1.5 bg-festiva-cream px-2 py-1 rounded-xl border border-festiva-gold/40 text-xs">
                    <span className="font-bold text-festiva-maroon">{selectedProductIds.length} selected:</span>
                    <button
                      onClick={() => handleBulkMarkStock(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-0.5 rounded text-[10px] font-bold"
                    >
                      In Stock
                    </button>
                    <button
                      onClick={() => handleBulkMarkStock(false)}
                      className="bg-stone-600 hover:bg-stone-700 text-white px-2 py-0.5 rounded text-[10px] font-bold"
                    >
                      Out of Stock
                    </button>
                  </div>
                )}

                <button
                  onClick={() => window.print()}
                  className="bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  title="Print this sheet"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Print</span>
                </button>
              </div>
            </div>

            {/* High-Density Data Grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-festiva-blush/80 text-festiva-maroon uppercase text-[10px] font-extrabold border-b border-festiva-sand select-none">
                    <th className="py-2.5 px-3 w-8">
                      <input
                        type="checkbox"
                        checked={selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={handleSelectAll}
                        className="rounded text-festiva-burgundy"
                      />
                    </th>
                    <th className="py-2.5 px-3 cursor-pointer hover:bg-festiva-sand/30" onClick={() => handleSort('id')}>
                      <div className="flex items-center gap-1">
                        <span>ID</span>
                        <ArrowUpDown className="w-3 h-3 text-stone-400" />
                      </div>
                    </th>
                    <th className="py-2.5 px-3 min-w-[220px] cursor-pointer hover:bg-festiva-sand/30" onClick={() => handleSort('title')}>
                      <div className="flex items-center gap-1">
                        <span>Product Title & Media</span>
                        <ArrowUpDown className="w-3 h-3 text-stone-400" />
                      </div>
                    </th>
                    <th className="py-2.5 px-3">Quetta Area</th>
                    <th className="py-2.5 px-3 cursor-pointer hover:bg-festiva-sand/30" onClick={() => handleSort('dailyRent')}>
                      <div className="flex items-center gap-1">
                        <span>Daily Rent (PKR)</span>
                        <ArrowUpDown className="w-3 h-3 text-stone-400" />
                      </div>
                    </th>
                    <th className="py-2.5 px-3 cursor-pointer hover:bg-festiva-sand/30" onClick={() => handleSort('price')}>
                      <div className="flex items-center gap-1">
                        <span>Buy Price (PKR)</span>
                        <ArrowUpDown className="w-3 h-3 text-stone-400" />
                      </div>
                    </th>
                    <th className="py-2.5 px-3">Security Deposit</th>
                    <th className="py-2.5 px-3 text-center">Stock</th>
                    <th className="py-2.5 px-3 text-center">Featured</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="py-8 text-center text-stone-400 text-xs">
                        No products match your search or filter.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => {
                      const isEditing = editingId === p.id;
                      const isSelected = selectedProductIds.includes(p.id);

                      return (
                        <tr 
                          key={p.id} 
                          className={`hover:bg-amber-50/40 transition-colors ${isSelected ? 'bg-amber-50/70' : ''}`}
                        >
                          {/* Checkbox */}
                          <td className="py-2.5 px-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelectOne(p.id)}
                              className="rounded text-festiva-burgundy"
                            />
                          </td>

                          {/* ID */}
                          <td className="py-2.5 px-3 font-mono font-bold text-stone-500 whitespace-nowrap">
                            {p.id}
                          </td>

                          {/* Product & Media */}
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={p.images?.[0] || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=200'}
                                alt=""
                                className="w-9 h-9 rounded-lg object-cover border border-stone-200 flex-shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="font-bold text-stone-900 truncate max-w-[200px]" title={p.title}>
                                  {p.title}
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-stone-500">
                                  <span className="capitalize">{p.eventType}</span>
                                  <span>&bull;</span>
                                  <span>{p.images?.length || 1} photos</span>
                                  {p.video && (
                                    <span className="text-emerald-700 font-bold bg-emerald-50 px-1 rounded">
                                      + Video
                                    </span>
                                  )}
                                  <span>&bull;</span>
                                  <span className={p.isOfficial ? 'text-festiva-burgundy font-bold' : 'text-stone-600'}>
                                    {p.vendor.name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Area */}
                          <td className="py-2.5 px-3 text-stone-700 whitespace-nowrap">
                            <span className="flex items-center gap-1 text-[11px]">
                              <MapPin className="w-3 h-3 text-festiva-gold flex-shrink-0" />
                              <span>{p.quettaArea}</span>
                            </span>
                          </td>

                          {/* Daily Rent (Editable) */}
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editDailyRent}
                                onChange={(e) => setEditDailyRent(e.target.value)}
                                className="w-24 border border-festiva-burgundy rounded px-1.5 py-0.5 text-xs font-bold outline-none"
                              />
                            ) : (
                              <span className="font-bold text-festiva-burgundy">
                                {p.rentRate ? `Rs. ${formatPKR(p.rentRate.daily)}` : '—'}
                              </span>
                            )}
                          </td>

                          {/* Buy Price (Editable) */}
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                                className="w-24 border border-festiva-burgundy rounded px-1.5 py-0.5 text-xs font-bold outline-none"
                              />
                            ) : (
                              <span className="font-semibold text-stone-800">
                                {p.price ? `Rs. ${formatPKR(p.price)}` : '—'}
                              </span>
                            )}
                          </td>

                          {/* Security Deposit */}
                          <td className="py-2.5 px-3 text-emerald-800 font-medium whitespace-nowrap">
                            {p.securityDeposit ? `Rs. ${formatPKR(p.securityDeposit)}` : '—'}
                          </td>

                          {/* Stock Toggle */}
                          <td className="py-2.5 px-3 text-center">
                            <button
                              onClick={() => handleToggleStock(p)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                                p.inStock
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                            >
                              {p.inStock ? 'In Stock' : 'Out of Stock'}
                            </button>
                          </td>

                          {/* Featured Toggle */}
                          <td className="py-2.5 px-3 text-center">
                            <button
                              onClick={() => handleToggleFeatured(p)}
                              className={`p-1 rounded-lg transition-colors ${
                                p.featured
                                  ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                                  : 'text-stone-300 hover:text-stone-500'
                              }`}
                              title={p.featured ? 'Featured on Home' : 'Click to Feature'}
                            >
                              <Sparkles className="w-4 h-4" />
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-2.5 px-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {isEditing ? (
                                <button
                                  onClick={() => handleSaveEdit(p)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-1 rounded-lg text-xs"
                                  title="Save Changes"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleStartEdit(p)}
                                  className="text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-stone-100"
                                  title="Quick Edit Price / Rent"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                onClick={() => onDeleteProduct(p.id)}
                                className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50"
                                title="Delete from Platform"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Sheet Footer Summary */}
            <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
              <span>Showing <b>{filteredProducts.length}</b> of <b>{products.length}</b> items</span>
              <div className="flex items-center gap-3">
                <span>Official: <b>{officialProducts.length}</b></span>
                <span>•</span>
                <span>Peer Marketplace: <b>{peerProducts.length}</b></span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FINANCIAL OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-festiva-sand shadow-sm">
                <div className="flex items-center justify-between text-stone-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Booking Volume</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-serif font-bold text-festiva-burgundy">
                  Rs. {formatPKR(totalRevenue)}
                </div>
                <div className="text-[11px] text-stone-500 mt-1">Across all confirmed Quetta orders</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-festiva-sand shadow-sm">
                <div className="flex items-center justify-between text-stone-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Mamas Commission Cut</span>
                  <TrendingUp className="w-4 h-4 text-festiva-gold" />
                </div>
                <div className="text-2xl font-serif font-bold text-emerald-700">
                  Rs. {formatPKR(estimatedCommissionEarned)}
                </div>
                <div className="text-[11px] text-stone-500 mt-1">
                  At {rentalCommPercent}% rental & {saleCommPercent}% sale cut
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-festiva-sand shadow-sm">
                <div className="flex items-center justify-between text-stone-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Quetta Peer Hosts</span>
                  <Users className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-2xl font-serif font-bold text-stone-900">
                  {peerProducts.length} Listings
                </div>
                <div className="text-[11px] text-stone-500 mt-1">Community bridal dresses & wedding cars</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-festiva-sand shadow-sm">
                <div className="flex items-center justify-between text-stone-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Mamas 1st Party Store</span>
                  <Store className="w-4 h-4 text-festiva-maroon" />
                </div>
                <div className="text-2xl font-serif font-bold text-stone-900">
                  {officialProducts.length} Items
                </div>
                <div className="text-[11px] text-stone-500 mt-1">100% direct revenue margin items</div>
              </div>
            </div>

            {/* Quetta Hub Trust & Security Notice */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-5 flex items-start gap-4 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 space-y-1">
                <h4 className="font-bold text-sm text-amber-950">Amanat Security Locker System (Quetta Protocol)</h4>
                <p>
                  Every rental order requires an Amanat Security Deposit held in escrow by Mamas Collection Quetta. 
                  When the customer returns the suit/car without damage, the security deposit is refunded instantly via EasyPaisa/JazzCash.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BOOKINGS & ORDERS STATUS MANAGEMENT (ALL BUTTONS WORKING) */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-festiva-sand shadow-sm p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif font-bold text-lg text-stone-900">
                  Live Orders & Booking Challans
                </h2>
                <p className="text-xs text-stone-500">
                  Update booking lifecycle: Verification ➔ Dispatched ➔ Returned ➔ Completed.
                </p>
              </div>
              <span className="bg-festiva-burgundy text-white font-bold text-xs px-3 py-1 rounded-full">
                {orders.length} Total Orders
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 text-stone-400 text-xs space-y-2">
                <Package className="w-8 h-8 mx-auto opacity-40 text-festiva-burgundy" />
                <p>No orders placed yet. Place an order on the storefront to test live invoice generation!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-festiva-blush text-festiva-maroon uppercase text-[10px] font-bold border-b border-festiva-sand">
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Quetta Delivery Address</th>
                      <th className="py-2.5 px-3">Payment</th>
                      <th className="py-2.5 px-3">Total (PKR)</th>
                      <th className="py-2.5 px-3">Lifecycle Status (Working)</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders.map((o) => (
                      <tr key={o.orderId} className="hover:bg-stone-50 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-festiva-burgundy">
                          {o.orderId}
                          <div className="text-[10px] text-stone-400 font-normal">
                            {new Date(o.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-stone-900">
                          {o.customer.name}
                          <div className="text-[11px] text-stone-500 font-normal">
                            {o.customer.phone}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-stone-600">
                          <div className="font-medium text-stone-800">{o.customer.area}</div>
                          <div className="text-[10px] text-stone-400 truncate max-w-xs">{o.customer.address}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="uppercase font-bold text-[10px] bg-stone-100 px-2 py-0.5 rounded text-stone-800">
                            {o.payment.method}
                          </span>
                          <div className="text-[10px] text-stone-400 font-mono">{o.payment.transactionId}</div>
                        </td>
                        <td className="py-3 px-3 font-bold text-festiva-burgundy">
                          Rs. {formatPKR(o.grandTotal)}
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={o.status || 'Pending Verification'}
                            onChange={(e) => onUpdateOrderStatus(o.orderId, e.target.value)}
                            className="bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1 text-xs font-bold text-stone-800 outline-none focus:border-festiva-burgundy"
                          >
                            <option value="Pending Verification">🟡 Pending Verification</option>
                            <option value="Deposit Verified">🟢 Deposit Verified</option>
                            <option value="Dispatched in Quetta">🚚 Dispatched in Quetta</option>
                            <option value="Active Rental">👗 Active Rental (With Client)</option>
                            <option value="Returned & Deposit Refunded">💰 Returned & Deposit Refunded</option>
                            <option value="Completed">✓ Completed</option>
                            <option value="Cancelled">❌ Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => onDeleteOrder(o.orderId)}
                            className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete Order Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CARD CATALOG VIEW */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-festiva-sand shadow-sm p-5 sm:p-6 space-y-4">
            <h2 className="font-serif font-bold text-lg text-stone-900">
              Visual Product Catalog ({products.length} Items)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p.id} className="border border-stone-200 rounded-2xl p-3 flex gap-3 hover:shadow-md transition-shadow">
                  <img
                    src={p.images?.[0] || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=300'}
                    alt=""
                    className="w-20 h-24 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-stone-400">{p.id}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${p.isOfficial ? 'bg-festiva-maroon text-white' : 'bg-stone-200 text-stone-700'}`}>
                          {p.isOfficial ? 'Official' : 'Peer'}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-stone-900 truncate mt-0.5">{p.title}</h4>
                      <p className="text-[11px] text-festiva-burgundy font-serif font-bold">
                        {p.rentRate ? `Rs. ${formatPKR(p.rentRate.daily)} / day` : `Rs. ${formatPKR(p.price)}`}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[10px]">
                      <span className="text-stone-500">{p.quettaArea}</span>
                      <button
                        onClick={() => onDeleteProduct(p.id)}
                        className="text-red-500 hover:text-red-700 font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: COMMISSION CONTROLLER */}
        {activeTab === 'commission' && (
          <div className="bg-white rounded-3xl border border-festiva-sand shadow-sm p-5 sm:p-6 space-y-6 max-w-2xl">
            <div>
              <h2 className="font-serif font-bold text-lg text-stone-900">
                Dynamic Platform Commission Engine
              </h2>
              <p className="text-xs text-stone-500">
                Set the percentage cut Mamas Collection earns from every peer bridal dress, wedding car, and jewellery rental in Quetta.
              </p>
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Commission rates updated successfully across the entire platform!</span>
              </div>
            )}

            <form onSubmit={handleSaveCommission} className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <label className="block font-bold text-sm text-amber-950">
                  Rental Booking Commission Percentage (%):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={rentalCommPercent}
                    onChange={(e) => setRentalCommPercent(e.target.value)}
                    className="w-24 bg-white border border-amber-300 rounded-xl px-3 py-2 text-sm font-bold text-amber-900 outline-none"
                  />
                  <span className="text-stone-500">
                    Recommended: 15% - 20% on bridal wear & luxury cars.
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <label className="block font-bold text-sm text-stone-800">
                  Peer Direct Sale Commission Percentage (%):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={saleCommPercent}
                    onChange={(e) => setSaleCommPercent(e.target.value)}
                    className="w-24 bg-white border border-stone-300 rounded-xl px-3 py-2 text-sm font-bold text-stone-900 outline-none"
                  />
                  <span className="text-stone-500">
                    Standard Mamas Collection platform fee for peer-to-peer preloved sales.
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="bg-festiva-burgundy hover:bg-festiva-maroon text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
              >
                <Save className="w-4 h-4 text-festiva-lightgold" />
                <span>Save Commission Settings</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
