import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  ShieldCheck, 
  Sparkles, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Ruler,
  AlertCircle,
  Camera,
  Video,
  Trash2,
  Film,
  Image as ImageIcon
} from 'lucide-react';
import { QUETTA_AREAS, EVENT_CATEGORIES, COLOR_PALETTE } from '../data/mockData';
import WhatsAppIcon from './WhatsAppIcon';

export default function SellerPortalModal({ isOpen, onClose, onAddListing }) {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [titleUrdu, setTitleUrdu] = useState('');
  const [category, setCategory] = useState('bridal');
  const [listingType, setListingType] = useState('rent'); // 'rent', 'buy', 'both'
  const [eventType, setEventType] = useState('barat');
  const [selectedColor, setSelectedColor] = useState('Deep Maroon');
  const [quettaArea, setQuettaArea] = useState('Satellite Town');
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerCnic, setSellerCnic] = useState('');
  const [condition, setCondition] = useState('Worn Once (9.5/10)');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFileName, setVideoFileName] = useState('');
  
  // Pricing
  const [salePrice, setSalePrice] = useState('');
  const [dailyRent, setDailyRent] = useState('');
  const [hourlyRent, setHourlyRent] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  
  // Measurements
  const [chest, setChest] = useState('38 inches');
  const [waist, setWaist] = useState('32 inches');
  const [length, setLength] = useState('48 inches');
  const [flare, setFlare] = useState('140 inches');
  const [alterationMargin, setAlterationMargin] = useState('2 inches inner margin');

  const [selectedSizes, setSelectedSizes] = useState(['M']);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleToggleSize = (size) => {
    if (selectedSizes.includes(size)) {
      if (selectedSizes.length > 1) {
        setSelectedSizes(selectedSizes.filter(s => s !== size));
      }
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleImageFiles = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => {
          if (prev.length >= 6) return prev;
          return [...prev, reader.result];
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleMakeCover = (index) => {
    if (index === 0) return;
    setImages(prev => {
      const copy = [...prev];
      const selected = copy.splice(index, 1)[0];
      return [selected, ...copy];
    });
  };

  const handleVideoFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideoFileName(file.name);
    const videoObjUrl = URL.createObjectURL(file);
    setVideoUrl(videoObjUrl);
  };

  const handleRemoveVideo = () => {
    setVideoUrl('');
    setVideoFileName('');
  };

  const handleAddSamplePhotos = () => {
    if (category === 'cars') {
      setImages([
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800',
        'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=800',
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800',
        'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=800'
      ]);
    } else if (category === 'jewellery') {
      setImages([
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800',
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800',
        'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?q=80&w=800'
      ]);
    } else {
      setImages([
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800',
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800',
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800',
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800'
      ]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !sellerName.trim() || !sellerPhone.trim() || !sellerCnic.trim()) {
      setErrorMsg('Please fill in Item Title, Your Name, Phone Number, and CNIC.');
      return;
    }

    if (listingType === 'rent') {
      if (!dailyRent || !securityDeposit) {
        setErrorMsg('Please specify the Daily Rent and Security Deposit amount.');
        return;
      }
    } else if (listingType === 'buy') {
      if (!salePrice) {
        setErrorMsg('Please specify the Full Selling Price.');
        return;
      }
    }

    const defaultImg = category === 'cars' 
      ? 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=800&auto=format&fit=crop'
      : category === 'furniture'
      ? 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop'
      : category === 'jewellery'
      ? 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop'
      : 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop';

    const colorObj = COLOR_PALETTE.find(c => c.name === selectedColor) || { name: selectedColor, hex: '#800000' };

    const finalImages = images.length > 0 ? images : [imageUrl.trim() || defaultImg];

    const newListing = {
      id: `MC-QTA-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      titleUrdu: titleUrdu.trim() || title.trim(),
      category,
      isOfficial: false,
      listingType, // strictly 'rent' or 'buy'
      eventType,
      price: listingType === 'buy' ? Number(salePrice) : 0,
      rentRate: listingType === 'rent' ? {
        hourly: Number(hourlyRent) || Math.round(Number(dailyRent) / 6),
        daily: Number(dailyRent),
        monthly: Number(monthlyRent) || Number(dailyRent) * 18
      } : null,
      originalPrice: Number(originalPrice) || (listingType === 'rent' ? Number(dailyRent) * 15 : Number(salePrice)),
      securityDeposit: listingType === 'rent' ? (Number(securityDeposit) || Math.round(Number(dailyRent) * 1.5)) : 0,
      color: colorObj,
      sizes: selectedSizes,
      measurements: category === 'bridal' || category === 'garments' ? {
        chest,
        waist,
        length,
        flare,
        alterationMargin
      } : null,
      quettaArea,
      vendor: {
        name: sellerName.trim(),
        isOfficial: false,
        phone: sellerPhone.trim(),
        verified: true,
        city: 'Quetta'
      },
      images: finalImages,
      video: videoUrl || null,
      rating: 5.0,
      reviewsCount: 0,
      viewsCount: 1,
      likesCount: 0,
      inquiriesCount: 0,
      status: 'Active',
      inStock: true,
      condition,
      featured: false,
      description: description.trim() || 'Listed on Mamas Collection Quetta verified marketplace.'
    };

    onAddListing(newListing);
    setSubmittedSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-festiva-sand my-8 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-festiva-sand bg-gradient-to-r from-festiva-maroon via-festiva-burgundy to-festiva-maroon text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-festiva-gold" />
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-white">
                Post Item for Rent or Sale in Quetta
              </h2>
              <p className="text-[11px] text-festiva-lightgold font-medium">
                اپنی برائیڈل سوٹ، زیورات یا فرنیچر کرائے پر دیں اور کمائیں
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {submittedSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-serif font-bold text-xl text-stone-900">
              Listing Submitted Successfully! 🎉
            </h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
              Aapki item <b>Mamas Collection Quetta</b> par live kar di gayi hai! Khas tor par Quetta ke buyers aur renters aap se direct WhatsApp par rabta kar sakenge.
            </p>
            <button
              onClick={() => {
                setSubmittedSuccess(false);
                onClose();
              }}
              className="bg-festiva-burgundy text-white font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-festiva-maroon transition-all shadow-sm"
            >
              View in Quetta Catalog
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1 text-xs text-stone-800">
            
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Step 1: Basic Item Info */}
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-1.5 border-b pb-1.5">
                <Sparkles className="w-4 h-4 text-festiva-gold" />
                <span>1. Item Information (چیز کی تفصیلات)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 mb-1">
                    Item Title (e.g. Red Velvet Barat Bridal Lehenga) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter attractive title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 outline-none focus:border-festiva-burgundy"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Urdu Title (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="مثلاً: ریڈ ویلوٹ بارات برائیڈل لہنگا"
                    value={titleUrdu}
                    onChange={(e) => setTitleUrdu(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 outline-none focus:border-festiva-burgundy font-urdu"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 outline-none focus:border-festiva-burgundy"
                  >
                    <option value="bridal">Bridal Lehengas & Gowns</option>
                    <option value="garments">Ladies Garments & Suits</option>
                    <option value="jewellery">Bridal Jewellery Sets</option>
                    <option value="cars">Wedding Cars (Barat Rent)</option>
                    <option value="furniture">Stage Furniture & Decor</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Listing Purpose (کیا کرنا چاہتے ہیں؟) *
                  </label>
                  <select
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 outline-none focus:border-festiva-burgundy font-bold text-festiva-burgundy"
                  >
                    <option value="rent">🔵 Only For Rent (صرف کرائے پر دینا ہے)</option>
                    <option value="buy">🟢 Only For Sale (صرف مکمل فروخت کرنا ہے)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Event / Occasion *
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 outline-none focus:border-festiva-burgundy"
                  >
                    <option value="barat">Barat (بارات)</option>
                    <option value="valima">Valima (ولیمہ)</option>
                    <option value="mehndi">Mehndi & Mayun (مہندی)</option>
                    <option value="nikkah">Nikkah (نکاح)</option>
                    <option value="party">Party & Qawwali (پارٹی)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Primary Color *
                  </label>
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 outline-none focus:border-festiva-burgundy"
                  >
                    {COLOR_PALETTE.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Condition (حالت) *
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 outline-none focus:border-festiva-burgundy"
                  >
                    <option value="Brand New (10/10)">Brand New (10/10)</option>
                    <option value="Worn Once (9.5/10)">Worn Once for Event (9.5/10)</option>
                    <option value="Like New (9/10)">Like New (9/10)</option>
                    <option value="Good Condition (8/10)">Good Condition (8/10)</option>
                  </select>
                </div>

                {/* Step 1.5: Multi-Photo & Video Showcase */}
                <div className="sm:col-span-2 pt-2 border-t border-stone-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="flex items-center gap-1.5 font-bold text-stone-800 text-sm">
                        <Camera className="w-4 h-4 text-festiva-burgundy" />
                        <span>Product Photos (کم از کم 4 سے 5 تصاویر لازمی ہیں) *</span>
                      </label>
                      <p className="text-[11px] text-stone-500">
                        Front, Back, Embroidery / Fabric close-up, and Flare view. Total: {images.length} photos selected.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddSamplePhotos}
                      className="text-[11px] text-festiva-burgundy bg-festiva-cream hover:bg-festiva-sand/40 border border-festiva-gold/40 px-2.5 py-1 rounded-lg font-bold transition-colors whitespace-nowrap"
                    >
                      + Load 5 High-Res Samples
                    </button>
                  </div>

                  {/* Multi-Photo Upload Dropzone */}
                  <div className="border-2 border-dashed border-festiva-gold/40 rounded-2xl p-4 bg-festiva-cream/30 hover:bg-festiva-cream/60 transition-colors text-center">
                    <input
                      type="file"
                      id="seller-multi-images"
                      multiple
                      accept="image/*"
                      onChange={handleImageFiles}
                      className="hidden"
                    />
                    <label 
                      htmlFor="seller-multi-images" 
                      className="cursor-pointer flex flex-col items-center justify-center gap-2"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white border border-festiva-gold/40 flex items-center justify-center text-festiva-burgundy shadow-sm">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-festiva-burgundy hover:underline">
                          Click to Browse or Drag 4-5 Photos
                        </span>
                        <p className="text-[10px] text-stone-500">PNG, JPG, WEBP up to 10MB each</p>
                      </div>
                    </label>
                  </div>

                  {/* Photo Preview Strip (Minimum 4-5 photo slots) */}
                  {images.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-stone-600 font-medium">
                        <span>Selected Photos ({images.length} of 5+):</span>
                        <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                          {images.length >= 4 ? '✓ Recommended quota met' : `Need ${4 - images.length} more for best trust`}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                        {images.map((img, idx) => (
                          <div 
                            key={idx} 
                            className="relative group rounded-xl overflow-hidden border-2 border-stone-200 bg-stone-100 aspect-square shadow-sm"
                          >
                            <img 
                              src={img} 
                              alt={`Preview ${idx + 1}`} 
                              className="w-full h-full object-cover"
                            />

                            {/* Badge */}
                            <span className={`absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded shadow ${
                              idx === 0 
                                ? 'bg-festiva-burgundy text-white' 
                                : 'bg-black/60 text-white'
                            }`}>
                              {idx === 0 ? 'Cover Photo' : `#${idx + 1}`}
                            </span>

                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full opacity-80 group-hover:opacity-100 transition-opacity shadow"
                              title="Delete this image"
                            >
                              <X className="w-3 h-3" />
                            </button>

                            {/* Make Cover Button */}
                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleMakeCover(idx)}
                                className="absolute bottom-1 left-1 right-1 bg-black/75 hover:bg-festiva-burgundy text-white text-[9px] font-bold py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity text-center"
                              >
                                Make Cover
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Video Upload Section */}
                  <div className="pt-3 border-t border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-1.5 font-bold text-stone-800 text-sm">
                        <Video className="w-4 h-4 text-festiva-burgundy" />
                        <span>Product Video Clip (ویڈیو کلپ)</span>
                      </label>
                      <span className="text-[10px] text-stone-500 uppercase tracking-wider font-bold bg-stone-100 px-2 py-0.5 rounded">
                        Optional (360° dress flare / car sound)
                      </span>
                    </div>

                    {!videoUrl ? (
                      <div className="border border-stone-200 rounded-xl p-3 bg-stone-50 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs text-stone-600">
                          <Film className="w-4 h-4 text-stone-400" />
                          <span>Short video clip upload karein (MP4 / WebM)</span>
                        </div>
                        <label 
                          htmlFor="seller-video-upload" 
                          className="cursor-pointer bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <Video className="w-3.5 h-3.5 text-festiva-burgundy" />
                          <span>Choose Video File</span>
                        </label>
                        <input
                          type="file"
                          id="seller-video-upload"
                          accept="video/mp4,video/webm,video/quicktime"
                          onChange={handleVideoFile}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div className="border border-emerald-200 bg-emerald-50/50 rounded-2xl p-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Video Uploaded: {videoFileName || 'item-preview.mp4'}</span>
                          </span>
                          <button
                            type="button"
                            onClick={handleRemoveVideo}
                            className="text-red-600 hover:text-red-700 font-bold text-xs flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Video</span>
                          </button>
                        </div>
                        <video 
                          src={videoUrl} 
                          controls 
                          className="w-full max-h-48 rounded-xl bg-black shadow-inner"
                        />
                      </div>
                    )}
                  </div>

                  {/* Fallback Image URL */}
                  <div className="pt-2">
                    <label className="block text-[11px] font-bold text-stone-500 mb-1">
                      Or Online Image Link (Optional alternative):
                    </label>
                    <input
                      type="url"
                      placeholder="https://... (agar direct online link use karna ho)"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-900 outline-none focus:border-festiva-burgundy"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Pricing & Rental Rates */}
            <div className="space-y-3 pt-2">
              <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-1.5 border-b pb-1.5">
                <Clock className="w-4 h-4 text-festiva-gold" />
                <span>2. Pricing & Rental Rates (کرایہ اور قیمت)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {listingType === 'rent' ? (
                  <>
                    <div>
                      <label className="block font-bold text-festiva-burgundy mb-1">
                        Daily Rent (روپے فی دن) *
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 10000"
                        value={dailyRent}
                        onChange={(e) => setDailyRent(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 font-bold outline-none focus:border-festiva-burgundy"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">
                        Hourly Rent (فی گھنٹہ)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 1500"
                        value={hourlyRent}
                        onChange={(e) => setHourlyRent(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 outline-none focus:border-festiva-burgundy"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-amber-800 mb-1">
                        Security Deposit (واپسی سیکیورٹی ڈپازٹ) *
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 15000"
                        value={securityDeposit}
                        onChange={(e) => setSecurityDeposit(e.target.value)}
                        className="w-full bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-stone-900 font-bold outline-none focus:border-festiva-burgundy"
                      />
                    </div>
                  </>
                ) : (
                  <div className="sm:col-span-3">
                    <label className="block font-bold text-emerald-800 mb-1">
                      Full Selling Price (مکمل فروخت کی قیمت - روپے) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 85000"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      className="w-full sm:w-1/2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 font-bold outline-none focus:border-festiva-burgundy"
                    />
                    <p className="text-[11px] text-stone-500 mt-1">
                      یہ چیز خریدار کو مستقل طور پر فروخت کر دی جائے گی۔ اس پر کوئی کرایہ یا واپسی ڈپازٹ لاگو نہیں ہوگا۔
                    </p>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Original Retail Value (اصل مارکیٹ قیمت)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 150000"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 outline-none focus:border-festiva-burgundy"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Quetta Location & Host Details */}
            <div className="space-y-3 pt-2">
              <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-1.5 border-b pb-1.5">
                <MapPin className="w-4 h-4 text-festiva-gold" />
                <span>3. Quetta Location & Verification Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Quetta Area (علاقہ) *
                  </label>
                  <select
                    value={quettaArea}
                    onChange={(e) => setQuettaArea(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 outline-none focus:border-festiva-burgundy"
                  >
                    {QUETTA_AREAS.filter(a => a !== "All Areas (Quetta)").map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Your Name / Boutique Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zara Bridal Studio"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 outline-none focus:border-festiva-burgundy"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 font-bold text-stone-700 mb-1">
                    <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp Phone Number *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0307-0816990"
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 outline-none focus:border-festiva-burgundy"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    CNIC for Verified Host Badge *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="54400-XXXXXXX-X"
                    value={sellerCnic}
                    onChange={(e) => setSellerCnic(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 outline-none focus:border-festiva-burgundy"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-festiva-gold to-amber-600 hover:from-amber-600 hover:to-festiva-gold text-festiva-maroon hover:text-white font-bold py-3.5 px-4 rounded-2xl shadow-festive transition-all flex items-center justify-center gap-2 transform active:scale-95 text-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publish Listing on Mamas Collection Quetta</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
