import { Tournament, TournamentResponse } from '../types/index.ts'

export const toTournamentResponse = (tournament: Tournament): TournamentResponse => ({
  id: tournament.id,
  name: tournament.name,
  createdAt: tournament.createdAt.toISOString()
})
