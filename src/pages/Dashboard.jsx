/**
 * Dashboard.jsx — لوحة التحكم الذكية
 * تشمل: بطاقة الإجراء العاجل + رسالة الترحيب + الـ widgets
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import DocumentsWidget from '../components/dashboard/DocumentsWidget'
import ActiveTransactionsWidget from '../components/dashboard/ActiveTransactionsWidget'
import AlertsWidget from '../components/dashboard/AlertsWidget'
import QuickActionsWidget from '../components/dashboard/QuickActionsWidget'
import useAppStore from '../store/useAppStore'
import { X, ArrowLeft, AlertTriangle } from 'lucide-react'

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

  let sub = topAlert.message
  let subColor = topAlert.severity === 'danger' ? 'var(--color-danger)' : topAlert.severity === 'warning' ? 'var(--color-warning)' : '#5dade2'
  let action = topAlert.action
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

/* ────────────────────────────────────────
   بطاقة الإجراء العاجل
   ──────────────────────────────────────── */
function UrgentActionCard({ documents, navigate }) {
  const DISMISSED_KEY = 'babel-urgent-dismissed'
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISSED_KEY) === '1'
  )

  const expired = documents.find((d) => d.status === 'expired')
  if (!expired || dismissed) return null

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, '1')
    setDismissed(true)
  }

  const daysAgo = Math.abs(expired.daysLeft)

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -8 }}
          transition={{ duration: 0.35 }}
          className="relative mb-6 rounded-2xl p-5 overflow-hidden"
          style={{
            backgroundColor: 'rgba(192,57,43,0.08)',
            border: '1.5px solid rgba(192,57,43,0.45)',
          }}
        >
          {/* Pulse border animation */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            animate={{ opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            style={{ border: '2px solid rgba(192,57,43,0.5)' }}
          />

          {/* زر الإغلاق */}
          <button
            onClick={dismiss}
            className="absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'var(--color-text-muted)' }}
            aria-label="إغلاق التنبيه"
          >
            <X size={14} />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(192,57,43,0.2)' }}>
              <AlertTriangle size={22} style={{ color: 'var(--color-danger)' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-danger)', opacity: 0.8 }}>
                🚨 أهم إجراء الآن
              </p>
              <p className="text-base font-bold leading-snug mb-1" style={{ color: 'var(--color-text-main)' }}>
                {expired.type} منتهية منذ {daysAgo} يوم
              </p>
              <p className="text-sm mb-4" style={{ color: 'rgba(232,240,254,0.65)' }}>
                الغرامة تزداد كل يوم — جدد الآن قبل فوات الأوان
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/services')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ backgroundColor: 'var(--color-danger)', boxShadow: '0 4px 16px rgba(192,57,43,0.4)' }}
              >
                ابدأ تجديد {expired.type}
                <ArrowLeft size={15} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
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
      {/* بطاقة الإجراء العاجل */}
      <UrgentActionCard documents={documents} navigate={navigate} />

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
          <p className="text-sm font-medium" style={{ color: welcome.subColor }}>{welcome.sub}</p>
          {welcome.action && welcome.actionPath && (
            <>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>—</span>
              <button
                onClick={() => navigate(welcome.actionPath)}
                className="text-sm font-bold underline underline-offset-2 hover:opacity-80 transition-opacity"
                style={{ color: welcome.subColor }}
              >
                {welcome.action}
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* الـ widgets */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <motion.div variants={sectionVariants} className="md:col-span-2">
          <QuickActionsWidget />
        </motion.div>
        <motion.div variants={sectionVariants} className="md:col-span-2">
          <AlertsWidget />
        </motion.div>
        <motion.div variants={sectionVariants}>
          <DocumentsWidget />
        </motion.div>
        <motion.div variants={sectionVariants}>
          <ActiveTransactionsWidget />
        </motion.div>
      </motion.div>
    </>
  )
}
