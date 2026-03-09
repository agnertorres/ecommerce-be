import type { Request, Response } from 'express';
import { AuthService } from '../services/authService';

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const data = await authService.getUser(req.body);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getToken(req: Request, res: Response) {
    try {
      const token = await authService.generateJwtToken(req.body);
      res.status(200).json(token);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}