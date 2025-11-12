import { Request, Response } from "express";
import Stripe from "stripe";
import prisma from "../db/client.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-10-29.clover" });

export async function stripeWebhookHandler(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];
  if (!sig) return res.status(400).send("Missing stripe-signature header");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      (req as any).rawBody, // ver server.ts
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const subscriptionId = session.subscription as string | undefined;
        const customerId = session.customer as string | undefined;

        if (userId) {
          await prisma.usuario.update({
            where: { id: userId },
            data: {
              plano: "PREMIUM",
              // opcional: defina expiração como +30 dias (Stripe já renova, mas mantemos redundância)
              premiumExpiraEm: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              stripeCustomerId: customerId ?? undefined,
              stripeSubscriptionId: subscriptionId ?? undefined,
            },
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        // pagamento falhou — você pode notificar via WhatsApp, ou agendar rebaixa
        break;
      }
      default:
        // ignore outros eventos por enquanto
        break;
    }

    res.json({ received: true });
  } catch (e: any) {
    console.error("Erro no webhook handler:", e);
    res.status(500).send("Webhook handler error");
  }
}
