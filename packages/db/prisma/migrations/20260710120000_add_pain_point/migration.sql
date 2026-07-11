-- CreateTable
CREATE TABLE "pain_point" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pain_point_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pain_point_userId_createdAt_idx" ON "pain_point"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "pain_point" ADD CONSTRAINT "pain_point_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
