export const queryKeys = {
  groups: {
    all: ['groups'] as const,
    list: () => ['groups', 'list'] as const,
  },
  teams: {
    all: ['teams'] as const,
    list: () => ['teams', 'list'] as const,
    byGroup: (code: string) => ['teams', 'byGroup', code] as const,
  },
  standings: {
    all: ['standings'] as const,
    list: () => ['standings', 'list'] as const,
  },
  matches: {
    all: ['matches'] as const,
    list: (filters?: Record<string, unknown>) =>
      ['matches', 'list', filters ?? {}] as const,
    upcoming: (limit: number) => ['matches', 'upcoming', limit] as const,
    detail: (id: number) => ['matches', 'detail', id] as const,
  },
  predictions: {
    all: ['predictions'] as const,
    mine: () => ['predictions', 'mine'] as const,
  },
  extras: {
    all: ['extras'] as const,
    mine: () => ['extras', 'mine'] as const,
  },
  outcomes: {
    all: ['outcomes'] as const,
    singleton: () => ['outcomes', 'singleton'] as const,
    bonusOpen: () => ['outcomes', 'bonus-open'] as const,
  },
  ranking: {
    all: ['ranking'] as const,
    top: (limit: number) => ['ranking', 'top', limit] as const,
    mine: () => ['ranking', 'mine'] as const,
  },
  profile: {
    all: ['profile'] as const,
    me: () => ['profile', 'me'] as const,
  },
} as const
