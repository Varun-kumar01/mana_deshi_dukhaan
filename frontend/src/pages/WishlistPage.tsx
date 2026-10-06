import {
  ArrowRight,
  Heart,
  Leaf,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { ProductCard } from '../components/ProductCard';
import { useWishlist } from '../context/WishlistContext';
import { fallbackProducts } from '../data/mockData';
import { fetchProducts } from '../services/api';
import type { Product } from '../types';

export function WishlistPage() {
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(fallbackProducts);

  useEffect(() => {
    let active = true;

    fetchProducts().then((result) => {
      if (active && result.length) {
        setProducts(result);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const savedProducts = products.filter((product) =>
    wishlist.includes(product.id),
  );

  return (
    <PageLayout title="Your wishlist" eyebrow="Saved favourites">
      <div className="bg-[#FAF7F2]">
        {/* Header */}
        <section className="mx-auto max-w-7xl px-4 pb-6 pt-8 sm:px-6 lg:px-8 lg:pb-8 lg:pt-12">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E7DEC8] bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#B35427]">
                <Heart size={13} />
                Your favourites
              </div>

              <h1 className="font-display text-3xl font-extrabold text-[#1E3A27] sm:text-4xl">
                Products you love
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-600">
                Keep your favourite homemade foods close and come back whenever
                you are ready to order.
              </p>
            </div>

            {savedProducts.length > 0 && (
              <div className="flex items-center gap-2 rounded-full bg-[#EEF5F0] px-4 py-2 text-sm font-semibold text-[#1E3A27]">
                <Heart size={16} />
                {savedProducts.length}{' '}
                {savedProducts.length === 1 ? 'favourite' : 'favourites'}
              </div>
            )}
          </div>
        </section>

        {/* Products */}
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
          {savedProducts.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {savedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenDetail={(selected) =>
                    navigate(`/product/${selected.id}`)
                  }
                />
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-[2rem] border border-[#E7DEC8] bg-white">
              <div className="flex min-h-[430px] flex-col items-center justify-center px-6 py-12 text-center sm:px-10">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F7E8DC]">
                  <Heart className="h-9 w-9 text-[#B35427]" />
                </div>

                <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-[#B35427]">
                  Nothing saved yet
                </p>

                <h2 className="mt-2 font-display text-2xl font-extrabold text-[#1E3A27] sm:text-3xl">
                  Your wishlist is waiting.
                </h2>

                <p className="mt-3 max-w-md text-sm leading-7 text-stone-600">
                  Tap the heart on any product you love and it will stay here
                  until you are ready to bring it home.
                </p>

                <Link
                  to="/shop"
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#1E3A27] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2B5336]"
                >
                  <ShoppingBag size={17} />
                  Browse the shop
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="grid border-t border-[#E7DEC8] bg-[#FAF7F2] sm:grid-cols-3">
                <div className="flex items-center gap-3 border-b border-[#E7DEC8] px-5 py-4 sm:border-b-0 sm:border-r">
                  <Leaf size={18} className="shrink-0 text-[#1E3A27]" />
                  <span className="text-xs font-semibold text-stone-600">
                    Traditional flavours
                  </span>
                </div>

                <div className="flex items-center gap-3 border-b border-[#E7DEC8] px-5 py-4 sm:border-b-0 sm:border-r">
                  <Sparkles size={18} className="shrink-0 text-[#B35427]" />
                  <span className="text-xs font-semibold text-stone-600">
                    Homemade favourites
                  </span>
                </div>

                <div className="flex items-center gap-3 px-5 py-4">
                  <Heart size={18} className="shrink-0 text-[#B35427]" />
                  <span className="text-xs font-semibold text-stone-600">
                    Saved for later
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </PageLayout>
  );
}

export default WishlistPage;