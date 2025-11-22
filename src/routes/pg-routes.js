async function pgRoutes(fastify, options) {

    const bodySchema = {
        type: 'object',
        required: ['name'],
        properties: {
            name: { type: 'string', minLength: 1 }
        }
    }

    fastify.get('/', async (request, reply) => {
        const client = await fastify.pg.connect()
        const { rows } = await client.query('SELECT * FROM resources')
        client.release()
        return { resources: rows }
    })

    fastify.get('/:id', async (request, reply) => {
        const { id } = request.params
        const client = await fastify.pg.connect()
        const { rows } = await client.query('SELECT * FROM resources WHERE id=$1', [id])
        client.release()

        if (rows.length === 0) {
            return reply.status(404).send({ error: 'Resource not found' })
        }
        return { resource: rows[0] }
    })

    fastify.post('/', { schema: { body: bodySchema } }, async (request, reply) => {
        const { name } = request.body
        const client = await fastify.pg.connect()
        const { rows } = await client.query(
            'INSERT INTO resources(name) VALUES($1) RETURNING *',
            [name]
        )
        client.release()
        return reply.status(201).send({ resource: rows[0] })
    })

    fastify.put('/:id', { schema: { body: bodySchema } }, async (request, reply) => {
        const { id } = request.params
        const { name } = request.body
        const client = await fastify.pg.connect()
        const { rows } = await client.query(
            'UPDATE resources SET name=$1 WHERE id=$2 RETURNING *',
            [name, id]
        )
        client.release()

        if (rows.length === 0) {
            return reply.status(404).send({ error: 'Resource not found' })
        }
        return { resource: rows[0] }
    })

    fastify.delete('/:id', async (request, reply) => {
        const { id } = request.params
        const client = await fastify.pg.connect()
        const { rowCount } = await client.query('DELETE FROM resources WHERE id=$1', [id])
        client.release()

        if (rowCount === 0) {
            return reply.status(404).send({ error: 'Resource not found' })
        }
        return { message: 'Deleted successfully' }
    })
}

module.exports = pgRoutes