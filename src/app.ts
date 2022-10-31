import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import fjwt from '@fastify/jwt';
import userRoutes from './modules/user/user.route';
import productRoutes from './modules/product/product.route';
import {userSchemas} from './modules/user/user.schema';
import {productSchemas} from './modules/product/product.schema';
import swagger from '@fastify/swagger';
import {withRefResolver} from 'fastify-zod';
import {version} from '../package.json'

export const server = Fastify();

declare module "fastify"{
    export interface FastifyInstance {
        authenticate: any;
    }
}

declare module '@fastify/jwt'{
    interface FastifyJWT {
        user: {
            id: number,
            email: string,
            name: string
        }
    }
}

server.register(fjwt, {
    secret: "flkds65f6dv5te541s61d32awdcrs5g4sr51c32fds6a5f1",
});

server.decorate(
    "authenticate", 
    async(request: FastifyRequest, reply: FastifyReply) => {
     try {
        await request.jwtVerify();
     } catch (e) {
        return reply.send(e)
     }   
})

server.get('/healthcheck', async function(){
    return {status: "ok"};
})

async function main(){
    for(const schema of [...userSchemas, ...productSchemas]){
        server.addSchema(schema);
    };

    server.register(
        swagger,
        withRefResolver({
            routePrefix: '/docs',
            exposeRoute: true,
            staticCSP: true,
            openapi: {
                info:{
                    title: 'Fastify API',
                    description: 'API for some products',
                    version,
                }
            }
        })
    )

    server.register(userRoutes, {prefix: 'api/users'});
    server.register(productRoutes, {prefix: 'api/products'});

    try {
        await server.listen(3000, '0.0.0.0')
        console.log('Server ready at http://localhost:3000');
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

main()