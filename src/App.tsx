import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TopBar } from './components/Layout/TopBar';
import { Navbar } from './components/Layout/Navbar';
import { Footer } from './components/Layout/Footer';
import { QuoteModal } from './components/QuoteModal';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { IntroLoader } from './components/IntroLoader';

// Public Pages
import { HomePage } from './pages/HomePage';
import { CorporatePage } from './pages/CorporatePage';
import { ReferencesPage } from './pages/ReferencesPage';
import { BrandsPage } from './pages/BrandsPage';
import { BrandDetailPage } from './pages/BrandDetailPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';

// Admin Panel Layout & Pages
import { AdminLayout } from './layouts/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminBrands } from './pages/admin/AdminBrands';
import { AdminHeroSlides } from './pages/admin/AdminHeroSlides';
import { AdminServices } from './pages/admin/AdminServices';
import { AdminPages } from './pages/admin/AdminPages';
import { AdminReferences } from './pages/admin/AdminReferences';
import { AdminGallery } from './pages/admin/AdminGallery';
import { AdminForms } from './pages/admin/AdminForms';
import { AdminSettings } from './pages/admin/AdminSettings';

// Auto scroll to top on route navigation
function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Protected Admin Route Guard
function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}

// Public Website Layout Component
function PublicLayout() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedProductOrService, setSelectedProductOrService] = useState<string | undefined>();

  const handleOpenQuoteModal = (productTitle?: string) => {
    setSelectedProductOrService(productTitle);
    setIsQuoteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white relative">
      <IntroLoader />
      <TopBar />
      <Navbar onOpenQuoteModal={() => handleOpenQuoteModal()} />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage onOpenQuoteModal={handleOpenQuoteModal} />} />
          <Route path="/kurumsal/:slug" element={<CorporatePage />} />
          <Route path="/referanslar" element={<ReferencesPage />} />
          <Route path="/kvkk" element={<CorporatePage />} />
          <Route path="/markalar" element={<BrandsPage />} />
          <Route path="/markalar/:slug" element={<BrandDetailPage onOpenQuoteModal={handleOpenQuoteModal} />} />
          <Route path="/urunler" element={<ProductsPage onOpenQuoteModal={handleOpenQuoteModal} />} />
          <Route path="/urunler/:slug" element={<ProductDetailPage onOpenQuoteModal={handleOpenQuoteModal} />} />
          <Route path="/hizmetler" element={<ServicesPage />} />
          <Route path="/hizmetler/:slug" element={<ServiceDetailPage onOpenQuoteModal={handleOpenQuoteModal} />} />
          <Route path="/galeri" element={<GalleryPage />} />
          <Route path="/iletisim" element={<ContactPage />} />
        </Routes>
      </main>

      <Footer />

      <ScrollToTopButton />

      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        initialProductOrService={selectedProductOrService}
      />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <LanguageProvider>
          <Router>
            <ScrollToTopOnRouteChange />
            <Routes>
              {/* Admin Login Route */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin Panel Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout />
                  </ProtectedAdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="hero-slides" element={<AdminHeroSlides />} />
                <Route path="brands" element={<AdminBrands />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="pages" element={<AdminPages />} />
                <Route path="references" element={<AdminReferences />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="forms" element={<AdminForms />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Public Website Routes */}
              <Route path="/*" element={<PublicLayout />} />
            </Routes>
          </Router>
        </LanguageProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
