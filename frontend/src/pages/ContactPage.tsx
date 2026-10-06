import {
  ArrowRight,
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';

const WHATSAPP_URL = 'https://wa.me/919951118687';
const PHONE_NUMBER = '+919951118687';

export function ContactPage() {
  return (
    <PageLayout title="We’d love to hear from you" eyebrow="Contact us">
      <div className="bg-[#FAF7F2]">
        {/* Main contact section */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            {/* WhatsApp CTA */}
            <div className="relative overflow-hidden rounded-[2rem] bg-[#1E3A27] p-7 text-white sm:p-10">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5" />
              <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-emerald-300/5" />

              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                  <MessageCircle size={27} className="text-amber-300" />
                </div>

                <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
                  ManaDeshi Dukaan by Swathi
                </p>

                <h2 className="mt-3 max-w-xl font-display text-3xl font-extrabold leading-tight sm:text-4xl">
                  Here to help with your order.
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
                  Questions about our homemade foods, delivery or an existing
                  order? Reach us directly and we’ll be happy to help.
                </p>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1E3A27] transition hover:bg-[#FAF7F2]"
                >
                  <MessageCircle size={17} />
                  Message us on WhatsApp
                  <ArrowRight size={16} />
                </a>

                <div className="mt-10 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                      Phone
                    </p>
                    <a
                      href={`tel:${PHONE_NUMBER}`}
                      className="mt-1 block text-sm font-semibold text-white hover:text-amber-300"
                    >
                      +91 99511 18687
                    </a>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                      Hours
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      9:00 AM – 9:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact details */}
            <div className="space-y-4">
              <article className="rounded-3xl border border-[#E7DEC8] bg-white p-6 transition hover:border-[#D8CEB9] hover:shadow-sm sm:p-7">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F7E8DC] text-[#B35427]">
                    <MapPin size={21} />
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold text-[#1E3A27]">
                      Visit / local delivery
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-stone-600">
                      Sai Srinivasa Nilayam, T4, Srinivasa Colony, Manikonda,
                      Hyderabad 500089
                    </p>
                  </div>
                </div>
              </article>

              <article className="rounded-3xl border border-[#E7DEC8] bg-white p-6 transition hover:border-[#D8CEB9] hover:shadow-sm sm:p-7">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F7E8DC] text-[#B35427]">
                    <Phone size={21} />
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold text-[#1E3A27]">
                      Call or WhatsApp
                    </h3>

                    <a
                      className="mt-2 block text-sm font-semibold text-stone-600 transition hover:text-[#B35427]"
                      href={`tel:${PHONE_NUMBER}`}
                    >
                      +91 99511 18687
                    </a>

                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-xs font-semibold text-[#B35427] hover:underline"
                    >
                      Start a WhatsApp chat
                    </a>
                  </div>
                </div>
              </article>

              <article className="rounded-3xl border border-[#E7DEC8] bg-white p-6 transition hover:border-[#D8CEB9] hover:shadow-sm sm:p-7">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF5F0] text-[#1E3A27]">
                    <Clock3 size={21} />
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold text-[#1E3A27]">
                      Store hours
                    </h3>

                    <p className="mt-2 text-sm text-stone-600">
                      Daily, 9:00 AM – 9:00 PM
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Location / service strip */}
        <section className="border-y border-[#E7DEC8] bg-white">
          <div className="mx-auto grid max-w-7xl gap-0 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
            <div className="flex items-start gap-4 border-b border-[#E7DEC8] py-7 md:border-b-0 md:border-r md:pr-8">
              <MapPin className="mt-1 shrink-0 text-[#B35427]" size={21} />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#B35427]">
                  Local roots
                </p>
                <p className="mt-1 text-sm leading-6 text-stone-600">
                  Proudly based in Manikonda, Hyderabad.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border-b border-[#E7DEC8] py-7 md:border-b-0 md:border-r md:px-8">
              <MessageCircle
                className="mt-1 shrink-0 text-[#1E3A27]"
                size={21}
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#1E3A27]">
                  Easy support
                </p>
                <p className="mt-1 text-sm leading-6 text-stone-600">
                  Reach us directly through WhatsApp or phone.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 py-7 md:pl-8">
              <Sparkles className="mt-1 shrink-0 text-[#B35427]" size={21} />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#B35427]">
                  Homemade favourites
                </p>
                <p className="mt-1 text-sm leading-6 text-stone-600">
                  Pickles, podis, snacks, sweets, ghee and more.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-[#F1E9DD] p-7 sm:p-10 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B35427]">
                Ready to order?
              </p>

              <h2 className="mt-2 font-display text-2xl font-extrabold text-[#1E3A27] sm:text-3xl">
                Find something that tastes like home.
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-7 text-stone-600">
                Explore our homemade favourites and discover traditional Telugu
                flavours for your table.
              </p>
            </div>

            <Link
              to="/shop"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#1E3A27] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2B5336]"
            >
              Browse the shop
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

export default ContactPage;