import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { telegramId, pointsToAdd } = await req.json();

        if (!telegramId) {
            return NextResponse.json({ error: 'Invalid telegramId' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { telegramId },
            data: { 
                points: { increment: pointsToAdd },
            }
        });

        return NextResponse.json({ success: true, points: updatedUser.points });
    } catch (error) {
        console.error('Error farming PixelDogs:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
