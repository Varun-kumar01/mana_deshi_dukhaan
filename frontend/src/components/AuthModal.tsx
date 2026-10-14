import React, { useEffect, useState } from 'react';

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

import {
  loginUser,
  registerUser,
} from '../services/api';

interface AuthModalProps {
  onAdminAccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onAdminAccess,
}) => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    login,
    logout,
    user,
    isAdmin,
    isLoggedIn,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(
    'login',
  );

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  useEffect(() => {
    if (!isAuthModalOpen) {
      setError('');
      setSuccess('');
      setLoading(false);
    }
  }, [isAuthModalOpen]);

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      phone: '',
      password: '',
    });
    setError('');
    setSuccess('');
    setShowPassword(false);
  };

  const switchMode = (nextMode: 'login' | 'register') => {
    resetForm();
    setMode(nextMode);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (mode === 'register') {
      if (!form.name.trim()) {
        return 'Please enter your full name.';
      }

      if (!form.phone.trim()) {
        return 'Please enter your phone number.';
      }

      const phoneDigits = form.phone.replace(/\D/g, '');

      if (
        phoneDigits.length !== 10 &&
        phoneDigits.length !== 12
      ) {
        return 'Please enter a valid phone number.';
      }

      if (
        form.email.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          form.email.trim(),
        )
      ) {
        return 'Please enter a valid email address.';
      }
    }

    if (!form.email.trim() && !form.phone.trim()) {
      return 'Please enter your email or phone number.';
    }

    if (form.password.length < 6) {
      return 'Password must be at least 6 characters.';
    }

    return '';
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response =
        mode === 'login'
          ? await loginUser({
              emailOrPhone:
                form.email.trim() ||
                form.phone.trim(),
              password: form.password,
            })
          : await registerUser({
              name: form.name.trim(),
              email: form.email.trim(),
              phone: form.phone.trim(),
              password: form.password,
            });

      if (
        response.success &&
        response.user &&
        response.token
      ) {
        login(response.user, response.token);

        setSuccess(
          response.message ||
            (mode === 'login'
              ? 'Welcome back!'
              : 'Your account has been created!'),
        );

        /*
         * Important:
         * Admin does NOT get redirected automatically.
         * Admin will use the future "Admin Dashboard"
         * navigation item.
         */
        setTimeout(() => {
          setIsAuthModalOpen(false);
        }, 700);

        return;
      }

      setError(
        response.message ||
          'Unable to complete authentication.',
      );
    } catch (requestError) {
      console.error('Authentication error:', requestError);

      setError(
        'Unable to connect to the server. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;

    setIsAuthModalOpen(false);
  };

  if (!isAuthModalOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[500] flex items-end justify-center bg-[#172019]/45 p-0 backdrop-blur-sm min-[540px]:items-center min-[540px]:p-4"
      onClick={handleClose}
    >
      <div
        className="relative max-h-[92dvh] w-full max-w-[440px] overflow-y-auto rounded-t-[30px] border border-[#e8dfcf] bg-[#fffdf9] px-5 pb-7 pt-6 shadow-[0_30px_100px_rgba(20,45,28,0.24)] sm:px-7 min-[540px]:rounded-[30px]"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-[#f3eee5] text-[#526056] transition hover:bg-[#e8dfcf] hover:text-[#234b32]"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {isLoggedIn ? (
          <div className="flex flex-col items-center py-5">
            <div className="grid h-[76px] w-[76px] place-items-center rounded-full bg-[#234b32] font-[family-name:'Playfair_Display',Georgia,serif] text-3xl font-bold text-white shadow-lg">
              {user?.name
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <div className="mt-4 text-center">
              <h2 className="font-[family-name:'Playfair_Display',Georgia,serif] text-2xl font-bold text-[#1d2a20]">
                {user?.name}
              </h2>

              <p className="mt-1 text-sm text-[#68736b]">
                {user?.email || user?.phone}
              </p>
            </div>

            {isAdmin && (
              <div className="mt-4 inline-flex items-center rounded-full border border-[#d9c89d] bg-[#f8f0d9] px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#806323]">
                Admin Account
              </div>
            )}

            <div className="mt-7 w-full space-y-3">
              {isAdmin && onAdminAccess && (
                <button
                  type="button"
                  onClick={() => {
                    setIsAuthModalOpen(false);
                    onAdminAccess();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#234b32] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#173522]"
                >
                  <Settings size={17} />
                  Admin Dashboard
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  logout();
                  setIsAuthModalOpen(false);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-3.5 text-sm font-bold text-red-600 transition hover:bg-red-100"
              >
                <LogOut size={17} />
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="pr-8 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#edf4ee] text-2xl">
                🌿
              </div>

              <h2 className="mt-4 font-[family-name:'Playfair_Display',Georgia,serif] text-2xl font-bold tracking-[-0.02em] text-[#1d2a20]">
                {mode === 'login'
                  ? 'Welcome back'
                  : 'Join ManaDeshi Dukaan'}
              </h2>

              <p className="mt-1.5 text-sm text-[#68736b]">
                {mode === 'login'
                  ? 'Sign in to continue shopping'
                  : 'Create your account and start ordering'}
              </p>
            </div>

            {success ? (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-[#edf4ee]">
                  <CheckCircle2
                    size={34}
                    className="text-[#234b32]"
                  />
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#1d2a20]">
                  {mode === 'login'
                    ? 'Signed in successfully'
                    : 'Account created successfully'}
                </h3>

                <p className="mt-2 max-w-[300px] text-sm leading-6 text-[#68736b]">
                  {success}
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-4"
              >
                {mode === 'register' && (
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-[#354138]">
                      Full Name
                    </label>

                    <div className="relative">
                      <User
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89948c]"
                      />

                      <input
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full rounded-xl border border-[#ddd5c6] bg-[#faf7f2] py-3 pl-10 pr-4 text-sm text-[#1d2a20] outline-none transition placeholder:text-[#9ba39d] focus:border-[#234b32] focus:bg-white focus:ring-2 focus:ring-[#234b32]/10"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#354138]">
                    {mode === 'register'
                      ? 'Email Address (Optional)'
                      : 'Email or Phone Number'}
                  </label>

                  <div className="relative">
                    <User
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89948c]"
                    />

                    <input
                      name="email"
                      type={
                        mode === 'register'
                          ? 'email'
                          : 'text'
                      }
                      autoComplete={
                        mode === 'register'
                          ? 'email'
                          : 'username'
                      }
                      value={form.email}
                      onChange={handleChange}
                      placeholder={
                        mode === 'register'
                          ? 'you@example.com'
                          : 'Email or +91 phone'
                      }
                      className="w-full rounded-xl border border-[#ddd5c6] bg-[#faf7f2] py-3 pl-10 pr-4 text-sm text-[#1d2a20] outline-none transition placeholder:text-[#9ba39d] focus:border-[#234b32] focus:bg-white focus:ring-2 focus:ring-[#234b32]/10"
                    />
                  </div>
                </div>

                {mode === 'register' && (
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-[#354138]">
                      Phone Number
                    </label>

                    <div className="relative">
                      <Phone
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89948c]"
                      />

                      <input
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 98490 12345"
                        className="w-full rounded-xl border border-[#ddd5c6] bg-[#faf7f2] py-3 pl-10 pr-4 text-sm text-[#1d2a20] outline-none transition placeholder:text-[#9ba39d] focus:border-[#234b32] focus:bg-white focus:ring-2 focus:ring-[#234b32]/10"
                        required
                      />
                    </div>
                  </div>
                )}

                {mode === 'login' && !form.email && (
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-[#354138]">
                      Phone Number
                    </label>

                    <div className="relative">
                      <Phone
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89948c]"
                      />

                      <input
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 98490 12345"
                        className="w-full rounded-xl border border-[#ddd5c6] bg-[#faf7f2] py-3 pl-10 pr-4 text-sm text-[#1d2a20] outline-none transition placeholder:text-[#9ba39d] focus:border-[#234b32] focus:bg-white focus:ring-2 focus:ring-[#234b32]/10"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#354138]">
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89948c]"
                    />

                    <input
                      name="password"
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      autoComplete={
                        mode === 'login'
                          ? 'current-password'
                          : 'new-password'
                      }
                      value={form.password}
                      onChange={handleChange}
                      placeholder="At least 6 characters"
                      className="w-full rounded-xl border border-[#ddd5c6] bg-[#faf7f2] py-3 pl-10 pr-11 text-sm text-[#1d2a20] outline-none transition placeholder:text-[#9ba39d] focus:border-[#234b32] focus:bg-white focus:ring-2 focus:ring-[#234b32]/10"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current,
                        )
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#89948c] transition hover:text-[#234b32]"
                      aria-label={
                        showPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold leading-5 text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#234b32] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#173522] disabled:cursor-not-allowed disabled:opacity-60"
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

                <div className="pt-1 text-center text-xs text-[#68736b]">
                  {mode === 'login' ? (
                    <>
                      New to ManaDeshi?{' '}
                      <button
                        type="button"
                        onClick={() =>
                          switchMode('register')
                        }
                        className="font-bold text-[#234b32] underline underline-offset-2"
                      >
                        Create an account
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() =>
                          switchMode('login')
                        }
                        className="font-bold text-[#234b32] underline underline-offset-2"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};