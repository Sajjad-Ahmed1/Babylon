/**
 * Profile.jsx — صفحة الحساب الشخصي
 * بيانات المستخدم + ملخص الوثائق + الإعدادات + عن بابل + تسجيل الخروج
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  User, Shield, MapPin, IdCard, Car, Truck,
  Bell, Globe, LogOut, Info, ChevronLeft,
  CheckCircle, AlertTriangle, Clock,
} from 'lucide-react'
import useAppStore from '../store/useAppStore'

const sectionVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

/* بطاقة وثيقة صغيرة */
const DOC_ICONS = { IdCard, Car, Truck }
const STATUS_CONFIG = {
  valid:         { label: 'سارية',              color: 'var(--color-success)',  Icon: CheckCircle },
  'expiring-soon': { label: 'تنتهي قريباً',     color: 'var(--color-warning)', Icon: Clock },
  expired:       { label: 'منتهية',             color: 'var(--color-danger)',   Icon: AlertTriangle },
}

function DocMiniCard({ doc }) {
  const IconDoc = DOC_ICONS[doc.icon] ?? IdCard
  const cfg     = STATUS_CONFIG[doc.status]
  const CfgIcon = cfg.Icon
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl"
      style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)' }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${cfg.color}15` }}
      >
        <IconDoc size={16} style={{ color: cfg.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold truncate" style={{ color: 'var(--color-text-main)' }}>{doc.type}</p>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {doc.status === 'expired'
            ? `منتهية منذ ${Math.abs(doc.daysLeft)} يوم`
            : `تنتهي خلال ${doc.daysLeft} يوم`}
        </p>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <CfgIcon size={13} style={{ color: cfg.color }} />
        <span className="text-xs font-medium" style={{ color: cfg.color }}>{cfg.label}</span>
      </div>
    </div>
  )
}

/* صف إعداد */
function SettingRow({ icon: Icon, label, children }) {
  return (
    <div
      className="flex items-center justify-between gap-3 py-3.5"
      style={{ borderBottom: '1px solid var(--color-border)' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(27,79,114,0.25)' }}
        >
          <Icon size={15} style={{ color: 'var(--color-secondary)' }} />
        </div>
        <span className="text-sm font-medium" style={{ color: 'var(--color-text-main)' }}>{label}</span>
      </div>
      {children}
    </div>
  )
}

/* Toggle بسيط */
function Toggle({ checked, onChange, ariaLabel }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      style={{
        width: '44px', height: '24px', borderRadius: '12px',
        position: 'relative', flexShrink: 0, border: 'none', cursor: 'pointer',
        backgroundColor: checked ? 'var(--color-primary)' : 'var(--color-border)',
        transition: 'background-color 0.2s',
      }}
    >
      <motion.div
        style={{
          position: 'absolute', top: '2px', left: '2px',
          width: '20px', height: '20px', borderRadius: '50%',
          backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }}
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      />
    </button>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const { user, documents, logout } = useAppStore()

  const [notifs, setNotifs] = useState(true)
  const [lang, setLang]     = useState('ar') // 'ar' | 'ku'

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="max-w-2xl mx-auto flex flex-col gap-5"
    >

      {/* ── بطاقة المستخدم ── */}
      <motion.div variants={sectionVariants} className="card p-5">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
              boxShadow: '0 8px 24px rgba(27,79,114,0.4)',
            }}
          >
            <User size={28} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold leading-tight" style={{ color: 'var(--color-text-main)' }}>
              {user.name}
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
              <Shield size={12} style={{ color: 'var(--color-secondary)' }} />
              <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
                {user.nationalId}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin size={12} style={{ color: 'var(--color-text-muted)' }} />
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {user.governorate}
              </span>
            </div>
          </div>
        </div>

        {/* شارة الحساب الموثق */}
        <div
          className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ backgroundColor: 'rgba(39,174,96,0.1)', border: '1px solid rgba(39,174,96,0.2)' }}
        >
          <CheckCircle size={14} style={{ color: 'var(--color-success)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--color-success)' }}>
            هوية موثّقة — مستوى 2
          </span>
        </div>
      </motion.div>

      {/* ── ملخص الوثائق ── */}
      <motion.div variants={sectionVariants} className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold" style={{ color: 'var(--color-text-main)' }}>
            وثائقي الرسمية
          </h3>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1 text-xs font-medium"
            style={{ color: 'var(--color-secondary)' }}
            aria-label="عرض التفاصيل الكاملة"
          >
            التفاصيل <ChevronLeft size={13} />
          </button>
        </div>
        <div className="flex flex-col gap-2.5">
          {documents.map((doc) => <DocMiniCard key={doc.id} doc={doc} />)}
        </div>
      </motion.div>

      {/* ── الإعدادات ── */}
      <motion.div variants={sectionVariants} className="card p-5">
        <h3 className="text-base font-bold mb-1" style={{ color: 'var(--color-text-main)' }}>
          الإعدادات
        </h3>

        <SettingRow icon={Bell} label="إشعارات انتهاء الوثائق">
          <Toggle checked={notifs} onChange={setNotifs} ariaLabel="تفعيل الإشعارات" />
        </SettingRow>

        <SettingRow icon={Globe} label="لغة الواجهة">
          <div className="flex gap-1.5">
            {[{ id: 'ar', label: 'العربية' }, { id: 'ku', label: 'كوردی' }].map((l) => (
              <button
                key={l.id}
                onClick={() => setLang(l.id)}
                className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                style={{
                  backgroundColor: lang === l.id ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                  color: lang === l.id ? '#fff' : 'var(--color-text-muted)',
                  border: `1px solid ${lang === l.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                }}
                aria-pressed={lang === l.id}
              >
                {l.label}
              </button>
            ))}
          </div>
        </SettingRow>
      </motion.div>

      {/* ── عن بابل ── */}
      <motion.div variants={sectionVariants} className="card p-5">
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          >
            <span className="text-white font-black text-lg">ب</span>
          </div>
          <div>
            <h3 className="text-base font-bold" style={{ color: 'var(--color-text-main)' }}>عن بابل</h3>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>الإصدار 1.0.0 — MVP</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          بابل هي البوابة الوطنية الموحدة للخدمات الحكومية العراقية — مبنية على حقيقة واحدة:
          <strong style={{ color: 'var(--color-text-main)' }}> "المواطن العراقي لا يخاف من المعاملة، يخاف من المجهول."</strong>
        </p>
        <div
          className="mt-3 flex items-center gap-2 text-xs"
          style={{ color: 'var(--color-text-muted)', opacity: 0.6 }}
        >
          <Info size={12} />
          <span>جمهورية العراق — وزارة الداخلية © ٢٠٢٥</span>
        </div>
      </motion.div>

      {/* ── زر الخروج ── */}
      <motion.div variants={sectionVariants}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          aria-label="تسجيل الخروج من الحساب"
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-base font-bold transition-all"
          style={{
            backgroundColor: 'rgba(192,57,43,0.1)',
            border: '1.5px solid rgba(192,57,43,0.3)',
            color: 'var(--color-danger)',
          }}
        >
          <LogOut size={20} />
          تسجيل الخروج
        </motion.button>
        <p className="text-center text-xs mt-2" style={{ color: 'var(--color-text-muted)', opacity: 0.5 }}>
          سيتم تسجيل خروجك من جميع الأجهزة
        </p>
      </motion.div>
    </motion.div>
  )
}
