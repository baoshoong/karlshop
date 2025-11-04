/*
  Warnings:

  - You are about to drop the column `customId` on the `Order` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Order_customId_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "customId";
