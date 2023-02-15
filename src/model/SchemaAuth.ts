import { Static, Type } from "@sinclair/typebox";

export const SchemaAuth = Type.Object({
  email: Type.String(),
  password: Type.String(),
});

export type SchemaAuthType = Static<typeof SchemaAuth>;
