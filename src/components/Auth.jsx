import { useState } from 'react';
import { Mail, Lock, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/config/supabase';
import './Auth.css';

export function Auth({ user, onAuthChange }) {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!supabase) {
      setError('Supabase not configured. Please add your Supabase credentials.');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { data, error: err } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (err) throw err;
        onAuthChange(data.user);
      } else {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password
        });
        if (err) throw err;
        onAuthChange(data.user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    onAuthChange(null);
  };

  if (user) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 glass-effect rounded-lg">
        <div className="flex-1 min-w-0">
          <p className="text-sm truncate text-muted-foreground">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-card rounded-lg transition-colors text-muted-foreground hover:text-foreground"
        >
          <LogOut size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="auth-modal fixed inset-0 bg-black/50 flex items-center justify-center z-40">
      <div className="bg-card rounded-lg p-8 w-full max-w-md border border-border">
        <h2 className="text-2xl font-bold text-gradient-cyan mb-6">
          {isLogin ? t('login') : t('register')}
        </h2>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Mail size={16} />
              {t('email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-cyan-1"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Lock size={16} />
              {t('password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-cyan-1"
              placeholder="••••••••"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Lock size={16} />
                {t('confirmPassword')}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-cyan-1"
                placeholder="••••••••"
                required
              />
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-cyan-1 text-background rounded-lg font-semibold hover:bg-cyan-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : (isLogin ? t('login') : t('register'))}
          </button>
        </form>

        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
          className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {isLogin ? t('noAccount') : t('haveAccount')}
        </button>
      </div>
    </div>
  );
}
