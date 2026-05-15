import { Navigate, Outlet } from 'react-router'
import { Skeleton } from '@/components/ui/skeleton'
import { useMyProfile } from '@/lib/queries/profile'

export function AdminRoute() {
  const profile = useMyProfile()

  if (profile.isLoading) return <AdminLoading />
  if (!profile.data?.is_admin) return <Navigate to="/" replace />
  return <Outlet />
}

function AdminLoading() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  )
}
