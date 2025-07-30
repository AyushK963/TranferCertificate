import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { tcId: string } }) {
  const { tcId } = params;

  try {
    const data = await req.json();

    const updatedTC = await prisma.transferCertificate.update({
      where: { tcId },
      data: {
        studentName: data.studentName,
        studentNameHi: data.studentNameHi,
        fatherName: data.fatherName,
        fatherNameHi: data.fatherNameHi,
        motherName: data.motherName,
        motherNameHi: data.motherNameHi,
        religion: data.religion,
        caste: data.caste,
        rollNumber: data.rollNumber,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        address:data.address,
        panNumber:data.panNumber,
        nationality:data.nationality,


        dateOfAdmission:data.dateOfAdmission,
        dateOfLeaving:data.dateOfLeaving,
        reasonForLeaving:data.reasonForLeaving,
        lastClassAttended:data.lastClassAttended,

        schoolLeavingFrom:data.schoolLeavingFrom,
        schoolLeavingTo:data.schoolLeavingTo,


        // Refresh admission history
        admissionHistory: {
          deleteMany: {},
          create: data.admissionHistory.map((entry: any) => ({
            className: entry.className,
            admissionDate: entry.admissionDate,
            promotionDate: entry.promotionDate,
            session: entry.session,
            conduct:entry.conduct,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, updatedTC });
  } catch (error) {
    console.error("Error updating Transfer Certificate:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update Transfer Certificate." },
      { status: 500 }
    );
  }
}
