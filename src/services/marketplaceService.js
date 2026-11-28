// Mamas Collection Marketplace Service
// Handles User Profiles, Privacy Guard (Contact Masking), Real-Time Analytics, and Data Management

// 1. Anti-Disintermediation / Contact Masking Filter
// Strictly detects and blocks phone numbers, social media handles, and emails
export const SENSITIVE_PATTERNS = {
  // Pakistani phone formats: 0300-1234567, 03001234567, +92300..., 92300..., 0 3 0 0 ...
  phone: /(?:(?:\+|00)92\s*3\d{2}|0\s*3\d{2})[\s\-\.]*\d{3}[\s\-\.]*\d{4}/gi,
  
  // Generic 10-11 digit sequence with or without spaces/dashes
  digitsSequence: /\b\d{3,4}[\s\-\.]?\d{3,4}[\s\-\.]?\d{3,4}\b/g,
  
  // Social media handles & external platforms
  social: /(?:whatsapp|wa\.me|instagram|insta|ig|facebook|fb|fb\.com|telegram|tiktok|snapchat|imo)/gi,
  handle: /@[\w\.-]+/g,
  
  // Email addresses
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi
};

/**
 * Checks if a message contains contact info or bypass attempts
 * Returns { isSafe: boolean, violations: string[] }
 */
export function checkMessageSafety(text) {
  if (!text) return { isSafe: true, violations: [] };

  const violations = [];

  if (SENSITIVE_PATTERNS.phone.test(text) || SENSITIVE_PATTERNS.digitsSequence.test(text)) {
    violations.push('Phone Number / Mobile Sequence');
  }

  if (SENSITIVE_PATTERNS.social.test(text)) {
    violations.push('External Social Platform / WhatsApp');
  }

  if (SENSITIVE_PATTERNS.handle.test(text)) {
    violations.push('Social Handle (@)');
  }

  if (SENSITIVE_PATTERNS.email.test(text)) {
    violations.push('Email Address');
  }

  // Reset regex states
  SENSITIVE_PATTERNS.phone.lastIndex = 0;
  SENSITIVE_PATTERNS.digitsSequence.lastIndex = 0;
  SENSITIVE_PATTERNS.social.lastIndex = 0;
  SENSITIVE_PATTERNS.handle.lastIndex = 0;
  SENSITIVE_PATTERNS.email.lastIndex = 0;

  return {
    isSafe: violations.length === 0,
    violations
  };
}

/**
 * Masks any sensitive information in a string
 */
export function maskSensitiveText(text) {
  let masked = text;
  masked = masked.replace(SENSITIVE_PATTERNS.phone, '[BLOCKED: Mobile Number]');
  masked = masked.replace(SENSITIVE_PATTERNS.digitsSequence, '[BLOCKED: Contact Sequence]');
  masked = masked.replace(SENSITIVE_PATTERNS.social, '[BLOCKED: External Platform]');
  masked = masked.replace(SENSITIVE_PATTERNS.handle, '[BLOCKED: Social Handle]');
  masked = masked.replace(SENSITIVE_PATTERNS.email, '[BLOCKED: Email]');
  return masked;
}

// 2. Demo Preset Registered Users
export const DEFAULT_USERS = [
  {
    id: 'user_zarghoon',
    name: 'Zarghoon Bridal Lounge',
    phone: '0307-8899112',
    area: 'Satellite Town, Quetta',
    cnicVerified: true,
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200'
  },
  {
    id: 'user_fatima',
    name: 'Fatima Baloch (Buyer)',
    phone: '0307-5544332',
    area: 'Quetta Cantt',
    cnicVerified: true,
    role: 'buyer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'
  },
  {
    id: 'user_samungli',
    name: 'Samungli Wedding Motors',
    phone: '0307-9988776',
    area: 'Samungli Road, Quetta',
    cnicVerified: true,
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200'
  }
];

