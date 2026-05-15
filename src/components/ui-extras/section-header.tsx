import { cn } from '@/lib/utils'

type Props = {
  eyebrow?: string
  title: string
  action?: React.ReactNode
  className?: string
}

export function SectionHeader({ eyebrow, title, action, className }: Props) {
  return (
    <div className={cn('flex items-end justify-between gap-3', className)}>
      <div>
        {eyebrow && (
          <div className="flex items-center gap-2 mb-1">
            <span aria-hidden className="h-1 w-6 rounded-full bg-primary" />
            <span className="panini-eyebrow">{eyebrow}</span>
          </div>
        )}
        <h2 className="panini-display text-xl sm:text-2xl">{title}</h2>
      </div>
      {action}
    </div>
  )
}
