import * as TE from 'fp-ts/lib/TaskEither'
import pLimit from 'p-limit'
import { PokemonApiResponse } from '../types/index.ts'

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2/pokemon'
const POKEAPI_RATE_LIMIT = 10

// Rate limiter
const limit = pLimit(POKEAPI_RATE_LIMIT)

// In-memory cache
const pokemonCache = new Map<string, PokemonApiResponse>()

// Fetch Pokemon data with caching, rate limiting
export const fetchPokemon = (
  name: string
): TE.TaskEither<string, PokemonApiResponse> =>
  TE.tryCatch(
    async () => {
      const key = name.toLowerCase()

      // Return cached version if available
      if (pokemonCache.has(key)) {
        return pokemonCache.get(key)!
      }

      // Rate-limited fetch
      const response = await limit(() => fetch(`${POKEAPI_BASE_URL}/${key}`))

      if (!response.ok) {
        throw new Error('Name is not a valid Pokemon')
      }

      const data = (await response.json()) as PokemonApiResponse

      // Store in cache
      pokemonCache.set(key, data)

      return data
    },
    (error) => (error instanceof Error ? error.message : String(error))
  )

// Extract Pokemon data needed for player creation
export const extractPokemonData = (pokemon: PokemonApiResponse) => ({
  id: pokemon.id,
  types: pokemon.types.map((t) => t.type.name),
  height: pokemon.height,
  weight: pokemon.weight,
})
