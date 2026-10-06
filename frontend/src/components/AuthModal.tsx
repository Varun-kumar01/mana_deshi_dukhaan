import React, { useState } from 'react';
import { X, User, Phone, Lock, Eye, EyeOff, Loader2, CheckCircle2, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginUser, registerUser } from '../services/api';

interface AuthModalProps {
  onAdminAccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onAdminAccess }) => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, logout, user, isAdmin, isLoggedIn } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let res;
      if (mode === 'login') {
        res = await loginUser({ emailOrPhone: form.email || form.phone, password: form.password });
      } else {
        if (!form.name.trim()) { setError('Name is required'); setLoading(false); return; }
        if (!form.phone.trim()) { setError('Phone is required'); setLoading(false); return; }
        if (form.password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }
        res = await registerUser({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      }

      if (res.success && res.user && res.token) {
        login(res.user, res.token);
        setSuccess(res.message || 'Welcome!');
        if (res.user.role === 'admin') {
          setTimeout(() => {
            setIsAuthModalOpen(false);
            onAdminAccess();
          }, 800);
        } else {
          setTimeout(() => setIsAuthModalOpen(false), 1000);
        }
      } else {
        setError(res.message || 'Something went wrong');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <div className="auth-overlay" onClick={() => setIsAuthModalOpen(false)}>
      <div className="auth-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button className="auth-close" onClick={() => setIsAuthModalOpen(false)}>
          <X size={20} />
        </button>

        {isLoggedIn ? (
          /* ── Logged-in profile view ── */
          <div className="auth-profile">
            <div className="auth-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="auth-profile-name">{user?.name}</h2>
            <p className="auth-profile-email">{user?.email || user?.phone}</p>

            {isAdmin && (
              <div className="auth-admin-badge">Admin Account</div>
            )}

            <div className="auth-profile-actions">
              {isAdmin && (
                <button
                  className="btn-primary"
                  onClick={() => { setIsAuthModalOpen(false); onAdminAccess(); }}
                >
                  <Settings size={16} />
                  Go to Admin Dashboard
                </button>
              )}
              <button
                className="btn-outline-danger"
                onClick={() => { logout(); setIsAuthModalOpen(false); }}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* ── Auth form ── */
          <>
            <div className="auth-header">
              <div className="auth-logo">🌿</div>
              <h2 className="auth-title">
                {mode === 'login' ? 'Welcome back' : 'Join ManaDeshi Dukaan'}
              </h2>
              <p className="auth-subtitle">
                {mode === 'login'
                  ? 'Sign in to your account'
                  : 'Create your account to start ordering'}
              </p>
            </div>

            {success ? (
              <div className="auth-success">
                <CheckCircle2 size={32} className="text-green-600" />
                <p>{success}</p>
              </div>
            ) : (
              <form className="auth-form" onSubmit={handleSubmit}>
                {mode === 'register' && (
                  <div className="field-group">
                    <label className="field-label">Full Name</label>
                    <div className="field-wrap">
                      <User size={16} className="field-icon" />
                      <input
                        name="name"
                        type="text"
                        placeholder="Eg: Ravi Teja"
                        value={form.name}
                        onChange={handleChange}
                        className="field-input"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="field-group">
                  <label className="field-label">
                    {mode === 'register' ? 'Email (Optional)' : 'Email or Phone'}
                  </label>
                  <div className="field-wrap">
                    <User size={16} className="field-icon" />
                    <input
                      name="email"
                      type={mode === 'login' ? 'text' : 'email'}
                      placeholder={mode === 'login' ? 'admin@manadeshi.com or +91...' : 'your@email.com'}
                      value={form.email}
                      onChange={handleChange}
                      className="field-input"
                    />
                  </div>
                </div>

                {mode === 'register' && (
                  <div className="field-group">
                    <label className="field-label">Phone Number *</label>
                    <div className="field-wrap">
                      <Phone size={16} className="field-icon" />
                      <input
                        name="phone"
                        type="tel"
                        placeholder="+91 9849012345"
                        value={form.phone}
                        onChange={handleChange}
                        className="field-input"
                        required
                      />
                    </div>
                  </div>
                )}

                {mode === 'login' && !form.email && (
                  <div className="field-group">
                    <label className="field-label">Or Phone Number</label>
                    <div className="field-wrap">
                      <Phone size={16} className="field-icon" />
                      <input
                        name="phone"
                        type="tel"
                        placeholder="+91 9849012345"
                        value={form.phone}
                        onChange={handleChange}
                        className="field-input"
                      />
                    </div>
                  </div>
                )}

                <div className="field-group">
                  <label className="field-label">Password</label>
                  <div className="field-wrap">
                    <Lock size={16} className="field-icon" />
                    <input
                      name="password"
                      type={showPass ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      className="field-input"
                      required
                    />
                    <button
                      type="button"
                      className="field-toggle"
                      onClick={() => setShowPass(!showPass)}
                    >
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="auth-error">{error}</div>
                )}

                <button type="submit" className="btn-primary w-full" disabled={loading}>
                  {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                  {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                </button>

                <div className="auth-switch">
                  {mode === 'login' ? (
                    <>
                      New to ManaDeshi?{' '}
                      <button type="button" onClick={() => { setMode('register'); setError(''); }}>
                        Create account
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button type="button" onClick={() => { setMode('login'); setError(''); }}>
                        Sign in
                      </button>
                    </>
                  )}
                </div>

                {mode === 'login' && (
                  <div className="auth-demo-hint">
                    <strong>Demo:</strong> admin@manadeshi.com / admin123 for Admin access
                  </div>
                )}
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
