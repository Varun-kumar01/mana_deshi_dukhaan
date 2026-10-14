import { useState } from 'react';

import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Gift,
  Heart,
  Leaf,
  Package,
  Sparkles,
  Truck,
  Users,
} from 'lucide-react';

import { Link } from 'react-router-dom';

import { TopBar } from '../components/TopBar';
import { Footer } from '../components/Footer';

import { fallbackProducts } from '../data/mockData';

import { Product } from '../types';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1800&q=90';

const STORY_IMAGE =
  'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=1200&q=90';

const GIFT_IMAGE =
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=90';

const BENEFITS = [
  {
    icon: Gift,
    title: 'Thoughtful selections',
    description:
      'Traditional foods chosen to create a gift that feels personal, memorable and genuinely useful.',
  },
  {
    icon: Package,
    title: 'Custom combinations',
    description:
      'Build gifting collections around your budget, occasion, audience or brand requirements.',
  },
  {
    icon: Users,
    title: 'Bulk order support',
    description:
      'From a few dozen gifts to larger corporate requirements, we help coordinate the complete order.',
  },
  {
    icon: Truck,
    title: 'Delivery coordination',
    description:
      'We help organise packaging and delivery so your gifting experience stays simple from start to finish.',
  },
];

const OCCASIONS = [
  'Diwali & festive gifting',
  'Employee appreciation',
  'Client & partner gifting',
  'Wedding & event gifting',
  'New employee welcome kits',
  'Annual corporate celebrations',
];

const PROCESS = [
  {
    number: '01',
    title: 'Tell us what you need',
    description:
      'Share your occasion, approximate quantity, budget and any preferences.',
  },
  {
    number: '02',
    title: 'We curate your collection',
    description:
      'Our team helps you choose products and create a gifting combination that fits.',
  },
  {
    number: '03',
    title: 'Approve & confirm',
    description:
      'Once the selection and quantities are finalised, we prepare your order.',
  },
  {
    number: '04',
    title: 'We handle the rest',
    description:
      'Your gifts are packed carefully and coordinated for delivery.',
  },
];

const FAQS = [
  {
    question: 'What is the minimum quantity for corporate orders?',
    answer:
      'We can support both smaller business gifting requirements and larger bulk orders. Share your expected quantity with us and we will suggest the best approach.',
  },
  {
    question: 'Can we customise the gift combination?',
    answer:
      'Yes. You can combine different ManaDeshi products based on your budget, occasion and recipient preferences.',
  },
  {
    question: 'Can you help with festive gifting?',
    answer:
      'Yes. Festive gifting is one of the ideal use cases for our traditional food collections, and we can help curate suitable combinations.',
  },
  {
    question: 'Can gifts be sent to multiple addresses?',
    answer:
      'Multi-address requirements can be discussed with the gifting team when you submit your enquiry.',
  },
];

