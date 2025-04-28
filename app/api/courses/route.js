import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST() {
    try {
        // new change + new change
        const courses = [
            {
                courseTitle: "Web Development",
                courseImage: "https://qeaed3epwphs2esg.public.blob.vercel-storage.com/webdev-NhLHElNXAGftFuN9BKUgYY8nF8Mud7.png",
                courseDescription: "Learn HTML, CSS, JavaScript, and modern frameworks."
            },
            {
                courseTitle: "Cloud Computing",
                courseImage: "https://qeaed3epwphs2esg.public.blob.vercel-storage.com/cloud-jfzA7rTiDaeh2olQZy2Ne2Z4S4ldlX.png",
                courseDescription: "Master AWS, Azure, and Google Cloud technologies."
            },
            {
                courseTitle: "MongoDB",
                courseImage: "https://qeaed3epwphs2esg.public.blob.vercel-storage.com/mongodb-OwPCM8Uis3qDCLduIBIQ2Oba7qPhZK.png",
                courseDescription: "Understand NoSQL databases and MongoDB queries."
            },
            {
                courseTitle: "Cybersecurity",
                courseImage: "https://qeaed3epwphs2esg.public.blob.vercel-storage.com/cybersecurity-Osf4BWXHQrC20DXxoJdQ5x4nnU6gIk.png",
                courseDescription: "Learn ethical hacking, penetration testing, and security practices."
            }
        ];

        const insertedCourses = await prisma.course.createMany({
            data: courses,
            skipDuplicates: true,
        });

        const allCourses = await prisma.course.findMany();

        const updatedCourses = await Promise.all(
            allCourses.map(async (course) => {
                return prisma.course.update({
                    where: { id: course.id },
                    data: { linkPage: `/courses/${course.id}` },
                });
            })
        );

        return NextResponse.json({ success: true, courses: updatedCourses });
    } catch (error) {
        console.error("Error inserting courses:", error);
        return NextResponse.json({ success: false, message: error.message });
    }
}

export async function GET() {
    try {
        const courses = await prisma.course.findMany();

        if (courses.length > 0) {
            return NextResponse.json({ success: true, courses });
        }
        return NextResponse.json({ success: false, message: "No courses found" });

    } catch (error) {
        console.error("Error fetching courses:", error);
        return NextResponse.json({ success: false, message: error.message });
    }
}
