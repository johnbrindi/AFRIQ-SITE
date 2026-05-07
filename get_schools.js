const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const schools = await prisma.school.findMany({
    select: { id: true, n: true, acr: true, schoolRequirements: true }
  });
  console.log(JSON.stringify(schools, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
