import "dotenv/config";
import Fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { z } from "zod";

const app = Fastify({ logger: true });

// 1. Compilers PRIMEIRO
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// 2. Swagger ANTES das rotas
await app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Bootcamp Treinos API",
      description: "API para o bootcamp de treinos do FSC",
      version: "1.0.0",
    },
    servers: [{ description: "Localhost", url: "http://localhost:3000" }],
  },
  transform: jsonSchemaTransform,
});

await app.register(fastifySwaggerUI, {
  routePrefix: "/docs",
});

// 3. Rotas DEPOIS do Swagger
app.withTypeProvider<ZodTypeProvider>().route({
  method: "GET",
  url: "/",
  schema: {
    description: "Hello world",
    tags: ["hello-world"],
    response: {
      200: z.object({
        message: z.string(),
      }),
    },
  },
  handler: () => {
    return { message: "Hello world" };
  },
});

// 4. Start do servidor
try {
  await app.listen({ port: Number(process.env.PORT) || 3001 });
  console.log(
    `🚀 Server running at http://localhost:${process.env.PORT || 3001}`,
  );
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