export function B2BPage() {
  const [products] = useState<Product[]>(fallbackProducts);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#fbf8f0] text-[#293723]">
      <TopBar
        products={products}
        onSelectProduct={() => undefined}
        isAdminView={false}
      />

      <main>
        {/* =========================================================
            HERO
        ========================================================= */}

        <section className="relative overflow-hidden bg-[#30482b] text-white">
          <div className="mx-auto grid min-h-[650px] w-full max-w-[1380px] lg:grid-cols-2">
            <div className="flex items-center px-6 py-20 sm:px-10 lg:px-16 xl:px-24">
              <div className="max-w-[610px]">
                <span className="mb-5 inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#dfaa70]">
                  <BriefcaseBusiness size={15} />
                  ManaDeshi Business Gifting
                </span>

                <h1 className="font-['Playfair_Display',Georgia,serif] text-[clamp(48px,6vw,78px)] leading-[0.98] tracking-[-0.04em]">
                  Give your
                  <br />
                  <em className="text-[#b7c99f]">
                    people something
                  </em>
                  <br />
                  to remember.
                </h1>

                <p className="mt-7 max-w-[530px] text-base leading-8 text-white/70 sm:text-lg">
                  Thoughtful traditional food gifts for
                  employees, clients, partners and the
                  people who help your business grow.
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/contact"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-[#30482b] transition-all hover:-translate-y-0.5"
                  >
                    Start an enquiry
                    <ArrowRight size={17} />
                  </Link>

                  <Link
                    to="/gifting"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-7 text-sm font-bold text-white transition-colors hover:bg-white/10"
                  >
                    Explore gifting
                  </Link>
                </div>

                <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs text-white/60">
                  <span className="flex items-center gap-2">
                    <Check size={14} className="text-[#b7c99f]" />
                    Custom selections
                  </span>

                  <span className="flex items-center gap-2">
                    <Check size={14} className="text-[#b7c99f]" />
                    Bulk orders
                  </span>

                  <span className="flex items-center gap-2">
                    <Check size={14} className="text-[#b7c99f]" />
                    Delivery support
                  </span>
                </div>
              </div>
            </div>

            <div className="relative min-h-[420px] lg:min-h-full">
              <img
                src={HERO_IMAGE}
                alt="Corporate gifting collection"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#30482b] via-transparent to-black/10 lg:from-[#30482b]/40" />

              <div className="absolute bottom-7 right-6 max-w-[270px] rounded-2xl bg-white/95 p-5 text-[#30482b] shadow-2xl backdrop-blur sm:right-10">
                <Sparkles
                  size={19}
                  className="text-[#d47b32]"
                />

                <p className="mt-3 font-['Playfair_Display',Georgia,serif] text-xl">
                  Traditional food.
                  <br />
                  Thoughtfully gifted.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            INTRO
        ========================================================= */}

        <section className="bg-white px-6 py-20 sm:py-28">
          <div className="mx-auto grid w-full max-w-[1120px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#d47b32]">
                Why ManaDeshi
              </span>

              <h2 className="mt-4 font-['Playfair_Display',Georgia,serif] text-4xl leading-tight tracking-[-0.03em] text-[#293723] sm:text-5xl">
                Corporate gifting
                <br />
                <em className="text-[#71865a]">
                  with meaning.
                </em>
              </h2>
            </div>

            <div className="max-w-[650px]">
              <p className="text-base leading-8 text-[#697265] sm:text-lg">
                Corporate gifting does not have to feel
                corporate.
              </p>

              <p className="mt-5 text-base leading-8 text-[#697265] sm:text-lg">
                We believe the best business gifts are
                useful, thoughtful and connected to a
                feeling. Traditional food does exactly that.
              </p>

              <p className="mt-5 text-base leading-8 text-[#697265] sm:text-lg">
                ManaDeshi helps businesses create food
                gifting experiences that feel warm,
                authentic and distinctly Indian.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================
            BENEFITS
        ========================================================= */}

        <section className="bg-[#f2eee3] px-5 py-20 sm:py-28">
          <div className="mx-auto w-full max-w-[1200px]">
            <div className="mx-auto max-w-[650px] text-center">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#d47b32]">
                Built around your needs
              </span>

              <h2 className="mt-4 font-['Playfair_Display',Georgia,serif] text-4xl text-[#293723] sm:text-5xl">
                More than a gift box.
              </h2>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {BENEFITS.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <article
                    key={benefit.title}
                    className="rounded-[24px] bg-white p-7"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#edf2e8] text-[#536b47]">
                      <Icon size={22} />
                    </div>

                    <h3 className="mt-7 font-['Playfair_Display',Georgia,serif] text-2xl text-[#293723]">
                      {benefit.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-[#697265]">
                      {benefit.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================
            STORY SPLIT
        ========================================================= */}

        <section className="bg-[#fbf8f0] px-5 py-20 sm:py-28">
          <div className="mx-auto grid w-full max-w-[1240px] overflow-hidden rounded-[30px] bg-[#e9eee2] lg:grid-cols-2">
            <div className="relative min-h-[430px]">
              <img
                src={STORY_IMAGE}
                alt="Traditional food gifting"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center px-7 py-12 sm:px-12 lg:px-16">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#d47b32]">
                A different kind of corporate gift
              </span>

              <h2 className="mt-4 font-['Playfair_Display',Georgia,serif] text-4xl leading-tight text-[#293723] sm:text-5xl">
                Something that
                <br />
                <em className="text-[#71865a]">
                  feels like home.
                </em>
              </h2>

              <p className="mt-6 text-sm leading-7 text-[#697265] sm:text-base">
                Our products are inspired by familiar
                Indian flavours — the kind that remind
                people of family kitchens, festivals and
                shared meals.
              </p>

              <p className="mt-4 text-sm leading-7 text-[#697265] sm:text-base">
                That makes them naturally suited to
                celebrations, appreciation, relationships
                and moments where you want your gift to
                say a little more.
              </p>

              <Link
                to="/gifting"
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#334d2d] px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5"
              >
                Explore gifting
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================
            OCCASIONS
        ========================================================= */}

        <section className="bg-white px-5 py-20 sm:py-28">
          <div className="mx-auto w-full max-w-[1100px]">
            <div className="text-center">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#d47b32]">
                Perfect for
              </span>

              <h2 className="mt-4 font-['Playfair_Display',Georgia,serif] text-4xl text-[#293723] sm:text-5xl">
                Every business occasion.
              </h2>
            </div>

            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {OCCASIONS.map((occasion) => (
                <div
                  key={occasion}
                  className="flex items-center gap-4 rounded-2xl border border-[#334d2d]/10 bg-[#fbf8f0] p-5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e9eee2] text-[#536b47]">
                    <Gift size={17} />
                  </span>

                  <span className="text-sm font-semibold text-[#465243]">
                    {occasion}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            PROCESS
        ========================================================= */}

        <section className="bg-[#334d2d] px-5 py-20 text-white sm:py-28">
          <div className="mx-auto w-full max-w-[1150px]">
            <div className="max-w-[600px]">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#dca164]">
                How it works
              </span>

              <h2 className="mt-4 font-['Playfair_Display',Georgia,serif] text-4xl sm:text-5xl">
                Simple from start
                <br />
                <em>to delivery.</em>
              </h2>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-4">
              {PROCESS.map((step) => (
                <article
                  key={step.number}
                  className="border-t border-white/15 pt-6"
                >
                  <span className="text-xs font-bold tracking-[0.15em] text-[#dca164]">
                    {step.number}
                  </span>

                  <h3 className="mt-7 font-['Playfair_Display',Georgia,serif] text-2xl">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-white/60">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            ENQUIRY CTA
        ========================================================= */}

        <section className="bg-[#f2eee3] px-5 py-20 sm:py-28">
          <div className="mx-auto max-w-[950px] overflow-hidden rounded-[30px] bg-[#71865a] px-7 py-14 text-center text-white sm:px-12 sm:py-20">
            <Heart
              size={28}
              className="mx-auto"
              fill="currentColor"
            />

            <h2 className="mt-5 font-['Playfair_Display',Georgia,serif] text-4xl leading-tight sm:text-6xl">
              Let's create a gift
              <br />
              <em>people remember.</em>
            </h2>

            <p className="mx-auto mt-5 max-w-[560px] text-sm leading-7 text-white/80 sm:text-base">
              Tell us about your gifting requirement and
              we can help you plan the right collection.
            </p>

            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-[#334d2d] transition-all hover:-translate-y-0.5"
            >
              Send an enquiry
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        {/* =========================================================
            FAQ
        ========================================================= */}

        <section className="bg-[#fbf8f0] px-5 py-20 sm:py-28">
          <div className="mx-auto max-w-[850px]">
            <div className="text-center">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#d47b32]">
                Questions
              </span>

              <h2 className="mt-3 font-['Playfair_Display',Georgia,serif] text-4xl text-[#293723] sm:text-5xl">
                Corporate gifting FAQ
              </h2>
            </div>

            <div className="mt-10 divide-y divide-[#334d2d]/10 border-y border-[#334d2d]/10">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index;

                return (
                  <button
                    key={faq.question}
                    type="button"
                    onClick={() =>
                      setOpenFaq(
                        isOpen ? null : index
                      )
                    }
                    className="block w-full py-6 text-left"
                  >
                    <div className="flex items-center justify-between gap-5">
                      <span className="text-sm font-bold text-[#334d2d] sm:text-base">
                        {faq.question}
                      </span>

                      <ChevronDown
                        size={18}
                        className={`shrink-0 text-[#71865a] transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>

                    {isOpen && (
                      <p className="mt-4 max-w-[720px] pr-6 text-sm leading-7 text-[#697265]">
                        {faq.answer}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================
            FINAL CTA
        ========================================================= */}

        <section className="bg-[#293723] px-5 py-20 text-white sm:py-24">
          <div className="mx-auto max-w-[800px] text-center">
            <Leaf
              size={25}
              className="mx-auto text-[#b7c99f]"
            />

            <h2 className="mt-5 font-['Playfair_Display',Georgia,serif] text-4xl sm:text-5xl">
              Good relationships deserve
              <br />
              <em className="text-[#b7c99f]">
                good gifts.
              </em>
            </h2>

            <p className="mx-auto mt-5 max-w-[550px] text-sm leading-7 text-white/60">
              Build a more thoughtful gifting experience
              with ManaDeshi Dukaan.
            </p>

            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-[#334d2d]"
            >
              Talk to us
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}

export default B2BPage;