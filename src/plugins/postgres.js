const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
    fastify.register(require('@fastify/postgres'), {
        connectionString: process.env.POSTGRES_URL
    })

    fastify.ready().then(async () => {
        try {
            const client = await fastify.pg.connect()
            await client.query(`
        CREATE TABLE IF NOT EXISTS resources (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL
        );
      `)
            client.release()
            fastify.log.info('PostgreSQL: Table "resources" checked/created')
        } catch (err) {
            fastify.log.error(err)
        }
    })
})