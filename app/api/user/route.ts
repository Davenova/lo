import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const userData = await req.json();

    if (!userData || !userData.id) {
      return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
    }

    let user = await prisma.user.findUnique({
      where: { telegramId: userData.id },
      select: {
        telegramId: true,
        username: true,
        firstName: true,
        lastName: true,
        points: true,
        claimedButton1: true,
        claimedButton2: true,
        invitedUsers: true,
        invitedBy: true
      }
    });

    const inviterId = userData.start_param ? parseInt(userData.start_param) : null;

    if (!user) {
      if (inviterId) {
        const inviterInfo = await prisma.user.findUnique({
          where: { telegramId: inviterId },
          select: { username: true, firstName: true, lastName: true }
        });

        if (inviterInfo) {
          user = await prisma.user.create({
            data: {
              telegramId: userData.id,
              username: userData.username || '',
              firstName: userData.first_name || '',
              lastName: userData.last_name || '',
              invitedBy: `@${inviterInfo.username || inviterId}`
            }
          });

          await prisma.user.update({
            where: { telegramId: inviterId },
            data: {
              invitedUsers: {
                push: `@${userData.username || userData.id}`
              }
            }
          });
        } else {
          user = await prisma.user.create({
            data: {
              telegramId: userData.id,
              username: userData.username || '',
              firstName: userData.first_name || '',
              lastName: userData.last_name || ''
            }
          });
        }
      } else {
        user = await prisma.user.create({
          data: {
            telegramId: userData.id,
            username: userData.username || '',
            firstName: userData.first_name || '',
            lastName: userData.last_name || ''
          }
        });
      }
    }

    let inviterInfo = null;
    if (inviterId) {
      inviterInfo = await prisma.user.findUnique({
        where: { telegramId: inviterId },
        select: { username: true, firstName: true, lastName: true }
      });
    }

    return NextResponse.json({ user, inviterInfo });
  } catch (error) {
    console.error('Error processing user data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
