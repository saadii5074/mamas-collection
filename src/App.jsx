import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import FilterBar from './components/FilterBar';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import InvoiceModal from './components/InvoiceModal';
import SellerPortalModal from './components/SellerPortalModal';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginModal from './components/AdminLoginModal';
import ChatModal from './components/ChatModal';
import InboxModal from './components/InboxModal';
import AuthModal from './components/AuthModal';
import MyListingsModal from './components/MyListingsModal';
import MobileBottomNav from './components/MobileBottomNav';
import WhatsAppIcon from './components/WhatsAppIcon';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_COMMISSION_RATES 
} from './data/mockData';
import { 
  getActiveUser, 
  setActiveUser as saveActiveUser, 
  DEFAULT_USERS, 
  incrementProductView, 
  toggleProductLike,
  verifyCartPriceIntegrity,
  sanitizeInput
} from './services/marketplaceService';
import { 
  Sparkles, 
  MessageCircle, 
  PhoneCall, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  ArrowUp,
  Store,
  Layers,
  Clock,
  User,
  Eye
} from 'lucide-react';

export default function App() {
  // Products & Storage
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('mamas_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('mamas_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [commissionRates, setCommissionRates] = useState(() => {
    const saved = localStorage.getItem('mamas_commission');
    return saved ? JSON.parse(saved) : INITIAL_COMMISSION_RATES;
  });

  // Admin Authentication
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('mamas_admin_auth') === 'true';
  });
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // In-App Chat & Messaging
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('mamas_chats');
    return saved ? JSON.parse(saved) : {};
  });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatProduct, setChatProduct] = useState(null);
  const [isInboxOpen, setIsInboxOpen] = useState(false);

  // Filters State
  const [selectedArea, setSelectedArea] = useState('All Areas (Quetta)');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMode, setActiveMode] = useState('all'); // 'all', 'buy', 'rent'
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('All');
  const [onlyOfficial, setOnlyOfficial] = useState(false);

  // Cart & Modals
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const [modalInitialMode, setModalInitialMode] = useState('rent');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrderForInvoice, setActiveOrderForInvoice] = useState(null);
  const [isSellerPortalOpen, setIsSellerPortalOpen] = useState(false);
  const [isAdminActive, setIsAdminActive] = useState(false);

  // Active User Authentication & Role Simulation
  const [activeUser, setActiveUserState] = useState(() => getActiveUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMyListingsModalOpen, setIsMyListingsModalOpen] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('mamas_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('mamas_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('mamas_commission', JSON.stringify(commissionRates));
  }, [commissionRates]);

  useEffect(() => {
    localStorage.setItem('mamas_chats', JSON.stringify(conversations));
  }, [conversations]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Area Filter
      if (selectedArea !== 'All Areas (Quetta)' && item.quettaArea !== selectedArea) {
        return false;
      }

      // Mode Filter (Buy vs Rent)
      if (activeMode === 'buy' && item.listingType !== 'buy' && item.listingType !== 'both') {
        return false;
      }
      if (activeMode === 'rent' && item.listingType !== 'rent' && item.listingType !== 'both') {
        return false;
      }

      // Event Filter
      if (selectedEvent !== 'all' && item.eventType !== selectedEvent) {
        return false;
      }

      // Category Filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Color Filter
      if (selectedColor && item.color?.name !== selectedColor) {
        return false;
      }

      // Size Filter
      if (selectedSize !== 'All') {
        if (!item.sizes || !item.sizes.includes(selectedSize)) {
          return false;
        }
      }

      // Official Brand Filter
      if (onlyOfficial && !item.isOfficial) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesUrdu = item.titleUrdu?.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);
        const matchesArea = item.quettaArea?.toLowerCase().includes(q);
        const matchesEvent = item.eventType?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesUrdu && !matchesDesc && !matchesArea && !matchesEvent) {
          return false;
        }
      }

      return true;
    });
  }, [
    products, 
    selectedArea, 
    activeMode, 
    selectedEvent, 
    selectedCategory, 
    selectedColor, 
    selectedSize, 
    onlyOfficial, 
    searchQuery
  ]);

  const handleResetFilters = () => {
    setSelectedArea('All Areas (Quetta)');
    setSelectedEvent('all');
    setSelectedCategory('all');
    setSelectedColor(null);
    setSelectedSize('All');
    setOnlyOfficial(false);
    setSearchQuery('');
  };

  const handleAddToCart = (bookingDetails) => {
    setCartItems([...cartItems, bookingDetails]);
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  // Handlers for Admin Auth & Management
  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      setIsAdminActive(!isAdminActive);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('mamas_admin_auth', 'true');
    setIsAdminActive(true);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('mamas_admin_auth');
    setIsAdminActive(false);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o));
  };

  const handleDeleteOrder = (orderId) => {
    setOrders(orders.filter(o => o.orderId !== orderId));
  };

  // In-App Chat Handlers
  const handleSendMessage = (product, message) => {
    const key = `chat_${product.id}`;
    setConversations(prev => {
      const existing = prev[key] || [];
      return {
        ...prev,
        [key]: [...existing, message]
      };
    });
  };

  const handleOpenChatWithProduct = (product) => {
    setChatProduct(product);
    setIsChatOpen(true);
  };

  const handleOpenWhatsApp = (product) => {
    const phone = (product.vendor?.phone || '03070816990').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Assalam o Alaikum! I want to inquire about "${product.title}" (${product.id}) on Mamas Collection Quetta.`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleCompleteOrder = (orderData) => {
    // 🛡️ Enterprise Financial Integrity Check (Anti-Price Tampering)
    const { verifiedItems, hasTampering } = verifyCartPriceIntegrity(orderData.items, products);

    const cleanSubtotal = verifiedItems.reduce((acc, item) => {
      return acc + (item.bookingMode === 'rent' ? (item.rentAmount || 0) : (item.totalPrice || 0));
    }, 0);
    const cleanSecurity = verifiedItems.reduce((acc, item) => {
      return acc + (item.bookingMode === 'rent' ? (item.securityDeposit || 0) : 0);
    }, 0);

    const orderWithStatus = {
      ...orderData,
      items: verifiedItems,
      subtotalItems: cleanSubtotal,
      totalSecurityDeposit: cleanSecurity,
      grandTotal: cleanSubtotal + cleanSecurity,
      status: 'Pending Verification',
      priceTamperedDetected: hasTampering
    };

    setOrders([orderWithStatus, ...orders]);
    setCartItems([]);
    setIsCheckoutOpen(false);
    setActiveOrderForInvoice(orderWithStatus);
  };

  const handleAddListing = (newProduct) => {
    setProducts([newProduct, ...products]);
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  const handleSwitchRole = () => {
    const isCurrentlyBuyer = !activeUser || activeUser.id === DEFAULT_USERS.buyer.id;
    const nextUser = isCurrentlyBuyer ? DEFAULT_USERS.seller : DEFAULT_USERS.buyer;
    saveActiveUser(nextUser);
    setActiveUserState(nextUser);
  };

  const handleAuthSuccess = (userData) => {
    saveActiveUser(userData);
    setActiveUserState(userData);
    setIsAuthModalOpen(false);
  };

  const handleSelectProduct = (product, mode = null) => {
    incrementProductView(product.id);
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, viewsCount: (p.viewsCount || 0) + 1 } : p));
    setSelectedProductForModal(product);
    if (mode) {
      setModalInitialMode(mode);
    } else {
      setModalInitialMode(product.listingType === 'buy' ? 'buy' : 'rent');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5F3] text-stone-900 pb-20 sm:pb-12 flex flex-col font-sans selection:bg-festiva-burgundy selection:text-white">
      
      {/* 1. FESTIVA LUXURY HEADER & NAVBAR */}
      <Navbar
        selectedArea={selectedArea}
        setSelectedArea={setSelectedArea}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSellerPortal={() => setIsSellerPortalOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        isAdminActive={isAdminActive}
        isAdminAuthenticated={isAdminAuthenticated}
        onOpenInbox={() => setIsInboxOpen(true)}
        unreadMessagesCount={Object.keys(conversations).length}
        activeUser={activeUser}
        onOpenMyListings={() => setIsMyListingsModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSwitchRole={handleSwitchRole}
      />

      {/* Main Content View Switcher */}
      {isAdminActive ? (
        <AdminDashboard
          products={products}
          onDeleteProduct={handleDeleteProduct}
          onApproveProduct={() => {}}
          onUpdateProduct={handleUpdateProduct}
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onDeleteOrder={handleDeleteOrder}
          commissionRates={commissionRates}
          onUpdateCommissionRates={setCommissionRates}
          onClose={() => setIsAdminActive(false)}
          onLogout={handleAdminLogout}
        />
      ) : (
        <>
          {/* 2. HERO BANNER */}
          <HeroBanner
            onSelectEvent={setSelectedEvent}
            onOpenSellerPortal={() => setIsSellerPortalOpen(true)}
            activeMode={activeMode}
            setActiveMode={setActiveMode}
          />

          {/* 3. FILTER BAR (Quetta Areas, Barat/Valima/Mehndi Events, Colors, Sizes) */}
          <FilterBar
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            onlyOfficial={onlyOfficial}
            setOnlyOfficial={setOnlyOfficial}
            activeMode={activeMode}
            setActiveMode={setActiveMode}
            onResetFilters={handleResetFilters}
            totalResults={filteredProducts.length}
          />

          {/* 4. PRODUCTS & RENTALS GRID */}
          <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
            
            {/* Mode Banner Indicator */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2">
              <div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-festiva-maroon flex items-center gap-2">
                  <span>
                    {activeMode === 'rent' ? 'Quetta Bridal & Asset Rentals' :
                     activeMode === 'buy' ? 'Mamas Collection Direct Store' :
                     'Explore All Quetta Collections & Rentals'}
                  </span>
                  <span className="text-xs bg-festiva-gold/30 text-festiva-maroon font-bold px-2 py-0.5 rounded-full border border-festiva-gold">
                    {selectedArea}
                  </span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  شادی، بارات اور ولیمہ کے لیے برائیڈل لہنگے، شیروانی، جیولری، کار اور فرنیچر رینٹ پر لیں
                </p>
              </div>

              {/* Mode switch pills */}
              <div className="flex items-center gap-2 text-xs font-semibold">
                <button
                  onClick={() => setActiveMode('all')}
                  className={`px-3 py-1 rounded-full border transition-all ${
                    activeMode === 'all'
                      ? 'bg-festiva-burgundy text-white border-festiva-burgundy'
                      : 'bg-white text-stone-600 border-festiva-sand hover:bg-festiva-blush'
                  }`}
                >
                  All Items
                </button>
                <button
                  onClick={() => setActiveMode('rent')}
                  className={`px-3 py-1 rounded-full border transition-all ${
                    activeMode === 'rent'
                      ? 'bg-festiva-burgundy text-white border-festiva-burgundy'
                      : 'bg-white text-stone-600 border-festiva-sand hover:bg-festiva-blush'
                  }`}
                >
                  For Rent (کرایہ)
                </button>
                <button
                  onClick={() => setActiveMode('buy')}
                  className={`px-3 py-1 rounded-full border transition-all ${
                    activeMode === 'buy'
                      ? 'bg-festiva-burgundy text-white border-festiva-burgundy'
                      : 'bg-white text-stone-600 border-festiva-sand hover:bg-festiva-blush'
                  }`}
                >
                  For Sale (خریداری)
                </button>
              </div>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-festiva-sand shadow-sm space-y-4 max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-full bg-festiva-blush text-festiva-burgundy flex items-center justify-center mx-auto border border-festiva-sand">
                  <Sparkles className="w-8 h-8 text-festiva-gold" />
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  No Items Match Your Filter in {selectedArea}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Is area ya event ke mutabiq filhal koi item nahi mili. Filters reset kar ke Quetta ki tamam items check karein ya apni item khud post karein!
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="bg-festiva-burgundy text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-festiva-maroon transition-all shadow-sm"
                  >
                    Reset All Filters
                  </button>
                  <button
                    onClick={() => setIsSellerPortalOpen(true)}
                    className="bg-white text-festiva-maroon border border-festiva-sand text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-festiva-blush transition-all"
                  >
                    Post an Item for Rent
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={(p) => handleSelectProduct(p)}
                    onQuickRent={(p) => handleSelectProduct(p, 'rent')}
                    onQuickBuy={(p) => handleSelectProduct(p, 'buy')}
                  />
                ))}
              </div>
            )}

            {/* Quetta Community Host Banner */}
            <div className="bg-gradient-to-r from-festiva-maroon via-festiva-burgundy to-festiva-maroon rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-festiva-gold/40 flex flex-col md:flex-row items-center justify-between gap-6 mt-12">
              <div className="space-y-2 text-center md:text-left">
                <span className="bg-festiva-gold text-festiva-maroon text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Quetta Peer Marketplace
                </span>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">
                  Have a Bridal Dress, Car, or Furniture in Quetta?
                </h3>
                <p className="text-xs text-festiva-lightgold max-w-xl leading-relaxed">
                  اپنے برائیڈل سوٹ یا گاڑی کو ماماس کلیکشن پر لسٹ کریں اور ہر شادی کے سیزن میں گھر بیٹھے کمائیں۔ 100% سیکیورٹی ڈپازٹ اور ویریفائیڈ کسٹمرز۔
                </p>
              </div>

              <button
                onClick={() => setIsSellerPortalOpen(true)}
                className="bg-gradient-to-r from-festiva-gold to-amber-600 hover:from-amber-500 hover:to-festiva-gold text-festiva-maroon font-bold px-6 py-3 rounded-full text-xs sm:text-sm transition-all shadow-lg whitespace-nowrap transform active:scale-95"
              >
                Post Your Listing (Free)
              </button>
            </div>

          </main>
        </>
      )}

      {/* 5. FOOTER */}
      <footer className="bg-gradient-to-b from-[#2D060D] to-[#1A0307] text-white pt-12 pb-24 sm:pb-12 border-t border-festiva-gold/20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-festiva-burgundy text-festiva-gold flex items-center justify-center font-serif font-bold text-lg border border-festiva-gold/40">
                M
              </div>
              <span className="font-serif text-lg font-bold text-white">
                Mamas Collection
              </span>
            </div>
            <p className="text-stone-300 leading-relaxed text-[11px]">
              Quetta's pioneer festive luxury e-commerce and peer-to-peer bridal & asset rental platform. Built with elegance and local trust.
            </p>
            <div className="text-[11px] text-festiva-lightgold font-medium">
              📍 Jinnah Road & Cantt, Quetta, Pakistan
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-serif font-bold text-sm text-festiva-lightgold border-b border-white/10 pb-1">
              Quetta Event Categories
            </h4>
            <ul className="space-y-1.5 text-stone-300 text-[11px]">
              <li><button onClick={() => setSelectedEvent('barat')} className="hover:text-festiva-lightgold">Barat Heavy Lehengas & Sherwanis</button></li>
              <li><button onClick={() => setSelectedEvent('valima')} className="hover:text-festiva-lightgold">Valima Trail Gowns & Maxis</button></li>
              <li><button onClick={() => setSelectedEvent('mehndi')} className="hover:text-festiva-lightgold">Mehndi & Mayun Yellow Pishwas</button></li>
              <li><button onClick={() => setSelectedEvent('nikkah')} className="hover:text-festiva-lightgold">Nikkah Pure Whites & Ivory</button></li>
              <li><button onClick={() => setSelectedCategory('cars')} className="hover:text-festiva-lightgold">Decorated Wedding Cars for Rent</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-serif font-bold text-sm text-festiva-lightgold border-b border-white/10 pb-1">
              Customer Support & Contact
            </h4>
            <ul className="space-y-1.5 text-stone-300 text-[11px]">
              <li className="flex items-center gap-1.5">
                <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp: <b>0307-0816990</b></span>
              </li>
              <li>Official Email: <b>mamascollection11@gmail.com</b></li>
              <li>Direct Store: 100% Guaranteed Quality</li>
              <li>Rental Amanat Locker: Safe Security Returns</li>
              <li>Facebook Page: fb.com/mamascollection.quetta</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-serif font-bold text-sm text-festiva-lightgold border-b border-white/10 pb-1">
              Accepted Local Payments
            </h4>
            <p className="text-[11px] text-stone-300">
              EasyPaisa, JazzCash, Direct Bank Transfer (Meezan/HBL), and Cash on Delivery in Quetta city.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="bg-white/10 px-2 py-0.5 rounded font-mono text-[10px]">EasyPaisa</span>
              <span className="bg-white/10 px-2 py-0.5 rounded font-mono text-[10px]">JazzCash</span>
              <span className="bg-white/10 px-2 py-0.5 rounded font-mono text-[10px]">Bank Transfer</span>
              <span className="bg-white/10 px-2 py-0.5 rounded font-mono text-[10px]">COD Quetta</span>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 pt-8 mt-8 border-t border-white/10 text-center text-stone-400 text-[10px]">
          &copy; {new Date().getFullYear()} Mamas Collection (ماماس کلیکشن) &bull; Designed for Saadii &bull; Quetta, Balochistan. All Rights Reserved.
        </div>
      </footer>

      {/* 6. MODALS & DRAWERS */}
      
      {/* Product Detail & Rental Calculator Modal */}
      {selectedProductForModal && (
        <ProductDetailModal
          product={selectedProductForModal}
          initialBookingType={modalInitialMode}
          onClose={() => setSelectedProductForModal(null)}
          onAddToCart={handleAddToCart}
          onOpenChatWithProduct={handleOpenChatWithProduct}
        />
      )}

      {/* Cart & Booking Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout & Payment Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onCompleteOrder={handleCompleteOrder}
      />

      {/* Digital Printable Invoice Modal */}
      {activeOrderForInvoice && (
        <InvoiceModal
          order={activeOrderForInvoice}
          onClose={() => setActiveOrderForInvoice(null)}
        />
      )}

      {/* Peer Seller / Host Listing Modal (Multi-Photo & Video) */}
      <SellerPortalModal
        isOpen={isSellerPortalOpen}
        onClose={() => setIsSellerPortalOpen(false)}
        onAddListing={handleAddListing}
      />

      {/* Admin Authentication Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* In-App Peer-to-Peer Chat Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        product={chatProduct}
        conversations={conversations}
        onSendMessage={handleSendMessage}
        onOpenWhatsApp={handleOpenWhatsApp}
      />

      {/* In-App Messages / Inbox Modal */}
      <InboxModal
        isOpen={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
        conversations={conversations}
        products={products}
        onOpenChatWithProduct={handleOpenChatWithProduct}
      />

      {/* Real Phone Registration & SMS OTP Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* OLX-Style My Ads & Analytics Studio Modal */}
      <MyListingsModal
        isOpen={isMyListingsModalOpen}
        onClose={() => setIsMyListingsModalOpen(false)}
        activeUser={activeUser}
        products={products}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onOpenSellerPortal={() => {
          setIsMyListingsModalOpen(false);
          setIsSellerPortalOpen(true);
        }}
      />

      {/* 7. PWA MOBILE BOTTOM NAVIGATION BAR */}
      <MobileBottomNav
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSellerPortal={() => setIsSellerPortalOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        isAdminActive={isAdminActive}
        onOpenMyListings={() => setIsMyListingsModalOpen(true)}
      />

      {/* Floating WhatsApp Quick Action Bubble */}
      <a
        href="https://wa.me/923070816990?text=Assalam%20o%20Alaikum%20Mamas%20Collection%20Quetta!"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] hover:bg-[#20ba59] active:scale-90 text-white rounded-full shadow-2xl flex items-center justify-center transform hover:scale-110 transition-all duration-300 border-2 border-white/30"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon className="w-8 h-8 fill-white" />
      </a>

    </div>
  );
}
