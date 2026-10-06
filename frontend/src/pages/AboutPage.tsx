import { Heart, Leaf, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';

export function AboutPage() {
  return (
    <PageLayout title="A taste of home, made with care" eyebrow="Our story">
      <main className="overflow-hidden">
        {/* INTRO */}
        <section className="bg-white">
          <div className="mx-auto grid w-full max-w-[1080px] gap-10 px-5 py-14 max-[639px]:px-4 sm:py-20 md:grid-cols-2 md:items-center md:gap-16">
            <div>
              <span className="mb-3 block text-xs font-bold uppercase tracking-[0.16em] text-[#B35427]">
                From our kitchen
              </span>

              <h2 className="font-['Playfair_Display',Georgia,serif] text-4xl font-bold leading-tight text-[#1E3A27] sm:text-5xl">
                Food that feels
                <br />
                <em>like home.</em>
              </h2>

              <div className="mt-6 space-y-4 text-sm leading-7 text-stone-600 sm:text-base">
                <p>
                  ManaDeshi Dukaan by Swathi brings traditional Telugu foods
                  from a home kitchen in Manikonda to your family table.
                </p>

                <p>
                  Our small batches are inspired by familiar recipes,
                  carefully chosen ingredients and the flavours we grew up
                  with.
                </p>

                <p>
                  From pickles and podis to ghee, snacks and sweets, each jar
                  and pack is prepared with the same attention we would give
                  food made for our own family.
                </p>
              </div>

              <Link
                to="/shop"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#1E3A27] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#2B5336]"
              >
                Explore homemade favourites
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-[28px] bg-[#F4EFE6]">
                <img
                  src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=90"
                  alt="Traditional homemade food"
                  className="h-[420px] w-full object-cover sm:h-[500px]"
                />
              </div>

              <div className="absolute bottom-5 left-5 rounded-2xl bg-white/95 px-5 py-4 shadow-lg backdrop-blur">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#B35427]">
                  <Sparkles size={14} />
                  ManaDeshi Dukaan
                </div>
                <p className="mt-1 text-sm font-semibold text-[#1E3A27]">
                  Traditional taste. Homemade care.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="bg-[#FAF7F2] py-14 sm:py-20">
          <div className="mx-auto w-full max-w-[1080px] px-5 max-[639px]:px-4">
            <div className="mb-10 max-w-[620px]">
              <span className="mb-3 block text-xs font-bold uppercase tracking-[0.16em] text-[#B35427]">
                What we believe
              </span>

              <h2 className="font-['Playfair_Display',Georgia,serif] text-3xl font-bold leading-tight text-[#1E3A27] sm:text-4xl">
                Simple food.
                <br />
                Honest values.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <article className="rounded-3xl border border-[#E7DEC8] bg-white p-6 transition-shadow hover:shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F4EFE6]">
                  <Heart className="text-[#B35427]" size={22} />
                </div>

                <h3 className="mt-5 font-['Playfair_Display',Georgia,serif] text-xl font-bold text-[#1E3A27]">
                  Made like home
                </h3>

                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Traditional recipes, familiar flavours and thoughtfully
                  prepared small batches.
                </p>
              </article>

              <article className="rounded-3xl border border-[#E7DEC8] bg-white p-6 transition-shadow hover:shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF1E8]">
                  <Leaf className="text-[#1E3A27]" size={22} />
                </div>

                <h3 className="mt-5 font-['Playfair_Display',Georgia,serif] text-xl font-bold text-[#1E3A27]">
                  Simple ingredients
                </h3>

                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Carefully selected ingredients, prepared with patience and
                  respect for tradition.
                </p>
              </article>

              <article className="rounded-3xl border border-[#E7DEC8] bg-white p-6 transition-shadow hover:shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF1D6]">
                  <MapPin className="text-[#B35427]" size={22} />
                </div>

                <h3 className="mt-5 font-['Playfair_Display',Georgia,serif] text-xl font-bold text-[#1E3A27]">
                  Local roots
                </h3>

                <p className="mt-2 text-sm leading-6 text-stone-600">
                  From Manikonda, Hyderabad, with traditional Telugu taste at
                  the heart of everything we make.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* MANIKONDA STORY */}
        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto grid w-full max-w-[1080px] gap-10 px-5 max-[639px]:px-4 md:grid-cols-2 md:items-center md:gap-16">
            <div className="order-2 md:order-1">
              <div className="rounded-[28px] bg-[#1E3A27] p-7 text-white sm:p-10">
                <MapPin className="mb-5 text-amber-300" size={28} />

                <span className="text-xs font-bold uppercase tracking-[0.16em] text-amber-200">
                  Our roots
                </span>

                <h2 className="mt-3 font-['Playfair_Display',Georgia,serif] text-3xl font-bold sm:text-4xl">
                  From Manikonda,
                  <br />
                  Hyderabad.
                </h2>

                <p className="mt-5 text-sm leading-7 text-white/80 sm:text-base">
                  Local roots, traditional Telugu taste and delivery for
                  homes across Hyderabad.
                </p>

                <div className="mt-7 h-px bg-white/15" />

                <p className="mt-5 text-xs leading-6 text-white/65">
                  Every order is a little connection between our kitchen and
                  your table.
                </p>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <span className="mb-3 block text-xs font-bold uppercase tracking-[0.16em] text-[#B35427]">
                Why ManaDeshi
              </span>

              <h2 className="font-['Playfair_Display',Georgia,serif] text-3xl font-bold leading-tight text-[#1E3A27] sm:text-4xl">
                Keeping familiar
                <br />
                flavours alive.
              </h2>

              <p className="mt-5 text-sm leading-7 text-stone-600 sm:text-base">
                We believe food carries memories. A spoonful of pickle, a
                familiar podi or a traditional sweet can bring back a kitchen,
                a festival or a meal shared with family.
              </p>

              <p className="mt-4 text-sm leading-7 text-stone-600 sm:text-base">
                ManaDeshi Dukaan is built around that feeling — making
                traditional favourites accessible while keeping the care and
                character of homemade food at the centre.
              </p>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="bg-[#FAF7F2] py-14 sm:py-20">
          <div className="mx-auto w-full max-w-[1080px] px-5 max-[639px]:px-4">
            <div className="mb-9 text-center">
              <span className="mb-3 block text-xs font-bold uppercase tracking-[0.16em] text-[#B35427]">
                From our kitchen
              </span>

              <h2 className="font-['Playfair_Display',Georgia,serif] text-3xl font-bold text-[#1E3A27] sm:text-4xl">
                Something for every table.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['Pickles', 'pickles'],
                ['Podis & Powders', 'powders'],
                ['Snacks', 'snacks'],
                ['Sweets', 'sweets'],
              ].map(([label, slug]) => (
                <Link
                  key={slug}
                  to={`/category/${slug}`}
                  className="group relative min-h-[190px] overflow-hidden rounded-2xl bg-[#1E3A27] text-white"
                >
                  <img
                    src={
                      {
                        pickles:
                          'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=85',
                        powders:
                          'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=85',
                        snacks:
                          'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85',
                        sweets:
                          'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=900&q=85',
                      }[slug]
                    }
                    alt={label}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
                      Explore
                    </span>

                    <h3 className="mt-1 font-['Playfair_Display',Georgia,serif] text-xl font-bold">
                      {label}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-[#1E3A27] px-5 py-14 text-white sm:py-20">
          <div className="mx-auto max-w-[700px] text-center">
            <span className="mb-3 block text-xs font-bold uppercase tracking-[0.16em] text-amber-200">
              ManaDeshi Dukaan by Swathi
            </span>

            <h2 className="font-['Playfair_Display',Georgia,serif] text-4xl font-bold leading-tight sm:text-5xl">
              Bring the taste of
              <br />
              <em>home</em> to your table.
            </h2>

            <p className="mx-auto mt-4 max-w-[520px] text-sm leading-7 text-white/75 sm:text-base">
              Discover traditional Telugu foods made with familiar flavours,
              carefully selected ingredients and plenty of care.
            </p>

            <Link
              to="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#1E3A27] transition-colors hover:bg-[#FAF7F2]"
            >
              Shop our collection
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}

export default AboutPage;