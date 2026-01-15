import * as t from 'io-ts'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { PathReporter } from 'io-ts/lib/PathReporter'

// Tournament validation codec
export const CreateTournamentRequestCodec = t.type({
  name: t.string
})

// Player validation codec
export const CreatePlayerRequestCodec = t.type({
  name: t.string
})

// Generic validation function using io-ts
export const validateWith = <A>(codec: t.Type<A>) => (input: unknown): E.Either<string, A> =>
  pipe(
    codec.decode(input),
    E.mapLeft((errors) => PathReporter.report(E.left(errors)).join(', '))
  )

// Specific validators
export const validateCreateTournamentRequest = validateWith(CreateTournamentRequestCodec)
export const validateCreatePlayerRequest = validateWith(CreatePlayerRequestCodec)
