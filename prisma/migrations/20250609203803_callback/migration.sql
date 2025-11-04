/*
  Warnings:

  - You are about to drop the `ProductInteraction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductInteraction" DROP CONSTRAINT "ProductInteraction_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductInteraction" DROP CONSTRAINT "ProductInteraction_userId_fkey";

-- DropTable
DROP TABLE "ProductInteraction";
