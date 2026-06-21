import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    console.log("DATABASE_URL =", process.env.DATABASE_URL);
    console.log("DIRECT_URL =", process.env.DIRECT_URL);

    try {
        const count = await prisma.university.count();
        return NextResponse.json({ success: true, count, directUrlUsed: process.env.DIRECT_URL, dbUrlUsed: process.env.DATABASE_URL });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message, directUrlUsed: process.env.DIRECT_URL, dbUrlUsed: process.env.DATABASE_URL }, { status: 500 });
    }
}
