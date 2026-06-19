import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

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
    const universities = await prisma.university.findMany({
      where: countryFilter as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      select: { id: true, name: true, short: true, country: true } as any,
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(universities);
  } catch (error) {
    console.error('Error fetching universities:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

