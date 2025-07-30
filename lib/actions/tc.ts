import { prisma } from "../prisma";

async function getTCById(id: string) {
  return await prisma.transferCertificate.findUnique({
    where: { tcId: id },
  });
}