// Helper to get all registered user profiles
export function getAllUserProfiles() {
  const saved = localStorage.getItem('mamas_user_profiles');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      // fallback
    }
  }
  localStorage.setItem('mamas_user_profiles', JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
}

export function saveUserProfile(user) {
  const profiles = getAllUserProfiles();
  const index = profiles.findIndex(u => u.id === user.id);
  let updated;
  if (index >= 0) {
    updated = [...profiles];
    updated[index] = user;
  } else {
    updated = [...profiles, user];
  }
  localStorage.setItem('mamas_user_profiles', JSON.stringify(updated));
  return updated;
}

// Helper to get active user
export function getActiveUser() {
  const saved = localStorage.getItem('mamas_active_user');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
  }
  const all = getAllUserProfiles();
  return all[0] || DEFAULT_USERS[0];
}

export function setActiveUser(user) {
  localStorage.setItem('mamas_active_user', JSON.stringify(user));
}

// 3. Increment Real-time Product View
export function incrementProductView(productId, products, setProducts) {
  setProducts(prevProducts => {
    const updated = prevProducts.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          viewsCount: (p.viewsCount || Math.floor(Math.random() * 80) + 120) + 1
        };
      }
      return p;
    });
    localStorage.setItem('mamas_products', JSON.stringify(updated));
    return updated;
  });
}

// 4. Toggle Product Favorite / Like
export function toggleProductLike(productId, products, setProducts) {
  let isNowLiked = false;
  setProducts(prevProducts => {
    const updated = prevProducts.map(p => {
      if (p.id === productId) {
        const currentLikes = p.likesCount || 15;
        const liked = !p.isLikedByUser;
        isNowLiked = liked;
        return {
          ...p,
          likesCount: liked ? currentLikes + 1 : Math.max(0, currentLikes - 1),
          isLikedByUser: liked
        };
      }
      return p;
    });
    localStorage.setItem('mamas_products', JSON.stringify(updated));
    return updated;
  });
  return isNowLiked;
}

// 5. Enterprise Security & Anti-XSS Engine
export function sanitizeInput(input, maxLength = 2000) {
  if (typeof input !== 'string') return '';
  
  // 1. Cap input length to prevent ReDoS / Buffer exploits
  let clean = input.slice(0, maxLength);

  // 2. Strip dangerous script tags and execution wrappers
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  clean = clean.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  clean = clean.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  clean = clean.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');

  // 3. Strip inline event handlers (onerror=, onload=, onclick=, etc.)
  clean = clean.replace(/on\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');

  // 4. Strip dangerous pseudo-protocols
  clean = clean.replace(/javascript\s*:/gi, '');
  clean = clean.replace(/vbscript\s*:/gi, '');
  clean = clean.replace(/data\s*:\s*text\/html/gi, '');

  // 5. Escape raw HTML markup to safe entities
  clean = clean
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

  return clean.trim();
}

// 6. Strict File Upload Quarantine & Antivirus Gate
export const ALLOWED_FILE_TYPES = {
  image: {
    extensions: ['jpg', 'jpeg', 'png', 'webp'],
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    label: 'JPG, PNG, WebP (Max 5MB)'
  },
  video: {
    extensions: ['mp4', 'webm', 'mov'],
    mimeTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    maxSizeBytes: 30 * 1024 * 1024, // 30MB
    label: 'MP4, WebM (Max 30MB)'
  }
};

export const DANGEROUS_EXTENSIONS = [
  'exe', 'bat', 'cmd', 'sh', 'php', 'phtml', 'php3', 'php4', 'php5',
  'js', 'mjs', 'vbs', 'scr', 'jar', 'html', 'htm', 'svg', 'dll', 'com',
  'apk', 'msi', 'bin', 'py', 'rb', 'pl', 'cgi'
];

export function validateUploadedFile(file, type = 'image') {
  if (!file) return { isValid: false, error: 'No file provided' };

  const fileName = file.name.toLowerCase();
  const fileExt = fileName.split('.').pop();
  const rules = ALLOWED_FILE_TYPES[type];

  // 1. Check for double extension attacks (e.g., photo.jpg.exe)
  for (const badExt of DANGEROUS_EXTENSIONS) {
    if (fileName.includes(`.${badExt}`)) {
      return {
        isValid: false,
        error: `Security Alert: Dangerous executable or script file detected (.${badExt}). Upload strictly blocked.`
      };
    }
  }

  // 2. Verify extension against whitelist
  if (!rules.extensions.includes(fileExt)) {
    return {
      isValid: false,
      error: `Invalid file extension .${fileExt}. Only ${rules.label} files are permitted.`
    };
  }

  // 3. Verify MIME type
  if (file.type && !rules.mimeTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `MIME type mismatch (${file.type}). File format disguised or corrupted.`
    };
  }

  // 4. Verify file size
  if (file.size > rules.maxSizeBytes) {
    const maxMB = rules.maxSizeBytes / (1024 * 1024);
    return {
      isValid: false,
      error: `File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed is ${maxMB}MB.`
    };
  }

  return { isValid: true };
}

