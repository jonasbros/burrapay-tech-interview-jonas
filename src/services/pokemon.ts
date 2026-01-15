import * as TE from 'fp-ts/lib/TaskEither'
import { PokemonApiResponse } from '../types/index.ts'

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2/pokemon'

// Fetch Pokemon data from PokeAPI using TaskEither
export const fetchPokemon = (
  name: string
): TE.TaskEither<string, PokemonApiResponse> =>
  TE.tryCatch(
    async () => {
      const response = await fetch(`${POKEAPI_BASE_URL}/${name.toLowerCase()}`)

      if (!response.ok) {
        throw new Error('Name is not a valid Pokemon')
      }

      const data = await response.json()
      return data as PokemonApiResponse
    },
    (error) => {
      if (
        error instanceof Error &&
        error.message === 'Name is not a valid Pokemon'
      ) {
        return 'Name is not a valid Pokemon'
      }
      return `Failed to validate Pokemon: ${error}`
    }
  )

// Extract Pokemon data needed for player creation
export const extractPokemonData = (pokemon: PokemonApiResponse) => ({
  id: pokemon.id,
  types: pokemon.types.map((t) => t.type.name),
  height: pokemon.height,
  weight: pokemon.weight,
})
