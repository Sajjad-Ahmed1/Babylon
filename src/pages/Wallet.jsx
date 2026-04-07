/**
 * Wallet.jsx — المحفظة الرقمية
 * عرض الوثائق الرسمية بشكل بطاقات قابلة للقلب مع QR placeholder
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WalletCards, QrCode, RefreshCw, Share2, Copy, Check, CreditCard, Car, Truck } from 'lucide-react'
import useAppStore from '../store/useAppStore'

const WALLET_DOCS = [
  {
    id: 'national-id',
    title: 'البطاقة الوطنية الموحدة',
    subtitle: 'وزارة الداخلية',
    number: '1987●●●●01',
    expiry: '2026-04-15',
    daysLeft: 8,
    status: 'expiring-soon',
    color1: '#1B4F72',
    color2: '#2471A3',
    Icon: CreditCard,
  },
  {
    id: 'driving',
    title: 'رخصة القيادة',
    subtitle: 'مديرية المرور العامة',
    number: 'BS●●●●4421',
    expiry: '2025-06-01',
    daysLeft: -305,
    status: 'expired',
    color1: '#922B21',
    color2: '#C0392B',
    Icon: Car,
  },
  {
    id: 'vehicle',
    title: 'بطاقة المركبة',
    subtitle: 'مديرية المرور — البصرة',
    number: '78●●●●BAS',
    expiry: '2026-12-31',
    daysLeft: 269,
    status: 'valid',
    color1: '#1E8449',
    color2: '#27AE60',
    Icon: Truck,
  },
]

function StatusBadge({ status, daysLeft }) {
  if (status === 'valid')         return <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ backgroundColor: 'rgba(39,174,96,0.25)', color: '#27AE60' }}>✓ سارية</span>
  if (status === 'expiring-soon') return <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ backgroundColor: 'rgba(230,126,34,0.25)', color: '#E67E22' }}>⚠ تنتهي خلال {daysLeft} يوم</span>
  return <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ backgroundColor: 'rgba(192,57,43,0.25)', color: '#E74C3C' }}>✕ منتهية منذ {Math.abs(daysLeft)} يوم</span>
}

function QRPlaceholder({ title }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      <div className="w-28 h-28 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '2px dashed rgba(255,255,255,0.3)' }}>
        <QrCode size={56} style={{ color: 'rgba(255,255,255,0.7)' }} />
      </div>
      <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.6)' }}>
        رمز QR لـ<br /><span className="font-bold">{title}</span>
      </p>
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>يُعرض عند الطلب فقط</p>
    </div>
  )
}

function DocCard({ doc }) {
  const [flipped, setFlipped] = useState(false)
  const [copied, setCopied]   = useState(false)

  function handleShare() {
    navigator.clipboard.writeText(`بابل — وثيقة: ${doc.title}\nالرقم: ${doc.number}\nالانتهاء: ${doc.expiry}`)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
      .catch(() => {})
  }

  return (
    <div className="flex flex-col gap-2">
      {/* البطاقة القابلة للقلب */}
      <div style={{ height: '200px', perspective: '1000px' }}>
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformStyle: 'preserve-3d', width: '100%', height: '100%', position: 'relative' }}
        >
          {/* الوجه الأمامي */}
          <div
            className="absolute inset-0 rounded-2xl p-5 flex flex-col justify-between overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${doc.color1} 0%, ${doc.color2} 100%)`,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
            }}
          >
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
              backgroundSize: '12px 12px',
            }} />
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{doc.subtitle}</p>
                <h3 className="text-base font-black text-white leading-tight">{doc.title}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                <doc.Icon size={22} strokeWidth={1.8} color="rgba(255,255,255,0.9)" />
              </div>
            </div>
            <div className="relative z-10">
              <p className="font-mono text-lg font-bold tracking-widest text-white mb-2">{doc.number}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>تاريخ الانتهاء</p>
                  <p className="text-sm font-bold text-white">{doc.expiry}</p>
                </div>
                <StatusBadge status={doc.status} daysLeft={doc.daysLeft} />
              </div>
            </div>
          </div>

          {/* الوجه الخلفي */}
          <div
            className="absolute inset-0 rounded-2xl p-5 flex flex-col"
            style={{
              background: `linear-gradient(135deg, ${doc.color2} 0%, ${doc.color1} 100%)`,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
            }}
          >
            <QRPlaceholder title={doc.title} />
          </div>
        </motion.div>
      </div>

      {/* أزرار الإجراءات — خارج البطاقة، بدون absolute */}
      <div className="flex gap-2">
        <button
          onClick={() => setFlipped((f) => !f)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold"
          style={{ backgroundColor: 'rgba(27,79,114,0.3)', color: 'var(--color-text-main)', border: '1px solid var(--color-border)' }}
        >
          <QrCode size={13} />
          {flipped ? 'إخفاء QR' : 'عرض QR'}
        </button>

        {doc.status === 'expired' && (
          <button
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold"
            style={{ backgroundColor: 'rgba(192,57,43,0.2)', color: '#E74C3C', border: '1px solid rgba(192,57,43,0.3)' }}
          >
            <RefreshCw size={13} />تجديد
          </button>
        )}

        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
          style={{ backgroundColor: 'rgba(243,156,18,0.1)', color: 'var(--color-secondary)', border: '1px solid rgba(243,156,18,0.25)' }}
        >
          {copied ? <><Check size={13} />تم النسخ</> : <><Share2 size={13} />مشاركة</>}
        </button>
      </div>
    </div>
  )
}

export default function Wallet() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
    >
      {/* رأس الصفحة */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-main)' }}>محفظتي الرقمية</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          وثائقك الرسمية في مكان واحد — اضغط على أي بطاقة لعرض رمز QR
        </p>
      </motion.div>

      {/* البطاقات */}
      <div className="flex flex-col gap-5">
        {WALLET_DOCS.map((doc, i) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12, duration: 0.4 }}
          >
            <DocCard doc={doc} />
          </motion.div>
        ))}
      </div>

      {/* تنبيه أمان */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="mt-4 p-4 rounded-2xl text-center"
        style={{ backgroundColor: 'rgba(27,79,114,0.08)', border: '1px dashed rgba(27,79,114,0.3)' }}
      >
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          🔒 بياناتك مشفّرة ولا تُشارك مع أي جهة بدون موافقتك
        </p>
      </motion.div>
    </motion.div>
  )
}
