"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import codeClubLogo from "@/public/img/code_club_logo.jpg";

const CoursePage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCourseAndLessons = async () => {
      try {
        const response = await axios.get(`/api/courses/${courseId}`);
        console.log("API Response:", response.data);

        if (response.data.success) {
          setCourse(response.data.course);
          setLessons(response.data.lessons);
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndLessons();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!course) {
    return <p className="text-center mt-5 text-gray-500">Course not found.</p>;
  }

  const navItems = [
    { pathname: "Home", path: "/" },
    { pathname: "Scratch", path: "/scratch" },
    { pathname: "Python", path: "/python" },
    { pathname: "Web", path: "/web" },
  ];

  return (
    <div className="flex w-full">
      {/* Sidebar Navigation */}
      <nav className="hidden lg:flex flex-col items-start bg-white shadow-md p-4 h-screen sticky top-0 left-0 w-64">
        <Image
          src={codeClubLogo}
          alt="Code Club Logo"
          width={48}
          height={48}
          className="rounded-xl"
        />
        {navItems.map((item, index) => (
          <Link
            href={item.path}
            key={index}
            className="block px-4 py-2 text-black hover:bg-lime-300 transition duration-200"
          >
            {item.pathname}
          </Link>
        ))}
      </nav>

      {/* Main Content */}
      <div className="bg-lime-300 min-h-screen w-full">
        {/* Header */}
        <header className="container mx-auto rounded-xl">
          <div className="flex justify-between items-center px-4 py-3">
            {/* Mobile Logo */}
            <Image
              src="/codeClubLogo.png"
              alt="Code Club Logo"
              width={48}
              height={48}
              className="rounded-xl md:flex lg:hidden"
            />

            {/* Mobile Navigation */}
            <nav className="lg:hidden hidden md:flex space-x-4">
              {navItems.map((item, index) => (
                <Link
                  href={item.path}
                  key={index}
                  className="border-solid border-2 px-3 py-1 rounded-md border-black bg-white hover:bg-lime-300 transition-all duration-200"
                >
                  {item.pathname}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-black focus:outline-none"
              onClick={() => setMenuOpen(true)}
            >
              <svg
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="fixed inset-0 bg-black/50 z-10">
            <div className="bg-white w-3/4 h-full p-4">
              <button
                className="mb-4 bg-red-700 text-white p-2 rounded-xl focus:outline-none"
                onClick={() => setMenuOpen(false)}
              >
                Close
              </button>
              {navItems.map((item, index) => (
                <Link
                  href={item.path}
                  key={index}
                  className="block border-solid border-2 px-3 py-1 rounded-md border-black bg-white hover:bg-lime-300 mb-2 transition-all duration-200 ease-in-out"
                >
                  {item.pathname}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Main Course Content */}
        <main className="container bg-lime-300 mx-auto px-4 rounded-xl">
          <article className="container mx-auto px-4 py-4 rounded-xl">
            <header className="container bg-blue-200 border-2 border-black mx-auto p-7 rounded-xl w-full lg:w-4/5">
              <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                {course.courseTitle}
              </h1>
              <p className="text-center text-gray-600 mt-2">
                {course.courseDescription}
              </p>
            </header>

            {/* Lessons Section */}
            {lessons.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full lg:w-4/5 mx-auto mt-4">
                {lessons.map((lesson, index) => (
                  <section
                    key={lesson.id || index}
                    className={`p-5 rounded-md mx-2 text-center ${
                      index % 3 === 0
                        ? "bg-orange-400"
                        : index % 3 === 1
                        ? "bg-blue-200"
                        : "bg-lime-600"
                    }`}
                  >
                    <div className="content p-4">
                      <h2 className="font-bold text-start text-xl">
                        {lesson.lessonTitle}
                      </h2>
                      <p className="text-start">{lesson.lessonContent}</p>
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-4 text-center">
                No lessons available for this course.
              </p>
            )}
          </article>
        </main>
      </div>
    </div>
  );
};

export default CoursePage;
