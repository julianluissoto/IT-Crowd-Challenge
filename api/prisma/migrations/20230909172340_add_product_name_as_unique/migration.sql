/*
  Warnings:

  - You are about to drop the column `brandName` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "brandName";

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");
