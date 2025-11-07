import { Router } from 'express';
import prisma from '../db/client.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: '🚀 FinIA API online!' });
});

router.get('/users', async (req, res) => {
  try {
    const users = await prisma.usuario.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
});

export default router;
