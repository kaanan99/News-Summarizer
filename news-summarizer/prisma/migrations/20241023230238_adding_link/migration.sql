/*
  Warnings:

  - Added the required column `headline_url` to the `RawHeadline` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RawHeadline" ADD COLUMN     "headline_url" TEXT NOT NULL;
