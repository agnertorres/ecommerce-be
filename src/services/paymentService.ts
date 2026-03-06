import { prisma } from '@/config/prisma';

export interface PaymentMethod {
	lastFourDigits: string;
	brand: string;
	token: string;
	expirationMonth: string;
  expirationYear: string;
}

export class PaymentService {
  async createPaymentMethod(userId: string, paymentMethod: PaymentMethod) {
    return await prisma.paymentMethod.create({
      data: {
        ...paymentMethod,
        userId,
      },
    });
  }

  async deletePaymentMethod(userId: string, paymentId: string) {
    return await prisma.$transaction(async (tx) => {
      await tx.paymentMethod.delete({
        where: { id: paymentId },
      });

      return await tx.user.findUnique({
        where: { id: userId },
        include: {
          addresses: { orderBy: { isDefault: 'desc' } },
          paymentMethods: true,
        },
      });
    });
  }
}