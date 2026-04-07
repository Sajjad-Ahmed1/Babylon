/**
 * AppHeader — الشريط العلوي مع لوحة الإشعارات
 */
import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Shield, User, LogOut, X, AlertTriangle, Info, AlertCircle } from 'lucide-react'
import useAppStore from '../../store/useAppStore'

const PAGE_TITLES = {
  '/dashboard': { title: 'الرئيسية',     sub: 'لوحة التحكم الذكية' },
  '/tracker':   { title: 'تتبع المعاملة', sub: 'الحالة الراهنة لمعاملاتك' },
  '/services':  { title: 'دليل الخدمات', sub: 'اعرف أوراقك قبل ما تروح' },
  '/wallet':    { title: 'محفظتي',        sub: 'وثائقي الرقمية' },
  '/profile':   { title: 'حسابي',         sub: 'بياناتك وإعداداتك' },
}

const SEVERITY_ICON = {
  danger:  { Icon: AlertTriangle, color: 'var(--color-danger)',   bg: 'rgba(192,57,43,0.12)'  },
  warning: { Icon: AlertCircle,   color: 'var(--color-warning)',  bg: 'rgba(230,126,34,0.12)' },
  info:    { Icon: Info,          color: '#5dade2',               bg: 'rgba(93,173,226,0.12)' },
}

function NotificationsPanel({ alerts, onClose, onNavigate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="absolute left-0 top-full mt-2 w-80 rounded-2xl overflow-hidden z-50"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}
    >
      {/* رأس اللوحة */}
      <div className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-2">
          <Bell size={15} style={{ color: 'var(--color-secondary)' }} />
          <h3 className="text-sm font-bold" style={{ color: 'var(--color-text-main)' }}>التنبيهات</h3>
          {alerts.length > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
              style={{ backgroundColor: 'rgba(192,57,43,0.2)', color: 'var(--color-danger)' }}>
              {alerts.length}
            </span>
          )}
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--color-text-muted)' }}>
          <X size={14} />
        </button>
      </div>

      {/* قائمة التنبيهات */}
      <div className="max-h-72 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <Bell size={28} className="mx-auto mb-2 opacity-20" style={{ color: 'var(--color-text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>لا توجد تنبيهات</p>
          </div>
        ) : (
          alerts.map((alert, i) => {
            const sev = SEVERITY_ICON[alert.severity] ?? SEVERITY_ICON.info
            const isClickable = !!alert.actionPath
            return (
              <div
                key={alert.id ?? i}
                onClick={isClickable ? () => onNavigate(alert.actionPath) : undefined}
                className="flex items-start gap-3 px-4 py-3"
                style={{
                  borderBottom: i < alerts.length - 1 ? '1px solid var(--color-border)' : 'none',
                  cursor: isClickable ? 'pointer' : 'default',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => { if (isClickable) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: sev.bg }}>
                  <sev.Icon size={15} style={{ color: sev.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold leading-snug" style={{ color: 'var(--color-text-main)' }}>
                    {alert.message}
                  </p>
                  {alert.action && (
                    <p className="text-xs mt-1 font-bold flex items-center gap-1"
                      style={{ color: sev.color }}>
                      {alert.action}
                      {isClickable && <span style={{ fontSize: '10px' }}>←</span>}
                    </p>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* تذييل */}
      <div className="px-4 py-2.5" style={{ borderTop: '1px solid var(--color-border)' }}>
        <p className="text-xs text-center" style={{ color: 'var(--color-text-muted)' }}>
          {alerts.length} تنبيه نشط
        </p>
      </div>
    </motion.div>
  )
}

export default function AppHeader() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const { user, alerts, logout } = useAppStore()
  const [showNotifs, setShowNotifs] = useState(false)
  const bellRef = useRef(null)

  const urgentCount = alerts.filter((a) => a.severity === 'danger').length
  const page = PAGE_TITLES[location.pathname] ?? { title: 'بابل', sub: '' }

  // إغلاق عند النقر خارج اللوحة
  useEffect(() => {
    if (!showNotifs) return
    function handleClick(e) {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setShowNotifs(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showNotifs])

  // إغلاق عند تغيير الصفحة
  useEffect(() => { setShowNotifs(false) }, [location.pathname])

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-3 sm:px-4 md:px-6 py-2.5"
      style={{
        backgroundColor: 'rgba(13,27,42,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
        minHeight: '56px',
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
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
          style={{ backgroundColor: 'rgba(27,79,114,0.2)' }}>
          <Shield size={12} style={{ color: 'var(--color-secondary)' }} />
          <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
            {user.nationalId}
          </span>
        </div>

        {/* زر التنبيهات + اللوحة */}
        <div className="relative" ref={bellRef}>
          <button
            onClick={() => setShowNotifs((v) => !v)}
            className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
            style={{
              backgroundColor: showNotifs ? 'rgba(243,156,18,0.15)' : 'rgba(27,79,114,0.15)',
              border: showNotifs ? '1px solid rgba(243,156,18,0.3)' : '1px solid transparent',
            }}
            aria-label={`التنبيهات — ${urgentCount} عاجلة`}
            aria-expanded={showNotifs}
          >
            <Bell size={18} style={{ color: urgentCount > 0 ? 'var(--color-secondary)' : 'var(--color-text-muted)' }} />
            {urgentCount > 0 && (
              <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-0.5 -left-0.5 w-4 h-4 rounded-full text-white flex items-center justify-center font-bold"
                style={{ backgroundColor: 'var(--color-danger)', fontSize: '9px' }}
              >
                {urgentCount}
              </motion.span>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <NotificationsPanel
                alerts={alerts}
                onClose={() => setShowNotifs(false)}
                onNavigate={(path) => { setShowNotifs(false); navigate(path) }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* الصورة الرمزية */}
        <button onClick={() => navigate('/profile')}
          className="flex items-center gap-2 pr-1"
          aria-label="فتح صفحة الحساب الشخصي">
          <div className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-primary)' }}>
            <User size={16} className="text-white" />
          </div>
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--color-text-main)' }}>
              {user.name.split(' ').slice(0, 2).join(' ')}
            </p>
          </div>
        </button>

        {/* خروج — mobile */}
        <button onClick={handleLogout}
          className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: 'rgba(192,57,43,0.1)', color: 'var(--color-danger)' }}
          aria-label="تسجيل الخروج">
          <LogOut size={16} />
        </button>
      </div>
    </header>
  )
}
