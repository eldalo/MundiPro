import { Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { stageLabel } from '@/lib/match/stage-label'
import type { MatchStage } from '@/lib/db/types'

function stageTone(stage: MatchStage): {
  className: string
  showTrophy: boolean
} {
  if (stage === 'final') {
    return {
      className: 'bg-primary text-primary-foreground border-[var(--ink)] shadow-[2px_2px_0_var(--ink)]',
      showTrophy: true,
    }
  }
  if (stage === 'semifinal' || stage === 'third_place') {
    return {
      className: 'bg-[var(--gold)] text-foreground border-[var(--ink)]',
      showTrophy: false,
    }
  }
  if (stage === 'quarterfinal') {
    return {
      className: 'bg-destructive text-paper border-[var(--ink)]',
      showTrophy: false,
    }
  }
  if (stage === 'round_of_16' || stage === 'round_of_32') {
    return {
      className: 'bg-accent text-foreground border-[var(--ink)]',
      showTrophy: false,
    }
  }
  return {
    className: 'bg-paper text-foreground border-[var(--ink)]/60',
    showTrophy: false,
  }
}

export function StageBadge({ stage }: { stage: MatchStage }) {
  const tone = stageTone(stage)
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border-2 px-2 py-0.5 text-[10px] font-black tracking-widest uppercase',
        tone.className,
      )}
    >
      {tone.showTrophy && <Trophy className="h-3 w-3" strokeWidth={2.5} />}
      {stageLabel(stage)}
    </span>
  )
}
