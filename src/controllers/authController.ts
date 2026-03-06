import type { Request, Response } from 'express';
import { AuthService } from '../services/authService';

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const user = await authService.getUser(req.body);

      if(user?.password === req.body.password) {
        res.status(200).json(user);
      } else {
        res.status(401).json({ message: "Usuário ou senha inválidos" });
      }

    } catch (error) {
      res.status(400).json({ message: "Não foi possível criar usuário" });
    }
  }
}