import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, context: { params: { tcId: string }}) {
  const { tcId } = context.params;

  try {
    const tc = await prisma.transferCertificate.findUnique({
      where: { tcId },
      include: {
        admissionHistory: true,
      },
    });

    if (!tc) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }

    return NextResponse.json(tc);
  } catch (error) {
    console.error("Error fetching TC:", error);
    return NextResponse.json({ message: "Error fetching TC" }, { status: 500 });
  }
}
