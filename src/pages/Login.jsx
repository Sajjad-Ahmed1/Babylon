/**
 * Login.jsx — إعادة تصميم كاملة: "Civic Pride"
 * Desktop: Split-screen — يسار (تزييني) / يمين (نموذج)
 * Mobile: شاشة كاملة — النموذج فقط مع شعار صغير
 */
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Fingerprint, ArrowLeft, RefreshCw, ShieldCheck,
  Eye, EyeOff, ChevronRight, Lock, CheckCircle,
} from 'lucide-react'
import OtpInput from '../components/auth/OtpInput'
import useAppStore from '../store/useAppStore'

/* ══════════════════════════════════
   الشريط الجانبي التزييني (يسار / Desktop only)
   ══════════════════════════════════ */

function StatItem({ value, label, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="text-center"
    >
      <p className="text-4xl font-black" style={{ color: 'var(--color-secondary)' }}>{value}</p>
      <p className="text-sm mt-1 font-medium" style={{ color: 'rgba(232,240,254,0.7)' }}>{label}</p>
    </motion.div>
  )
}

function DecorativePanel() {
  return (
    <div
      className="hidden lg:flex flex-col justify-between relative overflow-hidden"
      style={{
        width: '45%',
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #0D1B2A 0%, #1B4F72 60%, #0D2137 100%)',
      }}
    >
      {/* Geometric SVG pattern overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="islamic-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            {/* Octagonal star — simplified Islamic geometry */}
            <polygon
              points="40,5 55,15 75,15 75,35 65,40 75,45 75,65 55,65 40,75 25,65 5,65 5,45 15,40 5,35 5,15 25,15"
              fill="none" stroke="#F39C12" strokeWidth="0.6" strokeOpacity="0.5"
            />
            <circle cx="40" cy="40" r="8" fill="none" stroke="#F39C12" strokeWidth="0.4" strokeOpacity="0.3" />
          </pattern>
          <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="#F39C12" fillOpacity="0.15" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
        <rect width="100%" height="100%" fill="url(#islamic-grid)" />
      </svg>

      {/* Radial glow effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(243,156,18,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full px-12 py-14">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
          className="flex items-center gap-4"
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 glow-gold"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          >
            <span className="text-white font-black" style={{ fontSize: '28px', lineHeight: 1 }}>ب</span>
          </div>
          <div>
            <h1 className="text-3xl font-black text-white leading-none">بابل</h1>
            <p className="text-xs mt-1" style={{ color: 'rgba(232,240,254,0.6)' }}>بوابة العراق الرقمية</p>
          </div>
        </motion.div>

        {/* Center: Main tagline */}
        <div className="flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--color-secondary)' }}
            >
              الجمهورية العراقية
            </p>
            <h2
              className="font-black leading-tight mb-3"
              style={{ color: '#E8F0FE', fontSize: 'clamp(1.6rem, 3vw, 2.5rem)' }}
            >
              خدماتك الحكومية<br />
              <span style={{ color: 'var(--color-secondary)' }}>في مكان واحد</span>
            </h2>
            <p className="text-base leading-relaxed" style={{ color: 'rgba(232,240,254,0.65)' }}>
              بابل هي بوابتك الرسمية للخدمات الحكومية العراقية —
              مصمّمة لمواطن يستحق خدمة لائقة.
            </p>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.5, origin: 'right' }}
            className="my-8 h-px w-16"
            style={{ backgroundColor: 'var(--color-secondary)', transformOrigin: 'right' }}
          />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <StatItem value="١٥٠+" label="خدمة حكومية"    delay={0.7} />
            <StatItem value="١٨"   label="محافظة عراقية"  delay={0.85} />
            <StatItem value="٢٤/٧" label="متاح دائماً"    delay={1.0} />
          </div>
        </div>

        {/* Bottom security badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex items-center gap-3 mt-8"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(39,174,96,0.2)', border: '1px solid rgba(39,174,96,0.3)' }}
          >
            <Lock size={14} style={{ color: '#27AE60' }} />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: '#27AE60' }}>اتصال آمن ومشفّر</p>
            <p className="text-xs" style={{ color: 'rgba(232,240,254,0.4)' }}>SSL 256-bit Encryption</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════
   خطوة 1: رقم الهوية
   ══════════════════════════════════ */
function NationalIdStep({ onSubmit, isLoading, error, onClearError }) {
  const [value, setValue] = useState('')
  const [masked, setMasked] = useState(true)

  const display = masked && value.length > 4
    ? value.slice(0, 4) + '●'.repeat(value.length - 4)
    : value

  function handleChange(e) {
    const v = e.target.value.replace(/\D/g, '').slice(0, 8)
    setValue(v)
    if (error) onClearError()
  }

  const isReady = value.length === 8

  return (
    <motion.div
      key="id-step"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.28 }}
    >
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >1</span>
          <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
            الخطوة الأولى من اثنتين
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-main)' }}>
          رقم هويتك الوطنية
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          أدخل الرقم المكوّن من 8 أرقام الموجود على بطاقتك الوطنية
        </p>
      </div>

      {/* حقل الإدخال */}
      <div className="relative mb-2">
        <input
          type="text"
          inputMode="numeric"
          placeholder="١٩٨٧٠٤١٢"
          value={display}
          onChange={handleChange}
          className="w-full py-4 px-5 rounded-2xl text-xl font-mono text-center tracking-[0.3em] outline-none transition-all"
          style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: `2px solid ${error ? 'var(--color-danger)' : isReady ? 'var(--color-primary)' : 'var(--color-border)'}`,
            color: 'var(--color-text-main)',
          }}
          onFocus={(e) => { e.target.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-primary)' }}
          onBlur={(e)  => { e.target.style.borderColor = error ? 'var(--color-danger)' : isReady ? 'var(--color-primary)' : 'var(--color-border)' }}
          autoComplete="off"
          aria-label="رقم الهوية الوطنية"
        />
        <button
          type="button"
          onClick={() => setMasked((m) => !m)}
          className="absolute top-1/2 -translate-y-1/2 left-4 p-1"
          style={{ color: 'var(--color-text-muted)' }}
          aria-label={masked ? 'إظهار الرقم' : 'إخفاء الرقم'}
        >
          {masked ? <Eye size={17} /> : <EyeOff size={17} />}
        </button>
      </div>

      {/* شريط التقدم */}
      <div className="flex gap-1 mb-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-0.5 rounded-full transition-all duration-200"
            style={{ backgroundColor: i < value.length ? 'var(--color-primary)' : 'var(--color-border)' }}
          />
        ))}
      </div>
      <p className="text-xs mb-5" style={{ color: 'var(--color-text-muted)' }}>
        {value.length}/8 أرقام {isReady && <span style={{ color: 'var(--color-success)' }}>✓</span>}
      </p>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm"
            style={{ backgroundColor: 'rgba(192,57,43,0.1)', color: 'var(--color-danger)', border: '1px solid rgba(192,57,43,0.25)' }}
          >
            <span className="font-bold text-base">!</span>
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={isReady ? { scale: 1.02 } : {}}
        whileTap={isReady ? { scale: 0.97 } : {}}
        onClick={() => isReady && onSubmit(value)}
        disabled={!isReady || isLoading}
        aria-label="إرسال رمز التحقق"
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-base font-bold text-white transition-all"
        style={{
          backgroundColor: isReady ? 'var(--color-primary)' : 'var(--color-border)',
          opacity: isReady ? 1 : 0.55,
          cursor: isReady ? 'pointer' : 'not-allowed',
          boxShadow: isReady ? '0 6px 24px rgba(27,79,114,0.5)' : 'none',
        }}
      >
        {isLoading
          ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><RefreshCw size={18} /></motion.div>
          : <><span>إرسال رمز التحقق</span><ArrowLeft size={18} /></>
        }
      </motion.button>
    </motion.div>
  )
}

