import Fastify from 'fastify'
import { tournamentRoutes } from './routes/tournaments.ts'
import { playerRoutes } from './routes/players.ts'

async function buildServer() {
  const fastify = Fastify({ logger: true })

  // Register routes
  await fastify.register(tournamentRoutes, { prefix: '/api' })
  await fastify.register(playerRoutes, { prefix: '/api' })

  // Basic health check endpoint (already implemented)
  fastify.get('/health', async () => {
    return { status: 'OK', timestamp: new Date().toISOString() }
  })

  return fastify
}

async function start() {
  try {
    const fastify = await buildServer()

    await fastify.listen({ port: 3000, host: '0.0.0.0' })

    console.log('🚀 Pokemon Tournament API Server started successfully!')
    console.log('📡 Server running on http://localhost:3000')
    console.log('🎮 Ready to accept Pokemon players only!')
  } catch (err) {
    console.error('❌ Error starting server:', err)
    process.exit(1)
  }
}

export { start }
