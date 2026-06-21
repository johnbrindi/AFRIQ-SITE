import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Force Prisma to use DIRECT_URL during seeding exactly like `npx prisma db push` does
const fixUrl = (url: string | undefined) => {
  if (!url) return undefined;
  return url
    .replace(/aws-0-eu-west-1\.pooler\.supabase\.com:\d+/g, 'db.zizfujfcndjharysytmx.supabase.co:5432')
    .replace('?pgbouncer=true', '');
};

const urlToUse = fixUrl(process.env.DIRECT_URL) || fixUrl(process.env.DATABASE_URL);

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: urlToUse,
    },
  },
});

async function main() {
  console.log('Seeding database...');

  // Seed Universities
  const universitiesPath = path.join(process.cwd(), 'data', 'universities.json');
  const universities = JSON.parse(fs.readFileSync(universitiesPath, 'utf8'));

  for (const uni of universities) {
    await prisma.university.upsert({
      where: { id: uni.id },
      update: {
        name: uni.name,
        short: uni.short,
        loc: uni.loc,
        city: uni.city,
        reg: uni.reg,
        tag: uni.tag,
        est: uni.est,
        img: uni.img,
        logo: uni.logo,
        about: uni.about,
        facts: uni.facts,
        missions: uni.missions,
        type: uni.type,
        country: uni.country,
      },
      create: {
        id: uni.id,
        name: uni.name,
        short: uni.short,
        loc: uni.loc,
        city: uni.city,
        reg: uni.reg,
        tag: uni.tag,
        est: uni.est,
        img: uni.img,
        logo: uni.logo,
        about: uni.about,
        facts: uni.facts,
        missions: uni.missions,
        type: uni.type,
        country: uni.country,
      },
    });
  }
  console.log('Universities seeded/updated.');

  // Seed Schools
  const schoolsPath = path.join(process.cwd(), 'data', 'schools.json');
  const schoolsData = JSON.parse(fs.readFileSync(schoolsPath, 'utf8'));

  for (const group of schoolsData) {
    const universityId = group.university_id;

    // Skip if university doesn't exist
    const uniExists = await prisma.university.findUnique({ where: { id: universityId } });
    if (!uniExists) continue;

    for (const school of group.schools) {
      // Match by acr+universityId first (so renamed schools are updated, not duplicated),
      // then fall back to matching by n (for schools without an acr).
      let existing = null;
      if (school.acr) {
        existing = await prisma.school.findFirst({
          where: { universityId, acr: school.acr }
        });
      }
      if (!existing) {
        existing = await prisma.school.findFirst({
          where: { universityId, n: school.n }
        });
      }

      if (existing) {
        await prisma.school.update({
          where: { id: existing.id },
          data: {
            n: school.n,
            acr: school.acr,
            t: school.t,
            i: school.i,
            departments: school.departments,
            formFields: school.formFields,
            schoolRequirements: school.schoolRequirements,
          }
        });
      } else {
        await prisma.school.create({
          data: {
            universityId,
            n: school.n,
            acr: school.acr,
            t: school.t,
            i: school.i,
            departments: school.departments,
            formFields: school.formFields,
            schoolRequirements: school.schoolRequirements,
          }
        });
      }
    }
  }

  console.log('Schools seeded/updated.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