/* ══════════════════════════════════
   خطوة 2: OTP
   ══════════════════════════════════ */
function OtpStep({ nationalId, onSubmit, onBack, isLoading, error, onClearError }) {
  const [otp, setOtp] = useState('')
  const [timer, setTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setTimer((t) => { if (t <= 1) { clearInterval(id); setCanResend(true); return 0 } return t - 1 })
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const maskedId = nationalId.slice(0, 4) + '●●●●'
  const isReady  = otp.length === 6

  return (
    <motion.div
      key="otp-step"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.28 }}
    >
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: 'var(--color-success)' }}
          >✓</span>
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >2</span>
          <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
            الخطوة الثانية من اثنتين
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-main)' }}>
          رمز التحقق
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          أُرسل رمز مكوّن من 6 أرقام إلى هاتفك المسجّل للهوية{' '}
          <span className="font-mono font-semibold" style={{ color: 'var(--color-secondary)' }}>{maskedId}</span>
        </p>
      </div>

      <div className="mb-3">
        <OtpInput
          length={6}
          onChange={(v) => { setOtp(v); if (error) onClearError() }}
          error={!!error}
          disabled={isLoading}
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm"
            style={{ backgroundColor: 'rgba(192,57,43,0.1)', color: 'var(--color-danger)', border: '1px solid rgba(192,57,43,0.25)' }}
          >
            <span className="font-bold text-base">!</span>
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* إعادة إرسال */}
      <div className="flex justify-center items-center gap-2 mb-6">
        {canResend ? (
          <button
            onClick={() => { setCanResend(false); setTimer(30) }}
            className="flex items-center gap-1.5 text-sm font-semibold"
            style={{ color: 'var(--color-secondary)' }}
            aria-label="إرسال رمز جديد"
          >
            <RefreshCw size={13} />
            إرسال رمز جديد
          </button>
        ) : (
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            إعادة الإرسال بعد{' '}
            <span
              className="font-black font-mono"
              style={{ color: 'var(--color-secondary)', fontVariantNumeric: 'tabular-nums' }}
            >
              {String(timer).padStart(2, '0')}
            </span>
            {' '}ثانية
          </p>
        )}
      </div>

      <motion.button
        whileHover={isReady ? { scale: 1.02 } : {}}
        whileTap={isReady ? { scale: 0.97 } : {}}
        onClick={() => isReady && onSubmit(otp)}
        disabled={!isReady || isLoading}
        aria-label="تأكيد وتسجيل الدخول"
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-base font-bold text-white transition-all mb-3"
        style={{
          backgroundColor: isReady ? 'var(--color-primary)' : 'var(--color-border)',
          opacity: isReady ? 1 : 0.55,
          cursor: isReady ? 'pointer' : 'not-allowed',
          boxShadow: isReady ? '0 6px 24px rgba(27,79,114,0.5)' : 'none',
        }}
      >
        {isLoading
          ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><RefreshCw size={18} /></motion.div>
          : <><ShieldCheck size={18} /><span>تأكيد وتسجيل الدخول</span></>
        }
      </motion.button>

      <button
        onClick={onBack}
        className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-medium"
        style={{ color: 'var(--color-text-muted)' }}
        aria-label="تغيير رقم الهوية"
      >
        <ChevronRight size={14} />
        تغيير رقم الهوية
      </button>
    </motion.div>
  )
}

