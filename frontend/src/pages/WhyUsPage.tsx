import {
  ArrowRight,
  Check,
  Heart,
  Leaf,
  PackageCheck,
  Sparkles,
  Sprout,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';

const reasons = [
  {
    icon: Heart,
    title: 'Traditional Telugu flavours',
    text: 'Food inspired by the recipes and tastes that make a meal feel like home.',
  },
  {
    icon: Sprout,
    title: 'Thoughtful ingredients',
    text: 'We focus on carefully selected ingredients and straightforward preparation.',
  },
  {
    icon: PackageCheck,
    title: 'Small-batch preparation',
    text: 'Prepared and packed with care so every order arrives ready for your table.',
  },
  {
    icon: Check,
    title: 'Made with care',
    text: 'A homegrown local business bringing homemade favourites to Hyderabad.',
  },
];

export function WhyUsPage() {
  return (
    <PageLayout
      title="Good food, made the traditional way"
      eyebrow="Why ManaDeshi"
    >
      <div className="bg-[#FAF7F2]">
        {/* Intro */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D9E5DC] bg-[#EEF5F0] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#1E3A27]">
                <Sparkles size={14} />
                Why choose us
              </div>

              <h1 className="max-w-3xl font-display text-4xl font-extrabold leading-tight tracking-tight text-[#1E3A27] sm:text-5xl lg:text-6xl">
                A little tradition in every bite.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">
                ManaDeshi Dukaan by Swathi brings traditional Telugu flavours
                from a homegrown kitchen to your table. We keep things
                thoughtful, familiar and rooted in the food we grew up loving.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1E3A27] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#2B5336]"
                >
                  Explore the shop
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#D9D0C0] bg-white px-5 py-3 text-sm font-bold text-[#1E3A27] transition hover:border-[#BFB39F] hover:bg-[#F5F0E8]"
                >
                  Our story
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -right-2 -top-2 h-24 w-24 rounded-full bg-[#E6EFE8] blur-2xl" />
              <div className="absolute -bottom-3 -left-3 h-28 w-28 rounded-full bg-[#F2DCCB] blur-2xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-[#E7DEC8] bg-white p-3 shadow-sm">
                <div className="flex min-h-[320px] flex-col justify-between rounded-[1.5rem] bg-[#1E3A27] p-7 text-white sm:min-h-[360px] sm:p-9">
                  <div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                      <Leaf size={27} className="text-amber-300" />
                    </div>

                    <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
                      Rooted in tradition
                    </p>

                    <h2 className="mt-3 max-w-md font-display text-3xl font-extrabold leading-tight sm:text-4xl">
                      Homemade favourites for Hyderabad homes.
                    </h2>
                  </div>

                  <p className="max-w-md text-sm leading-7 text-white/70">
                    Traditional Telugu taste, carefully selected ingredients
                    and small-batch preparation come together in every pack.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reasons */}
        <section className="border-y border-[#E7DEC8] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B35427]">
                What makes us different
              </p>

              <h2 className="mt-3 font-display text-3xl font-extrabold text-[#1E3A27] sm:text-4xl">
                Simple values behind every order
              </h2>

              <p className="mt-4 text-sm leading-7 text-stone-600 sm:text-base">
                We focus on familiar flavours, thoughtful preparation and the
                feeling of food made with genuine care.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {reasons.map(({ icon: Icon, title, text }) => (
                <article
                  key={title}
                  className="group rounded-3xl border border-[#E7DEC8] bg-[#FAF7F2] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#D8CEB9] hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF5F0] text-[#1E3A27] transition group-hover:bg-[#1E3A27] group-hover:text-white">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-5 font-display text-xl font-bold text-[#1E3A27]">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-stone-600">
                    {text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Care section */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-[#E7DEC8] bg-white p-7 md:col-span-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7E8DC] text-[#B35427]">
                <Heart size={23} />
              </div>

              <h2 className="mt-5 font-display text-2xl font-extrabold text-[#1E3A27] sm:text-3xl">
                Made with the care we would give our own family.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
                Every product is inspired by familiar recipes and the tastes
                that make everyday meals special. Our goal is simple: bring
                homemade favourites to your table while keeping the experience
                warm, honest and easy.
              </p>
            </div>

            <div className="rounded-3xl bg-[#F1E9DD] p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#1E3A27]">
                <Sprout size={23} />
              </div>

              <h2 className="mt-5 font-display text-2xl font-extrabold text-[#1E3A27]">
                From our kitchen to yours.
              </h2>

              <p className="mt-3 text-sm leading-7 text-stone-600">
                Thoughtful preparation, familiar flavours and a local
                Hyderabad connection.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#1E3A27] px-6 py-10 text-white sm:px-10 sm:py-12">
            <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/5" />
            <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-emerald-300/5" />

            <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
                  Bring home a favourite
                </p>

                <h2 className="mt-2 max-w-2xl font-display text-3xl font-extrabold leading-tight sm:text-4xl">
                  Discover the flavours that feel like home.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-7 text-white/70">
                  Browse our homemade pickles, podis, snacks, sweets, ghee and
                  more.
                </p>
              </div>

              <Link
                to="/shop"
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-[#FAF7F2] px-5 py-3 text-sm font-bold text-[#1E3A27] transition hover:bg-white"
              >
                <Leaf size={17} />
                Browse the shop
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

export default WhyUsPage;