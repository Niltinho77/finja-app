// src/routes/auth.ts
import { Router } from "express";
import jwt from "jsonwebtoken";
import  prisma  from "../db/client.js"; // ajuste para seu caminho real

const router = Router();

/**
 * POST /api/auth/login
 * Exemplo de corpo: { "telefone": "+5551999999999" }
 * No seu fluxo real, você pode receber um token ou código enviado via WhatsApp.
 */
router.post("/login", async (req, res) => {
  const { telefone } = req.body as { telefone?: string };

  if (!telefone) {
    return res.status(400).json({ message: "Telefone é obrigatório." });
  }

  // procura usuário pelo telefone
  const usuario = await prisma.usuario.findUnique({ where: { telefone } });
  if (!usuario) {
    return res.status(401).json({ message: "Usuário não encontrado." });
  }

  // aqui você poderia validar um código de verificação enviado ao telefone

  // gera JWT válido por 7 dias
  const token = jwt.sign(
    { userId: usuario.id },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  // devolve dados do usuário (omitindo campos sensíveis)
  res.json({
    user: {
      id: usuario.id,
      nome: usuario.nome,
      telefone: usuario.telefone,
      idioma: usuario.idioma,
      plano: usuario.plano,
      trialExpiraEm: usuario.trialExpiraEm,
      premiumExpiraEm: usuario.premiumExpiraEm,
    },
    token,
  });
});

/**
 * GET /api/auth/me
 * Retorna o usuário autenticado atual.
 */
router.get("/me", async (req, res) => {
  const { userId } = req as any;
  if (!userId) {
    return res.status(401).json({ message: "Não autenticado." });
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: userId },
    include: {
      transacoes: false,
      tarefas: false,
    },
  });

  if (!usuario) {
    return res.status(404).json({ message: "Usuário não encontrado." });
  }

  res.json({
    id: usuario.id,
    nome: usuario.nome,
    telefone: usuario.telefone,
    idioma: usuario.idioma,
    plano: usuario.plano,
    trialExpiraEm: usuario.trialExpiraEm,
    premiumExpiraEm: usuario.premiumExpiraEm,
    criadoEm: usuario.criadoEm,
  });
});

export default router;
