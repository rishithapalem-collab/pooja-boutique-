import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { ShieldCheck, Mail, Lock, KeyRound } from 'lucide-react';

interface AdminLoginPageProps {
  onNavigate: (page: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const { showToast } = useShop();

  const [email, setEmail] = useState('admin@poojaboutique.com');
  const [password, setPassword] = useState('AdminPooja2026!');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter admin credentials', 'error');
      return;
    }

    try {
      setLoading(true);
      const user = await login({ email, password, targetRole: 'admin' });
      showToast(`Welcome Administrator, ${user.name}!`, 'success');
      onNavigate('admin-dashboard');
    } catch (err: any) {
      showToast(err.message || 'Admin authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 max-w-md mx-auto px-4">
      <div className="bg-boutique-900 text-white rounded-3xl p-8 shadow-2xl border-2 border-gold-500 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-gold-500 text-boutique-900 mx-auto flex items-center justify-center font-extrabold shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="font-serif font-bold text-2xl text-gold-400">Pooja Boutique Admin Portal</h1>
          <p className="text-xs text-gray-300">Authorized Personnel Management Console</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1">Admin Email / Username</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@poojaboutique.com"
                className="w-full pl-10 pr-4 py-3 bg-boutique-800 border border-boutique-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-gold-500 focus:outline-none placeholder-gray-500"
              />
              <Mail className="w-4 h-4 text-gold-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-gray-300">Password</label>
              <button
                type="button"
                onClick={() => onNavigate('admin-forgot-password')}
                className="text-xs text-gold-400 hover:underline"
              >
                Forgot Admin Password?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-boutique-800 border border-boutique-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-gold-500 focus:outline-none placeholder-gray-500"
              />
              <Lock className="w-4 h-4 text-gold-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-gold-500 rounded bg-boutique-800 border-boutique-700"
            />
            <label htmlFor="remember" className="ml-2 text-xs text-gray-300">
              Remember administrator session
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold-500 hover:bg-gold-400 text-boutique-900 font-extrabold py-3.5 rounded-xl transition-all shadow-lg text-sm flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5" />
            {loading ? 'Authenticating Admin...' : 'Login to Admin Console'}
          </button>
        </form>

        <div className="pt-4 border-t border-boutique-800 text-center text-xs text-gray-400">
          Demo Default Admin Email: <code className="text-gold-400">admin@poojaboutique.com</code>
        </div>
      </div>
    </div>
  );
};
