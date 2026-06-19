import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const leadSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    background: z.enum(['Science', 'Arts'], { required_error: 'Academic background is required' }),
    previousSchool: z.string().min(2, 'Previous school is required'),
    phoneNumber: z
        .string()
        .regex(/^\+?[0-9\s\-().]{7,20}$/, 'Please enter a valid phone number'),
    studyDestination: z.enum(['CAMEROON', 'ABROAD'], { required_error: 'Study destination is required' }),
    aspiringUniversity: z.string().min(1, 'Please select a university'),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validated = leadSchema.parse(body);

        const lead = await prisma.studentLead.create({
            data: validated,
        });

        return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
        }
        console.error('Error creating student lead:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const leads = await prisma.studentLead.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(leads);
    } catch (error) {
        console.error('Error fetching leads:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
