import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { stripeWebhookHandler } from "./routes/stripeWebhook.js";
import stripeRoutes from "./routes/stripe.js";
import whatsappRoutes from "./routes/whatsapp.js";
import iaRoutes from "./routes/ia.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Habilita CORS (evita erros em requests externos)
app.use(cors());

// ✅ Webhook precisa do corpo "raw" — vem ANTES do express.json()
app.post(
  "/api/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  (req: any, _res, next) => {
    req.rawBody = req.body; // importante: salva rawBody
    next();
  },
  stripeWebhookHandler
);

// ✅ Depois do webhook, ativa parsers normais
app.use(bodyParser.json({ limit: "2mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Outras rotas da aplicação
app.use("/api/stripe", stripeRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/ia", iaRoutes);

// ✅ Rota de teste simples (GET /)
app.get("/", (_req, res) => {
  res.send("FinIA backend rodando 🚀");
});

// ✅ Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor FinIA rodando na porta ${PORT}`);
});
