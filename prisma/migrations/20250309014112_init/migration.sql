-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "courseTitle" TEXT NOT NULL,
    "courseImage" TEXT NOT NULL,
    "courseDescription" TEXT NOT NULL,
    "linkPage" TEXT,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "lessonTitle" TEXT NOT NULL,
    "lessonContent" TEXT NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
