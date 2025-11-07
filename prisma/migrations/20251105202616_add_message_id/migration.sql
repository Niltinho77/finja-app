/*
  Warnings:

  - A unique constraint covering the columns `[messageId]` on the table `InteracaoIA` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "InteracaoIA" ADD COLUMN "messageId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "InteracaoIA_messageId_key" ON "InteracaoIA"("messageId");
