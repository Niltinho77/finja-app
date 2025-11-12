import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// 🔹 Cria uma sessão de checkout real
router.post("/create-session", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Faltando userId" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription", // ou 'payment' se for pagamento avulso
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!, // o ID do preço que você já criou
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId.toString(),
      },
      success_url: "https://finja-app-production.up.railway.app/success",
      cancel_url: "https://finja-app-production.up.railway.app/cancel",
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error("Erro ao criar sessão Stripe:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
