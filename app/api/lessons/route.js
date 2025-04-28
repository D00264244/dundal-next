import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST() {
    try {
        const courseId = "30b5b3b7-031d-41bc-a394-6d5422b94617";

        const courseExists = await prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!courseExists) {
            return NextResponse.json(
                { success: false, message: "Course not found" },
                { status: 404 }
            );
        }

        // Hardcoded MongoDB lessons
        const lessons = [
            { lessonTitle: "Introduction to Cloud Computing", lessonContent: "Understanding cloud computing, its benefits, and service models (IaaS, PaaS, SaaS)." },
            { lessonTitle: "Cloud Deployment Models", lessonContent: "Exploring Public, Private, Hybrid, and Multi-cloud environments." },
            { lessonTitle: "Virtualization & Containers", lessonContent: "Understanding VMs, Docker, Kubernetes, and their role in cloud computing." },
            { lessonTitle: "Cloud Service Providers", lessonContent: "Overview of AWS, Azure, Google Cloud, and their core services." },
            { lessonTitle: "Networking in the Cloud", lessonContent: "Configuring cloud networks, VPCs, subnets, security groups, and load balancing." },
            { lessonTitle: "Storage & Databases in the Cloud", lessonContent: "Exploring cloud storage types (block, object, file) and managed databases like AWS RDS, Firestore, and CosmosDB." },
            { lessonTitle: "Cloud Security Best Practices", lessonContent: "Implementing IAM, encryption, firewalls, and compliance measures." },
            { lessonTitle: "Serverless Computing", lessonContent: "Understanding FaaS, AWS Lambda, Azure Functions, and Google Cloud Functions." },
            { lessonTitle: "Cloud DevOps & Automation", lessonContent: "Using CI/CD pipelines, Terraform, Ansible, and cloud automation tools." },
            { lessonTitle: "Cloud Cost Management & Optimization", lessonContent: "Understanding cloud pricing models, budgeting, and cost-saving strategies." },
            { lessonTitle: "Monitoring & Logging in Cloud", lessonContent: "Using tools like CloudWatch, Azure Monitor, and Stackdriver for system health and performance tracking." },
            { lessonTitle: "Disaster Recovery & High Availability", lessonContent: "Implementing backups, failover strategies, and redundancy in the cloud." },
            { lessonTitle: "Hybrid & Multi-Cloud Strategies", lessonContent: "Managing workloads across multiple cloud providers and on-premises." },
            { lessonTitle: "Compliance & Governance in the Cloud", lessonContent: "Understanding GDPR, HIPAA, SOC 2, and regulatory frameworks." },
            { lessonTitle: "Building a Cloud-Native Application", lessonContent: "Developing and deploying a scalable cloud-based application." }
        ];




        const createdLessons = await prisma.$transaction(
            lessons.map(lesson =>
                prisma.lesson.create({
                    data: {
                        courseId,
                        lessonTitle: lesson.lessonTitle,
                        lessonContent: lesson.lessonContent,
                    },
                })
            )
        );

        return NextResponse.json(
            { success: true, lessons: createdLessons },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error adding lessons:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
