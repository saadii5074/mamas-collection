import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, X, Crown, AlertCircle } from 'lucide-react';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  if (!isOpen) return null;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      // Valid credentials: admin/mamas/saadii with mamas123 or quetta2026
      const validUsers = ['admin', 'mamas', 'saadii'];
      const validPass = ['mamas123', 'quetta2026', 'admin123'];

      if (validUsers.includes(username.trim().toLowerCase()) && validPass.includes(password.trim())) {
        setLoading(false);
        onLoginSuccess();
        onClose();
      } else {
        setLoading(false);
        setError('Ghalat Username ya Password! Default: Username "admin" aur Password "mamas123" use karein.');
      }
    }, 400);
  };

  const handleQuickDemoFill = () => {
    setUsername('admin');
    setPassword('mamas123');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-festiva-gold/30 transform transition-all animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Festiva Luxury Brand */}
        <div className="bg-gradient-to-r from-[#4A0B16] via-[#6B1222] to-[#4A0B16] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-festiva-gold/20 border border-festiva-gold/40 flex items-center justify-center text-festiva-gold shadow-inner">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xl text-festiva-lightgold">
                  Mamas Collection
                </span>
                <span className="text-[10px] uppercase tracking-wider bg-festiva-gold text-festiva-maroon font-extrabold px-2 py-0.5 rounded-full">
                  Quetta HQ
                </span>
              </div>
              <p className="text-xs text-white/80">Super Admin Authentication Portal</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-center pb-2">
            <h2 className="font-serif font-bold text-lg text-stone-900">
              Admin Control Room Login
            </h2>
            <p className="text-xs text-stone-500">
              Baraye meherbani Super Admin access ke liye credentials enter karein.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-red-700 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Admin Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                autoFocus
                placeholder="e.g. admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-3 py-2.5 text-sm text-stone-900 outline-none focus:border-festiva-burgundy focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-stone-700">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-stone-900 outline-none focus:border-festiva-burgundy focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 p-0.5"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-festiva-burgundy to-festiva-maroon hover:from-festiva-maroon hover:to-festiva-burgundy text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-festiva-burgundy/25 transition-all flex items-center justify-center gap-2 group active:scale-98"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-festiva-lightgold" />
                <span>Verify & Open Control Room</span>
              </>
            )}
          </button>

          {/* Demo Helper Box */}
          <div className="bg-amber-50/80 border border-amber-200/70 rounded-2xl p-3 flex items-center justify-between gap-2 text-xs">
            <div className="text-amber-900">
              <p className="font-bold">Demo Login Credentials:</p>
              <p className="text-[11px] text-amber-700 font-mono">User: <b>admin</b> | Pass: <b>mamas123</b></p>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold px-2.5 py-1.5 rounded-lg text-[11px] transition-colors whitespace-nowrap"
            >
              Auto Fill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
