/**
 * OfficeStatusWidget — حالة الدوائر الحكومية الآن
 * يحل مشكلة: "ما أعرف هل النظام يعمل أم لا قبل ما أروح"
 */
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Users, TrendingUp, RefreshCw } from 'lucide-react'

const OFFICES = [
  {
    id: 'civil',
    name: 'مديرية الأحوال المدنية',
    district: 'البصرة المركز',
    status: 'active',
    crowd: 'moderate',
    bestTime: '9–11 صباحاً',
    waitMinutes: 45,
    hours: 'الأحد–الخميس: 8ص–2م',
  },
  {
    id: 'traffic',
    name: 'مديرية المرور',
    district: 'شارع العشار',
    status: 'slow',
    crowd: 'heavy',
    bestTime: '12–1 ظهراً',
    waitMinutes: 75,
    hours: 'الأحد–الخميس: 8ص–2م',
  },
  {
    id: 'retirement',
    name: 'دائرة التقاعد',
    district: 'البصرة — حي الجمهورية',
    status: 'active',
    crowd: 'light',
    bestTime: '10ص–12م',
    waitMinutes: 20,
    hours: 'الأحد–الخميس: 8ص–2م',
  },
]

const STATUS_MAP = {
  active: { label: 'يعمل',    dot: '#27AE60', bg: 'rgba(39,174,96,0.12)',  border: 'rgba(39,174,96,0.25)' },
  slow:   { label: 'بطيء',   dot: '#E67E22', bg: 'rgba(230,126,34,0.12)', border: 'rgba(230,126,34,0.25)' },
  down:   { label: 'متوقف',  dot: '#C0392B', bg: 'rgba(192,57,43,0.12)',  border: 'rgba(192,57,43,0.25)' },
}

const CROWD_MAP = {
  light:    { label: 'ازدحام خفيف',  color: '#27AE60', fill: 1 },
  moderate: { label: 'ازدحام متوسط', color: '#E67E22', fill: 2 },
  heavy:    { label: 'ازدحام شديد',  color: '#C0392B', fill: 3 },
}

function CrowdDots({ level }) {
  const { color, fill } = CROWD_MAP[level]
  return (
    <div className="flex gap-1">
      {[1, 2, 3].map((i) => (
        <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: i <= fill ? color : 'var(--color-border)' }} />
      ))}
    </div>
  )
}

function OfficeCard({ office, index }) {
  const status = STATUS_MAP[office.status]
  const crowd  = CROWD_MAP[office.crowd]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.35 }}
      className="card p-4 flex flex-col gap-3"
    >
      {/* الرأس */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold" style={{ color: 'var(--color-text-main)' }}>{office.name}</h4>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{office.district}</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0"
          style={{ backgroundColor: status.bg, border: `1px solid ${status.border}`, color: status.dot }}>
          <motion.div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: status.dot }}
            animate={office.status === 'active' ? { opacity: [1, 0.3, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.8 }} />
          {status.label}
        </div>
      </div>

      {/* التفاصيل */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
          <Users size={13} style={{ color: 'var(--color-text-muted)' }} />
          <div>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>الازدحام</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <CrowdDots level={office.crowd} />
              <span className="text-xs font-medium" style={{ color: crowd.color }}>{crowd.label}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
          <Clock size={13} style={{ color: 'var(--color-text-muted)' }} />
          <div>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>متوسط الانتظار</p>
            <p className="text-xs font-bold mt-0.5" style={{ color: 'var(--color-secondary)' }}>{office.waitMinutes} دقيقة</p>
          </div>
        </div>
      </div>

      {/* أفضل وقت */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
        style={{ backgroundColor: 'rgba(39,174,96,0.07)', border: '1px solid rgba(39,174,96,0.2)' }}>
        <TrendingUp size={13} style={{ color: '#27AE60' }} />
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          أفضل وقت للزيارة:{' '}
          <span className="font-bold" style={{ color: '#27AE60' }}>{office.bestTime}</span>
        </p>
      </div>
    </motion.div>
  )
}

export default function OfficeStatusWidget() {
  const [lastUpdate, setLastUpdate] = useState(5)
  const [refreshing, setRefreshing] = useState(false)

  function handleRefresh() {
    setRefreshing(true)
    setTimeout(() => { setRefreshing(false); setLastUpdate(0) }, 800)
  }

  return (
    <div className="mb-6">
      {/* العنوان */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold" style={{ color: 'var(--color-text-main)' }}>
            حالة الدوائر الحكومية الآن
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            آخر تحديث: منذ {lastUpdate} دقائق
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
          style={{ backgroundColor: 'rgba(27,79,114,0.2)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}
          aria-label="تحديث حالة الدوائر"
        >
          <motion.div animate={refreshing ? { rotate: 360 } : {}} transition={{ repeat: refreshing ? Infinity : 0, duration: 0.7, ease: 'linear' }}>
            <RefreshCw size={13} />
          </motion.div>
          تحديث
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {OFFICES.map((office, i) => (
          <OfficeCard key={office.id} office={office} index={i} />
        ))}
      </div>
    </div>
  )
}
