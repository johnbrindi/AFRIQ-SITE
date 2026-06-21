import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { unstable_cache } from 'next/cache';

export const dynamic = 'force-dynamic';

const getCachedUnis = unstable_cache(
  async (countryFilter: any) => {
    return await prisma.university.findMany({
      where: countryFilter,
      select: { id: true, name: true, short: true, country: true },
      orderBy: { id: 'asc' },
    });
  },
  ['api-universities-dest'],
  { revalidate: 3600, tags: ['universities'] }
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const destination = searchParams.get('destination'); // "CAMEROON" | "ABROAD"

  let countryFilter = {};
  if (destination === 'CAMEROON') {
    countryFilter = { country: 'Cameroon' };
  } else if (destination === 'ABROAD') {
    countryFilter = { country: { not: 'Cameroon' } };
  }

  try {
    const universities = await getCachedUnis(countryFilter);
    return NextResponse.json(universities);
  } catch (error) {
    console.error('Error fetching universities:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

