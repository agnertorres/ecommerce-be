import { prisma } from '@/config/prisma';
import { Prisma } from "../../generated/prisma/client";

interface User {
  name: string;
  email: string;
  nickname: string;
  cpf: string; 
  phone: string;
  password: string;
}

export class UserService {
  async getAllUsers() {
    return await prisma.user.findMany({
      include: {
        addresses: {
          orderBy: { isDefault: 'desc' }
        },
        paymentMethods: true,
      },
    });
  }

  async getById(id: string) {
    return await prisma.user.findUnique({ 
      where: { id },
      include: {
        addresses: {
          orderBy: { isDefault: 'desc' }
        },
        paymentMethods: true,
      }
    });
  }

  async createUser(data: User) {
    try {
      return await prisma.user.create({
        data,
        include: {
          addresses: {
            orderBy: { isDefault: 'desc' }
          },
          paymentMethods: true,
        }
      });
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
      throw new Error("Erro ao criar usuário. Tente novamente mais tarde.");
    }
  }

  async updatePassword(id: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    const isMatch = currentPassword === user?.password;

    if (!isMatch) {
      throw new Error("A senha atual está incorreta.");
    }

    return await prisma.user.update({
      where: { id },
      data: {
        password: newPassword,
      },
      include: {
        addresses: {
          orderBy: { isDefault: 'desc' }
        },
        paymentMethods: true,
      }
    });
  }

  async updateUser(id: string, userData: User) {
    return await prisma.user.update({
      where: { id },
      data: {
        ...userData,
      },
      include: {
        addresses: {
          orderBy: { isDefault: 'desc' }
        },
        paymentMethods: true,
      }
    });
  }
}