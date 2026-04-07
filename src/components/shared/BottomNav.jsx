/**
 * BottomNav — شريط التنقل السفلي (mobile فقط < 1024px)
 * 4 روابط: الرئيسية / تتبع / الخدمات / حسابي
 */
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Search, BookOpen, User, WalletCards } from 'lucide-react'
import { motion } from 'framer-motion'

const LINKS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'الرئيسية' },
  { to: '/tracker',   icon: Search,          label: 'التتبع' },
  { to: '/services',  icon: BookOpen,         label: 'الخدمات' },
  { to: '/wallet',    icon: WalletCards,      label: 'محفظتي' },
  { to: '/profile',   icon: User,             label: 'حسابي' },
]

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 flex lg:hidden"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderTop: '1px solid var(--color-border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        backdropFilter: 'blur(12px)',
      }}
      aria-label="التنقل السفلي"
    >
      {LINKS.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          aria-label={label}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-colors relative"
          style={({ isActive }) => ({
            color: isActive ? 'var(--color-secondary)' : 'var(--color-text-muted)',
            minHeight: '52px',
          })}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.div
                  layoutId="bottomnav-active"
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full"
                  style={{ backgroundColor: 'var(--color-secondary)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <Icon size={19} strokeWidth={isActive ? 2.5 : 1.8} />
              <span style={{ fontSize: '10px' }}>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
