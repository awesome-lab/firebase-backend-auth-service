import fastify from "fastify";

import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

import { SchemaAuth, SchemaAuthType } from "./src/model/SchemaAuth";
import HorseRacingAuth from "./src/horseRacingAuth";
import { FB_CONFIG } from "./config";
import { Credential } from "./src/model/Auth";

const app = fastify({
  trustProxy: true,
}).withTypeProvider<TypeBoxTypeProvider>();

const auth = new HorseRacingAuth(FB_CONFIG as any);

app.get("/ping", async (_request, _reply) => {
  return "pong\n";
});

app.get(
  "/",
  {
    schema: {
      querystring: SchemaAuth,
    },
  },
  async (request: any, reply: any) => {
    const payload = request.query as SchemaAuthType;

    try {
      const credential = (await auth.generateCredentials(
        payload.email,
        payload.password
      )) as Credential;

      reply.status(200).send({ Authorization: `Bearer ${credential.idToken}` });
    } catch (error) {
      reply.status(500).send({ error: "Error generating token" });
    }

    return request.query;
  }
);

// Force host 0.0.0.0 for cloud run
app.listen({ port: 8080, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    process.exit(1);
  }
  console.log(`🚀 Server ready at ${address}`);
});