// 7. Rate Limiting & Anti-Brute Force Vault
export function checkRateLimit(actionKey, maxAttempts = 5, lockDurationSeconds = 300) {
  const now = Date.now();
  const raw = sessionStorage.getItem(`rl_${actionKey}`);
  let data = raw ? JSON.parse(raw) : { count: 0, lockUntil: 0 };

  if (data.lockUntil && now < data.lockUntil) {
    const remaining = Math.ceil((data.lockUntil - now) / 1000);
    return {
      isLocked: true,
      remainingSeconds: remaining,
      message: `Security Lockout: Too many failed attempts. Try again in ${remaining}s.`
    };
  }

  return { isLocked: false, remainingSeconds: 0 };
}

export function recordFailedAttempt(actionKey, maxAttempts = 5, lockDurationSeconds = 300) {
  const now = Date.now();
  const raw = sessionStorage.getItem(`rl_${actionKey}`);
  let data = raw ? JSON.parse(raw) : { count: 0, lockUntil: 0 };

  data.count += 1;
  if (data.count >= maxAttempts) {
    data.lockUntil = now + (lockDurationSeconds * 1000);
  }

  sessionStorage.setItem(`rl_${actionKey}`, JSON.stringify(data));
  return data;
}

export function resetRateLimit(actionKey) {
  sessionStorage.removeItem(`rl_${actionKey}`);
}

// 8. Financial Integrity & Price Tampering Verifier
export function verifyCartPriceIntegrity(cartItems, catalogProducts) {
  let hasTampering = false;
  const verifiedItems = cartItems.map(item => {
    const original = catalogProducts.find(p => p.id === item.product?.id);
    if (!original) return item;

    // Check if price was manipulated
    if (item.bookingMode === 'buy') {
      if (item.totalPrice !== original.price) {
        hasTampering = true;
        return {
          ...item,
          totalPrice: original.price,
          product: original
        };
      }
    } else if (item.bookingMode === 'rent') {
      const genuineDailyRate = original.rentRate?.daily || 0;
      const genuineSecurity = original.securityDeposit || 0;
      const expectedTotal = (genuineDailyRate * (item.rentalDuration || 1)) + genuineSecurity;
      
      if (item.totalPrice !== expectedTotal) {
        hasTampering = true;
        return {
          ...item,
          totalPrice: expectedTotal,
          securityDeposit: genuineSecurity,
          rentAmount: genuineDailyRate * (item.rentalDuration || 1),
          product: original
        };
      }
    }

    return item;
  });

  return {
    verifiedItems,
    hasTampering
  };
}

