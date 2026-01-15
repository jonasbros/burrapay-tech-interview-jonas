import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import { createPlayer } from '../storage/index.ts'
import { fetchPokemon, extractPokemonData } from './pokemon.ts'

// Create Pokemon player from validated name
export const createPokemonPlayer = (name: string, tournamentId: string) =>
  pipe(
    fetchPokemon(name),
    TE.map(extractPokemonData),
    TE.flatMap((pokemonData) =>
      TE.fromEither(createPlayer(name, tournamentId, pokemonData))
    )
  )
