import app from "./app";
import { serve } from "@hono/node-server";

const mode =
  process.env.NODE_ENV === "test" ? "development" : process.env.NODE_ENV;

const isProductionMode = mode === "production";

if (isProductionMode) {
  serve(
    {
      ...app,
      port: Number(process.env.PORT) || 3000,
    },
    async (info) => console.log(`🚀 Server started on port ${info.port}`)
  );
}

export default app;
