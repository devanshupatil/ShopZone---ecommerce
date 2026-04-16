import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Favourites from './pages/Favourites';

function Layout({ children, showNavbar = true, showFooter = true }) {
  return (
    <>
      {showNavbar && <Navbar />}
      {children}
      {showFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/product/:id"
              element={
                <Layout>
                  <ProductDetail />
                </Layout>
              }
            />
            <Route
              path="/checkout"
              element={
                <Layout showNavbar={false} showFooter={false}>
                  <Checkout />
                </Layout>
              }
            />
            <Route
              path="/profile"
              element={
                <Layout>
                  <Profile />
                </Layout>
              }
            />
            <Route
              path="/favourites"
              element={
                <Layout>
                  <Favourites />
                </Layout>
              }
            />
          </Routes>
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
}
