import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tcId = searchParams.get("id");

  if (!tcId) return NextResponse.json({ error: "ID is required" }, { status: 400 });

  try {
    await prisma.transferCertificate.delete({
      where: { tcId },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
