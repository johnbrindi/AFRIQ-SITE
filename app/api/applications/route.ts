import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = parseInt(session.user.id);
  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid user session' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { schoolId, personalInfo, requirementsChecked, totalFee } = body;

    if (!schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 });
    }

    // Verify the user actually exists in the database before attempting to create
    const userExists = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!userExists) {
      return NextResponse.json(
        { error: 'Your session is outdated. Please log out and log back in.' },
        { status: 401 }
      );
    }

    // Verify the school exists
    const schoolExists = await prisma.school.findUnique({ where: { id: schoolId }, select: { id: true } });
    if (!schoolExists) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    const application = await prisma.application.create({
      data: {
        userId,
        schoolId,
        personalInfo: personalInfo || {},
        requirementsChecked: requirementsChecked || [],
        totalFee: totalFee || 0,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const applications = await prisma.application.findMany({
      where: {
        userId: parseInt(session.user.id),
      },
      include: {
        school: {
          include: {
            university: true,
          },
        },
      },
    });
    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
