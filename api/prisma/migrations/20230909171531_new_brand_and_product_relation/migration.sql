/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `brandName` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "brandName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");