/* ══════════════════════════════════
   شاشة النجاح
   ══════════════════════════════════ */
function SuccessScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, delay: 0.1 }}
        className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
        style={{ backgroundColor: 'rgba(39,174,96,0.15)', border: '2px solid var(--color-success)' }}
      >
        <CheckCircle size={40} style={{ color: 'var(--color-success)' }} />
      </motion.div>
      <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-main)' }}>
        تم التحقق بنجاح!
      </h3>
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
        جاري تحويلك إلى لوحة التحكم...
      </p>
    </motion.div>
  )
}

/* ══════════════════════════════════
   الصفحة الكاملة
   ══════════════════════════════════ */
export default function Login() {
  const navigate = useNavigate()
  const [isLoading, setLoading] = useState(false)
  const [fpMsg, setFpMsg]       = useState(false)
  const [success, setSuccess]   = useState(false)

  const {
    authStep, pendingNationalId, authError,
    submitNationalId, submitOtp, goBackToId, clearAuthError,
  } = useAppStore()

  async function handleIdSubmit(id) {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    submitNationalId(id)
    setLoading(false)
  }

  async function handleOtpSubmit(otp) {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    const result = submitOtp(otp)
    setLoading(false)
    if (result.success) {
      setSuccess(true)
      // preload Dashboard chunk during success animation to avoid blank screen
      import('./Dashboard')
      import('../components/shared/Layout')
      setTimeout(() => navigate('/dashboard', { replace: true }), 1400)
    }
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: 'var(--color-bg-dark)' }}
    >
      {/* ── اليسار التزييني (desktop فقط) ── */}
      <DecorativePanel />

      {/* ── اليمين: النموذج ── */}
      <div
        className="flex-1 flex flex-col min-h-screen overflow-y-auto"
        style={{ backgroundColor: 'var(--color-bg-dark)' }}
      >
        {/* رأس الصفحة (mobile only: شعار) */}
        <div
          className="flex items-center justify-between px-6 py-4 lg:px-10"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-secondary)' }}
            >
              <span className="text-white font-black text-lg">ب</span>
            </div>
            <span className="text-lg font-black" style={{ color: 'var(--color-text-main)' }}>بابل</span>
          </div>
          {/* Desktop: empty left / show just security badge */}
          <div className="hidden lg:flex items-center">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
              تسجيل الدخول
            </span>
          </div>

          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: 'rgba(39,174,96,0.1)',
              color: 'var(--color-success)',
              border: '1px solid rgba(39,174,96,0.25)',
            }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: 'var(--color-success)' }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
            />
            آمن ومشفّر
          </div>
        </div>

        {/* النموذج */}
        <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-16">
          <div className="w-full max-w-md">

            {/* Mobile: شعار كبير */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8 lg:hidden"
            >
              <p className="text-base font-semibold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                بوابة العراق الرقمية
              </p>
              <h1 className="text-3xl font-black" style={{ color: 'var(--color-text-main)' }}>
                مرحباً بك في <span style={{ color: 'var(--color-secondary)' }}>بابل</span>
              </h1>
            </motion.div>

            {/* Desktop: عنوان مختصر */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8 hidden lg:block"
            >
              <h2 className="text-3xl font-black mb-2" style={{ color: 'var(--color-text-main)' }}>
                تسجيل الدخول
              </h2>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                أدخل بياناتك للوصول إلى خدماتك الحكومية
              </p>
            </motion.div>

            {/* بطاقة النموذج */}
            <div
              className="rounded-3xl p-7 mb-5"
              style={{
                backgroundColor: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                minHeight: '320px',
              }}
            >
              <AnimatePresence mode="wait">
                {success ? (
                  <SuccessScreen key="success" />
                ) : authStep === 'id' ? (
                  <NationalIdStep
                    key="id"
                    onSubmit={handleIdSubmit}
                    isLoading={isLoading}
                    error={authError}
                    onClearError={clearAuthError}
                  />
                ) : (
                  <OtpStep
                    key="otp"
                    nationalId={pendingNationalId}
                    onSubmit={handleOtpSubmit}
                    onBack={goBackToId}
                    isLoading={isLoading}
                    error={authError}
                    onClearError={clearAuthError}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* ── زر البصمة ── */}
            <div className="mb-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>أو</span>
                <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
              </div>

              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { setFpMsg(true); setTimeout(() => setFpMsg(false), 3000) }}
                  className="w-full relative flex items-center justify-center gap-3 py-4 rounded-2xl text-sm font-semibold overflow-hidden"
                  style={{
                    backgroundColor: 'rgba(243,156,18,0.06)',
                    border: '1.5px solid rgba(243,156,18,0.25)',
                    color: 'var(--color-text-main)',
                  }}
                  aria-label="تسجيل الدخول بالبصمة"
                >
                  <motion.span
                    className="flex-shrink-0"
                    animate={{ scale: [1, 1.12, 1], opacity: [0.75, 1, 0.75] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  >
                    <Fingerprint size={22} style={{ color: 'var(--color-secondary)' }} />
                  </motion.span>
                  <span>تسجيل الدخول بالبصمة</span>
                </motion.button>

                <AnimatePresence>
                  {fpMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute -top-12 right-0 left-0 text-center text-xs py-2.5 px-3 rounded-xl"
                      style={{
                        backgroundColor: 'rgba(243,156,18,0.12)',
                        color: 'var(--color-secondary)',
                        border: '1px solid rgba(243,156,18,0.25)',
                      }}
                    >
                      البصمة غير مفعّلة على هذا الجهاز
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* بيانات الاختبار */}
            <div
              className="p-4 rounded-2xl text-xs text-center"
              style={{
                backgroundColor: 'rgba(27,79,114,0.08)',
                border: '1px dashed rgba(27,79,114,0.35)',
                color: 'var(--color-text-muted)',
              }}
            >
              <p className="font-semibold mb-2" style={{ color: '#5dade2' }}>بيانات الاختبار</p>
              <div className="flex justify-center gap-6">
                <span>الهوية: <span className="font-mono font-bold" style={{ color: 'var(--color-text-main)' }}>19870412</span></span>
                <span>OTP: <span className="font-mono font-bold" style={{ color: 'var(--color-text-main)' }}>123456</span></span>
              </div>
            </div>

            {/* تذييل */}
            <p className="text-center text-xs mt-6" style={{ color: 'var(--color-text-muted)', opacity: 0.45 }}>
              جمهورية العراق — وزارة الداخلية © ٢٠٢٥
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
