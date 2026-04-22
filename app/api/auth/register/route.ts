import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

// Regex for basic email validation server-side
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName, phone, academicBackground } = body;

    // --- Input validation ---
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ message: 'Please fill in all required fields.' }, { status: 400 });
    }
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ message: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    // --- Duplicate check ---
    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return NextResponse.json({ message: 'An account with this email already exists.' }, { status: 409 });
    }

    // --- Secure password hash (cost factor 12) ---
    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: (phone || '').trim(),
        academicBackground: (academicBackground || '').trim(),
      },
    });

    return NextResponse.json({ message: 'Account created successfully.' }, { status: 201 });
  } catch (error) {
    console.error('[REGISTER]', error);
    return NextResponse.json({ message: 'An internal error occurred. Please try again.' }, { status: 500 });
  }
}
