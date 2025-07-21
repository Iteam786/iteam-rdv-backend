// 📁 backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rendezvousRoutes from "./routes/rendezvousRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/rendezvous", rendezvousRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("✅ Backend Mosquée en ligne"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`));
