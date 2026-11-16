import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, navigateTo, isAdminLoggedIn } = useStore();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, navigate straight to admin
  React.useEffect(() => {
    if (isAdminLoggedIn) {
      navigateTo('admin');
    }
  }, [isAdminLoggedIn, navigateTo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!password) {
      setErrorMsg('Please enter your administrator password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const success = loginAdmin(password);
      if (success) {
        navigateTo('admin');
      } else {
        setErrorMsg('Invalid administrator credentials. Please check your password and try again.');
      }
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          onClick={() => navigateTo('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Storefront</span>
        </button>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md">
          {/* Brand & Security Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-pink-400/80 p-[2px] mx-auto shadow-lg bg-white">
              <img
                src="/images/depees_logo.jpg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://i.ibb.co/mr0VXG8j/Whats-App-Image-2026-10-23-at-2-10-31-PM.jpg';
                }}
                alt="DE-PEES Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] block">
                DE-PEES BABY & MOTHER CARE
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Owner Administrator Access
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Port Harcourt Store Management & Order Control
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Administrator Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-xs focus:border-[#DB2777] focus:ring-1 focus:ring-[#DB2777] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Initial owner setup credential configured for secure administration.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-[#DB2777] via-[#BE185D] to-[#1E3A8A] text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isLoading ? 'Verifying Credentials...' : 'UNLOCK DASHBOARD'}</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-500">
              Authorized personnel only · Protected admin session
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
