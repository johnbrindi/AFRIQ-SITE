import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const dynamic = 'force-dynamic';

const fixUrl = (url: string | undefined) => {
  if (!url) return undefined;
  return url
    .replace(/aws-0-eu-west-1\.pooler\.supabase\.com:\d+/g, 'db.zizfujfcndjharysytmx.supabase.co:5432')
    .replace('?pgbouncer=true', '');
};

const urlToUse = fixUrl(process.env.DATABASE_URL) || process.env.DATABASE_URL;

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: urlToUse,
    },
  },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
