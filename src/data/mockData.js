export const QUETTA_AREAS = [
  "All Areas (Quetta)",
  "Jinnah Road",
  "Satellite Town",
  "Quetta Cantt",
  "Zarghoon Road",
  "Model Town",
  "Shahbaz Town",
  "Brewery Road",
  "Samungli Road",
  "Nawan Killi",
  "Chiltan Housing",
  "Airport Road",
  "Joint Road"
];

export const EVENT_CATEGORIES = [
  { id: 'all', name: 'All Events', labelUrdu: 'تمام فنکشنز' },
  { id: 'barat', name: 'Barat (بارات)', desc: 'Heavy Bridal Lehengas & Sherwanis', color: '#851A2E' },
  { id: 'valima', name: 'Valima (ولیمہ)', desc: 'Modern Pastels, Maxis & Gowns', color: '#2C5E55' },
  { id: 'mehndi', name: 'Mehndi & Mayun (مہندی)', desc: 'Mustard Yellows & Festive Gota', color: '#C59B27' },
  { id: 'nikkah', name: 'Nikkah (نکاح)', desc: 'Graceful Whites, Ivory & Soft Gold', color: '#938173' },
  { id: 'party', name: 'Party & Qawwali (پارٹی)', desc: 'Velvet, Silk & Formal Wear', color: '#4A154B' }
];

