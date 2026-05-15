import { cn } from '@/lib/utils'
import { flagCode } from '@/lib/teams/iso-mapping'

type Size = 'sm' | 'md' | 'lg' | 'xl'

const SIZE_CONFIG: Record<
  Size,
  { width: number; height: number; src: 'w40' | 'w80' | 'w160'; src2x: 'w80' | 'w160' | 'w320' }
> = {
  sm: { width: 20, height: 15, src: 'w40', src2x: 'w80' },
  md: { width: 28, height: 21, src: 'w80', src2x: 'w160' },
  lg: { width: 40, height: 30, src: 'w80', src2x: 'w160' },
  xl: { width: 56, height: 42, src: 'w160', src2x: 'w320' },
}

type Props = {
  code: string | null | undefined
  name?: string | null
  flagUrl?: string | null
  size?: Size
  className?: string
}

export function TeamFlag({ code, name, flagUrl, size = 'sm', className }: Props) {
  const cfg = SIZE_CONFIG[size]

  // 1) prefer team.flag_url from DB if provided
  if (flagUrl) {
    return (
      <img
        src={flagUrl}
        width={cfg.width}
        height={cfg.height}
        alt={name ?? code ?? ''}
        loading="lazy"
        decoding="async"
        className={cn(
          'inline-block rounded-[4px] object-cover border-2 border-[var(--ink)]/40',
          className,
        )}
      />
    )
  }

  // 2) fallback to flagcdn via ISO mapping
  const flag = flagCode(code)
  if (!flag) {
    return (
      <span
        className={cn('bg-muted inline-block rounded-[3px]', className)}
        style={{ width: cfg.width, height: cfg.height }}
        aria-hidden
      />
    )
  }

  const base = `https://flagcdn.com/${cfg.src}/${flag}.png`
  const x2 = `https://flagcdn.com/${cfg.src2x}/${flag}.png 2x`

  return (
    <img
      src={base}
      srcSet={x2}
      width={cfg.width}
      height={cfg.height}
      alt={name ?? code ?? ''}
      loading="lazy"
      decoding="async"
      className={cn(
        'inline-block rounded-[4px] object-cover border-2 border-[var(--ink)]/40',
        className,
      )}
    />
  )
}
