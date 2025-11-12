import { Request, Response } from "express";
import Stripe from "stripe";
import prisma from "../db/client.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function stripeWebhookHandler(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];
  if (!sig) return res.status(400).send("Faltando assinatura");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      (req as any).rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Erro ao validar webhook:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.userId;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (!userId) {
          console.warn("⚠️ checkout.session.completed sem metadata.userId");
          break;
        }

        

        // Atualiza o usuário no banco
        await prisma.usuario.update({
            where: { id: userId },
            data: {
                plano: "PREMIUM",
                stripeCustomerId: customerId ?? null,
                stripeSubscriptionId: subscriptionId ?? null,
            },
            });



        console.log(`✅ Usuário ${userId} atualizado para PREMIUM`);
        break;
      }

      case "invoice.payment_failed":
        console.warn("⚠️ Pagamento falhou:", event.id);
        break;

      case "customer.subscription.deleted":
        console.warn("⚠️ Assinatura cancelada:", event.id);
        // aqui você poderia rebaixar o usuário para FREE, se quiser
        break;

      default:
        console.log(`ℹ️ Evento ignorado: ${event.type}`);
    }
  } catch (err) {
    console.error("Erro ao processar evento:", err);
  }

  res.status(200).json({ received: true });
}
