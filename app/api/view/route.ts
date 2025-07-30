// app/api/tc/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const tc = await prisma.transferCertificate.findUnique({ where: { tcId:id } ,  include: { admissionHistory: true }});
  return NextResponse.json(tc);
}
