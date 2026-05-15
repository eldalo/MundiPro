const dateFmt = new Intl.DateTimeFormat('es-MX', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
})

const timeFmt = new Intl.DateTimeFormat('es-MX', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

export function formatKickoff(iso: string): { date: string; time: string } {
  const d = new Date(iso)
  return { date: dateFmt.format(d), time: timeFmt.format(d) }
}

export function formatTeamCode(code: string | null | undefined): string {
  return code ?? '???'
}
