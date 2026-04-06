/**
 * Sidebar — شريط التنقل الجانبي للشاشات الكبيرة (>1024px)
 * قابل للطي: عرض كامل (272px) أو أيقونات فقط (72px)
 * يظهر فقط على lg وما فوق
 */
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Search, BookOpen, User,
  LogOut, ChevronRight, ChevronLeft, Shield,
} from 'lucide-react'
import useAppStore from '../../store/useAppStore'

const NAV_LINKS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'الرئيسية',     desc: 'لوحة التحكم' },
  { to: '/tracker',   icon: Search,          label: 'تتبع المعاملة', desc: 'حالة معاملاتك' },
  { to: '/services',  icon: BookOpen,         label: 'الخدمات',      desc: 'دليل الخدمات' },
  { to: '/profile',   icon: User,             label: 'حسابي',        desc: 'بياناتك الشخصية' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAppStore()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  const width = collapsed ? 72 : 272

  return (
    <motion.aside
      animate={{ width }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      className="hidden lg:flex flex-col fixed top-0 right-0 h-screen z-40 overflow-hidden"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderLeft: '1px solid var(--color-border)',
        width,
      }}
      aria-label="القائمة الجانبية"
    >
      {/* ── الرأس: شعار بابل ── */}
      <div
        className="flex items-center gap-3 px-4 py-5 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--color-border)', minHeight: '72px' }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'var(--color-secondary)' }}
        >
          <span className="text-white font-black text-lg">ب</span>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="text-base font-black leading-tight" style={{ color: 'var(--color-text-main)', whiteSpace: 'nowrap' }}>بابل</p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>البوابة الوطنية</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── روابط التنقل ── */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto" aria-label="التنقل الرئيسي">
        <div className="flex flex-col gap-1">
          {NAV_LINKS.map(({ to, icon: Icon, label, desc }) => (
            <NavLink
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              aria-label={label}
              className="group flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative"
              style={({ isActive }) => ({
                backgroundColor: isActive ? 'rgba(243,156,18,0.1)' : 'transparent',
                color: isActive ? 'var(--color-secondary)' : 'var(--color-text-muted)',
                minHeight: '48px',
              })}
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator strip */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full"
                      style={{ backgroundColor: 'var(--color-secondary)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className="flex-shrink-0"
                    style={{ color: isActive ? 'var(--color-secondary)' : 'var(--color-text-muted)' }}
                  />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="overflow-hidden"
                      >
                        <p
                          className="text-sm font-semibold leading-tight"
                          style={{ color: isActive ? 'var(--color-secondary)' : 'var(--color-text-main)', whiteSpace: 'nowrap' }}
                        >
                          {label}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                          {desc}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* ── القسم السفلي: المستخدم + خروج ── */}
      <div
        className="px-2 py-4 flex-shrink-0"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        {/* معلومات المستخدم */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2.5 px-3 py-3 rounded-xl mb-2"
            style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <User size={14} className="text-white" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--color-text-main)' }}>
                {user.name}
              </p>
              <p className="text-xs font-mono truncate" style={{ color: 'var(--color-text-muted)' }}>
                {user.nationalId}
              </p>
            </div>
          </motion.div>
        )}

        {/* زر الخروج */}
        <button
          onClick={handleLogout}
          aria-label="تسجيل الخروج"
          title={collapsed ? 'تسجيل الخروج' : undefined}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors"
          style={{
            backgroundColor: 'rgba(192,57,43,0.06)',
            color: 'var(--color-danger)',
            minHeight: '48px',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(192,57,43,0.15)' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(192,57,43,0.06)' }}
        >
          <LogOut size={18} className="flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-semibold"
                style={{ whiteSpace: 'nowrap' }}
              >
                تسجيل الخروج
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* ── زر الطي ── */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? 'توسيع القائمة' : 'طي القائمة'}
        className="absolute -left-3.5 top-20 w-7 h-7 rounded-full flex items-center justify-center z-50 transition-colors"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-muted)',
        }}
      >
        {collapsed ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
      </button>
    </motion.aside>
  )
}
