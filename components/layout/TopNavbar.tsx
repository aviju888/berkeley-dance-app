"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiUser, FiSettings } from 'react-icons/fi';
import Avatar from '../ui/Avatar';
import LogoutButton from '../auth/LogoutButton';

interface TopNavbarProps {
  user?: {
    id: string;
    profile_image: string | null;
  } | null;
}

export default function TopNavbar({ user }: TopNavbarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-800 hover:bg-gray-100"
                >
                  Sign In
                </Link>
                <Link 
                  href="/sign-up" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-800 hover:bg-gray-100"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center focus:outline-none hover:bg-gray-100 rounded-full p-1 transition-colors"
                  aria-expanded={isUserDropdownOpen}
                  aria-label="Open user menu"
                >
                  <div className="relative">
                    <Avatar 
                      src={user.profile_image} 
                      alt="Profile" 
                      size="sm"
                      className="ring-2 ring-blue-200"
                    />
                    <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
                  </div>
                  <span className="ml-2 font-medium text-gray-800">My Account</span>
                  <svg className="w-4 h-4 ml-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* User Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
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
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
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
            <div className="px-4 py-3 border-b border-gray-100 flex items-center">
              <Avatar 
                src={user.profile_image} 
                alt="Profile" 
                size="md"
                className="border-2 border-blue-200"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">My Account</p>
              </div>
            </div>
          )}
          
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === '/' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-800 hover:bg-gray-100'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/events" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname.startsWith('/events') 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-800 hover:bg-gray-100'
              }`}
            >
              Events
            </Link>
            <Link 
              href="/network" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname.startsWith('/network') 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-800 hover:bg-gray-100'
              }`}
            >
              Network
            </Link>
            <Link 
              href="/organizations" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname.startsWith('/organizations') 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-800 hover:bg-gray-100'
              }`}
            >
              Organizations
            </Link>
            
            {/* Authentication Links for Mobile */}
            {!user ? (
              <>
                <Link 
                  href="/sign-in" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
                >
                  Sign In
                </Link>
                <Link 
                  href="/sign-up" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/profile" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
                >
                  My Profile
                </Link>
                <Link 
                  href="/profile/edit" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
                >
                  Edit Profile
                </Link>
                <div className="px-3 py-2 border-t border-gray-200 mt-2">
                  <LogoutButton 
                    variant="text" 
                    className="w-full flex py-2 text-red-600 font-medium" 
                    buttonText="Sign Out"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
} 