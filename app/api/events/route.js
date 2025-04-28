import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all events
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        tickets: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST new event
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.date || !body.startTime || !body.endTime || !body.details || !body.tickets) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate tickets array
    if (!Array.isArray(body.tickets) || body.tickets.length === 0) {
      return NextResponse.json(
        { error: 'At least one ticket type is required' },
        { status: 400 }
      );
    }

    // Validate each ticket
    for (const ticket of body.tickets) {
      if (!ticket.name || typeof ticket.spaces !== 'number' || ticket.spaces < 0) {
        return NextResponse.json(
          { error: 'Invalid ticket data' },
          { status: 400 }
        );
      }
    }

    // Create event with tickets using Prisma
    const newEvent = await prisma.event.create({
      data: {
        name: body.name,
        date: new Date(body.date),
        startTime: body.startTime,
        endTime: body.endTime,
        details: body.details,
        tickets: {
          create: body.tickets.map(ticket => ({
            name: ticket.name,
            spaces: ticket.spaces
          }))
        }
      },
      include: {
        tickets: true
      }
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE event
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Delete the event (tickets will be deleted automatically due to onDelete: Cascade)
    await prisma.event.delete({
      where: {
        id: id
      }
    });

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 