/**
 * EstimatedTimeCard — بطاقة الوقت المتوقع للإنجاز
 * التاريخ المحسوب دائماً من اليوم وإلى الأمام — لا يُعرض تاريخ في الماضي أبداً
 * addBusinessDays(today, estimatedDays) — الجمعة والسبت يُستثنيان
 */
import { motion } from 'framer-motion'
import { Timer, CalendarCheck, TrendingUp } from 'lucide-react'

/** يضيف N يوم عمل لتاريخ البداية، يتخطى الجمعة والسبت */
function addBusinessDays(startDate, days) {
  const result = new Date(startDate)
  let added = 0
  while (added < days) {
    result.setDate(result.getDate() + 1)
    const dow = result.getDay()
    if (dow !== 5 && dow !== 6) added++
  }
  return result
}

function getProgressColor(pct) {
  if (pct >= 80) return 'var(--color-success)'
  if (pct >= 50) return 'var(--color-secondary)'
  return '#5dade2'
}

function getEncouragementMessage(pct, estimatedDays) {
  if (pct >= 80) return 'معاملتك في مراحلها الأخيرة، قريباً جداً!'
  if (pct >= 60) return `تقدم ممتاز — متوقع الإنجاز خلال ${estimatedDays} أيام عمل`
  if (pct >= 40) return 'معاملتك تسير بشكل طبيعي، استمر في المتابعة'
  return 'طلبك قيد المعالجة، سنُعلمك عند كل تحديث'
}

export default function EstimatedTimeCard({ transaction }) {
  const pct = Math.round((transaction.currentStep / transaction.totalSteps) * 100)
  const barColor = getProgressColor(pct)
  const message = getEncouragementMessage(pct, transaction.estimatedDays)

  // التاريخ المتوقع = اليوم + الأيام المتبقية (من اليوم دائماً، ليس من تاريخ التقديم)
  const today = new Date()
  const expectedDate = addBusinessDays(today, transaction.estimatedDays)

  const expectedDateStr = expectedDate.toLocaleDateString('ar-IQ', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="card p-5"
    >
      {/* العنوان */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-5 rounded-full" style={{ backgroundColor: barColor }} />
        <h3 className="text-base font-bold" style={{ color: 'var(--color-text-main)' }}>
          الوقت المتوقع للإنجاز
        </h3>
      </div>

      {/* الأيام + التاريخ */}
      <div className="flex items-center gap-4 mb-5">
        <div
          className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${barColor}18`, border: `2px solid ${barColor}40` }}
        >
          <Timer size={18} style={{ color: barColor }} />
          <span className="text-lg font-black mt-0.5 leading-none" style={{ color: barColor }}>
            {transaction.estimatedDays}
          </span>
          <span className="text-xs" style={{ color: barColor, opacity: 0.7 }}>يوم</span>
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--color-text-main)' }}>
            متوقع الإنجاز خلال{' '}
            <span style={{ color: barColor }}>{transaction.estimatedDays} أيام عمل</span>
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <CalendarCheck size={12} style={{ color: barColor }} />
            <p className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
              {expectedDateStr}
            </p>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)', opacity: 0.6 }}>
            محسوب من تاريخ اليوم — أيام العمل فقط
          </p>
        </div>
      </div>

      {/* شريط التقدم */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={13} style={{ color: barColor }} />
            <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
              نسبة الإنجاز
            </span>
          </div>
          <span className="text-sm font-black" style={{ color: barColor }}>
            {pct}%
          </span>
        </div>

        <div
          className="w-full h-3 rounded-full overflow-hidden"
          style={{ backgroundColor: 'var(--color-border)' }}
        >
          <motion.div
            className="h-full rounded-full relative"
            style={{ backgroundColor: barColor }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
          >
            <motion.div
              className="absolute inset-y-0 right-0 w-6 rounded-full"
              style={{ background: 'linear-gradient(to left, rgba(255,255,255,0.3), transparent)' }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>

        <div className="flex justify-between mt-1">
          {Array.from({ length: transaction.totalSteps }).map((_, i) => (
            <span
              key={i}
              className="text-xs"
              style={{ color: i < transaction.currentStep ? barColor : 'var(--color-border)' }}
            >
              ●
            </span>
          ))}
        </div>
      </div>

      {/* رسالة تشجيعية */}
      <div
        className="px-3 py-2.5 rounded-lg text-xs leading-relaxed"
        style={{
          backgroundColor: `${barColor}10`,
          color: 'var(--color-text-muted)',
          borderRight: `2px solid ${barColor}`,
        }}
      >
        {message}
      </div>
    </motion.div>
  )
}
