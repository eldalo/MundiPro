import { Navigate, Outlet } from 'react-router'
import { useAuth } from './auth-context'
import { Skeleton } from '@/components/ui/skeleton'

export function GuestRoute() {
  const { user, loading } = useAuth()
  if (loading) return <GuestLoading />
  if (user) return <Navigate to="/" replace />
  return <Outlet />
}

function GuestLoading() {
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
