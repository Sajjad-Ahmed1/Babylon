/**
 * DashboardHeader — رأس الـ Dashboard
 * يعرض: اسم المستخدم، رقم الهوية المخفي جزئياً، وتاريخ آخر تسجيل دخول
 */
import { motion } from 'framer-motion'
import { User, Shield, Bell, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '../../store/useAppStore'

export default function DashboardHeader() {
  const { user, alerts, logout } = useAppStore()
  const navigate = useNavigate()
  const urgentCount = alerts.filter((a) => a.severity === 'danger').length

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderBottom: '1px solid var(--color-border)',
      }}
      className="px-4 py-4 md:px-8"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* الشعار والاسم */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <span className="text-white font-bold text-sm">ب</span>
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
              البوابة الوطنية للخدمات الحكومية
            </p>
            <h1 className="text-lg font-bold leading-tight" style={{ color: 'var(--color-text-main)' }}>
              بابل
            </h1>
          </div>
        </div>

        {/* بيانات المستخدم */}
        <div className="flex items-center gap-3">
          {/* زر التنبيهات */}
          <button
            className="relative p-2 rounded-lg transition-colors"
            style={{ backgroundColor: 'rgba(27,79,114,0.2)' }}
            aria-label="التنبيهات"
          >
            <Bell size={20} style={{ color: 'var(--color-text-muted)' }} />
            {urgentCount > 0 && (
              <span
                className="absolute -top-1 -left-1 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-danger)' }}
              >
                {urgentCount}
              </span>
            )}
          </button>

          {/* الهوية + الاسم */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ backgroundColor: 'rgba(27,79,114,0.2)' }}
          >
            <Shield size={14} style={{ color: 'var(--color-secondary)' }} />
            <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
              {user.nationalId}
            </span>
          </div>

          {/* الصورة الرمزية والاسم */}
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <User size={16} className="text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--color-text-main)' }}>
                {user.name}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {user.governorate}
              </p>
            </div>
          </div>

          {/* زر تسجيل الخروج */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg transition-colors"
            style={{ backgroundColor: 'rgba(192,57,43,0.1)', color: 'var(--color-danger)' }}
            aria-label="تسجيل الخروج"
            title="تسجيل الخروج"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </motion.header>
  )
}
