/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `PatientProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PatientProfile_email_key" ON "PatientProfile"("email");
