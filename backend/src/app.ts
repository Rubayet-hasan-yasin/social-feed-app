import express from "express";
import cors from "cors";
import morgan from "morgan";

import { swaggerSpec } from "./config/swagger.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ─── Swagger UI
app.get("/api/docs", (_req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Mini Social Feed API</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
    <style>body { margin: 0; }</style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js"></script>
    <script>
      window.onload = function () {
        SwaggerUIBundle({
          url: "/api/docs.json",
          dom_id: "#swagger-ui",
          presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
          layout: "StandaloneLayout",
          persistAuthorization: true,
          tryItOutEnabled: true,
        });
      };
    </script>
  </body>
</html>`);
});

// Raw OpenAPI JSON spec
app.get("/api/docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Health check
app.get("/api", (_req, res) => {
  res.json({
    success: true,
    message: "🚀 Mini Social Feed API is running",
    docs: "/api/docs",
  });
});


app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);


app.use(notFound);
app.use(errorHandler);

export default app;
