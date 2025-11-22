async function mongoRoutes(fastify, options) {
    const { ObjectId } = require('@fastify/mongodb')

    const bodySchema = {
        type: 'object',
        required: ['name'],
        properties: {
            name: { type: 'string', minLength: 1 },
            details: { type: 'object' }
        }
    }

    const collection = fastify.mongo.db.collection('resources')

    fastify.get('/', async (request, reply) => {
        const resources = await collection.find().toArray()
        return { resources }
    })

    fastify.get('/:id', async (request, reply) => {
        const { id } = request.params
        try {
            const resource = await collection.findOne({ _id: new ObjectId(id) })
            if (!resource) {
                return reply.status(404).send({ error: 'Resource not found' })
            }
            return { resource }
        } catch (err) {
            return reply.status(400).send({ error: 'Invalid ID format' })
        }
    })

    fastify.post('/', { schema: { body: bodySchema } }, async (request, reply) => {
        const result = await collection.insertOne(request.body)
        const newResource = { _id: result.insertedId, ...request.body }
        return reply.status(201).send({ resource: newResource })
    })

    fastify.put('/:id', { schema: { body: bodySchema } }, async (request, reply) => {
        const { id } = request.params
        try {
            const result = await collection.findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: request.body },
                { returnDocument: 'after' }
            )

            if (!result.value) {
                return reply.status(404).send({ error: 'Resource not found' })
            }
            return { resource: result.value }
        } catch (err) {
            return reply.status(400).send({ error: 'Invalid ID format' })
        }
    })

    fastify.delete('/:id', async (request, reply) => {
        const { id } = request.params
        try {
            const result = await collection.deleteOne({ _id: new ObjectId(id) })
            if (result.deletedCount === 0) {
                return reply.status(404).send({ error: 'Resource not found' })
            }
            return { message: 'Deleted successfully' }
        } catch (err) {
            return reply.status(400).send({ error: 'Invalid ID format' })
        }
    })
}

module.exports = mongoRoutes