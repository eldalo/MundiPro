import { forwardRef } from 'react'
import { AlertCircle, type LucideIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type Props = Omit<React.ComponentProps<typeof Input>, 'aria-invalid'> & {
  id: string
  label: string
  error?: string | undefined
  hint?: string
  icon?: LucideIcon
  trailing?: React.ReactNode
}

export const InputField = forwardRef<HTMLInputElement, Props>(function InputField(
  { id, label, error, hint, icon: Icon, trailing, className, ...inputProps },
  ref,
) {
  const errorId = error ? `${id}-error` : undefined
  const hintId = !error && hint ? `${id}-hint` : undefined
  return (
    <div className="flex flex-col gap-1.5">
      <Label
        htmlFor={id}
        className="text-[10px] font-black uppercase tracking-widest text-foreground"
      >
        {label}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon
            aria-hidden
            className="text-[var(--ink-soft)] pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
            strokeWidth={2}
          />
        )}
        <Input
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={errorId ?? hintId}
          className={cn(
            'h-12 text-sm',
            Icon && 'pl-10',
            trailing && 'pr-10',
            error && 'border-destructive focus-visible:ring-destructive/30',
            className,
          )}
          {...inputProps}
        />
        {trailing && (
          <div className="absolute top-1/2 right-1 -translate-y-1/2">{trailing}</div>
        )}
      </div>
      {error ? (
        <p
          id={errorId}
          className="text-destructive flex items-center gap-1.5 text-xs font-bold"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-[var(--ink-soft)] text-xs italic" style={{ fontFamily: 'Georgia, serif' }}>
          {hint}
        </p>
      ) : null}
    </div>
  )
})
