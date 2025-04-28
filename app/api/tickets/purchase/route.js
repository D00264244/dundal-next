import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getToken } from "next-auth/jwt";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = token.id;

    const body = await request.json();
    const { ticketId, quantity } = body;

    if (!ticketId || !quantity || quantity < 1) {
      return NextResponse.json(
        { success: false, message: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Get the ticket and check available spaces
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        purchases: true
      }
    });

    if (!ticket) {
      return NextResponse.json(
        { success: false, message: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Calculate remaining spaces
    const purchasedQuantity = ticket.purchases.reduce(
      (sum, purchase) => sum + purchase.quantity,
      0
    );
    const remainingSpaces = ticket.spaces - purchasedQuantity;

    if (quantity > remainingSpaces) {
      return NextResponse.json(
        { success: false, message: 'Not enough spaces available' },
        { status: 400 }
      );
    }

    // Create the purchase
    const purchase = await prisma.ticketPurchase.create({
      data: {
        ticketId,
        userId,
        quantity
      }
    });

    return NextResponse.json({ success: true, purchase }, { status: 201 });

  } catch (error) {
    console.error('Error purchasing ticket:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