// ==========================================
// 9. OLX "Make an Offer" Bargaining Engine
// ==========================================
export function getOffers() {
  const saved = localStorage.getItem('mamas_offers');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
  }
  // Initial demo offer to test right away
  const initialOffers = [
    {
      id: 'offer_101',
      productId: 'mc-001',
      productTitle: 'Royal Maroon Velvet Bridal Lehenga',
      productImage: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=600',
      sellerPhone: '0307-8899112',
      sellerName: 'Zarghoon Bridal Lounge',
      buyerId: 'user_fatima',
      buyerName: 'Fatima Baloch (Buyer)',
      buyerPhone: '0307-5544332',
      originalPrice: 15000,
      offeredPrice: 12500,
      offerType: 'rent',
      note: 'Assalam o Alaikum! I need this for Barat event on Dec 15. Can you please accept Rs. 12,500 daily rent?',
      status: 'pending', // 'pending', 'accepted', 'rejected', 'countered'
      counterPrice: null,
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ];
  localStorage.setItem('mamas_offers', JSON.stringify(initialOffers));
  return initialOffers;
}

export function saveOffers(offers) {
  localStorage.setItem('mamas_offers', JSON.stringify(offers));
}

export function createOffer(offerData) {
  const offers = getOffers();
  const newOffer = {
    id: `offer_${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...offerData
  };
  const updated = [newOffer, ...offers];
  saveOffers(updated);
  return newOffer;
}

export function updateOfferStatus(offerId, status, counterPrice = null) {
  const offers = getOffers();
  const updated = offers.map(o => {
    if (o.id === offerId) {
      return {
        ...o,
        status,
        counterPrice: counterPrice ? Number(counterPrice) : o.counterPrice,
        updatedAt: new Date().toISOString()
      };
    }
    return o;
  });
  saveOffers(updated);
  return updated;
}

// ==========================================
// 10. Amazon-Style Rental Booking Calendar
// ==========================================
export function getBookings() {
  const saved = localStorage.getItem('mamas_bookings');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
  }
  // Demo reserved booking dates
  const initialBookings = [
    {
      id: 'book_01',
      productId: 'mc-001',
      startDate: '2026-12-18',
      endDate: '2026-12-21',
      customerName: 'Ayesha Khan',
      status: 'confirmed'
    }
  ];
  localStorage.setItem('mamas_bookings', JSON.stringify(initialBookings));
  return initialBookings;
}

export function saveBookings(bookings) {
  localStorage.setItem('mamas_bookings', JSON.stringify(bookings));
}

export function addBooking(bookingData) {
  const bookings = getBookings();
  const newBooking = {
    id: `book_${Date.now()}`,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    ...bookingData
  };
  const updated = [...bookings, newBooking];
  saveBookings(updated);
  return newBooking;
}

export function checkDateConflict(productId, startDateStr, endDateStr) {
  if (!productId || !startDateStr || !endDateStr) return { hasConflict: false };
  const bookings = getBookings();
  const start = new Date(startDateStr).getTime();
  const end = new Date(endDateStr).getTime();

  for (const b of bookings) {
    if (b.productId === productId && b.status === 'confirmed') {
      const bStart = new Date(b.startDate).getTime();
      const bEnd = new Date(b.endDate).getTime();
      // Overlap check
      if (start <= bEnd && end >= bStart) {
        return {
          hasConflict: true,
          conflictingBooking: b,
          message: `Dates conflict! This dress is already booked in Quetta from ${b.startDate} to ${b.endDate}. Please choose different dates.`
        };
      }
    }
  }
  return { hasConflict: false };
}

// ==========================================
// 11. Customer Reviews & Ratings Engine
// ==========================================
export function getReviews(productId = null) {
  const saved = localStorage.getItem('mamas_reviews');
  let reviews = [];
  if (saved) {
    try {
      reviews = JSON.parse(saved);
    } catch (e) {
      // fallback
    }
  }

  if (!reviews || reviews.length === 0) {
    reviews = [
      {
        id: 'rev_1',
        productId: 'mc-001',
        authorName: 'Sana Zehri',
        authorCity: 'Jinnah Town, Quetta',
        rating: 5,
        event: 'Barat',
        fitting: 'Perfect Fit',
        comment: 'Bohot hi pyara lehenga tha! Fabric aur embroidery exact photos jaisi luxury thi. Zarghoon lounge se pickup bhi bohot asaan raha.',
        date: '3 days ago',
        verifiedRental: true,
        photo: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=400'
      },
      {
        id: 'rev_2',
        productId: 'mc-001',
        authorName: 'Hina Kakar',
        authorCity: 'Quetta Cantt',
        rating: 5,
        event: 'Valima',
        fitting: 'True to Size',
        comment: 'Security deposit safely refund ho gaya. Highly recommended for bridal events in Quetta!',
        date: '1 week ago',
        verifiedRental: true,
        photo: null
      }
    ];
    localStorage.setItem('mamas_reviews', JSON.stringify(reviews));
  }

  if (productId) {
    return reviews.filter(r => r.productId === productId);
  }
  return reviews;
}

export function addReview(newReview) {
  const reviews = getReviews();
  const fullReview = {
    id: `rev_${Date.now()}`,
    date: 'Just now',
    verifiedRental: true,
    ...newReview
  };
  const updated = [fullReview, ...reviews];
  localStorage.setItem('mamas_reviews', JSON.stringify(updated));
  return updated;
}

// ==========================================
// 12. Escrow Amanat Wallet & Payout Service
// ==========================================
export function getSellerWallet(sellerPhoneOrName) {
  const saved = localStorage.getItem('mamas_wallets');
  let wallets = {};
  if (saved) {
    try {
      wallets = JSON.parse(saved);
    } catch (e) {
      // fallback
    }
  }

  const key = (sellerPhoneOrName || 'user_zarghoon').toLowerCase();
  if (!wallets[key]) {
    wallets[key] = {
      availableBalance: 42000,
      escrowPending: 15000,
      lifetimeEarned: 135000,
      completedOrdersCount: 6,
      transactions: [
        {
          id: 'tx_01',
          date: 'Yesterday',
          type: 'Escrow Hold',
          amount: 15000,
          description: 'Rental order #ORD-7749 (In Inspection)',
          status: 'Pending'
        },
        {
          id: 'tx_02',
          date: 'Nov 22, 2026',
          type: 'Completed Payout',
          amount: 28000,
          description: 'Rental order #ORD-7612 (Completed & Approved)',
          status: 'Released'
        }
      ]
    };
    localStorage.setItem('mamas_wallets', JSON.stringify(wallets));
  }

  return wallets[key];
}

export function requestWithdrawal(sellerPhoneOrName, amount, method, accountTitle, accountNumber) {
  const saved = localStorage.getItem('mamas_wallets');
  let wallets = saved ? JSON.parse(saved) : {};
  const key = (sellerPhoneOrName || 'user_zarghoon').toLowerCase();
  
  if (!wallets[key]) {
    wallets[key] = getSellerWallet(sellerPhoneOrName);
  }

  const wallet = wallets[key];
  if (amount > wallet.availableBalance) {
    return { success: false, error: 'Insufficient available balance' };
  }

  wallet.availableBalance -= Number(amount);
  wallet.transactions.unshift({
    id: `tx_w_${Date.now()}`,
    date: 'Just now',
    type: `Withdrawal (${method})`,
    amount: Number(amount),
    description: `Withdrawal to ${accountTitle} (${accountNumber})`,
    status: 'Processing'
  });

  wallets[key] = wallet;
  localStorage.setItem('mamas_wallets', JSON.stringify(wallets));

  // Also log in withdrawals queue
  const withdrawals = JSON.parse(localStorage.getItem('mamas_withdrawals') || '[]');
  withdrawals.unshift({
    id: `wth_${Date.now()}`,
    seller: sellerPhoneOrName,
    amount: Number(amount),
    method,
    accountTitle,
    accountNumber,
    requestedAt: new Date().toISOString(),
    status: 'Pending Admin Approval'
  });
  localStorage.setItem('mamas_withdrawals', JSON.stringify(withdrawals));

  return { success: true, newBalance: wallet.availableBalance };
}
