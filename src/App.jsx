/**
 * App.jsx — الجذر الرئيسي لمنصة بابل
 * Lazy loading + Suspense + Layout wrapper + حماية المسارات
 */
import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PrivateRoute, PublicRoute } from './components/shared/PrivateRoute'
import Layout from './components/shared/Layout'

// Lazy load — تحميل عند الطلب فقط
const Splash    = lazy(() => import('./pages/Splash'))
const Login     = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Tracker   = lazy(() => import('./pages/Tracker'))
const Services  = lazy(() => import('./pages/Services'))
const Profile   = lazy(() => import('./pages/Profile'))
const Wallet    = lazy(() => import('./pages/Wallet'))

// Skeleton fallback بسيط أثناء التحميل
function PageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col gap-4 p-6" style={{ backgroundColor: 'var(--color-bg-dark)' }}>
      <div className="skeleton h-8 w-40 rounded-xl" />
      <div className="skeleton h-28 w-full rounded-2xl" />
      <div className="skeleton h-44 w-full rounded-2xl" />
      <div className="skeleton h-28 w-full rounded-2xl" />
    </div>
  )
}

// Preload all route chunks in the background after mount
function ChunkPreloader() {
  useEffect(() => {
    const t = setTimeout(() => {
      import('./pages/Dashboard')
      import('./pages/Tracker')
      import('./pages/Services')
      import('./pages/Profile')
      import('./pages/Wallet')
      import('./components/shared/Layout')
    }, 800)
    return () => clearTimeout(t)
  }, [])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <div dir="rtl" style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-dark)' }}>
        <ChunkPreloader />
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            {/* Splash */}
            <Route path="/" element={<Splash />} />

            {/* Login — عام، محجوب على المسجلين */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            {/* صفحات محمية داخل Layout */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/tracker"
              element={
                <PrivateRoute>
                  <Layout>
                    <Tracker />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/services"
              element={
                <PrivateRoute>
                  <Layout>
                    <Services />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </PrivateRoute>
              }
            />

            <Route
              path="/wallet"
              element={
                <PrivateRoute>
                  <Layout>
                    <Wallet />
                  </Layout>
                </PrivateRoute>
              }
            />

            <Route path="*" element={<Splash />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  )
}
