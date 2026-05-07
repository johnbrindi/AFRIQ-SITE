const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const schools = await prisma.school.findMany({
    select: { id: true, n: true, acr: true, schoolRequirements: true }
  });
  
  const targets = ['NAHPI', 'NURSING', 'MEDICINE', 'COLLEGE OF TECHNOLOGY', 'COLTECH', 'SRN'];
  const found = schools.filter(s => 
    targets.some(t => s.n.toUpperCase().includes(t) || (s.acr && s.acr.toUpperCase().includes(t)))
  );
  console.log(JSON.stringify(found, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
