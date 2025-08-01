// app/verify/[tcId]/page.tsx

import { prisma } from "@/lib/prisma";
import { CheckCircle, XCircle } from "lucide-react";
; // Or prisma if you used that

export default async function VerifyPage({ params }: { params: { tcId: string } }) {
  const tc = await prisma.transferCertificate.findUnique({
    where: { tcId: params.tcId },
  });

  if (!tc) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md text-center border border-red-300">
          <XCircle className="text-red-500 w-12 h-12 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-red-600">Invalid or Fake TC</h2>
          <p className="text-sm text-gray-600 mt-2">
            The Transfer Certificate with ID <code>{params.tcId}</code> was not found in our records.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full border border-green-300">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle className="text-green-600 w-12 h-12 mr-2" />
          <h2 className="text-2xl font-bold text-green-700">TC Verified</h2>
        </div>

        <div className="space-y-2 text-gray-700 text-sm">
          <p><strong>Student Name:</strong> {tc.studentName}</p>
          <p><strong>Father's Name:</strong> {tc.fatherName}</p>
          <p><strong>Mother's Name:</strong> {tc.motherName}</p>
          <p><strong>TC ID:</strong> {tc.tcId}</p>
          <p><strong>Date of Issue:</strong> {tc.issueDate}</p>
          <p><strong>School:</strong> Shri Gnadhi Inter College</p>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          This TC was issued digitally and verified from the official school records.
        </div>
      </div>
    </div>
  );
}
