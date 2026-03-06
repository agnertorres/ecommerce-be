/*
  Warnings:

  - Added the required column `expirationMonth` to the `PaymentMethod` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expirationYear` to the `PaymentMethod` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaymentMethod" ADD COLUMN     "expirationMonth" VARCHAR NOT NULL,
ADD COLUMN     "expirationYear" VARCHAR NOT NULL;
