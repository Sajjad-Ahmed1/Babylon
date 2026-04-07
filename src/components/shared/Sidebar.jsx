/**
 * Sidebar — شريط التنقل الجانبي (desktop > 1024px)
 * collapsed state مُدار من Layout لمزامنة padding المحتوى
 */
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Search, BookOpen, User,
  LogOut, ChevronRight, ChevronLeft, WalletCards,
} from 'lucide-react'
import useAppStore from '../../store/useAppStore'

const NAV_LINKS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'الرئيسية',     desc: 'لوحة التحكم' },
  { to: '/tracker',   icon: Search,          label: 'تتبع المعاملة', desc: 'حالة معاملاتك' },
  { to: '/services',  icon: BookOpen,         label: 'الخدمات',      desc: 'دليل الخدمات' },
  { to: '/wallet',    icon: WalletCards,      label: 'محفظتي',       desc: 'وثائقي الرقمية' },
  { to: '/profile',   icon: User,             label: 'حسابي',        desc: 'بياناتك الشخصية' },
]

export default function Sidebar({ collapsed, onCollapse }) {
  const { user, logout } = useAppStore()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  const w = collapsed ? 72 : 272

  return (
    <aside
      className="hidden lg:flex flex-col fixed top-0 right-0 h-screen z-40 overflow-hidden"
      style={{
        width: w,
        backgroundColor: 'var(--color-bg-card)',
        borderLeft: '1px solid var(--color-border)',
        transition: 'width 0.22s cubic-bezier(0.4,0,0.2,1)',
        willChange: 'width',
      }}
      aria-label="القائمة الجانبية"
    >
      {/* ── الرأس ── */}
      <div
        className="flex items-center gap-3 px-4 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--color-border)', minHeight: '64px' }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'var(--color-secondary)' }}
        >
          <span className="text-white font-black text-base">ب</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-base font-black leading-tight whitespace-nowrap" style={{ color: 'var(--color-text-main)' }}>بابل</p>
            <p className="text-xs whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>البوابة الوطنية</p>
          </div>
        )}
      </div>

      {/* ── روابط التنقل ── */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto" aria-label="التنقل الرئيسي">
        <div className="flex flex-col gap-0.5">
          {NAV_LINKS.map(({ to, icon: Icon, label, desc }) => (
            <NavLink
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              aria-label={label}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-xl relative"
              style={({ isActive }) => ({
                backgroundColor: isActive ? 'rgba(243,156,18,0.1)' : 'transparent',
                color: isActive ? 'var(--color-secondary)' : 'var(--color-text-muted)',
                minHeight: '44px',
                transition: 'background-color 0.15s ease, color 0.15s ease',
              })}
            >
              {({ isActive }) => (
                <>
                  {/* Active strip */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                      style={{ backgroundColor: 'var(--color-secondary)' }}
                      transition={{ type: 'spring', stiffness: 600, damping: 40 }}
                    />
                  )}
                  <Icon
                    size={19}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className="flex-shrink-0"
                  />
                  {!collapsed && (
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold leading-tight whitespace-nowrap"
                        style={{ color: isActive ? 'var(--color-secondary)' : 'var(--color-text-main)' }}>
                        {label}
                      </p>
                      <p className="text-xs whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>
                        {desc}
                      </p>
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* ── المستخدم + خروج ── */}
      <div className="px-2 py-3 flex-shrink-0" style={{ borderTop: '1px solid var(--color-border)' }}>
        {!collapsed && (
          <div
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-1.5"
            style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'var(--color-primary)' }}>
              <User size={13} className="text-white" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--color-text-main)' }}>{user.name}</p>
              <p className="text-xs font-mono truncate" style={{ color: 'var(--color-text-muted)' }}>{user.nationalId}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          title={collapsed ? 'تسجيل الخروج' : undefined}
          aria-label="تسجيل الخروج"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl"
          style={{
            backgroundColor: 'rgba(192,57,43,0.06)',
            color: 'var(--color-danger)',
            minHeight: '44px',
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(192,57,43,0.15)' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(192,57,43,0.06)' }}
        >
          <LogOut size={17} className="flex-shrink-0" />
          {!collapsed && <span className="text-sm font-semibold whitespace-nowrap">تسجيل الخروج</span>}
        </button>
      </div>

      {/* ── زر الطي ── */}
      <button
        onClick={() => onCollapse(!collapsed)}
        aria-label={collapsed ? 'توسيع القائمة' : 'طي القائمة'}
        className="absolute -left-3 top-[72px] w-6 h-6 rounded-full flex items-center justify-center z-50"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-muted)',
          transition: 'background-color 0.15s ease',
        }}
      >
        {collapsed ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>
    </aside>
  )
}
