import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  Plus, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Crown, 
  Sparkles, 
  Store, 
  ShoppingBag,
  ArrowRight,
  Check
} from 'lucide-react';
import { QUETTA_AREAS } from '../data/mockData';
import { 
  getAllUserProfiles, 
  saveUserProfile, 
  setActiveUser, 
  sanitizeInput 
} from '../services/marketplaceService';

export default function UserProfileManagerModal({
  isOpen,
  onClose,
  activeUser,
  onSelectUser
}) {
  if (!isOpen) return null;

  const [profiles, setProfiles] = useState(() => getAllUserProfiles());
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // New Profile Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('0307-');
  const [area, setArea] = useState('Jinnah Town');
  const [role, setRole] = useState('buyer'); // 'buyer' or 'seller'
  const [avatarSeed, setAvatarSeed] = useState('1');
  const [error, setError] = useState('');

  const avatarOptions = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200', // Fatima
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200', // Zarghoon
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200', // Samungli
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200', // Girl
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200'  // Boy
  ];

  const handleSwitch = (user) => {
    setActiveUser(user);
    if (onSelectUser) onSelectUser(user);
    onClose();
  };

  const handleCreateProfile = (e) => {
    e.preventDefault();
    const cleanName = sanitizeInput(name);
    if (!cleanName || cleanName.length < 3) {
      setError('Please enter a valid name (at least 3 characters).');
      return;
    }
    const cleanPhone = phone.trim();
    if (cleanPhone.length < 11) {
      setError('Please enter a valid Pakistani phone number (e.g. 0307-1234567).');
      return;
    }

    const newProfile = {
      id: `user_${Date.now()}`,
      name: cleanName,
      phone: cleanPhone,
      area: `${sanitizeInput(area)}, Quetta`,
      cnicVerified: true,
      role: role,
      avatar: avatarOptions[parseInt(avatarSeed) || 0] || avatarOptions[0]
    };

    const updated = saveUserProfile(newProfile);
    setProfiles(updated);
    handleSwitch(newProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-t-[28px] sm:rounded-3xl max-w-xl w-full max-h-[92vh] sm:max-h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-festiva-gold/30 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4A0B16] via-[#6B1222] to-[#4A0B16] text-white p-4 sm:p-5 flex items-center justify-between border-b border-festiva-gold/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-festiva-gold/20 border border-festiva-gold/40 flex items-center justify-center text-festiva-gold shadow-sm font-serif font-bold text-lg">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-base sm:text-lg text-white">
                  Active User Profiles & Testing Hub
                </h2>
                <span className="text-[10px] bg-festiva-gold text-festiva-maroon px-2 py-0.5 rounded-full font-bold uppercase">
                  Multi-Account
                </span>
              </div>
              <p className="text-xs text-white/80">
                Buyer aur Seller profiles aapas mein switch karein ya naya profile banayein
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Active Profile Bar */}
          {activeUser && (
            <div className="bg-gradient-to-r from-festiva-blush via-white to-festiva-blush border border-festiva-gold/40 p-3.5 rounded-2xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <img 
                  src={activeUser.avatar} 
                  alt={activeUser.name} 
                  className="w-11 h-11 rounded-full object-cover border-2 border-festiva-gold shadow"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-bold text-stone-900 text-sm">
                      {activeUser.name}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      activeUser.role === 'seller' 
                        ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      {activeUser.role === 'seller' ? 'Seller (وینڈر)' : 'Buyer (خریدار)'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 flex items-center gap-2 mt-0.5">
                    <span>{activeUser.phone}</span> &bull; 
                    <span className="text-stone-600 font-medium">{activeUser.area}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Active Now</span>
              </div>
            </div>
          )}

          {/* Toggle between list and create new */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <span className="font-serif font-bold text-stone-900 text-sm">
              {isCreatingNew ? 'Create New Realistic Profile' : 'Select Testing Account (Switch in 1-Click)'}
            </span>

            <button
              onClick={() => {
                setIsCreatingNew(!isCreatingNew);
                setError('');
              }}
              className="text-xs font-bold text-festiva-burgundy hover:text-festiva-maroon flex items-center gap-1 bg-festiva-blush hover:bg-festiva-sand px-3 py-1 rounded-xl border border-festiva-sand transition-all"
            >
              {isCreatingNew ? (
                <span>&larr; Back to Profiles</span>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 text-festiva-gold" />
                  <span>+ Create Custom Profile</span>
                </>
              )}
            </button>
          </div>

          {/* View Mode: Profiles List */}
          {!isCreatingNew ? (
            <div className="space-y-2.5">
              {profiles.map((user) => {
                const isActive = activeUser?.id === user.id;
                return (
                  <div
                    key={user.id}
                    onClick={() => handleSwitch(user)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isActive
                        ? 'border-festiva-burgundy bg-festiva-burgundy/5 ring-2 ring-festiva-burgundy/20 shadow-sm'
                        : 'border-stone-200 hover:border-festiva-gold hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-10 h-10 rounded-full object-cover border border-stone-300 group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-sm group-hover:text-festiva-burgundy transition-colors">
                            {user.name}
                          </span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            user.role === 'seller' 
                              ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {user.phone} &bull; {user.area}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isActive ? (
                        <span className="text-xs font-bold text-festiva-burgundy bg-festiva-blush px-2.5 py-1 rounded-lg">
                          Selected
                        </span>
                      ) : (
                        <button className="text-xs font-semibold text-stone-600 group-hover:text-festiva-burgundy flex items-center gap-1">
                          <span>Switch</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Creation Mode: New Profile Form */
            <form onSubmit={handleCreateProfile} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Full Name / Store Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ayesha Wedding Studio, Quetta"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-festiva-blush/40 focus:bg-white border border-stone-200 focus:border-festiva-burgundy rounded-xl p-2.5 text-xs outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Pakistani Mobile Phone:
                  </label>
                  <input
                    type="text"
                    placeholder="0307-1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-festiva-blush/40 focus:bg-white border border-stone-200 focus:border-festiva-burgundy rounded-xl p-2.5 text-xs outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Quetta Area / Location:
                  </label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-festiva-blush/40 focus:bg-white border border-stone-200 focus:border-festiva-burgundy rounded-xl p-2.5 text-xs outline-none"
                  >
                    {QUETTA_AREAS.filter(a => a !== 'All Areas (Quetta)').map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Role Selector: Buyer vs Seller */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Account Purpose / Role:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                      role === 'buyer'
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-900'
                        : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <ShoppingBag className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div>
                      <span className="block font-bold text-xs">Buyer (خریدار)</span>
                      <span className="text-[10px] text-stone-500">Rent dresses, make offers</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('seller')}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                      role === 'seller'
                        ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 text-amber-900'
                        : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <Store className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div>
                      <span className="block font-bold text-xs">Seller (وینڈر)</span>
                      <span className="text-[10px] text-stone-500">Post ads, manage payouts</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Choose Profile Avatar:
                </label>
                <div className="flex items-center gap-2.5">
                  {avatarOptions.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="avatar"
                      onClick={() => setAvatarSeed(idx.toString())}
                      className={`w-10 h-10 rounded-full object-cover cursor-pointer border-2 transition-all ${
                        avatarSeed === idx.toString()
                          ? 'border-festiva-burgundy scale-110 shadow-md ring-2 ring-festiva-gold/40'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-festiva-burgundy via-festiva-maroon to-festiva-burgundy text-white font-bold py-3 rounded-2xl shadow-festive hover:brightness-110 transition-all flex items-center justify-center gap-2 text-xs"
              >
                <Sparkles className="w-4 h-4 text-festiva-gold" />
                <span>Save & Activate This Profile (پروفائل چالو کریں)</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
