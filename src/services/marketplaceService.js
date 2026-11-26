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
  return DEFAULT_USERS[0]; // Zarghoon Boutique by default
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
