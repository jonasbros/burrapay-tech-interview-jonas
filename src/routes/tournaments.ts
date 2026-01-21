import { FastifyInstance } from 'fastify'
import { pipe } from 'fp-ts/lib/function'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { CreateTournamentRequest } from '../types/index.ts'
import { createTournament, getTournament, storage } from '../storage/index.ts'
import { validateCreateTournamentRequest } from '../validation/index.ts'
import { toTournamentResponse } from '../utils/transformers.ts'

export async function tournamentRoutes(fastify: FastifyInstance) {
  // POST /tournaments - Create a new tournament
  fastify.post<{ Body: CreateTournamentRequest }>(
    '/tournaments',
    async (request, reply) => {
      return pipe(
        validateCreateTournamentRequest(request.body),
        E.flatMap((validRequest) => createTournament(validRequest)),
        E.map(toTournamentResponse),
        E.fold(
          (error) => {
            fastify.log.warn(
              { error, reqId: request.id },
              'Failed to create tournament'
            )
            return reply.status(400).send({ error })
          },
          (tournament) => {
            fastify.log.info(
              { tournamentId: tournament.id, reqId: request.id },
              'Tournament created successfully'
            )
            return reply.status(201).send(tournament)
          }
        )
      )
    }
  )

  // GET /tournaments - List all tournaments
  fastify.get('/tournaments', async (request, reply) => {
    const tournaments = Array.from(storage.tournaments.values())
    const response = tournaments.map(toTournamentResponse)

    fastify.log.info(
      { count: response.length, reqId: request.id },
      'Retrieved tournaments list'
    )
    return reply.status(200).send(response)
  })

  // GET /tournaments/:id - Get tournament by ID
  fastify.get<{ Params: { id: string } }>(
    '/tournaments/:id',
    async (request, reply) => {
      const { id } = request.params

      return pipe(
        getTournament(id),
        O.map(toTournamentResponse),
        O.fold(
          () => {
            fastify.log.warn(
              { tournamentId: id, reqId: request.id },
              'Tournament not found'
            )
            return reply.status(404).send({ error: 'Tournament not found' })
          },
          (tournament) => {
            fastify.log.info(
              { tournamentId: id, reqId: request.id },
              'Tournament retrieved successfully'
            )
            return reply.status(200).send(tournament)
          }
        )
      )
    }
  )
}
