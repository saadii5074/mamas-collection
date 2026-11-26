import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  MessageCircle, 
  CheckCircle, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Calendar,
  Lock,
  Store
} from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { EasyPaisaLogo, JazzCashLogo, BankTransferLogo } from './PaymentLogos';

export default function InvoiceModal({ order, onClose }) {
  if (!order) return null;

  const formatPKR = (num) => Number(num || 0).toLocaleString('en-PK');

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Assalam o Alaikum! Here is my Mamas Collection Quetta Order Receipt:\n` +
      `Invoice #: ${order.orderId}\n` +
      `Customer: ${order.customer.name} (${order.customer.phone})\n` +
      `Quetta Area: ${order.customer.area}\n` +
      `Grand Total: Rs. ${formatPKR(order.grandTotal)}\n` +
      `Payment: ${order.payment.method.toUpperCase()} (TRX: ${order.payment.transactionId})\n` +
      `Please proceed with preparation & delivery dispatch.`
    );
    window.open(`https://wa.me/923070816990?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-festiva-sand my-8 flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Action Bar */}
        <div className="px-5 py-3.5 border-b border-festiva-sand bg-festiva-blush flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="font-serif font-bold text-festiva-maroon text-sm sm:text-base">
              Order Confirmed & Digital Invoice Generated
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-semibold shadow-sm transition-all"
            >
              <Printer className="w-4 h-4 text-festiva-burgundy" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold shadow-md transition-all"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
              <span>Share on WhatsApp</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="p-6 sm:p-8 overflow-y-auto space-y-6 text-stone-800 text-xs">
          
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b-2 border-festiva-sand gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-festiva-burgundy to-festiva-maroon flex items-center justify-center text-festiva-gold border border-festiva-gold/40 shadow-sm">
                <span className="font-serif font-bold text-3xl">M</span>
              </div>
              <div>
                <h1 className="font-serif font-bold text-2xl text-festiva-maroon">
                  Mamas Collection
                </h1>
                <p className="text-[11px] text-stone-500">
                  Luxury Bridal Wear, Garments & Peer Rentals &bull; Quetta, Pakistan
                </p>
                <p className="text-[10px] text-stone-400">
                  Helpline / WhatsApp: +92 307 0816990 &bull; mamascollection11@gmail.com
                </p>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="inline-block bg-festiva-blush text-festiva-burgundy border border-festiva-sand px-3 py-1 rounded-full font-mono font-bold text-xs">
                INVOICE #{order.orderId}
              </span>
              <p className="text-stone-500 text-[11px] mt-1">
                Date: {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
              <p className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">
                Status: {order.payment.status}
              </p>
            </div>
          </div>

          {/* Customer & Delivery Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-festiva-blush/60 border border-festiva-sand">
            <div>
              <span className="text-[10px] uppercase font-bold text-festiva-maroon tracking-wider block mb-1">
                Billed & Delivered To:
              </span>
              <p className="font-bold text-sm text-stone-900">{order.customer.name}</p>
              <p className="text-stone-600">WhatsApp: <b>{order.customer.phone}</b></p>
              <p className="text-stone-600">CNIC: <b>{order.customer.cnic}</b></p>
              <p className="text-stone-600 mt-1 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-festiva-gold flex-shrink-0 mt-0.5" />
                <span>{order.customer.address}, {order.customer.area}, Quetta</span>
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-festiva-maroon tracking-wider block mb-1">
                Payment Verification Details:
              </span>
              <div className="flex items-center gap-2 mb-1">
                {order.payment.method === 'easypaisa' && <EasyPaisaLogo className="w-5 h-5 flex-shrink-0" />}
                {order.payment.method === 'jazzcash' && <JazzCashLogo className="w-5 h-5 flex-shrink-0" />}
                {order.payment.method === 'bank' && <BankTransferLogo className="w-5 h-5 flex-shrink-0" />}
                <p className="font-semibold text-stone-900">
                  Method: <span className="uppercase text-festiva-burgundy font-bold">{order.payment.method}</span>
                </p>
              </div>
              <p className="text-stone-600 font-mono">
                Transaction ID: <b>{order.payment.transactionId}</b>
              </p>
              <p className="text-stone-600">
                Official Account: <b>0307-0816990 (Saadii / Mamas Collection)</b>
              </p>
              <p className="text-[10px] text-emerald-700 font-medium mt-1">
                ✓ Recorded in Quetta Central Ledger &bull; Amanat Escrow Held
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-festiva-maroon text-white text-[11px] uppercase">
                  <th className="py-2.5 px-3 rounded-l-lg font-bold">Item Description</th>
                  <th className="py-2.5 px-3 font-bold">Type / Duration</th>
                  <th className="py-2.5 px-3 font-bold text-right">Rent / Price</th>
                  <th className="py-2.5 px-3 font-bold text-right">Security Deposit</th>
                  <th className="py-2.5 px-3 rounded-r-lg font-bold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {order.items.map((item, idx) => {
                  const isRental = item.bookingMode === 'rent';
                  return (
                    <tr key={idx} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-stone-900">{item.product.title}</div>
                        <div className="text-[10px] text-stone-500">
                          ID: {item.product.id} &bull; Size: {item.selectedSize} &bull; Area: {item.product.quettaArea}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        {isRental ? (
                          <div className="text-stone-700">
                            <span className="font-bold text-festiva-burgundy">Rental</span> ({item.rentalDuration} {item.rentalUnit})
                            <div className="text-[10px] text-stone-500">Event Date: {item.startDate}</div>
                          </div>
                        ) : (
                          <span className="font-bold text-stone-700">Direct Purchase</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right font-medium text-stone-800">
                        Rs. {formatPKR(isRental ? item.rentAmount : item.product.price)}
                      </td>

                      <td className="py-3 px-3 text-right font-medium text-amber-900">
                        {isRental ? `Rs. ${formatPKR(item.securityDeposit)}` : '-'}
                      </td>

                      <td className="py-3 px-3 text-right font-bold text-festiva-burgundy">
                        Rs. {formatPKR(item.totalPrice)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-4 border-t border-stone-200">
            <div className="max-w-xs space-y-1 text-[11px] text-stone-500">
              <p className="font-bold text-stone-700">Rental & Booking Terms:</p>
              <p>&bull; Return item before 6:00 PM on the designated end date.</p>
              <p>&bull; Security deposit will be refunded within 2 hours of physical return inspection via EasyPaisa/JazzCash.</p>
              <p>&bull; For inquiries or extensions, contact Quetta office: <b>0307-0816990</b>.</p>
            </div>

            <div className="w-full sm:w-64 space-y-2 bg-[#FAF5F3] p-4 rounded-2xl border border-festiva-sand text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-stone-900">Rs. {formatPKR(order.subtotalItems)}</span>
              </div>

              {order.totalSecurityDeposit > 0 && (
                <div className="flex justify-between text-amber-900 font-medium">
                  <span>Refundable Deposit:</span>
                  <span>+ Rs. {formatPKR(order.totalSecurityDeposit)}</span>
                </div>
              )}

              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Quetta Delivery:</span>
                <span>FREE</span>
              </div>

              <div className="border-t border-festiva-sand pt-2 flex justify-between items-center text-sm font-bold text-stone-900">
                <span className="text-festiva-maroon font-serif text-base">Grand Total:</span>
                <span className="text-lg text-festiva-burgundy">
                  Rs. {formatPKR(order.grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Seal */}
          <div className="pt-6 border-t border-dashed border-stone-300 text-center text-[10px] text-stone-400">
            <p>Thank you for choosing Mamas Collection &bull; Quetta's Premier Bridal & Rental Destination</p>
            <p className="mt-0.5">This is a system generated digital invoice and proof of rental contract.</p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-festiva-sand bg-stone-50 flex justify-end print:hidden">
          <button
            onClick={onClose}
            className="bg-stone-900 hover:bg-festiva-maroon text-white font-bold py-2 px-6 rounded-xl text-xs transition-all shadow-sm"
          >
            Done & Continue Browsing
          </button>
        </div>

      </div>
    </div>
  );
}
