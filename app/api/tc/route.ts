// app/api/tc/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const allTCs = await prisma.transferCertificate.findMany({
      include: {
        admissionHistory: true,
      },
    });

    return NextResponse.json(allTCs, { status: 200 });
  } catch (error) {
    console.error("Error fetching TCs:", error);
    return NextResponse.json({ error: "Failed to fetch records" }, { status: 500 });
  }
}
