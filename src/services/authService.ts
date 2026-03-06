import { prisma } from '@/config/prisma';

export class AuthService {
  async getUser(data: { email: string; password: string }) {

    return await prisma.user.findUnique({
      where: {
        email: data.email,
      },
      include: {
        addresses: {
          orderBy: { isDefault: 'desc' }
        },
        paymentMethods: true,
      },
    });
  }
}