import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth()

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="spinner" />
    </div>
  )

  return admin ? children : <Navigate to="/admin/login" replace />
}
