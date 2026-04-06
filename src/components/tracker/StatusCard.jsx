/**
 * StatusCard — بطاقة الحالة الراهنة للمعاملة
 * يعرض: المكتب الحكومي الحالي، الوقت المتوقع، رقم التواصل
 */
import { motion } from 'framer-motion'
import { Building2, Clock, Phone, MapPin } from 'lucide-react'

// أرقام تواصل افتراضية حسب نوع الدائرة
const OFFICE_CONTACTS = {
  'مديرية الأحوال المدنية': '07700-123-456',
  'مديرية المرور العامة':   '07701-987-654',
  'هيئة التقاعد الوطنية':  '07702-555-888',
}

function getContactNumber(office) {
  const key = Object.keys(OFFICE_CONTACTS).find((k) => office.includes(k))
  return key ? OFFICE_CONTACTS[key] : '07700-000-000'
}

function InfoRow({ icon: Icon, label, value, valueColor }) {
  return (
    <div className="flex items-start gap-3 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ backgroundColor: 'rgba(27,79,114,0.3)' }}
      >
        <Icon size={15} style={{ color: 'var(--color-secondary)' }} />
      </div>
      <div className="flex-1">
        <p className="text-xs mb-0.5" style={{ color: 'var(--color-text-muted)' }}>
          {label}
        </p>
        <p
          className="text-sm font-semibold leading-snug"
          style={{ color: valueColor ?? 'var(--color-text-main)' }}
        >
          {value}
        </p>
      </div>
    </div>
  )
}

export default function StatusCard({ transaction }) {
  const contact = getContactNumber(transaction.office)
  const currentStepLabel =
    transaction.steps.find((s) => s.current)?.label ??
    transaction.steps[transaction.currentStep - 1]?.label

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="card p-5"
    >
      {/* العنوان */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-1.5 h-5 rounded-full"
          style={{ backgroundColor: 'var(--color-secondary)' }}
        />
        <h3 className="text-base font-bold" style={{ color: 'var(--color-text-main)' }}>
          الحالة الراهنة
        </h3>
      </div>

      {/* شارة الحالة */}
      <div
        className="mb-4 px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
        style={{ backgroundColor: 'rgba(243,156,18,0.12)', color: 'var(--color-secondary)' }}
      >
        <span className="w-2 h-2 rounded-full animate-pulse-slow inline-block"
          style={{ backgroundColor: 'var(--color-secondary)' }}
        />
        {currentStepLabel}
      </div>

      {/* تفاصيل */}
      <div className="divide-y-0">
        <InfoRow
          icon={Building2}
          label="الجهة المسؤولة حالياً"
          value={transaction.office}
        />
        <InfoRow
          icon={MapPin}
          label="الموقع"
          value="البصرة — المركز"
        />
        <InfoRow
          icon={Clock}
          label="ساعات الدوام"
          value="الأحد – الخميس، ٨ص – ٢م"
          valueColor="var(--color-text-muted)"
        />
        <div className="flex items-start gap-3 pt-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ backgroundColor: 'rgba(39,174,96,0.15)' }}
          >
            <Phone size={15} style={{ color: 'var(--color-success)' }} />
          </div>
          <div className="flex-1">
            <p className="text-xs mb-0.5" style={{ color: 'var(--color-text-muted)' }}>
              رقم التواصل
            </p>
            <a
              href={`tel:${contact.replace(/-/g, '')}`}
              className="text-sm font-bold font-mono"
              style={{ color: 'var(--color-success)' }}
              dir="ltr"
            >
              {contact}
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
