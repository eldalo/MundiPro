import { Outlet } from 'react-router'
import { Trophy } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-background text-foreground">
      <header className="relative max-w-5xl mx-auto w-full flex items-center justify-between px-6 py-5 sm:px-8 sm:py-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-primary text-primary-foreground">
            <Trophy className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="text-xl font-black uppercase tracking-wider text-foreground">
            Mundi Pro
          </span>
        </div>
        <span className="hidden sm:inline panini-eyebrow">Álbum 2026</span>
      </header>
      <main className="relative flex flex-1 items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
      <footer className="relative px-6 py-5 text-center panini-eyebrow">
        Quiniela Mundial 2026
      </footer>
    </div>
  )
}
