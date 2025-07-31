import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const saved = await prisma.transferCertificate.create({
      data: {
        tcId: data.tcId,
        studentName: data.studentName,
        studentNameHi:data.studentNameHi,
        fatherName: data.fatherName,    
        fatherNameHi: data.fatherNameHi,    
        motherName: data.motherName,
        motherNameHi: data.motherNameHi,
        religion: data.religion,
        caste: data.caste,
        rollNumber: data.rollNumber,
        dateOfBirth: data.dateOfBirth,
        gender:data.gender,
        address:data.address,
        panNumber:data.panNumber,
        nationality:data.nationality,
        addharCard:data.addharCard,


        dateOfAdmission: data.dateOfAdmission, 
        dateOfLeaving: data.dateOfLeaving,
        reasonForLeaving: data.reasonForLeaving,
        lastClassAttended: data. lastClassAttended,

        schoolLeavingFrom: data.schoolLeavingFrom,
        schoolLeavingTo: data.schoolLeavingTo,
        issueDate:data.issueDate,


        admissionHistory: {
          create: data.admissionHistory.map((entry: any) => ({
            className: entry.className,
            admissionDate: entry.admissionDate,
            promotionDate: entry.promotionDate,
            session: entry.session,
            conduct: entry.conduct,
          }))
        },
      }
    });

    return NextResponse.json({ success: true, saved });
  } catch (error) {
    console.error("Error saving TC:", error);
    return NextResponse.json({ success: false, error: String(error) });
  }
}
