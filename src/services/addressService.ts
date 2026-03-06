import { prisma } from '@/config/prisma';

interface Address {
  city: string;
  complement?: string;
  isDefault: boolean;
  number: string;
  state: string;
  street: string;
  zipcode: string;
}

export class AddressService {
  async createAddress(userId: string, data: Address) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        addresses: {
          // Primeiro: Se o novo for default, desmarcamos os outros
          ...(data.isDefault && {
            updateMany: {
              where: { isDefault: true },
              data: { isDefault: false },
            },
          }),
          // Segundo: Criamos o novo
          create: data,
        },
      },
      include: {
        addresses: {
          orderBy: { isDefault: 'desc' }
        },
        paymentMethods: true,
      },
    });
  }

  async updateAddress(userId: string, addressId: string, data: Address) {
    const addressUpdateAction: any = {
      update: {
        where: { id: addressId },
        data: data
      }
    };

    // Se o usuário marcou este endereço como padrão agora:
    if (data.isDefault) {
      addressUpdateAction.updateMany = {
        // Desmarca qualquer outro que seja padrão, exceto o que estamos editando
        where: { 
          isDefault: true,
          id: { not: addressId } 
        },
        data: { isDefault: false }
      };
    }

    return await prisma.user.update({
      where: { id: userId },
      data: {
        addresses: addressUpdateAction
      },
      include: {
        addresses: {
          orderBy: { isDefault: 'desc' }
        },
        paymentMethods: true,
      }
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    return await prisma.$transaction(async (tx) => {
      const addressToDelete = await tx.address.findUnique({
        where: { id: addressId },
        select: { isDefault: true }
      });

      await tx.address.delete({
        where: { id: addressId }
      });

      if (addressToDelete?.isDefault) {
        const remainingAddress = await tx.address.findFirst({
          where: { userId: userId },
          orderBy: { id: 'desc' }
        });

        if (remainingAddress) {
          await tx.address.update({
            where: { id: remainingAddress.id },
            data: { isDefault: true }
          });
        }
      }

      return await tx.user.findUnique({
        where: { id: userId },
        include: {
          addresses: {
            orderBy: { isDefault: 'desc' }
          },
          paymentMethods: true,
        }
      });
    });
  }

  async getAddressesByUserId(id: string) {
    return await prisma.address.findMany({
      where: { userId: id },
      orderBy: { isDefault: 'desc' }
    });
  }
}