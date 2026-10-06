import {
  ArrowRight,
  CheckCircle2,
  LogOut,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { useState } from 'react';
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

  const [showAdmin, setShowAdmin] = useState(false);

  if (showAdmin && isAdmin) {
    return (
      <AdminDashboard
        onBackToStore={() => setShowAdmin(false)}
      />
    );
  }

  return (
    <PageLayout title="My account" eyebrow="Your profile">
      <div className="bg-[#FAF7F2]">
        <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          {isLoggedIn && user ? (
            <div className="overflow-hidden rounded-[2rem] border border-[#E7DEC8] bg-white">
              {/* Account header */}
              <div className="relative overflow-hidden bg-[#1E3A27] px-6 py-8 text-white sm:px-9 sm:py-10">
                <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/5" />
                <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-emerald-300/5" />

                <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                      <UserRound size={29} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
                        Welcome back
                      </p>

                      <h2 className="mt-1 font-display text-2xl font-extrabold sm:text-3xl">
                        {user.name}
                      </h2>

                      <p className="mt-1 text-sm text-white/65">
                        Manage your ManaDeshi Dukaan account
                      </p>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-bold text-white">
                      <ShieldCheck size={15} />
                      Administrator
                    </div>
                  )}
                </div>
              </div>

              {/* Account details */}
              <div className="p-6 sm:p-9">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#B35427]">
                    Account details
                  </p>

                  <h3 className="mt-1 font-display text-2xl font-extrabold text-[#1E3A27]">
                    Your information
                  </h3>
                </div>

                <dl className="mt-6 overflow-hidden rounded-2xl border border-[#E7DEC8]">
                  <div className="flex flex-col gap-1 border-b border-[#E7DEC8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                    <dt className="text-sm text-stone-500">
                      Full name
                    </dt>

                    <dd className="text-sm font-semibold text-stone-800">
                      {user.name}
                    </dd>
                  </div>

                  <div className="flex flex-col gap-1 border-b border-[#E7DEC8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                    <dt className="text-sm text-stone-500">
                      Email
                    </dt>

                    <dd className="break-all text-sm font-semibold text-stone-800">
                      {user.email || 'Not provided'}
                    </dd>
                  </div>

                  <div className="flex flex-col gap-1 border-b border-[#E7DEC8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                    <dt className="text-sm text-stone-500">
                      Phone
                    </dt>

                    <dd className="text-sm font-semibold text-stone-800">
                      {user.phone}
                    </dd>
                  </div>

                  <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                    <dt className="text-sm text-stone-500">
                      Account type
                    </dt>

                    <dd className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#EEF5F0] px-3 py-1 text-xs font-bold capitalize text-[#1E3A27]">
                      <CheckCircle2 size={13} />
                      {user.role}
                    </dd>
                  </div>
                </dl>

                {/* Actions */}
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setShowAdmin(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3A27] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2B5336]"
                    >
                      <ShieldCheck size={17} />
                      Admin dashboard
                      <ArrowRight size={15} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={logout}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-bold text-red-700 transition hover:bg-red-50"
                  >
                    <LogOut size={17} />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[2rem] border border-[#E7DEC8] bg-white">
              <div className="flex min-h-[430px] flex-col items-center justify-center px-6 py-12 text-center sm:px-10">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EEF5F0] text-[#1E3A27]">
                  <UserRound size={36} />
                </div>

                <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-[#B35427]">
                  Your account
                </p>

                <h2 className="mt-2 font-display text-2xl font-extrabold text-[#1E3A27] sm:text-3xl">
                  Sign in to your account
                </h2>

                <p className="mt-3 max-w-md text-sm leading-7 text-stone-600">
                  Sign in or create an account to make checkout faster and
                  keep your cart close.
                </p>

                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#1E3A27] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2B5336]"
                >
                  Sign in or register
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="border-t border-[#E7DEC8] bg-[#FAF7F2] px-6 py-5 text-center">
                <p className="text-xs text-stone-500">
                  Secure account access · Easy checkout · Your saved cart
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </PageLayout>
  );
}

export default AccountPage;