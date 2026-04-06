/**
 * TransactionHeader — رأس صفحة تتبع المعاملة
 * يعرض: رقم المعاملة، نوعها، تاريخ التقديم، وآخر تحديث
 */
import { motion } from 'framer-motion'
import { FileText, Calendar, RefreshCw, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function TransactionHeader({ transaction }) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card p-5"
    >
      {/* زر الرجوع + العنوان */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(243,156,18,0.15)' }}
          >
            <FileText size={22} style={{ color: 'var(--color-secondary)' }} />
          </div>
          <div>
            <p
              className="text-xs font-medium mb-0.5"
              style={{ color: 'var(--color-text-muted)' }}
            >
              رقم المعاملة
            </p>
            <p
              className="text-base font-bold font-mono tracking-wide"
              style={{ color: 'var(--color-secondary)' }}
            >
              {transaction.id}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
          style={{
            color: 'var(--color-text-muted)',
            backgroundColor: 'rgba(255,255,255,0.05)',
          }}
        >
          <ArrowRight size={14} />
          رجوع
        </button>
      </div>

      {/* نوع المعاملة */}
      <h2
        className="text-lg font-bold mb-4 leading-snug"
        style={{ color: 'var(--color-text-main)' }}
      >
        {transaction.type}
      </h2>

      {/* التواريخ */}
      <div className="flex items-center gap-5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Calendar size={13} style={{ color: 'var(--color-text-muted)' }} />
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            تاريخ التقديم:
          </span>
          <span className="text-xs font-semibold" style={{ color: 'var(--color-text-main)' }}>
            {transaction.submittedAt}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <RefreshCw size={13} style={{ color: 'var(--color-success)' }} />
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            آخر تحديث:
          </span>
          <span className="text-xs font-semibold" style={{ color: 'var(--color-success)' }}>
            {transaction.lastUpdate}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
