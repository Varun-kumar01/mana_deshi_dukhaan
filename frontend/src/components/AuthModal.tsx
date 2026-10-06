import React, { useState } from 'react';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogOut,
  Phone,
  Settings,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginUser, registerUser } from '../services/api';

interface AuthModalProps {
  onAdminAccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onAdminAccess }) => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    login,
    logout,
    user,
    isAdmin,
    isLoggedIn,
  } = useAuth();

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
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError('');
  };

  const handleClose = () => {
    if (loading) return;

    setIsAuthModalOpen(false);
    setError('');
    setSuccess('');
  };

  const switchMode = (nextMode: 'login' | 'register') => {
    setMode(nextMode);
    setError('');
    setSuccess('');
    setShowPass(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let res;

      if (mode === 'login') {
        res = await loginUser({
          emailOrPhone: form.email || form.phone,
          password: form.password,
        });
      } else {
        if (!form.name.trim()) {
          setError('Name is required');
          setLoading(false);
          return;
        }

        if (!form.phone.trim()) {
          setError('Phone is required');
          setLoading(false);
          return;
        }

        if (form.password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        res = await registerUser({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        });
      }

      if (res.success && res.user && res.token) {
        login(res.user, res.token);
        setSuccess(res.message || 'Welcome!');

        if (res.user.role === 'admin') {
          setTimeout(() => {
            setIsAuthModalOpen(false);
            onAdminAccess?.();
          }, 800);
        } else {
          setTimeout(() => {
            setIsAuthModalOpen(false);
          }, 1000);
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
    <div
      className="fixed inset-0 z-[400] flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm min-[540px]:items-center min-[540px]:p-4"
      onClick={handleClose}
    >
      <div
        className="relative flex max-h-[92dvh] w-full max-w-[440px] flex-col overflow-hidden rounded-t-[28px] border border-[#E7DEC8] bg-white shadow-2xl min-[540px]:rounded-[28px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative top */}
        <div className="h-1.5 shrink-0 bg-gradient-to-r from-[#1E3A27] via-[#B35427] to-[#1E3A27]" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F0EBDD] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF5F0] text-[#1E3A27]">
              <User size={17} />
            </div>

            <div>
              <p className="font-display text-sm font-extrabold text-[#1E3A27]">
                ManaDeshi Dukaan
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#B35427]">
                Account
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4EFE6] text-stone-500 transition hover:bg-[#E7DEC8] hover:text-[#1A2318] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 pb-7 pt-6 sm:px-7 sm:pb-8">
          {isLoggedIn ? (
            /* Logged-in profile */
            <div className="flex flex-col items-center text-center">
              <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-gradient-to-br from-[#1E3A27] to-[#2B5336] font-display text-3xl font-extrabold text-white shadow-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#B35427]">
                Welcome back
              </p>

              <h2 className="mt-1 font-display text-2xl font-extrabold text-[#1A2318]">
                {user?.name}
              </h2>

              <p className="mt-1 break-all text-sm text-stone-500">
                {user?.email || user?.phone}
              </p>

              {isAdmin && (
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-amber-800">
                  <CheckCircle2 size={13} />
                  Admin Account
                </div>
              )}

              <div className="mt-7 w-full space-y-3">
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAuthModalOpen(false);
                      onAdminAccess?.();
                    }}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A27] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#2B5336]"
                  >
                    <Settings size={17} />
                    Go to Admin Dashboard
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsAuthModalOpen(false);
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100"
                >
                  <LogOut size={17} />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            /* Authentication form */
            <>
              {/* Form heading */}
              <div className="mb-6 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF5F0] text-2xl">
                  🌿
                </div>

                <h2 className="font-display text-2xl font-extrabold text-[#1A2318]">
                  {mode === 'login'
                    ? 'Welcome back'
                    : 'Join ManaDeshi Dukaan'}
                </h2>

                <p className="mt-1.5 text-sm text-stone-500">
                  {mode === 'login'
                    ? 'Sign in to your account'
                    : 'Create your account to start ordering'}
                </p>
              </div>

              {success ? (
                <div className="flex flex-col items-center rounded-2xl bg-[#EEF5F0] px-5 py-10 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
                    <CheckCircle2
                      size={32}
                      className="text-green-600"
                    />
                  </div>

                  <p className="mt-4 text-sm font-bold text-[#1A2318]">
                    {success}
                  </p>
                </div>
              ) : (
                <form
                  className="flex flex-col gap-4"
                  onSubmit={handleSubmit}
                >
                  {/* Name */}
                  {mode === 'register' && (
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="auth-name"
                        className="text-xs font-bold text-[#1A2318]"
                      >
                        Full Name
                      </label>

                      <div className="relative">
                        <User
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                        />

                        <input
                          id="auth-name"
                          name="name"
                          type="text"
                          placeholder="Eg: Ravi Teja"
                          value={form.name}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-[#D8CEB9] bg-[#FAF7F2] py-3 pl-9 pr-3.5 text-sm text-[#1A2318] outline-none transition placeholder:text-stone-400 focus:border-[#1E3A27] focus:bg-white focus:ring-2 focus:ring-[#1E3A27]/15"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="auth-email"
                      className="text-xs font-bold text-[#1A2318]"
                    >
                      {mode === 'register'
                        ? 'Email (Optional)'
                        : 'Email or Phone'}
                    </label>

                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                      />

                      <input
                        id="auth-email"
                        name="email"
                        type={mode === 'login' ? 'text' : 'email'}
                        placeholder={
                          mode === 'login'
                            ? 'admin@manadeshi.com or +91...'
                            : 'your@email.com'
                        }
                        value={form.email}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-[#D8CEB9] bg-[#FAF7F2] py-3 pl-9 pr-3.5 text-sm text-[#1A2318] outline-none transition placeholder:text-stone-400 focus:border-[#1E3A27] focus:bg-white focus:ring-2 focus:ring-[#1E3A27]/15"
                      />
                    </div>
                  </div>

                  {/* Registration phone */}
                  {mode === 'register' && (
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="auth-phone"
                        className="text-xs font-bold text-[#1A2318]"
                      >
                        Phone Number *
                      </label>

                      <div className="relative">
                        <Phone
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                        />

                        <input
                          id="auth-phone"
                          name="phone"
                          type="tel"
                          placeholder="+91 9849012345"
                          value={form.phone}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-[#D8CEB9] bg-[#FAF7F2] py-3 pl-9 pr-3.5 text-sm text-[#1A2318] outline-none transition placeholder:text-stone-400 focus:border-[#1E3A27] focus:bg-white focus:ring-2 focus:ring-[#1E3A27]/15"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Login phone */}
                  {mode === 'login' && !form.email && (
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="auth-login-phone"
                        className="text-xs font-bold text-[#1A2318]"
                      >
                        Or Phone Number
                      </label>

                      <div className="relative">
                        <Phone
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                        />

                        <input
                          id="auth-login-phone"
                          name="phone"
                          type="tel"
                          placeholder="+91 9849012345"
                          value={form.phone}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-[#D8CEB9] bg-[#FAF7F2] py-3 pl-9 pr-3.5 text-sm text-[#1A2318] outline-none transition placeholder:text-stone-400 focus:border-[#1E3A27] focus:bg-white focus:ring-2 focus:ring-[#1E3A27]/15"
                        />
                      </div>
                    </div>
                  )}

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="auth-password"
                      className="text-xs font-bold text-[#1A2318]"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <Lock
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                      />

                      <input
                        id="auth-password"
                        name="password"
                        type={showPass ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-[#D8CEB9] bg-[#FAF7F2] py-3 pl-9 pr-11 text-sm text-[#1A2318] outline-none transition placeholder:text-stone-400 focus:border-[#1E3A27] focus:bg-white focus:ring-2 focus:ring-[#1E3A27]/15"
                        required
                      />

                      <button
                        type="button"
                        aria-label={
                          showPass
                            ? 'Hide password'
                            : 'Show password'
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-[#1A2318]"
                        onClick={() => setShowPass(!showPass)}
                      >
                        {showPass ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div
                      role="alert"
                      className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs font-medium leading-5 text-red-700"
                    >
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A27] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#2B5336] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading && (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    )}

                    {loading
                      ? 'Please wait...'
                      : mode === 'login'
                        ? 'Sign In'
                        : 'Create Account'}
                  </button>

                  {/* Switch mode */}
                  <div className="pt-1 text-center text-sm text-stone-500">
                    {mode === 'login' ? (
                      <>
                        New to ManaDeshi?{' '}
                        <button
                          type="button"
                          onClick={() => switchMode('register')}
                          className="font-bold text-[#1E3A27] underline decoration-[#B35427]/50 underline-offset-2 hover:text-[#B35427]"
                        >
                          Create account
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => switchMode('login')}
                          className="font-bold text-[#1E3A27] underline decoration-[#B35427]/50 underline-offset-2 hover:text-[#B35427]"
                        >
                          Sign in
                        </button>
                      </>
                    )}
                  </div>

                  {/* Demo credentials */}
                  {mode === 'login' && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-center text-xs leading-5 text-amber-800">
                      <strong>Demo:</strong>{' '}
                      admin@manadeshi.com / admin123 for Admin access
                    </div>
                  )}
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};