export const COLOR_PALETTE = [
  { name: 'Deep Maroon', hex: '#6B1222' },
  { name: 'Bridal Red', hex: '#C41E3A' },
  { name: 'Emerald Green', hex: '#097969' },
  { name: 'Mustard Gold', hex: '#D4AF37' },
  { name: 'Pastel Pink', hex: '#F4C2C2' },
  { name: 'Ice Blue', hex: '#87CEEB' },
  { name: 'Royal Plum', hex: '#4B0082' },
  { name: 'Ivory / Off-White', hex: '#FFFFF0', border: true },
  { name: 'Midnight Black', hex: '#1C1917' }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'MC-101',
    title: 'Royal Noor Zardozi Bridal Lehenga (Barat Edition)',
    titleUrdu: 'شاہی نور زردوزی برائیڈل لہنگا',
    category: 'bridal',
    isOfficial: true,
    listingType: 'both', // buy or rent
    eventType: 'barat',
    price: 185000,
    rentRate: {
      hourly: 2000,
      daily: 14000,
      monthly: 110000
    },
    originalPrice: 195000,
    securityDeposit: 25000,
    color: { name: 'Deep Maroon', hex: '#6B1222' },
    sizes: ['S', 'M', 'L'],
    measurements: {
      chest: '38 inches',
      waist: '32 inches',
      length: '46 inches',
      flare: '160 inches',
      alterationMargin: '2.5 inches inner margin available'
    },
    quettaArea: 'Quetta Cantt',
    vendor: {
      name: "Mamas Collection Official",
      isOfficial: true,
      phone: "+923070816990",
      verified: true,
      city: "Quetta"
    },
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop'
    ],
    rating: 4.9,
    reviewsCount: 38,
    inStock: true,
    condition: 'Brand New (10/10)',
    featured: true,
    description: 'Pure velvet and raw silk with intricate dabka, kora, and zardozi hand embroidery. Specially crafted for Barat brides looking for majestic elegance.'
  },
  {
    id: 'MC-102',
    title: 'Champagne Trail Fairy Maxi for Valima',
    titleUrdu: 'شیمپین ٹریل فیری ولیمہ میکسی',
    category: 'bridal',
    isOfficial: true,
    listingType: 'both',
    eventType: 'valima',
    price: 145000,
    rentRate: {
      hourly: 1500,
      daily: 11000,
      monthly: 85000
    },
    originalPrice: 150000,
    securityDeposit: 20000,
    color: { name: 'Pastel Pink', hex: '#F4C2C2' },
    sizes: ['XS', 'S', 'M'],
    measurements: {
      chest: '36 inches',
      waist: '30 inches',
      length: '60 inches (with 20 inch trail)',
      flare: '180 inches',
      alterationMargin: '2 inches margin'
    },
    quettaArea: 'Model Town',
    vendor: {
      name: "Mamas Collection Official",
      isOfficial: true,
      phone: "+923070816990",
      verified: true,
      city: "Quetta"
    },
    images: [
      'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop'
    ],
    rating: 5.0,
    reviewsCount: 24,
    inStock: true,
    condition: 'Brand New (10/10)',
    featured: true,
    description: 'Enchanting champagne and powder rose gown with silver crystal work and 3D floral pearls. Ideal for modern receptions.'
  },
  {
    id: 'MC-103',
    title: 'Mustard Gota Pishwas & Chunri Lehenga (Mehndi)',
    titleUrdu: 'مسٹرڈ گوٹا پیشواس و چنری لہنگا (مہندی)',
    category: 'garments',
    isOfficial: false,
    listingType: 'rent',
    eventType: 'mehndi',
    price: 68000,
    rentRate: {
      hourly: 900,
      daily: 6500,
      monthly: 45000
    },
    originalPrice: 72000,
    securityDeposit: 10000,
    color: { name: 'Mustard Gold', hex: '#D4AF37' },
    sizes: ['S', 'M'],
    measurements: {
      chest: '37 inches',
      waist: '31 inches',
      length: '52 inches',
      flare: '140 inches',
      alterationMargin: '1.5 inches'
    },
    quettaArea: 'Jinnah Road',
    vendor: {
      name: "Fatima's Bridal Wardrobe",
      isOfficial: false,
      phone: "+923337890123",
      verified: true,
      city: "Quetta"
    },
    images: [
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop'
    ],
    rating: 4.8,
    reviewsCount: 16,
    inStock: true,
    condition: 'Worn Once (9.5/10)',
    featured: false,
    description: 'Worn only for 4 hours at sister wedding. Authentic gota tilla and mirror work on pure organza with traditional bandhani chunri dupatta.'
  },
  {
    id: 'MC-104',
    title: 'Ivory Sheer Organza Nikkah Gharara Suit',
    titleUrdu: 'آئیوری آرگنزا نکاح غرارہ سوٹ',
    category: 'garments',
    isOfficial: true,
    listingType: 'both',
    eventType: 'nikkah',
    price: 88000,
    rentRate: {
      hourly: 1200,
      daily: 8000,
      monthly: 55000
    },
    originalPrice: 92000,
    securityDeposit: 15000,
    color: { name: 'Ivory / Off-White', hex: '#FFFFF0' },
    sizes: ['M', 'L'],
    measurements: {
      chest: '40 inches',
      waist: '34 inches',
      length: '38 inches (Gharara: 42 inches)',
      flare: 'Gharara flare 70 inches each leg',
      alterationMargin: '2 inches margin'
    },
    quettaArea: 'Satellite Town',
    vendor: {
      name: "Mamas Collection Official",
      isOfficial: true,
      phone: "+923070816990",
      verified: true,
      city: "Quetta"
    },
    images: [
      'https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=800&auto=format&fit=crop'
    ],
    rating: 4.9,
    reviewsCount: 19,
    inStock: true,
    condition: 'Brand New (10/10)',
    featured: false,
    description: 'Subtle ivory elegance with hand-threaded pearls, sitara sequins, and antique champagne border. Breath-taking photography appeal.'
  },
  {
    id: 'MC-105',
    title: 'Royal Dehn Al-Oud & Rose Attar (Exclusive Mamas Perfume)',
    titleUrdu: 'شاہی دہن العود و عطر گلاب (ماماس سپیشل)',
    category: 'perfumes',
    isOfficial: true,
    listingType: 'buy', // Sale only
    eventType: 'party',
    price: 7500,
    rentRate: null,
    originalPrice: 8500,
    securityDeposit: 0,
    color: { name: 'Mustard Gold', hex: '#D4AF37' },
    sizes: ['50ml Spray', '12ml Concentrated Oil'],
    measurements: null,
    quettaArea: 'Jinnah Road',
    vendor: {
      name: "Mamas Collection Official",
      isOfficial: true,
      phone: "+923070816990",
      verified: true,
      city: "Quetta"
    },
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop'
    ],
    rating: 5.0,
    reviewsCount: 42,
    inStock: true,
    condition: 'Sealed Box',
    featured: true,
    description: 'Long-lasting signature oriental fragrance blended with pure Cambodian oud, Taif rose, and warm amber notes. Lasts over 24 hours on wedding garments.'
  },
  {
    id: 'MC-106',
    title: '24K Gold-Plated Bridal Kundan & Polki Jewellery Set',
    titleUrdu: '۲۴ قیراط کندن و پولکی برائیڈل جیولری سیٹ',
    category: 'jewellery',
    isOfficial: true,
    listingType: 'both',
    eventType: 'barat',
    price: 52000,
    rentRate: {
      hourly: 800,
      daily: 5000,
      monthly: 32000
    },
    originalPrice: 55000,
    securityDeposit: 10000,
    color: { name: 'Mustard Gold', hex: '#D4AF37' },
    sizes: ['Free Size (Adjustable Dori)'],
    measurements: {
      chest: 'N/A',
      waist: 'N/A',
      length: 'Necklace + Choker + Jhumar + Tikka + Earrings',
      flare: 'Full Bridal Set',
      alterationMargin: 'Fully adjustable cord'
    },
    quettaArea: 'Shahbaz Town',
    vendor: {
      name: "Mamas Collection Official",
      isOfficial: true,
      phone: "+923070816990",
      verified: true,
      city: "Quetta"
    },
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop'
    ],
    rating: 4.9,
    reviewsCount: 31,
    inStock: true,
    condition: 'Pristine (10/10)',
    featured: false,
    description: 'Complete 7-piece royal bridal jewelry set featuring semi-precious emerald drops, real freshwater pearls, and handcrafted polki work.'
  },
  {
    id: 'MC-107',
    title: 'Decorated White Honda Civic RS for Barat Rent',
    titleUrdu: 'بارات کے لیے ڈیکوریٹڈ سفید ہونڈا سیوک',
    category: 'cars',
    isOfficial: false,
    listingType: 'rent',
    eventType: 'barat',
    price: 0,
    rentRate: {
      hourly: 2500,
      daily: 16000,
      monthly: 180000
    },
    originalPrice: 8500000,
    securityDeposit: 30000,
    color: { name: 'Ivory / Off-White', hex: '#FFFFF0' },
    sizes: ['With Driver Included'],
    measurements: null,
    quettaArea: 'Samungli Road',
    vendor: {
      name: "Quetta Royal Motors & Rentals",
      isOfficial: false,
      phone: "+923129876543",
      verified: true,
      city: "Quetta"
    },
    images: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=800&auto=format&fit=crop'
    ],
    rating: 4.9,
    reviewsCount: 15,
    inStock: true,
    condition: 'Luxury Decorated (10/10)',
    featured: false,
    description: 'Fresh floral decoration included. Chauffeur driven, AC chilled, fully maintained for Quetta Barat entry. Fuel included for city limits.'
  },
  {
    id: 'MC-108',
    title: 'Antique Sheesham Bridal Stage Sofa & Chairs Set',
    titleUrdu: 'قدیم شیشم برائیڈل سٹیج صوفہ سیٹ',
    category: 'furniture',
    isOfficial: false,
    listingType: 'rent',
    eventType: 'barat',
    price: 120000,
    rentRate: {
      hourly: 1800,
      daily: 12000,
      monthly: 90000
    },
    originalPrice: 160000,
    securityDeposit: 25000,
    color: { name: 'Deep Maroon', hex: '#6B1222' },
    sizes: ['3-Seater + 2 Royal Chairs'],
    measurements: null,
    quettaArea: 'Zarghoon Road',
    vendor: {
      name: "Balochistan Heritage Furniture",
      isOfficial: false,
      phone: "+923214567890",
      verified: true,
      city: "Quetta"
    },
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop'
    ],
    rating: 4.7,
    reviewsCount: 9,
    inStock: true,
    condition: 'Restored Heritage (9/10)',
    featured: false,
    description: 'Solid Sheesham wood carved with royal gold leaf polish and crimson velvet tufting. Transport delivery available within Quetta.'
  }
];

