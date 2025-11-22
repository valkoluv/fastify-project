const Fastify = require('fastify')

const fastify = Fastify({ logger: true })

fastify.register(require('./plugins/postgres'))
fastify.register(require('./plugins/mongo'))

fastify.register(require('./routes/pg-routes'), { prefix: '/api/pg/resources' })

fastify.register(require('./routes/mongo-routes'), { prefix: '/api/mongo/resources' })


const start = async () => {
    try {
        await fastify.listen({ port: 3000, host: '0.0.0.0' })
        console.log('Server is running and connected to DBs')
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()