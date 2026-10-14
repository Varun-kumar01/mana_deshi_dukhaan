import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductPage } from './pages/ProductPage';
import { AboutPage } from './pages/AboutPage';
import { WhyUsPage } from './pages/WhyUsPage';
import { ContactPage } from './pages/ContactPage';
import { WishlistPage } from './pages/WishlistPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AccountPage } from './pages/AccountPage';
import { GiftingPage } from './pages/GiftingPage';
import { B2BPage } from './pages/B2BPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Routes>
              {/* Main storefront */}
              <Route path="/" element={<HomePage />} />

              {/* Shopping */}
              <Route path="/shop" element={<ShopPage />} />
              <Route
                path="/category/:slug"
                element={<CategoryPage />}
              />
              <Route
                path="/product/:id"
                element={<ProductPage />}
              />

              {/* Collections / discovery */}
              <Route path="/gifting" element={<GiftingPage />} />
              {/* <Route
                path="/gifting/:id"
                element={<ProductPage />}
              /> */}

              <Route path="/gifting/:id" element={<ProductPage />} />
              
              <Route path="/b2b" element={<B2BPage />} />

              {/* Brand */}
              <Route
                path="/our-story"
                element={<AboutPage />}
              />
              <Route
                path="/about"
                element={<AboutPage />}
              />
              <Route
                path="/why-us"
                element={<WhyUsPage />}
              />

              {/* Content */}
              <Route
                path="/blogs"
                element={<WhyUsPage />}
              />
              <Route
                path="/faqs"
                element={<ContactPage />}
              />
              <Route
                path="/contact"
                element={<ContactPage />}
              />

              {/* Customer */}
              <Route
                path="/wishlist"
                element={<WishlistPage />}
              />
              <Route
                path="/cart"
                element={<CartPage />}
              />
              <Route
                path="/checkout"
                element={<CheckoutPage />}
              />
              <Route
                path="/account/*"
                element={<AccountPage />}
              />

              {/* Legacy compatibility */}
              <Route
                path="*"
                element={<HomePage />}
              />
            </Routes>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;