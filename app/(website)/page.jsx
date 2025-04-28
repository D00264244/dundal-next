"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import codeClubLogo from "@/public/img/code_club_logo.jpg";
import Link from "next/link";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const navItems = [
    {
      path: "/",
      pathname: "Home",
    },
    {
      path: "/scratch",
      pathname: "Scratch",
    },
    {
      path: "/python",
      pathname: "Python",
    },
    {
      path: "/web",
      pathname: "Web",
    },
    {
      path: "/signup",
      pathname: "Signup",
    },
    {
      path: "/login",
      pathname: "Login",
    },
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/api/courses");

        console.log("API Response:", response.data);

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
      <div className="div">
        <nav className="hidden  lg:flex flex-col items-start bg-white shadow-md p-4  h-screen sticky top-0 left-0  w-64">
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
      </div>
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

            <button
              id="menu-toggle"
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
                id="menu-close"
                className="mb-4 bg-red-700 text-white p-2 rounded-xl focus:outline-none"
                onClick={() => setMenuOpen(false)}
              >
                Close
              </button>
              {["Home", "Scratch", "Python", "Web"].map((item, index) => (
                <Link
                  href={`/${item.toLowerCase()}`}
                  key={index}
                  className="block border-solid border-2 px-3 py-1 rounded-md border-black bg-white hover:bg-lime-300 mb-2 transition-all duration-200 ease-in-out"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        )}

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
                    key={course.id || index} // Use unique ID if available
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
                      onError={(e) => (e.target.src = "/placeholder.jpg")} // Fallback if image fails to load
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
