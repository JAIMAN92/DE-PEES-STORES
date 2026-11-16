import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Send,
  CheckCircle,
  Clock,
  Instagram,
  Facebook,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getWhatsAppUrl, isValidWhatsAppNumber } from '../lib/whatsapp';
import { sanitizeExternalUrl } from '../lib/sanitizeUrl';

export const ContactPage: React.FC = () => {
  const { settings, submitContactMessage } = useStore();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber || !message) return;

    setIsSubmitting(true);
    try {
      submitContactMessage({
        full_name: fullName,
        phone_number: phoneNumber,
        email: email || 'Not provided',
        subject: subject || 'General Customer Enquiry',
        message: message,
      });

      setSubmitted(true);
      setFullName('');
      setPhoneNumber('');
      setEmail('');
      setSubject('');
      setMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-28 sm:pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#FDF2F8]/70 via-white to-[#F0FDFA]/50 border-b border-pink-100/60 py-8 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-2 sm:space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#DB2777]">
            Get in Touch
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1E3A8A] tracking-tight">
            Contact DE-PEES BABY & MOTHER CARE
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Have questions about children's sizing, hospital welcome hampers, or delivery within Port
            Harcourt and nationwide? We would love to assist you.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details & Port Harcourt Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">
                  Store Information
                </span>
                <h2 className="text-lg font-bold text-slate-900">{settings.business_name}</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Port Harcourt's trusted boutique for children's fashion, school gear, and mother care essentials.
                </p>
              </div>

              <div className="space-y-4 text-xs text-slate-600">
                {/* Address */}
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block mb-0.5">Physical Location:</span>
                    <span className="leading-relaxed">{settings.address}</span>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <Phone className="w-5 h-5 text-[#1E3A8A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block mb-0.5">Telephone Call Line:</span>
                    {settings.phone ? (
                      <a
                        href={`tel:${settings.phone}`}
                        className="text-[#1E3A8A] font-semibold hover:underline"
                      >
                        {settings.phone}
                      </a>
                    ) : (
                      <span className="text-slate-500">Available upon request (Send message below)</span>
                    )}
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/70">
                  <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-emerald-950 block mb-0.5">WhatsApp Orders & Sizing:</span>
                    {isValidWhatsAppNumber(settings.whatsapp_number) ? (
                      <a
                        href={getWhatsAppUrl(settings.whatsapp_number, 'Hello DE-PEES BABY & MOTHER CARE, I would like to make an enquiry.')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 font-bold hover:underline"
                      >
                        {settings.whatsapp_display || settings.whatsapp_number}
                      </a>
                    ) : (
                      <span className="text-emerald-900 font-medium">
                        Port Harcourt Customer Enquiry (Send message below)
                      </span>
                    )}
                    <span className="block text-[10px] text-emerald-600 mt-0.5">
                      Fast response for Port Harcourt deliveries
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <Mail className="w-5 h-5 text-[#DB2777] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block mb-0.5">Email Enquiries:</span>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-slate-700 hover:text-[#DB2777] transition-colors"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <Clock className="w-5 h-5 text-[#0891B2] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block mb-0.5">Opening Hours:</span>
                    <span className="text-slate-600">Monday - Saturday: 8:30 AM - 6:30 PM</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700 block mb-2">Connect with Us:</span>
                <div className="flex items-center gap-3">
                  {sanitizeExternalUrl(settings.instagram) && (
                    <a
                      href={sanitizeExternalUrl(settings.instagram)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-pink-50 text-[#DB2777] hover:bg-pink-100 transition-colors flex items-center gap-1.5 text-xs font-medium"
                    >
                      <Instagram className="w-4 h-4" />
                      <span>Instagram</span>
                    </a>
                  )}
                  {sanitizeExternalUrl(settings.facebook) && (
                    <a
                      href={sanitizeExternalUrl(settings.facebook)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-blue-50 text-[#1E3A8A] hover:bg-blue-100 transition-colors flex items-center gap-1.5 text-xs font-medium"
                    >
                      <Facebook className="w-4 h-4" />
                      <span>Facebook</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Message Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0891B2] block mb-1">
                  Send a Direct Message
                </span>
                <h2 className="text-xl font-bold text-slate-900">How Can We Help You?</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in your details below and our Port Harcourt customer team will get back to you promptly.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-emerald-900">Message Sent Successfully!</h3>
                  <p className="text-xs text-emerald-800 max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out to <strong>DE-PEES BABY & MOTHER CARE</strong>. Our team in Port Harcourt will review your request and get in touch shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-3 text-xs font-semibold text-emerald-700 underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        placeholder="e.g. Mrs. Stephanie Lawson"
                        className="w-full text-sm sm:text-xs min-h-[44px] p-3 rounded-xl border border-slate-200 focus:border-[#DB2777] focus:ring-1 focus:ring-[#DB2777] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g. 080... (Your Phone Number)"
                        className="w-full text-sm sm:text-xs min-h-[44px] p-3 rounded-xl border border-slate-200 focus:border-[#DB2777] focus:ring-1 focus:ring-[#DB2777] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address (optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. stephanie@example.com"
                        className="w-full text-sm sm:text-xs min-h-[44px] p-3 rounded-xl border border-slate-200 focus:border-[#DB2777] focus:ring-1 focus:ring-[#DB2777] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Shoe sizing / Baby Hamper enquiry"
                        className="w-full text-sm sm:text-xs min-h-[44px] p-3 rounded-xl border border-slate-200 focus:border-[#DB2777] focus:ring-1 focus:ring-[#DB2777] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please type your question or order requirements here..."
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#DB2777] focus:ring-1 focus:ring-[#DB2777] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto py-3.5 px-8 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-[#1E3A8A] via-[#1E3A8A] to-[#0891B2] text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Sending Message...' : 'SEND MESSAGE'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
