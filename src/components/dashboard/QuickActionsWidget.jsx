/**
 * QuickActionsWidget — ودجت الإجراءات السريعة
 * أزرار مباشرة للخدمات الثلاث الأساسية + تتبع المعاملة
 * كل زر يوضح ماذا سيحدث بعد الضغط عليه
 */
import { motion } from 'framer-motion'
import { IdCard, Car, Heart, Search, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ACTIONS = [
  {
    id: 'renew-id',
    label: 'تجديد البطاقة الوطنية',
    description: 'ابدأ طلب التجديد الآن',
    icon: IdCard,
    color: '#1B4F72',
    bgColor: 'rgba(27,79,114,0.2)',
    path: '/services',
  },
  {
    id: 'renew-vehicle',
    label: 'تجديد بطاقة المركبة',
    description: 'اعرف الأوراق المطلوبة',
    icon: Car,
    color: '#F39C12',
    bgColor: 'rgba(243,156,18,0.15)',
    path: '/services',
  },
  {
    id: 'retirement',
    label: 'التقاعد والرعاية',
    description: 'تحديث بيانات التقاعد',
    icon: Heart,
    color: '#27AE60',
    bgColor: 'rgba(39,174,96,0.15)',
    path: '/services',
  },
  {
    id: 'track',
    label: 'تتبع المعاملة',
    description: 'اعرف وين وصلت معاملتك',
    icon: Search,
    color: '#5dade2',
    bgColor: 'rgba(93,173,226,0.15)',
    path: '/tracker',
  },
]

function ActionButton({ action, index }) {
  const navigate = useNavigate()
  const IconComponent = action.icon

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.07, duration: 0.3 }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(action.path)}
      className="card p-4 text-right flex flex-col gap-2 w-full"
      style={{ cursor: 'pointer' }}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: action.bgColor }}
        >
          <IconComponent size={20} style={{ color: action.color }} />
        </div>
        <ArrowLeft size={14} style={{ color: 'var(--color-text-muted)' }} />
      </div>
      <div>
        <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--color-text-main)' }}>
          {action.label}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          {action.description}
        </p>
      </div>
    </motion.button>
  )
}

export default function QuickActionsWidget() {
  return (
    <section>
      <h2 className="text-base font-bold mb-3" style={{ color: 'var(--color-text-main)' }}>
        إجراءات سريعة
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map((action, i) => (
          <ActionButton key={action.id} action={action} index={i} />
        ))}
      </div>
    </section>
  )
}
