/**
 * AlertsWidget — ودجت التنبيهات الاستباقية
 * يعرض أهم تنبيه فقط بشكل افتراضي مع زر "عرض الكل" قابل للتوسيع
 * الأحمر أولاً، ثم الأصفر، ثم الأزرق
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Clock, Info, X, ChevronLeft, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '../../store/useAppStore'

const SEVERITY_CONFIG = {
  danger: {
    icon: AlertTriangle,
    badgeClass: 'badge-danger',
    label: 'عاجل',
    borderColor: 'var(--color-danger)',
    bgColor: 'rgba(192,57,43,0.08)',
  },
  warning: {
    icon: Clock,
    badgeClass: 'badge-warning',
    label: 'تنبيه',
    borderColor: 'var(--color-warning)',
    bgColor: 'rgba(230,126,34,0.08)',
  },
  info: {
    icon: Info,
    badgeClass: 'badge-info',
    label: 'معلومة',
    borderColor: '#5dade2',
    bgColor: 'rgba(93,173,226,0.08)',
  },
}

const SEVERITY_ORDER = { danger: 0, warning: 1, info: 2 }

function AlertCard({ alert, onDismiss }) {
  const navigate = useNavigate()
  const config = SEVERITY_CONFIG[alert.severity]
  const IconComponent = config.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3 }}
      className="card p-4"
      style={{
        borderRight: `3px solid ${config.borderColor}`,
        backgroundColor: config.bgColor,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ backgroundColor: `${config.borderColor}20` }}
        >
          <IconComponent size={16} style={{ color: config.borderColor }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`${config.badgeClass} text-xs font-medium px-1.5 py-0.5 rounded`}>
              {config.label}
            </span>
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-main)' }}>
              {alert.title}
            </p>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            {alert.message}
          </p>

          {alert.action && (
            <button
              className="mt-2 flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-80"
              style={{ color: config.borderColor }}
              onClick={() => alert.actionPath && navigate(alert.actionPath)}
            >
              {alert.action}
              <ChevronLeft size={12} />
            </button>
          )}
        </div>

        <button
          onClick={() => onDismiss(alert.id)}
          className="p-1 rounded-lg transition-colors flex-shrink-0"
          style={{ color: 'var(--color-text-muted)' }}
          aria-label="إغلاق التنبيه"
        >
          <X size={14} />
        </button>
      </div>
    </motion.div>
  )
}

export default function AlertsWidget() {
  const { alerts, dismissAlert } = useAppStore()
  const [expanded, setExpanded] = useState(false)

  const sorted = [...alerts].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
  )

  // يُعرض دائماً التنبيه الأول فقط، والباقي عند الضغط
  const visible = expanded ? sorted : sorted.slice(0, 1)
  const hiddenCount = sorted.length - 1

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold" style={{ color: 'var(--color-text-main)' }}>
          التنبيهات والإشعارات
        </h2>
        {alerts.length > 0 && (
          <span className="badge-danger text-xs font-medium px-2 py-1 rounded-full">
            {alerts.length} تنبيهات
          </span>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="card p-6 text-center" style={{ color: 'var(--color-text-muted)' }}>
          <p className="text-sm">✓ لا توجد تنبيهات جديدة</p>
          <p className="text-xs mt-1 opacity-70">كل وثائقك في حالة جيدة</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2.5">
            <AnimatePresence mode="popLayout">
              {visible.map((alert) => (
                <AlertCard key={alert.id} alert={alert} onDismiss={dismissAlert} />
              ))}
            </AnimatePresence>
          </div>

          {/* زر التوسيع — يظهر فقط إذا كان هناك تنبيهات مخفية */}
          {hiddenCount > 0 && (
            <motion.button
              layout
              onClick={() => setExpanded((e) => !e)}
              className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-colors"
              style={{
                backgroundColor: 'rgba(255,255,255,0.04)',
                color: 'var(--color-text-muted)',
                border: '1px dashed var(--color-border)',
              }}
            >
              <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.22 }}
              >
                <ChevronDown size={14} />
              </motion.div>
              {expanded
                ? 'إخفاء التنبيهات'
                : `عرض جميع التنبيهات (${sorted.length})`}
            </motion.button>
          )}
        </>
      )}
    </section>
  )
}
