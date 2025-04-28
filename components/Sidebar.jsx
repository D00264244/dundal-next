"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import codeClubLogo from "@/public/img/code_club_logo.jpg";
import { signOut } from 'next-auth/react';
import {
  HomeIcon,
  CodeBracketIcon,
  CommandLineIcon,
  GlobeAltIcon,
  UserPlusIcon,
  UserIcon,
  CalendarIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon,
  UserGroupIcon,
  BookOpenIcon,
  AcademicCapIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = session?.user?.role === 'ADMIN';
  const isAuthenticated = status === 'authenticated';

  // Debug logs
  console.log('Session:', session);
  console.log('Status:', status);
  console.log('Is Admin:', isAdmin);
  console.log('Is Authenticated:', isAuthenticated);

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    ...(isAuthenticated ? [
      { name: 'Events', href: '/events', icon: CalendarIcon },
      ...(isAdmin ? [
        { name: 'Dashboard', href: '/dashboard', icon: ShieldCheckIcon },
        { name: 'Users', href: '/dashboard/users', icon: UserGroupIcon }
      ] : [])
    ] : [])
  ];

  const NavContent = () => (
    <>
      {/* Logo Section */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center">
          <Image
            src={codeClubLogo}
            alt="Code Club Logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="ml-3 text-xl font-semibold text-gray-900">Code Club</span>
        </div>
        <button
          className="lg:hidden text-gray-500 hover:text-gray-700"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-lime-50 text-lime-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon
                  className={`h-5 w-5 mr-3 ${
                    isActive ? 'text-lime-600' : 'text-gray-400'
                  }`}
                />
                <span>{item.name}</span>
                {isActive && (
                  <ChevronRightIcon className="h-4 w-4 ml-auto text-lime-600" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Section */}
      <div className="p-4 border-t border-gray-200">
        {isAuthenticated ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-lime-100 flex items-center justify-center">
                  {session?.user?.image ? (
                    <img
                      className="h-10 w-10 rounded-full"
                      src={session.user.image}
                      alt=""
                    />
                  ) : (
                    <UserCircleIcon className="h-5 w-5 text-lime-600" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
                  <p className="text-xs text-gray-500">{session?.user?.email}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
              Sign Out
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Link
              href="/login"
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-lime-600 hover:bg-lime-700"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Bars3Icon className="h-6 w-6 text-gray-600" />
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <nav className="flex flex-col bg-white h-screen w-72 border-r border-gray-200">
          <NavContent />
        </nav>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
          <nav className="fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-200">
            <NavContent />
          </nav>
        </div>
      )}
    </>
  );
} 