/**
 * BookingModal — نافذة حجز الموعد
 * تظهر عند الضغط على "احجز موعد" في ServiceCard
 * تعرض تأكيداً للحجز مع ملخص الأوراق المطلوبة
 */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, CalendarCheck, CheckCircle2, ChevronLeft } from 'lucide-react'

const AVAILABLE_DATES = [
  { label: 'الأحد 13 أبريل 2025',    slots: ['9:00 ص', '10:30 ص', '12:00 م'] },
  { label: 'الاثنين 14 أبريل 2025',   slots: ['9:00 ص', '11:00 ص'] },
  { label: 'الثلاثاء 15 أبريل 2025',  slots: ['10:00 ص', '12:00 م', '1:00 م'] },
]

export default function BookingModal({ service, categoryColor, onClose }) {
  const [step, setStep]           = useState(1) // 1: اختر الموعد | 2: تأكيد
  const [selectedDate, setDate]   = useState(null)
  const [selectedSlot, setSlot]   = useState(null)
  const [confirmed, setConfirmed] = useState(false)

  function handleConfirm() {
    setConfirmed(true)
    setTimeout(onClose, 3200)
  }

  return (
    <>
      {/* الخلفية الداكنة */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[70] flex items-end md:items-center justify-center p-0 md:p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      >
        {/* البطاقة */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 340, damping: 32 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full md:max-w-md rounded-t-3xl md:rounded-2xl flex flex-col"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            maxHeight: '92dvh',
          }}
        >
          {/* شريط اللون */}
          <div className="h-1 w-full" style={{ backgroundColor: categoryColor }} />

          {/* الرأس */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: '1px solid var(--color-border)' }}
          >
            <div>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>حجز موعد</p>
              <h2 className="text-base font-bold" style={{ color: 'var(--color-text-main)' }}>
                {service.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'var(--color-text-muted)' }}
            >
              <X size={16} />
            </button>
          </div>

          <div className="px-5 py-5 overflow-y-auto flex-1"
            style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
            {/* حالة التأكيد النهائي */}
            {confirmed ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-4 py-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, delay: 0.1 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(39,174,96,0.2)' }}
                >
                  <CheckCircle2 size={36} style={{ color: 'var(--color-success)' }} />
                </motion.div>
                <div>
                  <p className="text-lg font-bold" style={{ color: 'var(--color-text-main)' }}>
                    تم الحجز بنجاح!
                  </p>
                  <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                    موعدك: {selectedDate} — {selectedSlot}
                  </p>
                  <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                    لا تنسَ إحضار جميع الأوراق المطلوبة
                  </p>
                </div>
              </motion.div>
            ) : step === 1 ? (
              /* الخطوة 1: اختر التاريخ والوقت */
              <>
                <p className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-main)' }}>
                  اختر يوماً ووقتاً مناسباً
                </p>

                <div className="flex flex-col gap-3 mb-5">
                  {AVAILABLE_DATES.map((d) => (
                    <div key={d.label}>
                      <p
                        className="text-xs font-medium mb-1.5"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {d.label}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {d.slots.map((slot) => {
                          const active = selectedDate === d.label && selectedSlot === slot
                          return (
                            <button
                              key={slot}
                              onClick={() => { setDate(d.label); setSlot(slot) }}
                              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                              style={{
                                backgroundColor: active ? categoryColor : 'rgba(255,255,255,0.05)',
                                color: active ? '#fff' : 'var(--color-text-muted)',
                                border: `1px solid ${active ? categoryColor : 'var(--color-border)'}`,
                              }}
                            >
                              {slot}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  disabled={!selectedDate || !selectedSlot}
                  onClick={() => setStep(2)}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
                  style={{
                    backgroundColor: selectedDate ? categoryColor : 'var(--color-border)',
                    opacity: selectedDate ? 1 : 0.5,
                    cursor: selectedDate ? 'pointer' : 'not-allowed',
                  }}
                >
                  التالي — مراجعة الحجز
                </button>
              </>
            ) : (
              /* الخطوة 2: مراجعة وتأكيد */
              <>
                {/* ملخص الموعد */}
                <div
                  className="flex items-center gap-3 mb-4 p-3 rounded-xl"
                  style={{ backgroundColor: `${categoryColor}15`, border: `1px solid ${categoryColor}30` }}
                >
                  <CalendarCheck size={20} style={{ color: categoryColor }} />
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--color-text-main)' }}>
                      {selectedDate}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      الساعة {selectedSlot} — {service.office}
                    </p>
                  </div>
                </div>

                {/* قائمة الأوراق */}
                <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text-main)' }}>
                  تذكّر أن تُحضر معك:
                </p>
                <ul className="flex flex-col gap-2 mb-5">
                  {service.requiredDocs.map((doc, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm"
                      style={{ color: 'var(--color-text-main)' }}>
                      <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5"
                        style={{ color: 'var(--color-success)' }} />
                      {doc}
                    </li>
                  ))}
                </ul>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1 px-4 py-3 rounded-xl text-sm font-medium"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      color: 'var(--color-text-muted)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <ChevronLeft size={14} />
                    تغيير
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 py-3 rounded-xl text-sm font-bold text-white"
                    style={{ backgroundColor: categoryColor }}
                  >
                    تأكيد الحجز
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}
