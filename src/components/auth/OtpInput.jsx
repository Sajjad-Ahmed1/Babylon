/**
 * OtpInput — حقل إدخال رمز OTP
 * 6 خانات منفصلة، يتقدم تلقائياً بعد كل رقم، يرجع للخلف عند الحذف
 * يدعم اللصق (paste) الكامل
 */
import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function OtpInput({ length = 6, onChange, disabled = false, error = false }) {
  const [digits, setDigits] = useState(Array(length).fill(''))
  const refs = useRef([])

  useEffect(() => {
    refs.current[0]?.focus()
  }, [])

  // أبلغ الأب عند اكتمال الرمز
  useEffect(() => {
    onChange(digits.join(''))
  }, [digits])

  function handleChange(index, value) {
    // لصق متعدد الأرقام
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, length).split('')
      const next = [...Array(length).fill('')]
      pasted.forEach((d, i) => { next[i] = d })
      setDigits(next)
      refs.current[Math.min(pasted.length, length - 1)]?.focus()
      return
    }

    const digit = value.replace(/\D/g, '')
    if (!digit && value !== '') return  // رفض غير الأرقام

    const next = [...digits]
    next[index] = digit
    setDigits(next)

    if (digit && index < length - 1) {
      refs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits]
        next[index] = ''
        setDigits(next)
      } else if (index > 0) {
        refs.current[index - 1]?.focus()
      }
    }
    if (e.key === 'ArrowRight' && index > 0) {
      refs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index < length - 1) {
      refs.current[index + 1]?.focus()
    }
  }

  function handleFocus(e) {
    e.target.select()
  }

  return (
    /* flex-row-reverse: خانة 1 على اليمين في RTL */
    <div className="flex flex-row-reverse gap-2 justify-center" dir="ltr">
      {digits.map((digit, i) => (
        <motion.input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onFocus={handleFocus}
          whileFocus={{ scale: 1.08 }}
          transition={{ duration: 0.15 }}
          className="w-11 h-14 text-center text-xl font-bold rounded-xl outline-none transition-all"
          style={{
            backgroundColor: digit
              ? 'rgba(27,79,114,0.3)'
              : 'rgba(255,255,255,0.05)',
            border: error
              ? '2px solid var(--color-danger)'
              : digit
              ? '2px solid var(--color-primary)'
              : '2px solid var(--color-border)',
            color: 'var(--color-text-main)',
            caretColor: 'var(--color-secondary)',
          }}
        />
      ))}
    </div>
  )
}
