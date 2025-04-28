import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Ensure prisma is correctly imported

export async function POST(request) {
    try {
        const { name, email, password } = await request.json();
        console.log(name, email, password);

        // Check if prisma is available
        if (!prisma) {
            return NextResponse.json({ success: false, message: 'Prisma client is not available' });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ success: false, message: 'User already exists' });
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);

        return NextResponse.json({ success: false, message: 'Error creating user' }, { status: 500 });
    }
}
