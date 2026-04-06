/**
 * Tracker.jsx — صفحة تتبع المعاملة (Phase 2: Live Tracker)
 * يحل مشكلة: "ما أعرف وين وصلت معاملتي"
 * يعرض: اختيار المعاملة + الخط الزمني + الحالة + الوقت المتوقع
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, ChevronDown } from 'lucide-react'
import TransactionHeader from '../components/tracker/TransactionHeader'
import ProgressTimeline from '../components/tracker/ProgressTimeline'
import StatusCard from '../components/tracker/StatusCard'
import EstimatedTimeCard from '../components/tracker/EstimatedTimeCard'
import useAppStore from '../store/useAppStore'

/* ────────────────────────────────────────
   مُختار المعاملة — يظهر عندما يوجد أكثر من معاملة
   ──────────────────────────────────────── */
function TransactionSelector({ transactions, selectedId, onSelect }) {
  const [open, setOpen] = useState(false)
  const selected = transactions.find((t) => t.id === selectedId)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 p-4 rounded-xl text-right transition-colors"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(243,156,18,0.15)' }}
          >
            <FileText size={16} style={{ color: 'var(--color-secondary)' }} />
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              المعاملة المحددة
            </p>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-main)' }}>
              {selected?.type}
            </p>
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} style={{ color: 'var(--color-text-muted)' }} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-1 w-full z-20 rounded-xl overflow-hidden"
            style={{
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-card-hover)',
            }}
          >
            {transactions.map((tx) => (
              <button
                key={tx.id}
                onClick={() => { onSelect(tx.id); setOpen(false) }}
                className="w-full flex items-center gap-3 p-3.5 text-right transition-colors"
                style={{
                  backgroundColor:
                    tx.id === selectedId ? 'rgba(243,156,18,0.08)' : 'transparent',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      tx.id === selectedId
                        ? 'var(--color-secondary)'
                        : 'var(--color-border)',
                  }}
                />
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-text-main)' }}>
                    {tx.type}
                  </p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    {tx.id}
                  </p>
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
   الصفحة الرئيسية
   ──────────────────────────────────────── */
export default function Tracker() {
  const { transactions } = useAppStore()
  const [selectedId, setSelectedId] = useState(transactions[0]?.id ?? null)

  const selected = transactions.find((t) => t.id === selectedId)

  return (
    <>
      {/* اختيار المعاملة */}
      {transactions.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-4"
        >
          <TransactionSelector
            transactions={transactions}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </motion.div>
      )}

      {selected ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col gap-4"
          >
            <TransactionHeader transaction={selected} />
            <ProgressTimeline transaction={selected} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatusCard transaction={selected} />
              <EstimatedTimeCard transaction={selected} />
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="card p-10 text-center" style={{ color: 'var(--color-text-muted)' }}>
          <FileText size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">لا توجد معاملات نشطة حالياً</p>
        </div>
      )}
    </>
  )
}
