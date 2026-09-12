import React, { useState } from 'react';
import { api } from '../services/api';
import { useShop } from '../context/ShopContext';
import { Lock, CheckCircle2, ArrowRight } from 'lucide-react';

interface ResetPasswordPageProps {
  token: string;
  email: string;
  onNavigate: (page: string) => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({
  token: initialToken,
  email: initialEmail,
  onNavigate
}) => {
  const { showToast } = useShop();

  const [token, setToken] = useState(initialToken || '');
  const [email, setEmail] = useState(initialEmail || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !email || !newPassword) {
      showToast('Token, email, and new password are required', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await api.resetPassword({ token, email, newPassword });
      setResetSuccess(true);
      showToast(res.message, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to reset password. Link may be expired.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 max-w-md mx-auto px-4">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-boutique-100 text-boutique-700 mx-auto flex items-center justify-center font-bold">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-serif font-bold text-2xl text-boutique-900">Reset Your Password</h1>
          <p className="text-xs text-gray-500">Enter your new password below.</p>
        </div>

        {resetSuccess ? (
          <div className="space-y-4 bg-emerald-50 p-6 rounded-2xl border border-emerald-100 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="font-serif font-bold text-lg text-emerald-900">Password Reset Successful</h3>
            <p className="text-xs text-gray-600">
              Your password has been successfully reset. You can now log in using your new credentials.
            </p>
            <button
              onClick={() => onNavigate('login')}
              className="w-full bg-boutique-700 hover:bg-boutique-800 text-white font-bold py-3 rounded-xl shadow text-sm flex items-center justify-center gap-2"
            >
              Go to Login <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-boutique-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Reset Token</label>
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste token if not pre-filled"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs font-mono bg-gray-50 focus:ring-2 focus:ring-boutique-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-boutique-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-boutique-700 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-boutique-700 hover:bg-boutique-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm"
            >
              {loading ? 'Updating Password...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
