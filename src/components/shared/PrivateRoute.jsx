/**
 * PrivateRoute — يحمي الصفحات التي تتطلب تسجيل الدخول
 * إذا غير مسجل → يحوّل لـ /login
 */
import { Navigate } from 'react-router-dom'
import useAppStore from '../../store/useAppStore'

export function PrivateRoute({ children }) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

/**
 * PublicRoute — يمنع الوصول لـ /login إذا كان المستخدم مسجلاً
 * إذا مسجل → يحوّل مباشرةً لـ /dashboard
 */
export function PublicRoute({ children }) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children
}
