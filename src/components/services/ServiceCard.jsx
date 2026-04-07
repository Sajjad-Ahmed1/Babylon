/**
 * ServiceCard — بطاقة الخدمة الحكومية
 * تعرض: حالة النظام، الأوراق المطلوبة، الرسوم، الوقت المتوقع، زر الحجز
 * هذا يحل مشكلة: "ما أعرف الأوراق المطلوبة قبل ما أروح"
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileCheck,
  Clock,
  Banknote,
  Building2,
  CalendarPlus,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react'
import BookingModal from './BookingModal'

function SystemStatusBadge({ status }) {
  const isUp = status === 'يعمل'
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{
        backgroundColor: isUp ? 'rgba(39,174,96,0.15)' : 'rgba(192,57,43,0.15)',
        color: isUp ? 'var(--color-success)' : 'var(--color-danger)',
        border: `1px solid ${isUp ? 'rgba(39,174,96,0.3)' : 'rgba(192,57,43,0.3)'}`,
      }}
    >
      <motion.span
        className="w-2 h-2 rounded-full inline-block"
        style={{ backgroundColor: isUp ? 'var(--color-success)' : 'var(--color-danger)' }}
        animate={isUp ? { opacity: [1, 0.4, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1.8 }}
      />
      {isUp ? 'النظام يعمل' : 'متوقف مؤقتاً'}
    </div>
  )
}

function MetaRow({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-2.5 py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: 'rgba(27,79,114,0.25)' }}
      >
        <Icon size={13} style={{ color: color ?? 'var(--color-secondary)' }} />
      </div>
      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{label}</span>
      <span className="text-xs font-semibold mr-auto" style={{ color: color ?? 'var(--color-text-main)' }}>
        {value}
      </span>
    </div>
  )
}

export default function ServiceCard({ service, categoryColor, index }) {
  const [expanded, setExpanded] = useState(false)
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.35 }}
        className="card overflow-hidden"
      >
        {/* شريط اللون العلوي */}
        <div className="h-1 w-full" style={{ backgroundColor: categoryColor }} />

        <div className="p-4">
          {/* رأس البطاقة */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3
              className="text-base font-bold leading-snug flex-1"
              style={{ color: 'var(--color-text-main)' }}
            >
              {service.name}
            </h3>
            <SystemStatusBadge status={service.systemStatus} />
          </div>

          {/* المعلومات الأساسية */}
          <div className="mb-3">
            <MetaRow icon={Clock}     label="الوقت المتوقع"  value={service.estimatedTime} color="var(--color-secondary)" />
            <MetaRow icon={Banknote}  label="الرسوم"         value={service.fee}           color="var(--color-success)" />
            <MetaRow icon={Building2} label="الجهة المختصة"  value={service.office} />
          </div>

          {/* الأوراق المطلوبة — قابلة للتوسيع */}
          <button
            onClick={() => setExpanded((e) => !e)}
            className="w-full flex items-center justify-between gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-colors"
            style={{
              backgroundColor: expanded ? `${categoryColor}18` : 'rgba(255,255,255,0.04)',
              color: expanded ? categoryColor : 'var(--color-text-muted)',
            }}
          >
            <div className="flex items-center gap-2">
              <FileCheck size={15} />
              <span>الأوراق المطلوبة ({service.requiredDocs.length})</span>
            </div>
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.22 }}>
              <ChevronDown size={15} />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <ul className="mt-2 flex flex-col gap-1.5 pr-1">
                  {service.requiredDocs.map((doc, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-start gap-2 text-sm"
                      style={{ color: 'var(--color-text-main)' }}
                    >
                      <CheckCircle2
                        size={14}
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: 'var(--color-success)' }}
                      />
                      {doc}
                    </motion.li>
                  ))}
                </ul>

                {/* ملاحظة إضافية */}
                {service.notes && (
                  <div
                    className="mt-3 flex items-start gap-2 px-3 py-2.5 rounded-lg text-xs leading-relaxed"
                    style={{
                      backgroundColor: 'rgba(243,156,18,0.08)',
                      color: 'var(--color-text-muted)',
                      borderRight: '2px solid var(--color-secondary)',
                    }}
                  >
                    <Info size={13} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-secondary)' }} />
                    {service.notes}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* زر الحجز */}
          <div className="mt-4">
            {service.canBookOnline ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowModal(true)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all"
                style={{
                  backgroundColor: categoryColor,
                  boxShadow: `0 4px 16px ${categoryColor}40`,
                }}
              >
                <CalendarPlus size={16} />
                احجز موعد الآن
              </motion.button>
            ) : (
              <div className="flex flex-col gap-2">
                {/* شارة الحضور الشخصي */}
                <div
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    color: 'var(--color-text-muted)',
                    border: '1px dashed var(--color-border)',
                  }}
                >
                  <AlertCircle size={15} />
                  الحضور الشخصي مطلوب
                </div>

                {/* سبب عدم توفر الحجز */}
                {service.walkInReason && (
                  <div
                    className="flex items-start gap-2 px-3 py-2 rounded-lg text-xs leading-relaxed"
                    style={{
                      backgroundColor: 'rgba(230,126,34,0.08)',
                      color: 'var(--color-text-muted)',
                      borderRight: '2px solid var(--color-warning)',
                    }}
                  >
                    <Info size={12} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-warning)' }} />
                    <span><strong style={{ color: 'var(--color-warning)' }}>السبب:</strong> {service.walkInReason}</span>
                  </div>
                )}

                {/* متوسط وقت الانتظار */}
                {service.avgWaitMinutes && (
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                    style={{
                      backgroundColor: 'rgba(27,79,114,0.2)',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    <Clock size={12} style={{ color: '#5dade2' }} />
                    <span>
                      متوسط الانتظار في الدائرة:{' '}
                      <strong style={{ color: '#5dade2' }}>{service.avgWaitMinutes} دقيقة</strong>
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <BookingModal
            service={service}
            categoryColor={categoryColor}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
