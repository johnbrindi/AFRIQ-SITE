import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const university = await prisma.university.findUnique({
      where: { id },
      include: {
        schools: true,
      },
    });

    if (!university) {
      return NextResponse.json({ message: 'University not found' }, { status: 404 });
    }

    return NextResponse.json(university);
  } catch (error) {
    console.error('Error fetching university by ID:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
