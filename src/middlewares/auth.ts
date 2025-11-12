// src/middlewares/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token ausente" });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    // anexa o userId ao req para usar nas rotas
    (req as any).userId = decoded.userId;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}
