import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { telegramId } = await req.json();

        if (!telegramId) {
            return NextResponse.json({ error: 'Invalid telegramId' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { telegramId }
        });

        if (!user || !user.farmStartTime) {
            return NextResponse.json({ error: 'User not farming' }, { status: 400 });
        }

        const farmingDuration = Math.min(60, Math.floor((new Date().getTime() - user.farmStartTime.getTime()) / 1000));
        const farmedAmount = Math.floor(farmingDuration / 2) * 0.5;

        const updatedUser = await prisma.user.update({
            where: { telegramId },
            data: { 
                points: { increment: farmedAmount },
                farmStartTime: null,
                farmAmount: { increment: farmedAmount }
            }
        });

        return NextResponse.json({ 
            success: true, 
            points: updatedUser.points,
            farmedAmount 
        });
    } catch (error) {
        console.error('Error stopping farming:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
