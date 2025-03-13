"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiUser, FiSettings, FiBell, FiMail, FiHome, FiCalendar, FiUsers, FiBriefcase } from 'react-icons/fi';
import Avatar from '../ui/Avatar';
import LogoutButton from '../auth/LogoutButton';

interface TopNavbarProps {
  user?: {
    id: string;
    profile_image: string | null;
    username?: string | null;
  } | null;
}

export default function TopNavbar({ user }: TopNavbarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Determine display name (username or "My Account" as fallback)
  const displayName = user?.username || "My Account";
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-700 drop-shadow-sm">Berkeley Dance</span>
            </Link>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:ml-8 md:flex md:space-x-6">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname === '/' 
                    ? 'text-blue-700 border-b-2 border-blue-700' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <FiHome className="mr-1" />
                Home
              </Link>
              <Link
                href="/events"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname.startsWith('/events') 
                    ? 'text-blue-700 border-b-2 border-blue-700' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <FiCalendar className="mr-1" />
                Events
              </Link>
              <Link
                href="/network"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname.startsWith('/network') 
                    ? 'text-blue-700 border-b-2 border-blue-700' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <FiUsers className="mr-1" />
                Network
              </Link>
              <Link
                href="/organizations"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname.startsWith('/organizations') 
                    ? 'text-blue-700 border-b-2 border-blue-700' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <FiBriefcase className="mr-1" />
                Organizations
              </Link>
            </div>
          </div>
          
          {/* User Menu (Desktop) */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            {!user ? (
              <>
                <Link 
                  href="/sign-in" 
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/sign-up" 
                  className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setIsNotificationsOpen(!isNotificationsOpen);
                      setIsUserDropdownOpen(false);
                    }}
                    className="p-2 rounded-full text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none"
                  >
                    <FiBell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                  </button>
                  
                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-10 border border-gray-200">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        <div className="px-4 py-3 bg-gray-50 text-sm text-gray-500">
                          No new notifications
                        </div>
                      </div>
                      <div className="px-4 py-2 border-t border-gray-200 text-center">
                        <Link href="#" className="text-sm text-blue-600 hover:text-blue-800">
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* User Dropdown */}
                <div className="relative ml-3">
                  <button 
                    onClick={() => {
                      setIsUserDropdownOpen(!isUserDropdownOpen);
                      setIsNotificationsOpen(false);
                    }}
                    className="flex items-center focus:outline-none hover:bg-gray-100 rounded-full p-1 transition-colors"
                    aria-expanded={isUserDropdownOpen}
                    aria-label="Open user menu"
                  >
                    <div className="relative">
                      <Avatar 
                        src={user.profile_image} 
                        alt={displayName} 
                        size="sm"
                        className="ring-2 ring-blue-200"
                      />
                      <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
                    </div>
                    <span className="ml-2 font-medium text-gray-800 max-w-[100px] truncate">
                      {displayName}
                    </span>
                    <svg className="w-4 h-4 ml-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <div className="border-b border-gray-100 pb-2 px-4 py-3">
                        <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
                        <p className="text-xs text-gray-500 mt-1 truncate">{user.id}</p>
                      </div>
                      
                      <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <FiUser className="mr-3 text-gray-600" /> 
                        <span>My Profile</span>
                      </Link>
                      
                      <Link href="/profile/edit" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <FiSettings className="mr-3 text-gray-600" /> 
                        <span>Edit Profile</span>
                      </Link>
                      
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <div className="px-4 py-2">
                          <LogoutButton 
                            variant="text" 
                            className="w-full py-1 text-red-600 font-medium" 
                            buttonText="Sign Out"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            {user && (
              <button
                className="p-1 mr-2 rounded-full text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none"
              >
                <FiBell className="h-5 w-5" />
              </button>
            )}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <FiMenu className="block h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          {user && (
            <div className="px-4 py-3 border-b border-gray-100 flex items-center bg-gray-50">
              <Avatar 
                src={user.profile_image} 
                alt={displayName} 
                size="md"
                className="border-2 border-blue-200"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">{displayName}</p>
                <p className="text-xs text-gray-500 mt-1">View your profile</p>
              </div>
            </div>
          )}
          
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/" 
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                pathname === '/' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-800 hover:bg-gray-100'
              }`}
            >
              <FiHome className="mr-3" />
              Home
            </Link>
            <Link 
              href="/events" 
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                pathname.startsWith('/events') 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-800 hover:bg-gray-100'
              }`}
            >
              <FiCalendar className="mr-3" />
              Events
            </Link>
            <Link 
              href="/network" 
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                pathname.startsWith('/network') 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-800 hover:bg-gray-100'
              }`}
            >
              <FiUsers className="mr-3" />
              Network
            </Link>
            <Link 
              href="/organizations" 
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                pathname.startsWith('/organizations') 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-800 hover:bg-gray-100'
              }`}
            >
              <FiBriefcase className="mr-3" />
              Organizations
            </Link>
            
            {/* Authentication Links for Mobile */}
            {!user ? (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4">
                  <div className="flex-grow">
                    <Link 
                      href="/sign-in" 
                      className="block w-full text-center px-4 py-2 rounded-md text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 mb-2"
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/sign-up" 
                      className="block w-full text-center px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="border-t border-gray-200 pt-4">
                  <Link 
                    href="/profile" 
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
                  >
                    <FiUser className="mr-3" />
                    My Profile
                  </Link>
                  <Link 
                    href="/profile/edit" 
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
                  >
                    <FiSettings className="mr-3" />
                    Edit Profile
                  </Link>
                  <div className="px-3 py-3 border-t border-gray-200 mt-2">
                    <LogoutButton 
                      variant="text" 
                      className="w-full flex py-2 text-red-600 font-medium" 
                      buttonText="Sign Out"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
} 