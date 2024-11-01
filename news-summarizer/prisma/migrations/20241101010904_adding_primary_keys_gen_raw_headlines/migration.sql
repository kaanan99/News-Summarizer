/*
  Warnings:

  - A unique constraint covering the columns `[headline_text,date_added]` on the table `GeneartedHeadline` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[headline_text,headline_url]` on the table `RawHeadline` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GeneartedHeadline_headline_text_date_added_key" ON "GeneartedHeadline"("headline_text", "date_added");

-- CreateIndex
CREATE UNIQUE INDEX "RawHeadline_headline_text_headline_url_key" ON "RawHeadline"("headline_text", "headline_url");

-- AddForeignKey
ALTER TABLE "GeneartedHeadline" ADD CONSTRAINT "GeneartedHeadline_tid_fkey" FOREIGN KEY ("tid") REFERENCES "Topic"("tid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawHeadline" ADD CONSTRAINT "RawHeadline_tid_fkey" FOREIGN KEY ("tid") REFERENCES "Topic"("tid") ON DELETE RESTRICT ON UPDATE CASCADE;
