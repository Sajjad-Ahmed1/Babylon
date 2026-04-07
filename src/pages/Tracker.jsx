/**
 * Tracker.jsx — صفحة تتبع المعاملة مع ميزة المشاركة والطباعة
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, ChevronDown, Share2, Copy, Printer, X, Check } from 'lucide-react'
import TransactionHeader from '../components/tracker/TransactionHeader'
import ProgressTimeline from '../components/tracker/ProgressTimeline'
import StatusCard from '../components/tracker/StatusCard'
import EstimatedTimeCard from '../components/tracker/EstimatedTimeCard'
import useAppStore from '../store/useAppStore'

/* ────────────────────────────────────────
   مُختار المعاملة
   ──────────────────────────────────────── */
function TransactionSelector({ transactions, selectedId, onSelect }) {
  const [open, setOpen] = useState(false)
  const selected = transactions.find((t) => t.id === selectedId)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 p-4 rounded-xl text-right transition-colors"
        style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(243,156,18,0.15)' }}>
            <FileText size={16} style={{ color: 'var(--color-secondary)' }} />
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>المعاملة المحددة</p>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-main)' }}>{selected?.type}</p>
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} style={{ color: 'var(--color-text-muted)' }} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
            className="absolute top-full mt-1 w-full z-20 rounded-xl overflow-hidden"
            style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card-hover)' }}
          >
            {transactions.map((tx) => (
              <button key={tx.id}
                onClick={() => { onSelect(tx.id); setOpen(false) }}
                className="w-full flex items-center gap-3 p-3.5 text-right transition-colors"
                style={{ backgroundColor: tx.id === selectedId ? 'rgba(243,156,18,0.08)' : 'transparent', borderBottom: '1px solid var(--color-border)' }}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: tx.id === selectedId ? 'var(--color-secondary)' : 'var(--color-border)' }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-text-main)' }}>{tx.type}</p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{tx.id}</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ────────────────────────────────────────
   مودال المشاركة
   ──────────────────────────────────────── */
function ShareModal({ transaction, onClose }) {
  const [copied, setCopied] = useState(false)

  const currentStep = transaction.steps.find((s) => s.current)
  const doneCount   = transaction.steps.filter((s) => s.done).length

  function handleCopy() {
    const text = `معاملة بابل — ${transaction.type}\nرقم المعاملة: ${transaction.id}\nالحالة: ${currentStep?.label ?? 'جارية'}\nالتقدم: ${doneCount}/${transaction.steps.length} خطوات\nتاريخ التقديم: ${transaction.submittedAt}`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handlePrint() {
    window.print()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(13,27,42,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
      >
        {/* رأس المودال */}
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--color-border)' }}>
          <h3 className="text-base font-bold" style={{ color: 'var(--color-text-main)' }}>مشاركة حالة المعاملة</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'var(--color-text-muted)' }}>
            <X size={16} />
          </button>
        </div>

        {/* بطاقة المعاملة القابلة للطباعة */}
        <div className="p-6" id="print-area">
          <div className="rounded-2xl p-5"
            style={{ backgroundColor: 'rgba(27,79,114,0.12)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(243,156,18,0.15)' }}>
                <FileText size={20} style={{ color: 'var(--color-secondary)' }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>بوابة بابل — تقرير المعاملة</p>
                <p className="text-sm font-bold" style={{ color: 'var(--color-text-main)' }}>{transaction.type}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p style={{ color: 'var(--color-text-muted)' }}>رقم المعاملة</p>
                <p className="font-mono font-bold mt-0.5" style={{ color: 'var(--color-secondary)' }}>{transaction.id}</p>
              </div>
              <div>
                <p style={{ color: 'var(--color-text-muted)' }}>الحالة الراهنة</p>
                <p className="font-bold mt-0.5" style={{ color: 'var(--color-text-main)' }}>{currentStep?.label ?? 'جارية'}</p>
              </div>
              <div>
                <p style={{ color: 'var(--color-text-muted)' }}>التقدم</p>
                <p className="font-bold mt-0.5" style={{ color: 'var(--color-success)' }}>{doneCount}/{transaction.steps.length} خطوات</p>
              </div>
              <div>
                <p style={{ color: 'var(--color-text-muted)' }}>تاريخ التقديم</p>
                <p className="font-bold mt-0.5" style={{ color: 'var(--color-text-main)' }}>{transaction.submittedAt}</p>
              </div>
            </div>

            {/* شريط التقدم */}
            <div className="mt-4">
              <div className="h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-border)' }}>
                <div className="h-full rounded-full"
                  style={{ width: `${(doneCount / transaction.steps.length) * 100}%`, backgroundColor: 'var(--color-success)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all"
            style={{ backgroundColor: copied ? 'rgba(39,174,96,0.15)' : 'rgba(27,79,114,0.2)', color: copied ? 'var(--color-success)' : 'var(--color-text-main)', border: `1px solid ${copied ? 'rgba(39,174,96,0.3)' : 'var(--color-border)'}` }}
          >
            {copied ? <><Check size={16} />تم النسخ</> : <><Copy size={16} />نسخ الرابط</>}
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold"
            style={{ backgroundColor: 'rgba(243,156,18,0.1)', color: 'var(--color-secondary)', border: '1px solid rgba(243,156,18,0.25)' }}
          >
            <Printer size={16} />طباعة / PDF
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ────────────────────────────────────────
   الصفحة الرئيسية
   ──────────────────────────────────────── */
export default function Tracker() {
  const { transactions } = useAppStore()
  const [selectedId, setSelectedId]   = useState(transactions[0]?.id ?? null)
  const [showShare, setShowShare]     = useState(false)

  const selected = transactions.find((t) => t.id === selectedId)

  return (
    <>
      {/* اختيار المعاملة */}
      {transactions.length > 1 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }} className="mb-4">
          <TransactionSelector transactions={transactions} selectedId={selectedId} onSelect={setSelectedId} />
        </motion.div>
      )}

      {selected ? (
        <AnimatePresence mode="wait">
          <motion.div key={selected.id}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }}
            className="flex flex-col gap-4"
          >
            <TransactionHeader transaction={selected} />
            <ProgressTimeline transaction={selected} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              <StatusCard transaction={selected} />
              <EstimatedTimeCard transaction={selected} />
            </div>

            {/* زر المشاركة */}
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => setShowShare(true)}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-semibold"
              style={{ backgroundColor: 'rgba(27,79,114,0.15)', color: 'var(--color-text-main)', border: '1px solid var(--color-border)' }}
            >
              <Share2 size={16} style={{ color: 'var(--color-secondary)' }} />
              مشاركة حالة المعاملة
            </motion.button>
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="card p-10 text-center" style={{ color: 'var(--color-text-muted)' }}>
          <FileText size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">لا توجد معاملات نشطة حالياً</p>
        </div>
      )}

      {/* مودال المشاركة */}
      <AnimatePresence>
        {showShare && selected && (
          <ShareModal transaction={selected} onClose={() => setShowShare(false)} />
        )}
      </AnimatePresence>
    </>
  )
}
