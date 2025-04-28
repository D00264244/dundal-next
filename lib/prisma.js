import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

// Only create a new Prisma client if one doesn't already exist
if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient()
}

export const prisma = globalForPrisma.prisma

// In development mode, store the Prisma client globally to avoid creating multiple instances
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}
