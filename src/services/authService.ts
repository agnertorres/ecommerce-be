import { prisma } from '@/config/prisma';
import bcrypt from 'bcrypt';

export class AuthService {
  async getUser(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        addresses: {
          orderBy: { isDefault: 'desc' }
        },
        paymentMethods: true,
      },
    });

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new Error("Credenciais inválidas.");
    }

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}