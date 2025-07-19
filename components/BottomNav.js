'use client';

import { useState, useEffect, useRef } from 'react';
export default function BottomNavigation({ currentPage, setCurrentPage, isDarkMode, goHome }) {
  return (
    <nav className={`fixed bottom-0 left-0 right-0 backdrop-blur-md border-t shadow-lg z-40 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-900/95 border-gray-700' 
        : 'bg-white/95 border-gray-200'
    }`}>
      <div className="max-w-md mx-auto px-6 py-4">
        <div className="flex items-center justify-around">
          <button 
            onClick={goHome}
            className={`flex flex-col items-center space-y-1 p-2 transition-all duration-200 ${
              currentPage === 'home' 
                ? 'text-teal-500' 
                : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs font-medium">Home</span>
          </button>
          
          <button 
            onClick={() => setCurrentPage('search')}
            className={`flex flex-col items-center space-y-1 p-2 transition-all duration-200 ${
              currentPage === 'search' 
                ? 'text-teal-500' 
                : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-xs">Search</span>
          </button>
          
          <button
           onClick={() => setCurrentPage('browse')}
           className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
            isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
          }`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <span className="text-xs">Browse</span>
          </button>
          
          <button
           onClick={() => setCurrentPage('login')}          
          className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
            isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
          }`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs">Login</span>
          </button>
          
          <button 
          onClick={() => setCurrentPage('pro')}

          className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
            isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
          }`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
            </svg>
            <span className="text-xs">Pro</span>
          </button>
        </div>
      </div>
    </nav>
  );
}