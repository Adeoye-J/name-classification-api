import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import classifyRoute from "./src/routes/classify.route.js"

dotenv.config();

const app = express();

// CORS
app.use(
    cors({
        origin: "*"
    })
)

// Route: GET /api/classify
app.use("/api", classifyRoute)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});