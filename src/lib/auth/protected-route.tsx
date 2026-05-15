import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from './auth-context'
import { Skeleton } from '@/components/ui/skeleton'

export function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <AuthLoading />
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}

function AuthLoading() {
  return (
    <div className="bg-background flex min-h-svh items-center justify-center p-4">
      <div className="flex w-full max-w-sm flex-col gap-3">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  )
}
