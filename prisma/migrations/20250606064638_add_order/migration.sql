/*
  Warnings:

  - A unique constraint covering the columns `[customId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "customId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_customId_key" ON "Order"("customId");
