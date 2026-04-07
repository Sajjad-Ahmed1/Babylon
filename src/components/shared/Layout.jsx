/**
 * Layout.jsx — الغلاف المشترك للصفحات المحمية
 * يملك collapsed state ويمرره للـ Sidebar لمزامنة padding المحتوى
 */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import AppHeader from './AppHeader'

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-dark)' }}>
      {/* Sidebar — desktop فقط */}
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />

      {/* المحتوى الرئيسي — يتكيف مع عرض الـ sidebar على desktop فقط */}
      <div
        className="flex flex-col min-h-screen layout-content"
        style={{ '--sidebar-w': collapsed ? '72px' : '272px' }}
      >
        {/* Header */}
        <AppHeader />

        {/* محتوى الصفحة */}
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="flex-1 px-3 sm:px-5 py-4 pb-24 lg:pb-8 max-w-5xl mx-auto w-full"
        >
          {children}
        </motion.main>
      </div>

      {/* BottomNav — mobile فقط */}
      <BottomNav />
    </div>
  )
}
