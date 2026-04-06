/**
 * CategoryTabs — تبويبات تصنيف الخدمات
 * تتيح التنقل بين أحداث الحياة الثلاثة: الهوية، المركبات، التقاعد
 */
import { motion } from 'framer-motion'
import { IdCard, Car, Heart } from 'lucide-react'

const ICON_MAP = { IdCard, Car, Heart }

export default function CategoryTabs({ categories, activeId, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {categories.map((cat) => {
        const Icon = ICON_MAP[cat.icon] ?? IdCard
        const isActive = cat.id === activeId

        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors flex-shrink-0"
            style={{
              backgroundColor: isActive ? cat.color : 'var(--color-bg-card)',
              color: isActive ? '#fff' : 'var(--color-text-muted)',
              border: `1px solid ${isActive ? cat.color : 'var(--color-border)'}`,
            }}
          >
            <Icon size={16} />
            {cat.title}

            {/* نقطة متحركة تحت التبويب النشط */}
            {isActive && (
              <motion.span
                layoutId="tab-indicator"
                className="absolute -bottom-1 right-1/2 translate-x-1/2 w-1 h-1 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
