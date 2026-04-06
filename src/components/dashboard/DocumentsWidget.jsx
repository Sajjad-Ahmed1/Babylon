/**
 * DocumentsWidget — ودجت الوثائق الرسمية
 * يعرض البطاقة الوطنية، رخصة القيادة، وبطاقة المركبة
 * مع حالة كل وثيقة: سارية / قاربت على الانتهاء / منتهية
 */
import { motion } from 'framer-motion'
import { IdCard, Car, Truck, AlertTriangle, CheckCircle, Clock, ChevronLeft } from 'lucide-react'
import useAppStore from '../../store/useAppStore'

const ICON_MAP = { IdCard, Car, Truck }

function getStatusConfig(status, daysLeft) {
  if (status === 'expired') {
    return {
      label: 'منتهية الصلاحية',
      badgeClass: 'badge-danger',
      textColor: 'var(--color-danger)',
      icon: AlertTriangle,
      detail: `منذ ${Math.abs(daysLeft)} يوم`,
    }
  }
  if (status === 'expiring-soon') {
    return {
      label: 'تقترب من الانتهاء',
      badgeClass: 'badge-warning',
      textColor: 'var(--color-warning)',
      icon: Clock,
      detail: `تنتهي خلال ${daysLeft} يوم`,
    }
  }
  return {
    label: 'سارية المفعول',
    badgeClass: 'badge-success',
    textColor: 'var(--color-success)',
    icon: CheckCircle,
    detail: `تنتهي خلال ${daysLeft} يوم`,
  }
}

function DocumentCard({ doc, index }) {
  const IconComponent = ICON_MAP[doc.icon] || IdCard
  const status = getStatusConfig(doc.status, doc.daysLeft)
  const StatusIcon = status.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.35 }}
      className="card p-4 flex items-center gap-4 cursor-pointer"
      style={{ borderRight: `3px solid ${status.textColor}` }}
      whileHover={{ scale: 1.01 }}
    >
      {/* أيقونة الوثيقة */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${status.textColor}18` }}
      >
        <IconComponent size={22} style={{ color: status.textColor }} />
      </div>

      {/* المعلومات */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-main)' }}>
          {doc.type}
        </p>
        <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--color-text-muted)' }}>
          {doc.number}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <StatusIcon size={12} style={{ color: status.textColor }} />
          <span className="text-xs font-medium" style={{ color: status.textColor }}>
            {status.detail}
          </span>
        </div>
      </div>

      {/* الشارة والسهم */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <span
          className={`${status.badgeClass} text-xs font-medium px-2 py-0.5 rounded-full`}
        >
          {status.label}
        </span>
        <ChevronLeft size={14} style={{ color: 'var(--color-text-muted)' }} />
      </div>
    </motion.div>
  )
}

export default function DocumentsWidget() {
  const { documents } = useAppStore()

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold" style={{ color: 'var(--color-text-main)' }}>
          وثائقي الرسمية
        </h2>
        <span
          className="text-xs font-medium px-2 py-1 rounded-full badge-info"
        >
          {documents.length} وثائق
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {documents.map((doc, i) => (
          <DocumentCard key={doc.id} doc={doc} index={i} />
        ))}
      </div>
    </section>
  )
}
