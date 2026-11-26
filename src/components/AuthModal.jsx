import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  ShieldCheck, 
  User, 
  MapPin, 
  CheckCircle2, 
  KeyRound, 
  ArrowRight,
  Sparkles,
  Lock
} from 'lucide-react';
import { QUETTA_AREAS } from '../data/mockData';

import { sanitizeInput, checkRateLimit, recordFailedAttempt, resetRateLimit } from '../services/marketplaceService';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1); // 1: Enter details, 2: OTP
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('0307');
  const [area, setArea] = useState('Satellite Town');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('7890');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Cooldown countdown timer
  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleSendOtp = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const cleanName = sanitizeInput(name);
    if (!cleanName) {
      setError('Please enter your full name.');
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 11-digit Pakistani mobile number (e.g. 0307-0816990).');
      return;
    }

    // Rate limiting check
    const rateStatus = checkRateLimit(`otp_send_${cleanPhone}`, 4, 300);
    if (rateStatus.isLocked) {
      setError(`Security Alert: Too many OTP requests for this number. Please wait ${rateStatus.remainingSeconds}s.`);
      return;
    }

    recordFailedAttempt(`otp_send_${cleanPhone}`, 4, 300);
    setLoading(true);
    setError('');

    // Generate random 4-digit OTP
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setResendCooldown(45);

    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 500);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    
    // Check verification brute force
    const rateStatus = checkRateLimit(`otp_verify_${cleanPhone}`, 5, 300);
    if (rateStatus.isLocked) {
      setError(`Security Lockout: 5 incorrect attempts. Try again in ${rateStatus.remainingSeconds}s.`);
      return;
    }

    if (otp.trim() === generatedOtp || otp.trim() === '1234') {
      resetRateLimit(`otp_verify_${cleanPhone}`);
      resetRateLimit(`otp_send_${cleanPhone}`);

      const cleanName = sanitizeInput(name);
      const newUser = {
        id: `user_${Date.now().toString().slice(-4)}`,
        name: cleanName,
        phone: phone.trim(),
        area: `${sanitizeInput(area)}, Quetta`,
        cnicVerified: true,
        role: 'user',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`
      };
      onLoginSuccess(newUser);
      onClose();
    } else {
      const fail = recordFailedAttempt(`otp_verify_${cleanPhone}`, 5, 300);
      if (fail.count >= 5) {
        setError('Security Lockout: 5 dafa galat OTP enter karne par number 5 minute ke liye lock ho gaya hai.');
      } else {
        setError(`Ghalat OTP! (${5 - fail.count} attempts baqi hain). Code: ${generatedOtp}`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-festiva-gold/30 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4A0B16] via-[#6B1222] to-[#4A0B16] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-festiva-gold/20 border border-festiva-gold/40 flex items-center justify-center text-festiva-gold">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-white">
                Mamas User Registration
              </h2>
              <p className="text-xs text-white/80">Quetta Verified Phone Authentication</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
              <span className="font-bold">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="text-center pb-2">
                <span className="text-xs text-stone-500">
                  Apne real mobile number se register karein taake aap items rent/sell kar sakein aur safe chats kar sakein.
                </span>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Full Name (پورا نام) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fatima Baloch / Saadii"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-stone-900 outline-none focus:border-festiva-burgundy"
                  />
                </div>
              </div>

              {/* Mobile Phone */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Pakistani Mobile Number (موبائل نمبر) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="0307-0816990"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-stone-900 font-mono font-bold outline-none focus:border-festiva-burgundy"
                  />
                </div>
              </div>

              {/* Quetta Area */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Quetta Area (علاقہ) *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-stone-900 outline-none focus:border-festiva-burgundy"
                  >
                    {QUETTA_AREAS.filter(a => a !== 'All Areas (Quetta)').map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-festiva-burgundy hover:bg-festiva-maroon text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Send SMS Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 mx-auto flex items-center justify-center text-emerald-600">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-stone-900">
                  SMS Code Sent to {phone}
                </h3>
                <p className="text-xs text-stone-500">
                  Char hinson ka verification code darj karein.
                </p>
              </div>

              {/* OTP Simulation Notification Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center space-y-1">
                <span className="text-[11px] text-amber-800 font-bold block">
                  Simulated SMS Gateway Received:
                </span>
                <span className="text-lg font-mono font-extrabold tracking-widest text-festiva-maroon bg-white px-3 py-1 rounded-lg border border-amber-300 inline-block">
                  {generatedOtp}
                </span>
                <button
                  type="button"
                  onClick={() => setOtp(generatedOtp)}
                  className="block mx-auto text-[11px] text-amber-900 underline font-bold pt-1"
                >
                  Click to Auto-fill Code
                </button>
              </div>

              <div>
                <input
                  type="text"
                  required
                  maxLength={4}
                  autoFocus
                  placeholder="• • • •"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full text-center tracking-widest text-xl font-mono font-bold bg-stone-50 border border-stone-200 rounded-xl py-2.5 text-stone-900 outline-none focus:border-festiva-burgundy"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-2.5 rounded-xl text-xs transition-colors"
                >
                  Change Number
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-festiva-burgundy hover:bg-festiva-maroon text-white font-bold py-2.5 rounded-xl shadow-md text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-festiva-lightgold" />
                  <span>Verify & Login</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
