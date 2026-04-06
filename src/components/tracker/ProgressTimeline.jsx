/**
 * ProgressTimeline — خط تقدم المعاملة
 * يُقرأ من اليمين لليسار (RTL) — الخطوة الأولى في أقصى اليمين
 * يعمل أفقياً على الشاشات الكبيرة وعمودياً على الموبايل
 */
import { motion } from 'framer-motion'
import { CheckCircle2, Loader2, Circle } from 'lucide-react'

function StepIcon({ step, index }) {
  if (step.done) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.15, type: 'spring', stiffness: 300 }}
        className="w-10 h-10 rounded-full flex items-center justify-center z-10"
        style={{ backgroundColor: 'var(--color-success)', boxShadow: '0 0 0 4px rgba(39,174,96,0.2)' }}
      >
        <CheckCircle2 size={20} className="text-white" />
      </motion.div>
    )
  }

  if (step.current) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.15, type: 'spring', stiffness: 300 }}
        className="w-10 h-10 rounded-full flex items-center justify-center z-10"
        style={{
          backgroundColor: 'var(--color-secondary)',
          boxShadow: '0 0 0 4px rgba(243,156,18,0.25), 0 0 16px rgba(243,156,18,0.3)',
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        >
          <Loader2 size={20} className="text-white" />
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center z-10"
      style={{
        backgroundColor: 'var(--color-bg-dark)',
        border: '2px solid var(--color-border)',
      }}
    >
      <Circle size={14} style={{ color: 'var(--color-text-muted)' }} />
    </div>
  )
}

/* ──────────────────────────────────────────────
   الـ Timeline الأفقي (md وما فوق) — RTL
   الخطوة الأولى على اليمين، الأخيرة على اليسار
   ────────────────────────────────────────────── */
function HorizontalTimeline({ steps }) {
  return (
    <div className="relative hidden md:flex flex-row-reverse items-start justify-between w-full pt-5">
      {/* الخط الرابط */}
      <div
        className="absolute top-10 right-10 left-10 h-0.5"
        style={{ backgroundColor: 'var(--color-border)' }}
      />

      {/* خط التقدم المتحرك */}
      {(() => {
        const doneCount = steps.filter((s) => s.done).length
        const pct = (doneCount / (steps.length - 1)) * 100
        return (
          <motion.div
            className="absolute top-10 right-10 h-0.5"
            style={{ backgroundColor: 'var(--color-success)', width: 0 }}
            animate={{ width: `calc(${pct}% - 0px)` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          />
        )
      })()}

      {/* الخطوات — مرتبة RTL (flex-row-reverse يضع الأول على اليمين) */}
      {steps.map((step, i) => (
        <div key={i} className="flex flex-col items-center gap-2 flex-1 relative">
          <StepIcon step={step} index={i} />

          <div className="text-center px-1">
            <p
              className="text-xs font-semibold leading-snug"
              style={{
                color: step.done
                  ? 'var(--color-success)'
                  : step.current
                  ? 'var(--color-secondary)'
                  : 'var(--color-text-muted)',
              }}
            >
              {step.label}
            </p>
            {step.date && (
              <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--color-text-muted)' }}>
                {step.date}
              </p>
            )}
            {step.current && (
              <span
                className="inline-block text-xs font-medium px-1.5 py-0.5 rounded mt-1 badge-warning"
              >
                الآن
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ──────────────────────────────────────────────
   الـ Timeline العمودي (موبايل)
   يتدفق من الأعلى لأسفل، الأيقونة على اليمين
   ────────────────────────────────────────────── */
function VerticalTimeline({ steps }) {
  return (
    <div className="flex md:hidden flex-col gap-0">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-3">
          {/* العمود الأيسر: الأيقونة + الخط */}
          <div className="flex flex-col items-center">
            <StepIcon step={step} index={i} />
            {i < steps.length - 1 && (
              <motion.div
                className="w-0.5 flex-1 mt-1"
                style={{
                  backgroundColor: step.done ? 'var(--color-success)' : 'var(--color-border)',
                  minHeight: '32px',
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.12 + 0.3, duration: 0.4, transformOrigin: 'top' }}
              />
            )}
          </div>

          {/* النص */}
          <div className="pb-6 pt-2 flex-1">
            <p
              className="text-sm font-semibold"
              style={{
                color: step.done
                  ? 'var(--color-success)'
                  : step.current
                  ? 'var(--color-secondary)'
                  : 'var(--color-text-muted)',
              }}
            >
              {step.label}
            </p>
            <div className="flex items-center gap-2 mt-1">
              {step.date && (
                <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
                  {step.date}
                </span>
              )}
              {step.current && (
                <span className="text-xs font-medium px-1.5 py-0.5 rounded badge-warning">
                  المرحلة الحالية
                </span>
              )}
              {!step.done && !step.current && (
                <span className="text-xs" style={{ color: 'var(--color-text-muted)', opacity: 0.6 }}>
                  في الانتظار
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ProgressTimeline({ transaction }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="card p-5"
    >
      <h3 className="text-base font-bold mb-5" style={{ color: 'var(--color-text-main)' }}>
        مراحل المعاملة
      </h3>

      {/* أفقي للشاشات الكبيرة، عمودي للموبايل */}
      <HorizontalTimeline steps={transaction.steps} />
      <VerticalTimeline steps={transaction.steps} />
    </motion.div>
  )
}
