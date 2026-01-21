import {
  Tournament,
  TournamentResponse,
  Player,
  PlayerResponse,
} from '../types/index.ts'

export const toTournamentResponse = (
  tournament: Tournament
): TournamentResponse => ({
  id: tournament.id,
  name: tournament.name,
  megaTournament: tournament.megaTournament,
  createdAt: tournament.createdAt.toISOString(),
})

export const toPlayerResponse = (player: Player): PlayerResponse => ({
  id: player.id,
  name: player.name,
  tournamentId: player.tournamentId,
})
