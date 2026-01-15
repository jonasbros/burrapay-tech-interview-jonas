import * as TE from 'fp-ts/lib/TaskEither'
import pLimit from 'p-limit'
import { PokemonApiResponse } from '../types/index.ts'

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2/pokemon'
const POKEAPI_RATE_LIMIT = 10

// Rate limiter
const limit = pLimit(POKEAPI_RATE_LIMIT)

// Fetch Pokemon data from PokeAPI using TaskEither with rate limiting
export const fetchPokemon = (
  name: string
): TE.TaskEither<string, PokemonApiResponse> =>
  TE.tryCatch(
    () =>
      limit(async () => {
        const response = await fetch(
          `${POKEAPI_BASE_URL}/${name.toLowerCase()}`
        )

        if (!response.ok) {
          throw new Error('Name is not a valid Pokemon')
        }

        const data = await response.json()
        return data as PokemonApiResponse
      }),
    (error) => (error instanceof Error ? error.message : String(error))
  )

// Extract Pokemon data needed for player creation
export const extractPokemonData = (pokemon: PokemonApiResponse) => ({
  id: pokemon.id,
  types: pokemon.types.map((t) => t.type.name),
  height: pokemon.height,
  weight: pokemon.weight,
})
