"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiCalendar, FiUsers, FiBriefcase, FiUser } from 'react-icons/fi';

export default function BottomNavbar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: FiHome,
      active: pathname === '/',
    },
    {
      name: 'Events',
      href: '/events',
      icon: FiCalendar,
      active: pathname.startsWith('/events'),
    },
    {
      name: 'Network',
      href: '/network',
      icon: FiUsers,
      active: pathname.startsWith('/network'),
    },
    {
      name: 'Organizations',
      href: '/organizations',
      icon: FiBriefcase,
      active: pathname.startsWith('/organizations'),
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: FiUser,
      active: pathname.startsWith('/profile'),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-[100] shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center ${
                item.active 
                  ? 'text-blue-700 bg-blue-50 font-medium' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <div className={`p-1 rounded-full ${item.active ? 'bg-blue-100' : ''}`}>
                <item.icon className="h-6 w-6" />
              </div>
              <span className="text-xs mt-1 font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
} 