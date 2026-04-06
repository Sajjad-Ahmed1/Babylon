/**
 * ActiveTransactionsWidget — ودجت المعاملات النشطة
 * يعرض قائمة المعاملات الجارية مع شريط تقدم لكل منها وآخر تحديث
 */
import { motion } from 'framer-motion'
import { FileText, Clock, ChevronLeft, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '../../store/useAppStore'

function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="w-full h-1.5 rounded-full mt-2" style={{ backgroundColor: 'var(--color-border)' }}>
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: 'var(--color-secondary)' }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  )
}

function TransactionCard({ tx, index }) {
  const navigate = useNavigate()
  const pct = Math.round((tx.currentStep / tx.totalSteps) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.12, duration: 0.35 }}
      className="card p-4 cursor-pointer"
      whileHover={{ scale: 1.005 }}
      onClick={() => navigate('/tracker')}
    >
      <div className="flex items-start justify-between gap-3">
        {/* أيقونة + النوع */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(243,156,18,0.12)' }}
          >
            <FileText size={18} style={{ color: 'var(--color-secondary)' }} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-main)' }}>
              {tx.type}
            </p>
            <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              {tx.id}
            </p>
          </div>
        </div>

        {/* نسبة الإنجاز والسهم */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm font-bold" style={{ color: 'var(--color-secondary)' }}>
            {pct}%
          </span>
          <ChevronLeft size={14} style={{ color: 'var(--color-text-muted)' }} />
        </div>
      </div>

      {/* شريط التقدم */}
      <ProgressBar current={tx.currentStep} total={tx.totalSteps} />

      {/* التفاصيل السفلية */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1.5">
          <Clock size={11} style={{ color: 'var(--color-text-muted)' }} />
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            آخر تحديث: {tx.lastUpdate}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle2 size={11} style={{ color: 'var(--color-success)' }} />
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {tx.currentStep} من {tx.totalSteps} خطوات
          </span>
        </div>
      </div>

      {/* المرحلة الحالية */}
      <div
        className="mt-3 px-3 py-1.5 rounded-lg text-xs font-medium"
        style={{ backgroundColor: 'rgba(27,79,114,0.25)', color: '#5dade2' }}
      >
        المرحلة الحالية: {tx.steps.find((s) => s.current)?.label ?? tx.steps[tx.currentStep - 1]?.label}
      </div>
    </motion.div>
  )
}

export default function ActiveTransactionsWidget() {
  const { transactions } = useAppStore()

  if (!transactions || transactions.length === 0) {
    return (
      <section>
        <h2 className="text-base font-bold mb-3" style={{ color: 'var(--color-text-main)' }}>
          المعاملات النشطة
        </h2>
        <div
          className="card p-8 text-center"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <CheckCircle2 size={36} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">لا توجد معاملات نشطة حالياً</p>
          <p className="text-xs mt-1 opacity-70">✓ كل شيء على ما يرام</p>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold" style={{ color: 'var(--color-text-main)' }}>
          المعاملات النشطة
        </h2>
        <span className="badge-warning text-xs font-medium px-2 py-1 rounded-full">
          {transactions.length} جارية
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {transactions.map((tx, i) => (
          <TransactionCard key={tx.id} tx={tx} index={i} />
        ))}
      </div>
    </section>
  )
}
