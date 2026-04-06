/**
 * Layout.jsx — الغلاف المشترك لجميع الصفحات المحمية
 * يوفر: Sidebar (desktop) + DashboardHeader (top bar) + BottomNav (mobile)
 * الصفحة الداخلية تضع محتواها فقط
 */
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import AppHeader from './AppHeader'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-dark)' }}>
      {/* Sidebar — desktop فقط */}
      <Sidebar />

      {/* المحتوى الرئيسي — يتحرك لليسار بجانب الـ sidebar */}
      <div className="lg:pr-[272px] transition-all duration-300">
        {/* Header */}
        <AppHeader />

        {/* محتوى الصفحة */}
        <motion.main
          key={typeof window !== 'undefined' ? window.location.pathname : ''}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="px-4 py-6 pb-24 lg:pb-10 max-w-5xl mx-auto"
        >
          {children}
        </motion.main>
      </div>

      {/* BottomNav — mobile فقط */}
      <BottomNav />
    </div>
  )
}
