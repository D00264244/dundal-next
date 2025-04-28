"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import codeClubLogo from "@/public/img/code_club_logo.jpg";

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

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-lime-300 w-full">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Image
            src={codeClubLogo}
            alt="Code Club Logo"
            width={48}
            height={48}
            className="rounded-xl md:flex lg:hidden"
          />

          {/* Desktop Navigation */}
          <nav className="lg:hidden hidden md:flex space-x-4">
            {navItems.map((item, index) => (
              <Link
                href={item.path}
                key={index}
                className={`border-solid border-2 px-3 py-1 rounded-md border-black bg-white hover:bg-lime-300 transition-all duration-200 ${
                  pathname === item.path ? "bg-lime-300" : ""
                }`}
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
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="bg-white w-3/4 h-full p-4">
            <div className="flex justify-between items-center mb-4">
              <Image
                src={codeClubLogo}
                alt="Code Club Logo"
                width={48}
                height={48}
                className="rounded-xl"
              />
              <button
                className="bg-red-700 text-white p-2 rounded-xl focus:outline-none"
                onClick={() => setMenuOpen(false)}
              >
                Close
              </button>
            </div>
            {navItems.map((item, index) => (
              <Link
                href={item.path}
                key={index}
                className={`block border-solid border-2 px-3 py-2 rounded-md border-black bg-white hover:bg-lime-300 mb-2 transition-all duration-200 ${
                  pathname === item.path ? "bg-lime-300" : ""
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.pathname}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
} 