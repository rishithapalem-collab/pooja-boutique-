import React, { useState } from 'react';
import { api } from '../services/api';
import { useShop } from '../context/ShopContext';
import { ShieldCheck, Mail, ArrowLeft, CheckCircle2, ExternalLink } from 'lucide-react';

interface AdminForgotPasswordPageProps {
  onNavigate: (page: string, token?: string, email?: string) => void;
}

export const AdminForgotPasswordPage: React.FC<AdminForgotPasswordPageProps> = ({ onNavigate }) => {
  const { showToast } = useShop();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [devResetLink, setDevResetLink] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter registered admin email', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await api.forgotPassword(email);
      setSubmitted(true);
      if (res.devResetLink) {
        setDevResetLink(res.devResetLink);
      }
      showToast('If email matches administrator account, reset token was dispatched.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to process request', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 max-w-md mx-auto px-4">
      <div className="bg-boutique-900 text-white rounded-3xl p-8 shadow-2xl border-2 border-gold-500 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-gold-500 text-boutique-900 mx-auto flex items-center justify-center font-bold">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="font-serif font-bold text-2xl text-gold-400">Admin Password Recovery</h1>
          <p className="text-xs text-gray-300">Enter registered administrator email for single-use token generation.</p>
        </div>

        {submitted ? (
          <div className="space-y-4 bg-boutique-800 p-5 rounded-2xl border border-boutique-700 text-center">
            <CheckCircle2 className="w-10 h-10 text-gold-400 mx-auto" />
            <h3 className="font-serif font-bold text-base text-white">Reset Token Generated</h3>
            <p className="text-xs text-gray-300">
              Check admin email inbox for your secure temporary password reset link.
            </p>

            {devResetLink && (
              <div className="pt-3 border-t border-boutique-700">
                <span className="text-[10px] uppercase font-bold text-gold-400 block mb-2">Development Shortcut</span>
                <button
                  onClick={() => {
                    const urlParams = new URLSearchParams(devResetLink.split('?')[1]);
                    const token = urlParams.get('token') || '';
                    const mail = urlParams.get('email') || email;
                    onNavigate('reset-password', token, mail);
                  }}
                  className="bg-gold-500 text-boutique-900 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 mx-auto shadow"
                >
                  Open Reset Password Screen <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              onClick={() => onNavigate('admin-login')}
              className="text-xs text-gold-400 font-bold hover:underline block mx-auto pt-2"
            >
              Return to Admin Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Admin Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@poojaboutique.com"
                  className="w-full pl-10 pr-4 py-3 bg-boutique-800 border border-boutique-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-gold-500 focus:outline-none"
                />
                <Mail className="w-4 h-4 text-gold-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold-500 text-boutique-900 font-extrabold py-3.5 rounded-xl transition-all shadow-md text-sm"
            >
              {loading ? 'Processing...' : 'Send Recovery Token'}
            </button>

            <button
              type="button"
              onClick={() => onNavigate('admin-login')}
              className="w-full text-xs text-gray-300 font-semibold hover:text-white flex items-center justify-center gap-1 py-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
