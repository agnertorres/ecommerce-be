/*
  Warnings:

  - You are about to drop the column `isDefault` on the `PaymentMethod` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `PaymentMethod` table. All the data in the column will be lost.
  - Added the required column `brand` to the `PaymentMethod` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaymentMethod" DROP COLUMN "isDefault",
DROP COLUMN "type",
ADD COLUMN     "brand" VARCHAR NOT NULL;
