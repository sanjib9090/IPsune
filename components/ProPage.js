'use client';

import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
export default function ProPage({
  isDarkMode,
  toggleDarkMode,
  currentPage,
  setCurrentPage,
  goHome,
}) {
  return (
    <div
      className={`h-screen pb-[4.5rem] transition-colors duration-300 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800'
          : 'bg-gradient-to-br from-slate-50 via-white to-gray-50'
      }`}
    >
      <Navbar
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        goHome={goHome}
      />
      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1
          className={`text-2xl sm:text-3xl font-bold mb-6 text-center ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}
        >
          Go Pro
        </h1>
        <div
          className={`p-6 rounded-lg shadow-md ${
            isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
          } border`}
        >
          <h2
            className={`text-xl font-semibold mb-4 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-900'
            }`}
          >
            ⚠️Caution
          </h2>
          <p
            className={`text-sm mb-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
Ipsune is a JioSaavn-inspired music streaming app built with Next.js and React.

Instead of using official APIs, it scrapes data from JioSaavn and FreeConvert, so no API keys are needed.
The app has a clean, responsive UI for smooth music streaming and conversion.
<br />
            <br />
⚠️ Legal Notice: This project uses scraping for educational purposes.
Scraping content without permission may violate Terms of Service or local laws.
Use official APIs in production to ensure compliance.        </p>
          <ul
            className={`space-y-2 mb-6 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-teal-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Ad-free music streaming
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-teal-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Offline song downloads
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-teal-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Exclusive content access
            </li>
          </ul>
          <button
            className="w-full px-4 py-2 bg-teal-500 text-white rounded-full font-medium hover:bg-teal-600 transition-all duration-200 shadow-md"
            onClick={() => {
              // Add subscription logic or redirect here
              console.log('Pro subscription clicked');
            }}
          >
            Subscribed
          </button>
        </div>
      </main>
      <BottomNav
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isDarkMode={isDarkMode}
        goHome={goHome}
      />
    </div>
  );
}