export const INITIAL_COMMISSION_RATES = {
  rentalCommissionPercent: 18, // 18% cut on P2P rentals
  saleCommissionPercent: 10,   // 10% cut on P2P sales
  officialStoreCommission: 0   // 0% on Mamas Collection own products
};

export const PAYMENT_METHODS = [
  {
    id: 'easypaisa',
    name: 'EasyPaisa',
    accountTitle: 'Mamas Collection (Saadii)',
    accountNumber: '0307-0816990',
    instructions: 'Send payment to EasyPaisa and enter Transaction ID (TRX ID).'
  },
  {
    id: 'jazzcash',
    name: 'JazzCash',
    accountTitle: 'Mamas Collection (Saadii)',
    accountNumber: '0307-0816990',
    instructions: 'Send payment to JazzCash and enter Transaction ID (TRX ID).'
  },
  {
    id: 'bank',
    name: 'Direct Bank Transfer (Meezan / HBL Quetta)',
    accountTitle: 'Mamas Collection Quetta',
    accountNumber: '0102030405060708',
    iban: 'PK36MEZN0001020304050607',
    instructions: 'Transfer online and upload or attach transfer reference.'
  },
  {
    id: 'cod',
    name: 'Cash on Delivery / Pickup (Quetta Only)',
    accountTitle: 'Quetta Hand-to-Hand',
    accountNumber: 'Pay at Delivery',
    instructions: 'Pay cash when item is delivered to your Quetta address or upon pickup.'
  }
];
