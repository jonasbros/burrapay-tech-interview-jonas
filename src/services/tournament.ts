import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import { getTournament } from '../storage/index.ts'

// Validate tournament exists
export const validateTournamentExists = (tournamentId: string) =>
  pipe(
    getTournament(tournamentId),
    TE.fromOption(() => 'Tournament not found'),
    TE.map(() => undefined)
  )
