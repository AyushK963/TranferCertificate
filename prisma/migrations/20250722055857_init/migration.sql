-- CreateTable
CREATE TABLE "TransferCertificate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tcId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "fatherName" TEXT NOT NULL,
    "motherName" TEXT NOT NULL,
    "religion" TEXT NOT NULL,
    "caste" TEXT NOT NULL,
    "rollNumber" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "dateOfAdmission" TEXT NOT NULL,
    "dateOfLeaving" TEXT NOT NULL,
    "reasonForLeaving" TEXT NOT NULL,
    "lastClassAttended" TEXT NOT NULL,
    "schoolLeavingFrom" TEXT NOT NULL,
    "schoolLeavingTo" TEXT NOT NULL,
    "conduct" TEXT NOT NULL,
    "character" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "issueDate" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AdmissionHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "className" TEXT NOT NULL,
    "rollNo" TEXT NOT NULL,
    "session" TEXT NOT NULL,
    "conduct" TEXT NOT NULL,
    "tcId" TEXT NOT NULL,
    CONSTRAINT "AdmissionHistory_tcId_fkey" FOREIGN KEY ("tcId") REFERENCES "TransferCertificate" ("tcId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "TransferCertificate_tcId_key" ON "TransferCertificate"("tcId");
