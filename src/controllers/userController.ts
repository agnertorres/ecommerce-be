import type { Request, Response } from 'express';
import { UserService } from '../services/userService';

const userService = new UserService();

export class UserController {
  async list(req: Request, res: Response) {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  }

  async findUserById(req: Request, res: Response) {
    const user = await userService.getById(req.params.id);
    res.status(200).json(user);
  }

  async create(req: Request, res: Response) {
    try {
      const data = await userService.createUser(req.body);
      res.status(201).json(data);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async changePassword(req: Request, res: Response) {
    const { id } = req.params;
    const authenticatedUserId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (id !== authenticatedUserId) {
      return res.status(403).json({ message: 'Sem permissão para alterar este perfil.' });
    }

    try {
      const user = await userService.updatePassword(id, currentPassword, newPassword);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: 'Não foi possível trocar a senha' });
    }
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const authenticatedUserId = req.userId;

    if (id !== authenticatedUserId) {
      return res.status(403).json({ message: 'Sem permissão para alterar este perfil.' });
    }

    try {
      const user = await userService.updateUser(id, req.body);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: 'Não foi possível alterar dados' });
    }
  }
}