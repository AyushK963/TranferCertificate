/*
  Warnings:

  - You are about to drop the column `rollNo` on the `AdmissionHistory` table. All the data in the column will be lost.
  - Added the required column `rollNumber` to the `AdmissionHistory` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AdmissionHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "className" TEXT NOT NULL,
    "rollNumber" TEXT NOT NULL,
    "session" TEXT NOT NULL,
    "conduct" TEXT NOT NULL,
    "tcId" TEXT NOT NULL,
    CONSTRAINT "AdmissionHistory_tcId_fkey" FOREIGN KEY ("tcId") REFERENCES "TransferCertificate" ("tcId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AdmissionHistory" ("className", "conduct", "id", "session", "tcId") SELECT "className", "conduct", "id", "session", "tcId" FROM "AdmissionHistory";
DROP TABLE "AdmissionHistory";
ALTER TABLE "new_AdmissionHistory" RENAME TO "AdmissionHistory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
