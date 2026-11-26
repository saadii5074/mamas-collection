import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Wallet, 
  Building2, 
  Truck, 
  Lock, 
  MapPin, 
  CheckCircle2, 
  Phone, 
  User, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { PAYMENT_METHODS, QUETTA_AREAS } from '../data/mockData';
import { EasyPaisaLogo, JazzCashLogo, OneLinkLogo, BankTransferLogo } from './PaymentLogos';
import { sanitizeInput } from '../services/marketplaceService';

export default function CheckoutModal({
  isOpen,
  onClose,
  items,
  onCompleteOrder
}) {
  if (!isOpen || items.length === 0) return null;

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCnic, setCustomerCnic] = useState('');
  const [selectedQuettaArea, setSelectedQuettaArea] = useState('Jinnah Road');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('easypaisa');
  const [transactionId, setTransactionId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const formatPKR = (num) => Number(num || 0).toLocaleString('en-PK');

  const subtotalItems = items.reduce((acc, item) => {
    return acc + (item.bookingMode === 'rent' ? item.rentAmount : item.totalPrice);
  }, 0);

  const totalSecurityDeposit = items.reduce((acc, item) => {
    return acc + (item.bookingMode === 'rent' ? (item.securityDeposit || 0) : 0);
  }, 0);

  const grandTotal = subtotalItems + totalSecurityDeposit;
  const hasRentals = items.some(item => item.bookingMode === 'rent');

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      setErrorMsg('Please enter your Name, Phone Number, and Delivery Address in Quetta.');
      return;
    }

    if (hasRentals && !customerCnic.trim()) {
      setErrorMsg('CNIC number is required for rental security (Amanat Locker) verification.');
      return;
    }

    if ((paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash' || paymentMethod === 'bank') && !transactionId.trim()) {
      setErrorMsg(`Please enter the Transaction ID (TRX ID) from your ${paymentMethod.toUpperCase()} payment receipt.`);
      return;
    }

    const cleanName = sanitizeInput(customerName);
    const cleanPhone = sanitizeInput(customerPhone);
    const cleanCnic = sanitizeInput(customerCnic);
    const cleanAddress = sanitizeInput(deliveryAddress);
    const cleanTrx = sanitizeInput(transactionId);

    const orderData = {
      orderId: `MC-QTA-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      customer: {
        name: cleanName,
        phone: cleanPhone,
        cnic: cleanCnic || 'N/A',
        area: selectedQuettaArea,
        address: cleanAddress
      },
      payment: {
        method: paymentMethod,
        transactionId: cleanTrx || 'COD-PENDING',
        status: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid / Verification Pending'
      },
      items,
      subtotalItems,
      totalSecurityDeposit,
      grandTotal
    };

    onCompleteOrder(orderData);
  };

  const selectedPaymentInfo = PAYMENT_METHODS.find(m => m.id === paymentMethod);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-festiva-sand my-8 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-festiva-sand bg-festiva-blush flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-lg sm:text-xl text-festiva-maroon">
              Checkout & Payment (کوئیٹہ آرڈر و بلنگ)
            </h2>
            <p className="text-xs text-stone-500">
              Quetta Express Delivery & Secure Amanat Locker
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1 text-xs">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Customer Details */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-1.5 border-b pb-1.5">
              <User className="w-4 h-4 text-festiva-gold" />
              <span>1. Contact & Quetta Delivery Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Full Name (پورا نام) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fatima Khan"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 outline-none focus:border-festiva-burgundy"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  WhatsApp Phone Number (واٹس ایپ نمبر) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0307-0816990"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 outline-none focus:border-festiva-burgundy"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  CNIC Number (شناختی کارڈ) {hasRentals ? '*' : '(Optional)'}
                </label>
                <input
                  type="text"
                  placeholder="54400-XXXXXXX-X"
                  value={customerCnic}
                  onChange={(e) => setCustomerCnic(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 outline-none focus:border-festiva-burgundy"
                />
                {hasRentals && (
                  <span className="text-[10px] text-amber-700 block mt-0.5">
                    Required for rental verification & security deposit refund.
                  </span>
                )}
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Quetta Area (علاقہ) *
                </label>
                <select
                  value={selectedQuettaArea}
                  onChange={(e) => setSelectedQuettaArea(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 outline-none focus:border-festiva-burgundy"
                >
                  {QUETTA_AREAS.filter(a => a !== "All Areas (Quetta)").map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-700 mb-1">
                  Complete Delivery Address (گھر یا ہال کا مکمل پتہ) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Street / House No, Near Landmark / Banquet Hall, Quetta"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 outline-none focus:border-festiva-burgundy"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3 pt-2">
            <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-1.5 border-b pb-1.5">
              <CreditCard className="w-4 h-4 text-festiva-gold" />
              <span>2. Choose Payment Method</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    type="button"
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-festiva-burgundy text-white border-festiva-burgundy shadow-sm'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      {method.id === 'easypaisa' && <EasyPaisaLogo className="w-5 h-5 flex-shrink-0" />}
                      {method.id === 'jazzcash' && <JazzCashLogo className="w-5 h-5 flex-shrink-0" />}
                      {method.id === 'bank' && <BankTransferLogo className="w-5 h-5 flex-shrink-0" />}
                      {method.id === 'cod' && <Truck className={`w-5 h-5 flex-shrink-0 ${isSelected ? 'text-festiva-lightgold' : 'text-amber-700'}`} />}
                      <span className="font-bold text-[11px] truncate">{method.name}</span>
                    </div>
                    <div className={`text-[9px] ${isSelected ? 'text-stone-200' : 'text-stone-500'}`}>
                      {method.id === 'cod' ? 'Hand-to-Hand' : 'Instant Verified'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Payment Instructions Box */}
            {selectedPaymentInfo && (
              <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl text-stone-800 space-y-2">
                <div className="flex items-center justify-between font-bold text-xs text-amber-900">
                  <span>{selectedPaymentInfo.name} Account:</span>
                  <span className="text-festiva-maroon font-mono text-sm">{selectedPaymentInfo.accountNumber}</span>
                </div>
                <div className="text-[11px] text-stone-600 flex justify-between">
                  <span>Account Title:</span>
                  <b className="text-stone-900">{selectedPaymentInfo.accountTitle}</b>
                </div>

                {paymentMethod !== 'cod' && (
                  <div className="pt-2 border-t border-amber-200/80">
                    <label className="block font-bold text-[11px] text-stone-800 mb-1">
                      Enter Transaction ID / Reference (TRX ID): *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 19827364521"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 font-mono text-xs text-stone-900 outline-none focus:border-festiva-burgundy"
                    />
                    <span className="text-[10px] text-stone-500 block mt-1">
                      Please transfer Rs. {formatPKR(grandTotal)} and paste the TRX code above.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Summary breakdown */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
            <div className="flex justify-between text-stone-600">
              <span>Items / Rental Charges ({items.length} items):</span>
              <span className="font-semibold text-stone-900">Rs. {formatPKR(subtotalItems)}</span>
            </div>

            {totalSecurityDeposit > 0 && (
              <div className="flex justify-between text-amber-900">
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  Refundable Security Deposit (Amanat Locker):
                </span>
                <span className="font-bold">+ Rs. {formatPKR(totalSecurityDeposit)}</span>
              </div>
            )}

            <div className="flex justify-between text-emerald-700">
              <span>Delivery within Quetta:</span>
              <span className="font-bold">FREE (Launch Promotion)</span>
            </div>

            <div className="border-t border-stone-200 pt-2 flex justify-between items-center text-sm font-bold">
              <span className="text-festiva-maroon font-serif text-base">Grand Total:</span>
              <span className="text-lg text-festiva-burgundy">
                Rs. {formatPKR(grandTotal)}
              </span>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-festiva-burgundy via-festiva-maroon to-festiva-burgundy hover:brightness-110 text-white font-bold py-3.5 px-4 rounded-2xl shadow-festive transition-all flex items-center justify-center gap-2 transform active:scale-[0.99] text-sm"
          >
            <CheckCircle2 className="w-4 h-4 text-festiva-gold" />
            <span>Confirm Order & Generate Digital Invoice</span>
          </button>

        </form>

      </div>
    </div>
  );
}
