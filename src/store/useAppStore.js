/**
 * useAppStore.js — مخزن الحالة العامة لمنصة بابل
 * يستخدم Zustand لإدارة الحالة العالمية بشكل خفيف وكافٍ للـ MVP
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockUser, mockDocuments, mockTransactions, mockAlerts } from '../data/mockTransactions'

// بيانات الدخول التجريبية
const MOCK_CREDENTIALS = {
  nationalId: '19870412',
  otp: '123456',
}

const useAppStore = create(
  persist(
    (set, get) => ({
      // ─── المصادقة ───────────────────────────────
      isAuthenticated: false,
      authStep: 'id',          // 'id' | 'otp' | 'done'
      pendingNationalId: '',   // الهوية المُدخلة في الخطوة الأولى
      authError: null,

      /**
       * الخطوة الأولى: التحقق من رقم الهوية
       * يعيد { success, error }
       */
      submitNationalId: (nationalId) => {
        if (nationalId === MOCK_CREDENTIALS.nationalId) {
          set({ pendingNationalId: nationalId, authStep: 'otp', authError: null })
          return { success: true }
        }
        set({ authError: 'رقم الهوية غير صحيح، تحقق من الأرقام وأعد المحاولة' })
        return { success: false }
      },

      /**
       * الخطوة الثانية: التحقق من رمز OTP
       */
      submitOtp: (otp) => {
        if (otp === MOCK_CREDENTIALS.otp) {
          set({ isAuthenticated: true, authStep: 'done', authError: null })
          return { success: true }
        }
        set({ authError: 'الرمز غير صحيح، تحقق من الأرقام أو اطلب رمزاً جديداً' })
        return { success: false }
      },

      /** إعادة الخطوة لتغيير رقم الهوية */
      goBackToId: () =>
        set({ authStep: 'id', pendingNationalId: '', authError: null }),

      /** تسجيل الخروج */
      logout: () =>
        set({
          isAuthenticated: false,
          authStep: 'id',
          pendingNationalId: '',
          authError: null,
        }),

      clearAuthError: () => set({ authError: null }),

      // ─── بيانات التطبيق ───────────────────────────
      user: mockUser,
      documents: mockDocuments,
      transactions: mockTransactions,
      alerts: mockAlerts,
      isLoading: false,
      error: null,

      dismissAlert: (alertId) =>
        set((state) => ({
          alerts: state.alerts.filter((a) => a.id !== alertId),
        })),

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'babel-auth',           // مفتاح localStorage
      partialize: (state) => ({     // احفظ حالة المصادقة فقط
        isAuthenticated: state.isAuthenticated,
        pendingNationalId: state.pendingNationalId,
        authStep: state.authStep,
      }),
    }
  )
)

export default useAppStore
