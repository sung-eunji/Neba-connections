/**
 * @description This file defines the main application component with HashRouter configuration and all page routes.
 * It includes the global layout with Header and Footer components, and manages the RFQ modal state.
 * The app handles routing for all main pages and ensures proper navigation throughout the application.
 */
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProductsPage } from './pages/ProductsPage';
import { PartnershipPage } from './pages/PartnershipPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsAndConditionsPage } from './pages/TermsAndConditionsPage';
import { LoginPage } from './pages/LoginPage';
import { AdminLayout } from './pages/AdminLayout';
import { AdminPage } from './pages/AdminPage';
import { useUser } from './hooks/useUser';
import { SpinnerCentered } from './components/admin/SpinnerCentered';
import { ChatbotWidget } from './components/ChatbotWidget';

// Layout for the main public-facing site with enhanced structure
const MainLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-white">
    <Header />
    <main className="flex-1" role="main">
      {children}
    </main>
    <Footer />
  </div>
);

// Component to handle route protection and layout switching
const AppRoutes = () => {
  const { user, isLoading: isAuthLoading } = useUser();
  const allowedEmail = import.meta.env.VITE_USER_EMAIL || 'admin@neba.com';

  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />
      <Route
        path="/about"
        element={
          <MainLayout>
            <AboutPage />
          </MainLayout>
        }
      />
      <Route
        path="/products"
        element={
          <MainLayout>
            <ProductsPage />
          </MainLayout>
        }
      />
      <Route
        path="/partnership"
        element={
          <MainLayout>
            <PartnershipPage />
          </MainLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <MainLayout>
            <ContactPage />
          </MainLayout>
        }
      />
      <Route
        path="/privacy-policy"
        element={
          <MainLayout>
            <PrivacyPolicyPage />
          </MainLayout>
        }
      />
      <Route
        path="/terms-and-conditions"
        element={
          <MainLayout>
            <TermsAndConditionsPage />
          </MainLayout>
        }
      />

      {/* Standalone login page without main layout */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin routes with their own layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route
          index
          element={
            isAuthLoading ? (
              <SpinnerCentered message="Loading admin dashboard..." />
            ) : user?.email === allowedEmail ? (
              <AdminPage />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />
        <Route path="login" element={<LoginPage adminLogin={true} />} />
      </Route>

      {/* Catch all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export const App = () => {
  return (
    <HashRouter>
      <div className="relative">
        <AppRoutes />
        <ChatbotWidget />
      </div>
    </HashRouter>
  );
};
