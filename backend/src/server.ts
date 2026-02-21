import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";


dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;

await connectDB(MONGO_URI);

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

export default app;
