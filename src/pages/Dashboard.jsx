/**
 * Dashboard.jsx — لوحة التحكم الذكية (Phase 1)
 * Header و BottomNav يُوفّرهما Layout — هذه الصفحة تعرض المحتوى فقط
 * الترتيب: QuickActions → Alerts → Documents → Transactions
 */
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import DocumentsWidget from '../components/dashboard/DocumentsWidget'
import ActiveTransactionsWidget from '../components/dashboard/ActiveTransactionsWidget'
import AlertsWidget from '../components/dashboard/AlertsWidget'
import QuickActionsWidget from '../components/dashboard/QuickActionsWidget'
import useAppStore from '../store/useAppStore'

const SEVERITY_ORDER = { danger: 0, warning: 1, info: 2 }

function useWelcomeMessage(user, alerts, documents) {
  const topAlert = [...alerts].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
  )[0]

  if (!topAlert) {
    return { greeting: `مرحباً، ${user.name.split(' ')[0]}`, sub: 'جميع وثائقك في حالة جيدة', subColor: 'var(--color-success)', action: null }
  }

  const expiredDocs  = documents.filter((d) => d.status === 'expired')
  const expiringSoon = documents.filter((d) => d.status === 'expiring-soon')

  let sub      = topAlert.message
  let subColor = topAlert.severity === 'danger' ? 'var(--color-danger)' : topAlert.severity === 'warning' ? 'var(--color-warning)' : '#5dade2'
  let action   = topAlert.action
  let actionPath = topAlert.actionPath

  if (expiredDocs.length > 0) {
    const doc = expiredDocs[0]
    sub = `${doc.type} منتهية منذ ${Math.abs(doc.daysLeft)} يوم`
    subColor = 'var(--color-danger)'; action = 'جدد الآن'; actionPath = '/services'
  } else if (expiringSoon.length > 0) {
    const doc = expiringSoon[0]
    sub = `${doc.type} تنتهي خلال ${doc.daysLeft} يوم`
    subColor = 'var(--color-warning)'; action = 'ابدأ التجديد'; actionPath = '/services'
  }

  return { greeting: `مرحباً، ${user.name.split(' ')[0]}`, sub, subColor, action, actionPath }
}

const sectionVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function Dashboard() {
  const { user, alerts, documents } = useAppStore()
  const navigate = useNavigate()
  const welcome  = useWelcomeMessage(user, alerts, documents)

  return (
    <>
      {/* شريط الترحيب */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-main)' }}>
          {welcome.greeting}
        </h2>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <p className="text-sm font-medium" style={{ color: welcome.subColor }}>
            {welcome.sub}
          </p>
          {welcome.action && welcome.actionPath && (
            <>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>—</span>
              <button
                onClick={() => navigate(welcome.actionPath)}
                className="text-sm font-bold underline underline-offset-2 hover:opacity-80 transition-opacity"
                style={{ color: welcome.subColor }}
                aria-label={welcome.action}
              >
                {welcome.action}
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* Responsive grid: 1 col mobile → 2 col tablet → الـ widgets تختار عرضها */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* QuickActions — full width */}
        <motion.div variants={sectionVariants} className="md:col-span-2">
          <QuickActionsWidget />
        </motion.div>

        {/* Alerts — full width */}
        <motion.div variants={sectionVariants} className="md:col-span-2">
          <AlertsWidget />
        </motion.div>

        {/* Documents — يأخذ عمود كامل في mobile، نصف في tablet */}
        <motion.div variants={sectionVariants}>
          <DocumentsWidget />
        </motion.div>

        {/* Transactions — يأخذ عمود كامل في mobile، نصف في tablet */}
        <motion.div variants={sectionVariants}>
          <ActiveTransactionsWidget />
        </motion.div>
      </motion.div>
    </>
  )
}
