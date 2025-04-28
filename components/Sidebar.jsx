"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import codeClubLogo from "@/public/img/code_club_logo.jpg";
import {
  HomeIcon,
  CodeBracketIcon,
  CommandLineIcon,
  GlobeAltIcon,
  UserPlusIcon,
  UserIcon,
  CalendarIcon,
  ShieldCheckIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const navItems = [
  {
    path: "/",
    pathname: "Home",
    icon: HomeIcon,
  },
  
  {
    path: "/events",
    pathname: "Events",
    icon: CalendarIcon,
  },
  {
    path: "/signup",
    pathname: "Signup",
    icon: UserPlusIcon,
  },
  {
    path: "/login",
    pathname: "Login",
    icon: UserIcon,
  },
  {
    path: "/dashboard",
    pathname: "Admin Portal",
    icon: ShieldCheckIcon,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:block">
      <nav className="flex flex-col bg-white h-screen w-72 border-r border-gray-200">
        {/* Logo Section */}
        <div className="flex items-center justify-center p-6 border-b border-gray-200">
          <Image
            src={codeClubLogo}
            alt="Code Club Logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="ml-3 text-xl font-semibold text-gray-900">Code Club</span>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-3">
            {navItems.map((item, index) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  href={item.path}
                  key={index}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-lime-50 text-lime-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 mr-3 ${
                    isActive ? 'text-lime-600' : 'text-gray-400'
                  }`} />
                  <span>{item.pathname}</span>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-lime-100 flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-lime-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
} 