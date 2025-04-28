"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import codeClubLogo from "@/public/img/code_club_logo.jpg";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/api/courses");
        // console.log("API Response:", response.data);
        setCourses(
          Array.isArray(response.data.courses) ? response.data.courses : []
        );
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="container_ flex w-full">
      <Sidebar />
      <div className="bg-lime-300 min-h-screen md:w-full">
        <header id="logo" className="container mx-auto rounded-xl">
          <div className="flex justify-between items-center px-4 py-3">
            <Image
              src={codeClubLogo}
              alt="Code Club Logo"
              width={48}
              height={48}
              className="rounded-xl md:flex lg:hidden"
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 rounded-xl">
          <article className="container clear-both mx-auto px-4 py-4 rounded-xl">
            <header
              id="intro"
              className="container bg-blue-300 border-2 border-black mx-auto p-7 rounded-xl w-full lg:w-4/5"
            >
              <h1 className="text-2xl font-bold mb-4">
                Learn to code with Code Club
              </h1>
              <p>
                Our projects have step-by-step instructions to teach you how to
                create games, animations, and much more. Choose from hundreds of
                options, in up to 30 languages.
              </p>
            </header>

            <div
              id="panels"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full lg:w-4/5 mx-auto mt-4"
            >
              {Array.isArray(courses) && courses.length > 0 ? (
                courses.map((course, index) => (
                  <section
                    key={course.id || index}
                    className="p-5 bg-gray-200 rounded-md mx-2 text-center shadow-lg"
                  >
                    <Image
                      src={
                        course.courseImage?.startsWith("http")
                          ? course.courseImage
                          : `/${course.courseImage}`
                      }
                      alt={`${course.courseTitle} Logo`}
                      width={300}
                      height={200}
                      className="mx-auto w-full rounded-md"
                      onError={(e) => (e.target.src = "/placeholder.jpg")}
                    />

                    <div className="content p-4">
                      <h2 className="font-bold text-start text-xl">
                        {course.courseTitle}
                      </h2>
                      <p className="text-start text-gray-700">
                        {course.courseDescription}
                      </p>
                    </div>
                    {course.linkPage ? (
                      <Link href={course.linkPage}>
                        <button
                          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg mt-4 transition duration-300"
                          aria-label={`Explore ${course.courseTitle} Projects`}
                        >
                          Explore {course.courseTitle} Projects
                        </button>
                      </Link>
                    ) : (
                      <p className="text-red-500 mt-2">Link unavailable</p>
                    )}
                  </section>
                ))
              ) : (
                <p className="text-center text-gray-600 col-span-full">
                  No courses available
                </p>
              )}
            </div>
          </article>
        </main>

        {/* Footer */}
        <footer className="text-center mt-4">
          <address>Dublin Road, Dundalk</address>
        </footer>
      </div>
    </div>
  );
}
