/*
  Warnings:

  - Added the required column `tcIssued` to the `TransferCertificate` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TransferCertificate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tcId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "fatherName" TEXT NOT NULL,
    "motherName" TEXT NOT NULL,
    "religion" TEXT NOT NULL,
    "caste" TEXT NOT NULL,
    "rollNumber" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "dateOfAdmission" TEXT NOT NULL,
    "dateOfLeaving" TEXT NOT NULL,
    "reasonforleaving" TEXT NOT NULL,
    "lastClassAttended" TEXT NOT NULL,
    "tcIssued" BOOLEAN NOT NULL,
    "schoolLeavingFrom" TEXT NOT NULL,
    "schoolLeavingTo" TEXT NOT NULL,
    "conduct" TEXT NOT NULL,
    "character" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "issueDate" TEXT NOT NULL
);
INSERT INTO "new_TransferCertificate" ("caste", "character", "class", "conduct", "dateOfAdmission", "dateOfBirth", "dateOfLeaving", "fatherName", "gender", "id", "issueDate", "lastClassAttended", "motherName", "reasonforleaving", "religion", "remarks", "rollNumber", "schoolLeavingFrom", "schoolLeavingTo", "section", "studentName", "tcId") SELECT "caste", "character", "class", "conduct", "dateOfAdmission", "dateOfBirth", "dateOfLeaving", "fatherName", "gender", "id", "issueDate", "lastClassAttended", "motherName", "reasonforleaving", "religion", "remarks", "rollNumber", "schoolLeavingFrom", "schoolLeavingTo", "section", "studentName", "tcId" FROM "TransferCertificate";
DROP TABLE "TransferCertificate";
ALTER TABLE "new_TransferCertificate" RENAME TO "TransferCertificate";
CREATE UNIQUE INDEX "TransferCertificate_tcId_key" ON "TransferCertificate"("tcId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
