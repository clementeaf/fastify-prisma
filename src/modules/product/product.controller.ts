import { FastifyRequest, FastifyReply } from 'fastify';
import {CreateProductInput } from './product.schema';
import { createProduct, getProducts } from './product.server';

export async function createProductHandler(
    request: FastifyRequest<{
        Body: CreateProductInput;
    }>,
    reply: FastifyReply
){
    const product = await createProduct({
        ...request.body,
        ownerId: request.user.id,
    });

    return product;
}

export async function getProductsHandler(){
    const products = await getProducts();
    return products
}