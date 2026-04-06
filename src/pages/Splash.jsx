/**
 * Splash.jsx — شاشة البداية
 * تعرض شعار بابل المتحرك ثم تُحوّل تلقائياً إلى /login أو /dashboard
 */
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useAppStore from '../store/useAppStore'

export default function Splash() {
  const navigate = useNavigate()
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(isAuthenticated ? '/dashboard' : '/login', { replace: true })
    }, 2200)
    return () => clearTimeout(timer)
  }, [navigate, isAuthenticated])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: 'var(--color-bg-dark)' }}
    >
      {/* الشعار */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        className="flex flex-col items-center gap-5"
      >
        {/* دائرة الشعار */}
        <motion.div
          className="w-24 h-24 rounded-3xl flex items-center justify-center relative"
          style={{
            backgroundColor: 'var(--color-primary)',
            boxShadow: '0 0 60px rgba(27,79,114,0.6), 0 0 120px rgba(27,79,114,0.2)',
          }}
          animate={{ boxShadow: [
            '0 0 40px rgba(27,79,114,0.5)',
            '0 0 80px rgba(27,79,114,0.8)',
            '0 0 40px rgba(27,79,114,0.5)',
          ]}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* حرف ب */}
          <motion.span
            className="text-white font-black"
            style={{ fontSize: '48px', lineHeight: 1 }}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            ب
          </motion.span>

          {/* نقطة ذهبية زخرفية */}
          <motion.div
            className="absolute -bottom-1.5 -left-1.5 w-5 h-5 rounded-full"
            style={{ backgroundColor: 'var(--color-secondary)' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 400 }}
          />
        </motion.div>

        {/* اسم المنصة */}
        <motion.div
          className="text-center"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h1
            className="text-4xl font-black tracking-wide"
            style={{ color: 'var(--color-text-main)' }}
          >
            بابل
          </h1>
          <p
            className="text-sm mt-1.5 font-medium"
            style={{ color: 'var(--color-text-muted)' }}
          >
            البوابة الوطنية للخدمات الحكومية
          </p>
        </motion.div>

        {/* شعار العراق النصي */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            backgroundColor: 'rgba(243,156,18,0.1)',
            border: '1px solid rgba(243,156,18,0.2)',
          }}
        >
          <span style={{ color: 'var(--color-secondary)', fontSize: '13px', fontWeight: 600 }}>
            جمهورية العراق
          </span>
        </motion.div>
      </motion.div>

      {/* نقاط التحميل */}
      <motion.div
        className="flex gap-1.5 mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: 'var(--color-text-muted)' }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}
