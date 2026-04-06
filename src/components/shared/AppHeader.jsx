/**
 * AppHeader — الشريط العلوي المشترك لجميع الصفحات المحمية
 * يعرض: عنوان الصفحة الحالية، رقم الهوية، زر التنبيهات
 */
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bell, Shield, User, LogOut } from 'lucide-react'
import useAppStore from '../../store/useAppStore'

const PAGE_TITLES = {
  '/dashboard': { title: 'الرئيسية',     sub: 'لوحة التحكم الذكية' },
  '/tracker':   { title: 'تتبع المعاملة', sub: 'الحالة الراهنة لمعاملاتك' },
  '/services':  { title: 'دليل الخدمات', sub: 'اعرف أوراقك قبل ما تروح' },
  '/profile':   { title: 'حسابي',         sub: 'بياناتك وإعداداتك' },
}

export default function AppHeader() {
  const location = useLocation()
  const navigate  = useNavigate()
  const { user, alerts, logout } = useAppStore()

  const urgentCount = alerts.filter((a) => a.severity === 'danger').length
  const page = PAGE_TITLES[location.pathname] ?? { title: 'بابل', sub: '' }

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 py-3"
      style={{
        backgroundColor: 'rgba(13,27,42,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
        minHeight: '64px',
      }}
    >
      {/* عنوان الصفحة */}
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
      >
        <h1 className="text-lg font-bold leading-tight" style={{ color: 'var(--color-text-main)' }}>
          {page.title}
        </h1>
        <p className="text-xs hidden sm:block" style={{ color: 'var(--color-text-muted)' }}>
          {page.sub}
        </p>
      </motion.div>

      {/* الجانب الأيسر */}
      <div className="flex items-center gap-2">
        {/* الهوية */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
          style={{ backgroundColor: 'rgba(27,79,114,0.2)' }}
        >
          <Shield size={12} style={{ color: 'var(--color-secondary)' }} />
          <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
            {user.nationalId}
          </span>
        </div>

        {/* التنبيهات */}
        <button
          className="relative w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: 'rgba(27,79,114,0.15)' }}
          aria-label={`التنبيهات — ${urgentCount} عاجلة`}
        >
          <Bell size={18} style={{ color: urgentCount > 0 ? 'var(--color-secondary)' : 'var(--color-text-muted)' }} />
          {urgentCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -left-0.5 w-4 h-4 rounded-full text-white flex items-center justify-center font-bold"
              style={{ backgroundColor: 'var(--color-danger)', fontSize: '9px' }}
            >
              {urgentCount}
            </motion.span>
          )}
        </button>

        {/* الصورة الرمزية — mobile: يفتح profile */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 pr-1"
          aria-label="فتح صفحة الحساب الشخصي"
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <User size={16} className="text-white" />
          </div>
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--color-text-main)' }}>
              {user.name.split(' ').slice(0, 2).join(' ')}
            </p>
          </div>
        </button>

        {/* خروج — mobile */}
        <button
          onClick={handleLogout}
          className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: 'rgba(192,57,43,0.1)', color: 'var(--color-danger)' }}
          aria-label="تسجيل الخروج"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  )
}
