/**
 * Services.jsx — دليل الخدمات الحكومية (Phase 3: Service Directory)
 * Header و BottomNav يُوفّرهما Layout
 */
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import CategoryTabs from '../components/services/CategoryTabs'
import ServiceCard from '../components/services/ServiceCard'
import OfficeStatusWidget from '../components/services/OfficeStatusWidget'
import { lifeEvents } from '../data/services'

export default function Services() {
  const [activeCategory, setActiveCategory] = useState(lifeEvents[0].id)
  const [searchQuery, setSearchQuery]       = useState('')

  const category = lifeEvents.find((c) => c.id === activeCategory)

  // debounce-safe: فلترة فورية (debounce في search handler)
  const filtered = searchQuery.trim()
    ? lifeEvents.flatMap((cat) =>
        cat.services
          .filter((s) =>
            s.name.includes(searchQuery) ||
            s.requiredDocs.some((d) => d.includes(searchQuery)) ||
            s.office.includes(searchQuery)
          )
          .map((s) => ({ ...s, _categoryColor: cat.color }))
      )
    : null

  return (
    <>
      {/* حالة الدوائر */}
      <OfficeStatusWidget />

      {/* شريط البحث */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative mb-4"
      >
        <Search
          size={16}
          className="absolute top-1/2 -translate-y-1/2 right-3.5 pointer-events-none"
          style={{ color: 'var(--color-text-muted)' }}
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="ابحث عن خدمة أو ورقة مطلوبة..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-3.5 pr-11 pl-10 rounded-xl text-sm outline-none"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-main)',
          }}
          aria-label="البحث في الخدمات"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute top-1/2 -translate-y-1/2 left-3"
            style={{ color: 'var(--color-text-muted)' }}
            aria-label="مسح البحث"
          >
            <X size={15} />
          </button>
        )}
      </motion.div>

      {/* نتائج البحث */}
      {filtered !== null ? (
        <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
            {filtered.length > 0 ? `${filtered.length} نتيجة لـ "${searchQuery}"` : `لا توجد نتائج لـ "${searchQuery}"`}
          </p>
          {filtered.length === 0 ? (
            <div className="card p-8 text-center" style={{ color: 'var(--color-text-muted)' }}>
              <Search size={32} className="mx-auto mb-3 opacity-30" aria-hidden="true" />
              <p className="text-sm">لا توجد خدمات تطابق بحثك</p>
              <p className="text-xs mt-1 opacity-70">جرّب كلمة مختلفة</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((service, i) => (
                <ServiceCard key={service.id} service={service} categoryColor={service._categoryColor} index={i} />
              ))}
            </div>
          )}
        </motion.div>
      ) : (
        /* التبويبات */
        <>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="mb-4"
          >
            <CategoryTabs categories={lifeEvents} activeId={activeCategory} onSelect={setActiveCategory} />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              <div
                className="flex items-center gap-3 mb-4 px-4 py-3 rounded-xl"
                style={{ backgroundColor: `${category.color}15`, border: `1px solid ${category.color}28` }}
              >
                <div className="w-2 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: category.color }} />
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--color-text-main)' }}>{category.title}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{category.services.length} خدمة متاحة</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.services.map((service, i) => (
                  <ServiceCard key={service.id} service={service} categoryColor={category.color} index={i} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </>
  )
}
