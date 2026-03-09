import { Prisma } from "../../generated/prisma/client";

export const userSafeSelect = {
  id: true,
  name: true,
  email: true,
  cpf: true,
  nickname: true,
  phone: true,
  imageUrl: true,
  addresses: {
    orderBy: { isDefault: 'desc' },
  },
  paymentMethods: true,
} as const satisfies Prisma.UserSelect;

export type UserSafeResponse = Prisma.UserGetPayload<{ select: typeof userSafeSelect }>;