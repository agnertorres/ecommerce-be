import { prisma } from '@/config/prisma';
import { Prisma } from "../../generated/prisma/client";
import bcrypt from 'bcrypt';
import { userSafeSelect } from '@/utils';

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

interface User {
  name: string;
  email: string;
  nickname: string;
  cpf: string; 
  phone: string;
  password: string;
  imageUrl: string;
}

export class UserService {
  async getAllUsers() {
    const user = await prisma.user.findMany({
      select: userSafeSelect,
    });

    return user;
  }

  async getById(id: string) {
    return await prisma.user.findUnique({ 
      where: { id },
      select: userSafeSelect,
    });
  }

  async createUser(data: User) {
    const encryptedPassword = await bcrypt.hash(data.password, 10);

    const newUser = {
      ...data,
      password: encryptedPassword,
    }

    try {
      const user = await prisma.user.create({
        data: newUser,
        select: userSafeSelect,
      });

      if (!JWT_SECRET) {
        throw new Error('Ocorreu um erro inesperado.');
      }

      const token = jwt.sign(
        { id: user.id, email: user.email }, 
        JWT_SECRET, 
        { expiresIn: '7d' },
      );

      return { user, token };
    } catch (err) {
      
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          const target = (err.meta?.target as string[]) || [];
          const message = err.message || "";

          if (target.includes('email') || message.includes('(`email`)')) {
            throw new Error("Este e-mail já está em uso.");
          }
          
          if (target.includes('cpf') || message.includes('(`cpf`)')) {
            throw new Error("Este CPF já está cadastrado.");
          }

          if (target.includes('phone') || message.includes('(`phone`)')) {
            throw new Error("Este telefone já está cadastrado.");
          }
        }
      }
      throw new Error('Erro ao criar usuário. Tente novamente mais tarde.');
    }
  }

  async updatePassword(id: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      throw new Error('Credenciais inválidas.');
    }

    const password = await bcrypt.hash(newPassword, 10);

    return await prisma.user.update({
      where: { id },
      data: {
        password,
      },
      select: userSafeSelect,
    });
  }

  async updateUser(id: string, userData: User) {
    const { name, email, cpf, nickname, phone, imageUrl } = userData;
    
    return await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        cpf,
        nickname,
        phone,
        imageUrl,
      },
      select: userSafeSelect,
    });
  }
}