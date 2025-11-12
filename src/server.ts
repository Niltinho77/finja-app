import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { stripeWebhookHandler } from "./routes/stripeWebhook.js";
import stripeRoutes from "./routes/stripe.js";
import stripeSessionRoutes from "./routes/stripeSession.js"; // ✅ novo
import whatsappRoutes from "./routes/whatsapp.js";
import iaRoutes from "./routes/ia.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// ✅ 1. Rota do webhook isolada (usa raw)
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  (req: any, _res, next) => {
    req.rawBody = req.body;
    next();
  },
  stripeWebhookHandler
);

// ✅ 2. Agora sim, os parsers normais para as outras rotas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 3. Suas rotas normais (essas precisam do body JSON)
app.use("/api/stripe", stripeSessionRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/ia", iaRoutes);

app.get("/", (_req, res) => res.send("FinIA backend rodando 🚀"));

app.listen(PORT, () => console.log(`Servidor FinIA rodando na porta ${PORT}`));
