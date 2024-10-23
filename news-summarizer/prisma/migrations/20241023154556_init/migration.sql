-- CreateTable
CREATE TABLE "User" (
    "uid" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "GeneartedHeadline" (
    "gid" SERIAL NOT NULL,
    "headline_text" TEXT NOT NULL,
    "sentiment" DOUBLE PRECISION NOT NULL,
    "last_touched" TIMESTAMP(3) NOT NULL,
    "tid" INTEGER NOT NULL,

    CONSTRAINT "GeneartedHeadline_pkey" PRIMARY KEY ("gid")
);

-- CreateTable
CREATE TABLE "RawHeadline" (
    "rid" SERIAL NOT NULL,
    "headline_text" TEXT NOT NULL,
    "last_touched" TIMESTAMP(3) NOT NULL,
    "group" INTEGER NOT NULL,

    CONSTRAINT "RawHeadline_pkey" PRIMARY KEY ("rid")
);

-- CreateTable
CREATE TABLE "Topic" (
    "tid" SERIAL NOT NULL,
    "topic_type" TEXT NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("tid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "RawHeadline_last_touched_group_idx" ON "RawHeadline"("last_touched", "group");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_topic_type_key" ON "Topic"("topic_type");

-- AddForeignKey
ALTER TABLE "GeneartedHeadline" ADD CONSTRAINT "GeneartedHeadline_tid_fkey" FOREIGN KEY ("tid") REFERENCES "Topic"("tid") ON DELETE RESTRICT ON UPDATE CASCADE;
