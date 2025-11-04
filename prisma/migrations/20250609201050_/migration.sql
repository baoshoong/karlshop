/*
  Warnings:

  - The `comments` column on the `ProductInteraction` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ProductInteraction" DROP COLUMN "comments",
ADD COLUMN     "comments" JSONB NOT NULL DEFAULT '[]';
