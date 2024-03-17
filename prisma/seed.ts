import { PrismaClient } from '@prisma/client';

import { RESIDNET_JOHN_DOE } from './data';

const prisma = new PrismaClient();

async function main() {
  await prisma.resident.createMany({ data: [RESIDNET_JOHN_DOE] });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
