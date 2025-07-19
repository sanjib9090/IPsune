'use client';

import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';

export default function LoginPage({
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
          Log In (Under Construction)
        </h1>
        <form className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className={`block text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className={`mt-1 w-full px-4 py-2 rounded-md border ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-600 text-gray-300 focus:ring-teal-500 focus:border-teal-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-teal-500 focus:border-teal-500'
              } shadow-sm focus:outline-none`}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className={`block text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className={`mt-1 w-full px-4 py-2 rounded-md border ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-600 text-gray-300 focus:ring-teal-500 focus:border-teal-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-teal-500 focus:border-teal-500'
              } shadow-sm focus:outline-none`}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-teal-500 text-white rounded-full font-medium hover:bg-teal-600 transition-all duration-200 shadow-md"
          >
            Log In
          </button>
        </form>
        <p
          className={`mt-4 text-center text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Don’t have an account?{' '}
          <a
            href="#"
            className="text-teal-500 hover:text-teal-600 font-medium"
            onClick={(e) => {
              e.preventDefault();
              // Add signup page navigation or logic here
            }}
          >
            Sign Up
          </a>
        </p>
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