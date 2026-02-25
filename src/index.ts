import "dotenv/config";
import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { z } from "zod";

const app = Fastify({
  logger: true,
});

// Rota simples
app.get("/", async function handler() {
  return { hello: "world" };
});

// Rota com type provider + schema Zod
app.withTypeProvider<ZodTypeProvider>().route({
  method: "GET",
  url: "/hello",
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
    return {
      message: "Hello world",
    };
  },
});

// Registrando os compilers
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Start do servidor
try {
  await app.listen({ port: Number(process.env.PORT) });
  console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
