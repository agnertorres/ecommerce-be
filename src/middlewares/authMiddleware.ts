import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  email: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Não autorizado" });
  }

  const parts = authHeader.split(' ');

  const scheme = parts[0];
  const token = parts[1];

  if (!scheme || !token || !/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: "Token malformatado" });
  }

  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
     return res.status(500).json({ message: "Erro de configuração no servidor" });
  }

  try {
    const decoded = jwt.verify(token, secret) as unknown as TokenPayload;

    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
};