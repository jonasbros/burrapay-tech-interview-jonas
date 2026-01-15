import { FastifyInstance } from 'fastify'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import { CreatePlayerRequest } from '../types/index.ts'
import { validateCreatePlayerRequest } from '../validation/index.ts'
import { validateTournamentExists } from '../services/tournament.ts'
import { createPokemonPlayer } from '../services/player.ts'
import { toPlayerResponse } from '../utils/transformers.ts'

export async function playerRoutes(fastify: FastifyInstance) {
  // POST /tournaments/:tournamentId/players - Add Pokemon player to tournament
  fastify.post<{
    Params: { tournamentId: string }
    Body: CreatePlayerRequest
  }>('/tournaments/:tournamentId/players', async (request, reply) => {
    const { tournamentId } = request.params
    const createPlayerTask = pipe(
      TE.fromEither(validateCreatePlayerRequest(request.body)),
      TE.tap(() => validateTournamentExists(tournamentId)),
      TE.flatMap((validRequest) =>
        createPokemonPlayer(validRequest.name, tournamentId)
      ),
      TE.map(toPlayerResponse),
      TE.fold(
        (error) => async () => {
          const statusCode = error === 'Tournament not found' ? 404 : 400
          fastify.log.warn(
            { error, tournamentId, reqId: request.id },
            'Failed to add player'
          )
          return reply.status(statusCode).send({ error })
        },
        (player) => async () => {
          fastify.log.info(
            { playerId: player.id, tournamentId, reqId: request.id },
            'Player added successfully'
          )
          return reply.status(201).send(player)
        }
      )
    )

    return createPlayerTask()
  })
}
