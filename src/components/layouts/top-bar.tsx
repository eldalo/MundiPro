import { Link } from 'react-router'
import { Trophy } from 'lucide-react'

export function TopBar() {
  return (
    <header
      className="border-[var(--ink)]/30 bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-30 flex h-14 items-center justify-between border-b-2 px-4 backdrop-blur lg:hidden"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <Link to="/" className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-primary text-primary-foreground">
          <Trophy className="h-4 w-4" strokeWidth={2.5} />
        </span>
        <span className="text-sm font-black uppercase tracking-wider">Mundi Pro</span>
      </Link>
    </header>
  )
}
