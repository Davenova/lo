import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { telegramId, action } = await req.json();

    if (!telegramId) {
      return NextResponse.json({ error: 'Invalid telegramId' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { telegramId } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (action === 'start') {
      await prisma.user.update({
        where: { telegramId },
        data: { farmStartTime: new Date(), farmAmount: 0 }
      });
      return NextResponse.json({ success: true, message: 'Farming started' });
    } else if (action === 'collect') {
      const farmStartTime = user.farmStartTime;
      if (!farmStartTime) {
        return NextResponse.json({ error: 'Farming not started' }, { status: 400 });
      }

      const now = new Date();
      const farmingDuration = Math.min((now.getTime() - farmStartTime.getTime()) / (1000 * 60), 12 * 60); // in minutes, capped at 12 hours
      const farmingAmount = Math.floor(farmingDuration); // 1 PD per minute

      await prisma.user.update({
        where: { telegramId },
        data: {
          points: { increment: farmingAmount },
          farmStartTime: null,
          farmAmount: 0
        }
      });

      return NextResponse.json({ success: true, farmedAmount: farmingAmount });
    } else if (action === 'update') {
      const farmStartTime = user.farmStartTime;
      if (!farmStartTime) {
        return NextResponse.json({ error: 'Farming not started' }, { status: 400 });
      }

      const now = new Date();
      const farmingDuration = Math.min((now.getTime() - farmStartTime.getTime()) / (1000 * 60), 12 * 60); // in minutes, capped at 12 hours
      const farmingAmount = Math.floor(farmingDuration); // 1 PD per minute

      await prisma.user.update({
        where: { telegramId },
        data: {
          farmAmount: farmingAmount
        }
      });

      return NextResponse.json({ success: true, farmedAmount: farmingAmount });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error in farm route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
