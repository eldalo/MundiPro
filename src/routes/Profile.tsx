import { Link } from 'react-router'
import { toast } from 'sonner'
import { ChevronRight, Loader2, LogOut, Settings, Shield } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ProfileEditCard } from '@/components/profile/profile-edit-card'
import { useAuth } from '@/lib/auth/auth-context'
import { useSignOutMutation } from '@/lib/auth/auth-mutations'
import { useMyProfile } from '@/lib/queries/profile'

export default function Profile() {
  const { user } = useAuth()
  const profile = useMyProfile()
  const signOut = useSignOutMutation()

  const data = profile.data
  const isAdmin = data?.is_admin ?? false
  const displayName = data?.display_name?.trim() || user?.email?.split('@')[0] || 'Jugador'
  const initials = displayName.slice(0, 2).toUpperCase()

  const handleSignOut = () => {
    signOut.mutate(undefined, {
      onSuccess: () => toast.success('Sesión cerrada'),
      onError: (err) => {
        const message = err instanceof Error ? err.message : 'No se pudo cerrar sesión'
        toast.error('Error', { description: message })
      },
    })
  }

  return (
    <div className="flex flex-col gap-7">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-1 w-6 rounded-full bg-primary" />
          <span className="panini-eyebrow">Mi cuenta · Tu cromo personal</span>
        </div>
        <h1 className="panini-display text-4xl sm:text-5xl">Mi álbum</h1>
      </header>

      <div className="relative">
        <div
          aria-hidden
          className="absolute -top-3 -right-3 h-full w-full rounded-3xl bg-primary"
        />
        <div className="relative panini-card p-6 sm:p-7 shadow-xl">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)]">
              <AvatarImage src={data?.avatar_url ?? undefined} alt="" />
              <AvatarFallback className="text-2xl font-black bg-accent text-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              {profile.isLoading ? (
                <>
                  <Skeleton className="mb-2 h-7 w-40" />
                  <Skeleton className="h-4 w-48" />
                </>
              ) : (
                <>
                  <h2 className="panini-display truncate text-2xl sm:text-3xl">
                    {displayName}
                  </h2>
                  <p className="font-mono text-xs text-[var(--ink-soft)] truncate mt-1">
                    {user?.email}
                  </p>
                  {isAdmin && (
                    <span className="mt-2 inline-flex items-center gap-1 rounded-md border-2 border-[var(--ink)] bg-destructive px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-paper shadow-[2px_2px_0_var(--ink)]">
                      <Shield className="h-3 w-3" strokeWidth={2.5} />
                      Admin
                    </span>
                  )}
                </>
              )}
            </div>
            <Button
              variant="panini-outline"
              size="panini-sm"
              onClick={handleSignOut}
              disabled={signOut.isPending}
              className="shrink-0"
            >
              {signOut.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              Salir
            </Button>
          </div>
        </div>
      </div>

      {isAdmin && (
        <Link
          to="/admin/matches"
          className="focus-visible:ring-2 focus-visible:ring-ring rounded-2xl focus-visible:outline-none lg:hidden block"
        >
          <div className="panini-card p-4 flex items-center gap-4 hover:bg-accent/30 transition-colors">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[var(--ink)] bg-destructive text-paper shadow-[2px_2px_0_var(--ink)]">
              <Settings className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <div className="flex-1">
              <p className="text-sm font-black uppercase tracking-wider">Admin · Partidos</p>
              <p className="text-xs text-[var(--ink-soft)] mt-0.5">Cargar resultados</p>
            </div>
            <ChevronRight className="text-[var(--ink-soft)] h-5 w-5" strokeWidth={2.5} />
          </div>
        </Link>
      )}

      {profile.isLoading ? (
        <Skeleton className="h-72 w-full rounded-2xl" />
      ) : profile.error ? (
        <div className="border-2 border-destructive bg-destructive/10 rounded-xl px-4 py-3 text-sm font-bold">
          No se pudo cargar el perfil.
        </div>
      ) : data ? (
        <ProfileEditCard profile={data} />
      ) : null}
    </div>
  )
}
