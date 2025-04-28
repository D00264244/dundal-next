import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log('PostgreSQL Connected');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};

export { prisma, connectDB };
