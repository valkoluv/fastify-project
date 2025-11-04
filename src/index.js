import Fastify from 'fastify'

const fastify = Fastify({ logger: true });

let resources = [
    { id: 1, name: 'Resource 1' },
    { id: 2, name: 'Resource 2' },
    { id: 3, name: 'Resource 3' }
];

fastify.get('/api/resources', async (request, reply) => {
    reply.send({ resources})
})

fastify.get('/api/resources/:id', async (request, reply) => {
    const {id} = request.params
    const resource = resources.find(r => r.id === Number(id))
    if (resource) {
        reply.send({ resource })
    } else {
        reply.status(404).send({ error: 'Resource not found' })
    }
})

fastify.post('/api/resources', async (request, reply) => {
    const { name } = request.body
    const newResource = { id: resources.length + 1, name }
    resources.push(newResource)
    reply.status(201).send({ resource: newResource })
})

fastify.put('/api/resources/:id', async (request, reply) => {
    const { id } = request.params
    const { name } = request.body
    const resource = resources.find(r => r.id === Number(id))
    if (resource) {
        resource.name = name
        reply.send({ resource })
    } else {
        reply.status(404).send({ error: 'Resource not found' })
    }
})

fastify.delete('/api/resources/:id', async (request, reply) => {
    const { id } = request.params
    const index = resources.findIndex(r => r.id === Number(id))
    if (index !== -1) {
        const deletedResource = resources.splice(index, 1)
        reply.send({ resource: deletedResource[0] })
    } else {
        reply.status(404).send({ error: 'Resource not found' })
    }  
})

fastify.listen({ port: 3000, host: '0.0.0.0' }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    console.log(`Server listening on ${address}`)
})