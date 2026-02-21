import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import { swaggerSpec } from "./config/swagger.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";

const app = express();


app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Mini Social Feed API",
    swaggerOptions: { persistAuthorization: true },
  })
);


app.get("/api/docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});


app.get("/api", (_req, res) => {
  res.json({
    success: true,
    message: "🚀 Mini Social Feed API is running",
    docs: "/api/docs",
  });
});

//API Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);


app.use(notFound);
app.use(errorHandler);

export default app;
