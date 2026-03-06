import { prisma } from '@/config/prisma';

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
    // Aqui você poderia validar se o CPF é válido antes de salvar
    return await prisma.user.create({
      data,
      include: {
        addresses: {
          orderBy: { isDefault: 'desc' }
        },
        paymentMethods: true,
      }
    });
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