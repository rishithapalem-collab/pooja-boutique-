import React, { useState } from 'react';
import { api } from '../services/api';
import { useShop } from '../context/ShopContext';
import { KeyRound, Mail, ArrowLeft, CheckCircle2, ExternalLink } from 'lucide-react';

interface ForgotPasswordPageProps {
  onNavigate: (page: string, extraToken?: string, extraEmail?: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const { showToast } = useShop();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [devResetLink, setDevResetLink] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your email address', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await api.forgotPassword(email);
      setSubmitted(true);
      if (res.devResetLink) {
        setDevResetLink(res.devResetLink);
      }
      showToast(res.message, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to request password reset', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 max-w-md mx-auto px-4">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-boutique-100 text-boutique-700 mx-auto flex items-center justify-center font-bold">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="font-serif font-bold text-2xl text-boutique-900">Forgot Password</h1>
          <p className="text-xs text-gray-500">Enter your registered email address to receive password reset instructions.</p>
        </div>

        {submitted ? (
          <div className="space-y-4 bg-boutique-50 p-5 rounded-2xl border border-boutique-100 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-serif font-bold text-base text-boutique-900">Reset Link Generated</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              If an account exists for <strong>{email}</strong>, password reset instructions have been sent.
            </p>

            {devResetLink && (
              <div className="pt-3 border-t border-boutique-200">
                <span className="text-[10px] uppercase font-bold text-gold-600 tracking-wider block mb-2">Development Testing Shortcut</span>
                <button
                  onClick={() => {
                    const urlParams = new URLSearchParams(devResetLink.split('?')[1]);
                    const token = urlParams.get('token') || '';
                    const mail = urlParams.get('email') || email;
                    onNavigate('reset-password', token, mail);
                  }}
                  className="bg-gold-500 hover:bg-gold-400 text-boutique-900 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 mx-auto shadow"
                >
                  Proceed to Reset Password Page <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              onClick={() => onNavigate('login')}
              className="text-xs text-boutique-700 font-bold hover:underline block mx-auto pt-2"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Registered Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@gmail.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-boutique-700 focus:outline-none"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-boutique-700 hover:bg-boutique-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm flex items-center justify-center gap-2"
            >
              {loading ? 'Sending Link...' : 'Send Password Reset Link'}
            </button>

            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="w-full text-xs text-gray-600 font-semibold hover:text-gray-900 flex items-center justify-center gap-1 py-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Customer Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
