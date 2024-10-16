import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { telegramId, pointsToAdd, buttonId } = await req.json();

        if (!telegramId) {
            return NextResponse.json({ error: 'Invalid telegramId' }, { status: 400 });
        }

        // Define claimed field based on buttonId
        const claimedField = buttonId === 'button1' ? 'claimedButton1' : 'claimedButton2';

        const updatedUser = await prisma.user.update({
            where: { telegramId },
            data: { 
                points: { increment: pointsToAdd }, // Increment points by pointsToAdd
                [claimedField]: true // Update claimed status based on buttonId
            }
        });

        return NextResponse.json({ success: true, points: updatedUser.points });
    } catch (error) {
        console.error('Error increasing points:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
