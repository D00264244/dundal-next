import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // Import Prisma from your PostgreSQL setup

export async function GET(req, { params }) {
    try {
        const { courseId } = params;
        if (!courseId) {
            return NextResponse.json(
                { success: false, message: "Course ID is required" },
                { status: 400 }
            );
        }

        // Fetch course details
        const course = await prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!course) {
            return NextResponse.json(
                { success: false, message: "Course not found" },
                { status: 404 }
            );
        }

        // Fetch lessons for this course
        const lessons = await prisma.lesson.findMany({
            where: { courseId },
        });

        return NextResponse.json(
            { success: true, course, lessons },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching course and lessons:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
