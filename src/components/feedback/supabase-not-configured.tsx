import { TriangleAlert } from 'lucide-react'

export function SupabaseNotConfigured() {
  return (
    <div
      role="alert"
      className="border-2 border-destructive bg-destructive/10 text-foreground flex items-start gap-3 rounded-xl px-4 py-3 text-sm"
    >
      <TriangleAlert className="text-destructive mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.5} />
      <div className="space-y-1">
        <p className="font-black uppercase tracking-wider text-xs">Supabase no configurado</p>
        <p className="text-[var(--ink-soft)] text-xs">
          Añade <code className="font-mono">VITE_SUPABASE_URL</code> y{' '}
          <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> a{' '}
          <code className="font-mono">.env.local</code> y reinicia el servidor.
        </p>
      </div>
    </div>
  )
}
