import {
  ArrowRight,
  CheckCircle2,
  Heart,
  LogOut,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  UserRound,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminDashboard } from '../components/AdminDashboard';
import { PageLayout } from '../components/PageLayout';
import { useAuth } from '../context/AuthContext';

export function AccountPage() {
  const {
    isLoggedIn,
    isAdmin,
    user,
    logout,
    setIsAuthModalOpen,
  } = useAuth();

  const navigate = useNavigate();
  const [showAdmin, setShowAdmin] = useState(false);

  if (showAdmin && isAdmin) {
    return (
      <AdminDashboard
        onBackToStore={() => setShowAdmin(false)}
      />
    );
  }

  const accountActions = [
    {
      title: 'My orders',
      description: 'View your orders and track deliveries.',
      icon: Package,
      action: () => navigate('/orders'),
      accent: 'bg-[#EEF5F0] text-[#1E3A27]',
    },
    {
      title: 'Delivery details',
      description: 'Review your delivery information before checkout.',
      icon: MapPin,
      action: () => navigate('/checkout'),
      accent: 'bg-[#F4EBDD] text-[#B35427]',
    },
    {
      title: 'Wishlist',
      description: 'See products you saved for later.',
      icon: Heart,
      action: () => navigate('/wishlist'),
      accent: 'bg-[#F7EEE8] text-[#9B4930]',
    },
    {
      title: 'Continue shopping',
      description: 'Discover traditional foods for your home.',
      icon: ShoppingBag,
      action: () => navigate('/shop'),
      accent: 'bg-[#EEF5F0] text-[#1E3A27]',
    },
  ];

  return (
    <PageLayout title="My account" eyebrow="Your profile">
      <main className="bg-[#FAF7F2]">
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          {isLoggedIn && user ? (
            <>
              {/* Welcome hero */}
              <section className="relative overflow-hidden rounded-[2rem] bg-[#1E3A27] text-white shadow-sm sm:rounded-[2.5rem]">
                <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/[0.04]" />
                <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-[#B35427]/10" />

                <div className="relative grid gap-8 px-5 py-7 sm:px-8 sm:py-9 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10 lg:py-11">
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 sm:h-20 sm:w-20">
                      <UserRound
                        size={30}
                        strokeWidth={1.6}
                        className="sm:h-9 sm:w-9"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F4C95D] sm:text-xs">
                          Your ManaDeshi account
                        </span>

                        {isAdmin && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white/80">
                            <ShieldCheck size={12} />
                            Admin
                          </span>
                        )}
                      </div>

                      <h2 className="mt-2 truncate font-display text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                        Hello, {user.name}
                      </h2>

                      <p className="mt-2 max-w-xl text-sm leading-6 text-white/65">
                        Everything you need for your ManaDeshi Dukaan
                        orders, delivery details and shopping journey.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                    <button
                      type="button"
                      onClick={() => navigate('/orders')}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1E3A27] transition hover:bg-[#F7F2E9]"
                    >
                      <Package size={16} />
                      View my orders
                      <ArrowRight size={15} />
                    </button>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => setShowAdmin(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                      >
                        <ShieldCheck size={16} />
                        Admin dashboard
                      </button>
                    )}
                  </div>
                </div>
              </section>

              {/* Quick actions */}
              <section className="mt-6 sm:mt-8">
                <div className="mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B35427]">
                    Account shortcuts
                  </p>

                  <h3 className="mt-1 font-display text-xl font-extrabold text-[#1E3A27] sm:text-2xl">
                    Make yourself at home
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {accountActions.map((action) => {
                    const Icon = action.icon;

                    return (
                      <button
                        key={action.title}
                        type="button"
                        onClick={action.action}
                        className="group rounded-[1.35rem] border border-[#E7DEC8] bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#D8CEB9] hover:shadow-md sm:p-5"
                      >
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl ${action.accent}`}
                        >
                          <Icon size={19} />
                        </div>

                        <div className="mt-4 flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-sm font-extrabold text-[#1E3A27]">
                              {action.title}
                            </h4>

                            <p className="mt-1.5 text-xs leading-5 text-stone-500">
                              {action.description}
                            </p>
                          </div>

                          <ArrowRight
                            size={15}
                            className="mt-0.5 shrink-0 text-stone-300 transition group-hover:translate-x-1 group-hover:text-[#1E3A27]"
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Profile + account information */}
              <section className="mt-6 grid gap-5 sm:mt-8 lg:grid-cols-[1.3fr_0.7fr]">
                <div className="rounded-[1.75rem] border border-[#E7DEC8] bg-white shadow-sm">
                  <div className="border-b border-[#EEE7DA] px-5 py-5 sm:px-7">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B35427]">
                      Account details
                    </p>

                    <h3 className="mt-1 font-display text-xl font-extrabold text-[#1E3A27] sm:text-2xl">
                      Your information
                    </h3>
                  </div>

                  <dl className="divide-y divide-[#EEE7DA]">
                    <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-7">
                      <dt className="text-xs font-medium text-stone-500">
                        Full name
                      </dt>

                      <dd className="text-sm font-bold text-stone-800">
                        {user.name}
                      </dd>
                    </div>

                    <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-7">
                      <dt className="text-xs font-medium text-stone-500">
                        Email address
                      </dt>

                      <dd className="break-all text-sm font-bold text-stone-800 sm:text-right">
                        {user.email || 'Not provided'}
                      </dd>
                    </div>

                    <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-7">
                      <dt className="text-xs font-medium text-stone-500">
                        Phone number
                      </dt>

                      <dd className="text-sm font-bold text-stone-800">
                        {user.phone || 'Not provided'}
                      </dd>
                    </div>

                    <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-7">
                      <dt className="text-xs font-medium text-stone-500">
                        Account type
                      </dt>

                      <dd>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF5F0] px-3 py-1.5 text-[10px] font-bold capitalize text-[#1E3A27]">
                          <CheckCircle2 size={12} />
                          {user.role}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Account reassurance */}
                <div className="rounded-[1.75rem] border border-[#E7DEC8] bg-[#F4EBDD] p-5 sm:p-7">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1E3A27] text-white">
                    <ShieldCheck size={20} />
                  </div>

                  <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#B35427]">
                    Shopping with confidence
                  </p>

                  <h3 className="mt-1.5 font-display text-xl font-extrabold text-[#1E3A27]">
                    Your account, your way.
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-stone-600">
                    Keep your delivery details close, follow your orders and
                    return to your favourite products whenever you like.
                  </p>

                  <div className="mt-5 space-y-3">
                    {[
                      'Easy order tracking',
                      'Faster checkout',
                      'Delivery details ready at checkout',
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 text-xs font-semibold text-stone-700"
                      >
                        <CheckCircle2
                          size={15}
                          className="shrink-0 text-[#1E3A27]"
                        />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Sign out */}
              <section className="mt-5 flex flex-col gap-4 rounded-[1.5rem] border border-[#E7DEC8] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div>
                  <p className="text-sm font-extrabold text-[#1E3A27]">
                    Finished shopping for now?
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    You can sign back in anytime to continue where you left
                    off.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-xs font-bold text-red-700 transition hover:bg-red-100 sm:w-auto"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </section>
            </>
          ) : (
            /* Logged out */
            <>
              <section className="relative overflow-hidden rounded-[2rem] bg-[#1E3A27] text-white sm:rounded-[2.5rem]">
                <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/[0.04]" />
                <div className="absolute -bottom-28 left-1/4 h-64 w-64 rounded-full bg-[#B35427]/10" />

                <div className="relative mx-auto flex min-h-[430px] max-w-3xl flex-col items-center justify-center px-5 py-12 text-center sm:px-10">
                  <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/10">
                    <UserRound
                      size={36}
                      strokeWidth={1.5}
                    />
                  </div>

                  <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.2em] text-[#F4C95D] sm:text-xs">
                    Your ManaDeshi account
                  </p>

                  <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                    Welcome to your pantry.
                  </h2>

                  <p className="mt-4 max-w-lg text-sm leading-7 text-white/65">
                    Sign in or create an account to make checkout easier,
                    follow your orders and keep your ManaDeshi favourites
                    close.
                  </p>

                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#1E3A27] shadow-lg transition hover:bg-[#F7F2E9]"
                  >
                    Sign in or create account
                    <ArrowRight size={16} />
                  </button>
                </div>
              </section>

              <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  {
                    icon: ShieldCheck,
                    title: 'Secure account',
                    text: 'Your account details stay protected.',
                  },
                  {
                    icon: Package,
                    title: 'Track orders',
                    text: 'Keep an eye on every delivery.',
                  },
                  {
                    icon: Heart,
                    title: 'Save favourites',
                    text: 'Keep products you love close.',
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-[1.35rem] border border-[#E7DEC8] bg-white p-5 text-center shadow-sm"
                    >
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF5F0] text-[#1E3A27]">
                        <Icon size={18} />
                      </div>

                      <h3 className="mt-3 text-sm font-extrabold text-[#1E3A27]">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-stone-500">
                        {item.text}
                      </p>
                    </div>
                  );
                })}
              </section>
            </>
          )}
        </section>
      </main>
    </PageLayout>
  );
}

export default AccountPage;