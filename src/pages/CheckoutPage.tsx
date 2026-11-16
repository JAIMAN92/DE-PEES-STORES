import React, { useState } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  Truck,
  MessageCircle,
  Building2,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BrandedPlaceholder } from '../components/BrandedPlaceholder';
import { Order } from '../types';
import { getWhatsAppUrl, isValidWhatsAppNumber } from '../lib/whatsapp';

const NIGERIAN_STATES = [
  'Rivers State (Port Harcourt)',
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'Federal Capital Territory (Abuja)',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
];

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotal, createOrder, settings, navigateTo } = useStore();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [city, setCity] = useState('Port Harcourt');
  const [state, setState] = useState('Rivers State (Port Harcourt)');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'whatsapp' | 'bank_transfer'>(
    'whatsapp'
  );

  const [copiedBank, setCopiedBank] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate delivery fee
  const isPortHarcourt =
    state.toLowerCase().includes('rivers') || city.toLowerCase().includes('port harcourt');
  const rawDeliveryFee = isPortHarcourt
    ? settings.delivery_fee_ph
    : settings.delivery_fee_nationwide;
  const isFreeDelivery = cartSubtotal >= settings.free_delivery_threshold;
  const deliveryFee = isFreeDelivery ? 0 : rawDeliveryFee;
  const grandTotal = cartSubtotal + deliveryFee;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(settings.account_number);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2500);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !phone.trim() || !deliveryAddress.trim()) {
      setErrorMsg('Please fill in your full name, phone number, and delivery address.');
      return;
    }

    if (cart.length === 0) {
      setErrorMsg('Your cart is empty. Please add items before checking out.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = cart.map((item, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        product_id: item.product.id,
        product_name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        selected_size: item.selected_size,
        selected_color: item.selected_color,
        image_url: item.product.images[0]?.url,
      }));

      const newOrder = createOrder({
        customer_name: fullName.trim(),
        customer_phone: phone.trim(),
        customer_email: email.trim() || 'Not provided',
        delivery_address: deliveryAddress.trim(),
        city: city.trim(),
        state: state,
        order_notes: orderNotes.trim(),
        payment_method: paymentMethod,
        payment_status: 'unpaid',
        order_status: 'pending',
        items: orderItems,
        subtotal: cartSubtotal,
        delivery_fee: deliveryFee,
        total_amount: grandTotal,
      });

      setSubmittedOrder(newOrder);

      // If WhatsApp order, open formatted WhatsApp confirmation
      if (paymentMethod === 'whatsapp') {
        const itemsList = orderItems
          .map(
            (it) =>
              `• ${it.product_name} (Qty: ${it.quantity}${it.selected_size ? `, Size: ${it.selected_size}` : ''}${it.selected_color ? `, Col: ${it.selected_color}` : ''}) - ₦${(it.price * it.quantity).toLocaleString()}`
          )
          .join('\n');

        const messageText = `🛍️ *NEW ORDER FROM DE-PEES WEBSITE*\n*Order ID:* ${newOrder.order_number}\n\n*Customer Details:*\nName: ${fullName}\nPhone: ${phone}\nAddress: ${deliveryAddress}, ${city}, ${state}\nNotes: ${orderNotes || 'None'}\n\n*Ordered Items:*\n${itemsList}\n\n*Subtotal:* ₦${cartSubtotal.toLocaleString()}\n*Delivery Fee:* ₦${deliveryFee.toLocaleString()}\n*Total Amount:* ₦${grandTotal.toLocaleString()}\n\n*Payment Method:* WhatsApp Order / Confirm with Agent`;

        if (isValidWhatsAppNumber(settings.whatsapp_number)) {
          const waUrl = getWhatsAppUrl(settings.whatsapp_number, messageText);
          window.open(waUrl, '_blank', 'noopener,noreferrer');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedOrder) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Order Placed Successfully
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 mb-2">
            Thank you, {submittedOrder.customer_name}!
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            Your order number is <strong className="text-slate-900">{submittedOrder.order_number}</strong>.
            Our team in Port Harcourt has received your details and will process your delivery swiftly.
          </p>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left mb-6 space-y-3">
            <div className="flex justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
              <span>Delivery Destination:</span>
              <span className="font-semibold text-slate-800 text-right">
                {submittedOrder.delivery_address}, {submittedOrder.city}, {submittedOrder.state}
              </span>
            </div>

            <div className="space-y-1.5 py-1">
              <span className="text-xs font-semibold text-slate-700">Items:</span>
              {submittedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs text-slate-600">
                  <span>
                    {item.quantity}x {item.product_name}
                  </span>
                  <span className="font-medium text-slate-900 tabular-nums">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
              <span>Total Paid/Payable:</span>
              <span className="text-[#1E3A8A] tabular-nums">
                ₦{submittedOrder.total_amount.toLocaleString()}
              </span>
            </div>
          </div>

          {submittedOrder.payment_method === 'bank_transfer' && (
            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 text-left mb-6 space-y-2">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-600" />
                Bank Transfer Instructions
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                Please transfer <strong>₦{submittedOrder.total_amount.toLocaleString()}</strong> to the
                official DE-PEES account below and send proof of payment via WhatsApp:
              </p>
              <div className="p-3 bg-white rounded-xl border border-amber-300 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-800">{settings.bank_name}</div>
                  <div className="font-mono text-sm font-bold text-[#1E3A8A]">
                    {settings.account_number}
                  </div>
                  <div className="text-[11px] text-slate-500">{settings.account_name}</div>
                </div>
                <button
                  onClick={handleCopyAccount}
                  className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-medium flex items-center gap-1"
                >
                  {copiedBank ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBank ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            {isValidWhatsAppNumber(settings.whatsapp_number) && (
              <a
                href={getWhatsAppUrl(settings.whatsapp_number, `Hello DE-PEES, I just placed order ${submittedOrder.order_number} and would like to confirm delivery.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20BD5A] text-white flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Confirm on WhatsApp</span>
              </a>
            )}

            <button
              onClick={() => navigateTo('shop')}
              className="py-3 px-6 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6 pb-28 sm:py-10 sm:pb-16 px-3.5 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Link */}
        <button
          onClick={() => navigateTo('shop')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#DB2777] mb-4 sm:mb-6 transition-colors min-h-[36px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shop</span>
        </button>

        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold text-slate-900">Checkout & Order Placement</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete your order with DE-PEES BABY & MOTHER CARE. Port Harcourt local pickup or delivery across Nigeria.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Customer & Delivery Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#0891B2]" />
                Customer & Delivery Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Mrs. Grace Amadi"
                    className="w-full text-sm sm:text-xs min-h-[44px] p-3 rounded-xl border border-slate-200 focus:border-[#DB2777] focus:ring-1 focus:ring-[#DB2777] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number (WhatsApp preferred) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 080... (Your WhatsApp/Phone Number)"
                    className="w-full text-sm sm:text-xs min-h-[44px] p-3 rounded-xl border border-slate-200 focus:border-[#DB2777] focus:ring-1 focus:ring-[#DB2777] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. grace@example.com"
                  className="w-full text-sm sm:text-xs min-h-[44px] p-3 rounded-xl border border-slate-200 focus:border-[#DB2777] focus:ring-1 focus:ring-[#DB2777] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detailed Delivery Address <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="e.g. House 12, Trans-Amadi Road, near Odili Junction"
                  className="w-full text-sm sm:text-xs p-3 rounded-xl border border-slate-200 focus:border-[#DB2777] focus:ring-1 focus:ring-[#DB2777] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State / Region <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-sm sm:text-xs min-h-[44px] p-3 rounded-xl border border-slate-200 focus:border-[#DB2777] outline-none bg-white font-medium"
                  >
                    {NIGERIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / Town <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Port Harcourt"
                    className="w-full text-sm sm:text-xs min-h-[44px] p-3 rounded-xl border border-slate-200 focus:border-[#DB2777] focus:ring-1 focus:ring-[#DB2777] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Special Order Notes (optional)
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Gift packaging requested, call before arriving"
                  className="w-full text-sm sm:text-xs min-h-[44px] p-3 rounded-xl border border-slate-200 focus:border-[#DB2777] focus:ring-1 focus:ring-[#DB2777] outline-none"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                Select Payment Method
              </h2>

              <div className="space-y-3">
                {/* WhatsApp Option */}
                <label
                  className={`p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                    paymentMethod === 'whatsapp'
                      ? 'border-[#25D366] bg-emerald-50/40 ring-1 ring-[#25D366]'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'whatsapp'}
                    onChange={() => setPaymentMethod('whatsapp')}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        WhatsApp Order Confirmation (Recommended)
                      </span>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Fast & Direct
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Instantly sends your order summary to our Port Harcourt team via WhatsApp. We will confirm item availability and arrange your delivery.
                    </p>
                  </div>
                </label>

                {/* Bank Transfer Option */}
                <label
                  className={`p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-[#1E3A8A] bg-blue-50/40 ring-1 ring-[#1E3A8A]'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="mt-1 text-[#1E3A8A] focus:ring-[#1E3A8A]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        Direct Bank Transfer
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Transfer directly to our official {settings.bank_name} account. You will receive account details immediately after placing the order.
                    </p>
                  </div>
                </label>

              </div>
            </div>
          </div>

          {/* Order Summary (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-md space-y-5">
              <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs font-semibold text-slate-500">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'}
                </span>
              </h2>

              {/* Items Preview */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-slate-100">
                {cart.map((item, idx) => (
                  <div key={idx} className="pt-2 first:pt-0 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 shrink-0 overflow-hidden relative">
                      {item.product.images[0]?.url ? (
                        <img
                          src={item.product.images[0].url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BrandedPlaceholder
                          categoryName={item.product.category_name}
                          aspectRatio="square"
                          className="h-full border-none rounded-none p-1 text-[7px]"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-slate-800 truncate">
                        {item.product.name}
                      </h4>
                      <div className="text-[10px] text-slate-500">
                        Qty: {item.quantity} {item.selected_size ? `· ${item.selected_size}` : ''}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-slate-900 tabular-nums">
                      ₦{(item.product.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Fee Calculations */}
              <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    ₦{cartSubtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    <span>Delivery Charge:</span>
                    <span className="text-[10px] text-slate-400">
                      ({isPortHarcourt ? 'Port Harcourt Intra-city' : 'Nationwide'})
                    </span>
                  </span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {deliveryFee === 0 ? 'FREE' : `₦${deliveryFee.toLocaleString()}`}
                  </span>
                </div>

                {isFreeDelivery && (
                  <div className="text-[11px] text-emerald-600 font-medium bg-emerald-50 p-2 rounded-lg flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>Free delivery unlocked on orders above ₦{settings.free_delivery_threshold.toLocaleString()}!</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-bold text-slate-900">
                  <span>Total Due</span>
                  <span className="text-[#1E3A8A] text-lg tabular-nums">
                    ₦{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-4 px-4 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#DB2777] via-[#BE185D] to-[#1E3A8A] text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Processing Order...' : 'CONFIRM & PLACE ORDER'}
              </button>

              <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-2">
                <span>Safe & Secure Shopping</span>
                <span>·</span>
                <span>Port Harcourt, Nigeria</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
