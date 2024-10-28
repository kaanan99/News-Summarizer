/*
  Warnings:

  - You are about to drop the column `last_touched` on the `GeneartedHeadline` table. All the data in the column will be lost.
  - You are about to drop the column `last_touched` on the `RawHeadline` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[topic_key]` on the table `Topic` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date_added` to the `GeneartedHeadline` table without a default value. This is not possible if the table is not empty.
  - Added the required column `group` to the `GeneartedHeadline` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_added` to the `RawHeadline` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tid` to the `RawHeadline` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topic_key` to the `Topic` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "RawHeadline_last_touched_group_idx";

-- AlterTable
ALTER TABLE "GeneartedHeadline" DROP COLUMN "last_touched",
ADD COLUMN     "date_added" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "group" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RawHeadline" DROP COLUMN "last_touched",
ADD COLUMN     "date_added" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tid" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "topic_key" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserAccount" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "GeneartedHeadline_date_added_idx" ON "GeneartedHeadline"("date_added");

-- CreateIndex
CREATE INDEX "GeneartedHeadline_date_added_tid_idx" ON "GeneartedHeadline"("date_added", "tid");

-- CreateIndex
CREATE INDEX "GeneartedHeadline_date_added_tid_group_idx" ON "GeneartedHeadline"("date_added", "tid", "group");

-- CreateIndex
CREATE INDEX "RawHeadline_date_added_idx" ON "RawHeadline"("date_added");

-- CreateIndex
CREATE INDEX "RawHeadline_date_added_tid_idx" ON "RawHeadline"("date_added", "tid");

-- CreateIndex
CREATE INDEX "RawHeadline_date_added_tid_group_idx" ON "RawHeadline"("date_added", "tid", "group");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_topic_key_key" ON "Topic"("topic_key");

-- CreateIndex
CREATE INDEX "UserAccount_is_active_idx" ON "UserAccount"("is_active");

-- AddForeignKey
ALTER TABLE "RawHeadline" ADD CONSTRAINT "RawHeadline_tid_fkey" FOREIGN KEY ("tid") REFERENCES "Topic"("tid") ON DELETE RESTRICT ON UPDATE CASCADE;
