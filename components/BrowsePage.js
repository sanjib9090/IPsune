'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import MediaCardList from '../components/MediaCardList';

export default function BrowsePage({
  isDarkMode,
  toggleDarkMode,
  currentPage,
  setCurrentPage,
  goHome,
  handleCardClick,
}) {
  const [selectedLanguage, setSelectedLanguage] = useState('hindi');
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // List of languages to display as buttons
  const languages = [
    { name: 'Hindi', value: 'hindi' },
    { name: 'English', value: 'english' },
    { name: 'Odia', value: 'odia' },
    { name: 'Tamil', value: 'tamil' },
    { name: 'Telugu', value: 'telugu' },
    { name: 'Punjabi', value: 'punjabi' },
    { name: 'Malayalam', value: 'malayalam' },
    { name: 'Kannada', value: 'kannada' },
    { name: 'Bengali', value: 'bengali' },
  ];

  // Format API data to match the expected structure
  const formatData = useCallback((items) =>
    (items || [])
      .filter(item => item.image && item.title && item.perma_url)
      .map(item => {
        const urlWithoutDomain = item.perma_url.replace(/^https?:\/\/[^\/]+/, '');
        const urlParts = urlWithoutDomain.split('/').filter(Boolean);
        const type = urlParts[0];
        const id = urlParts.pop();
        return {
          id: item.id,
          title: item.title.replace(/"/g, ''),
          subtitle: item.subtitle || 'Various Artists',
          image: item.image.replace('150x150', '500x500'),
          type,
          id,
          perma_url: `/${type}/${id}`,
        };
      }), []);

  // Fetch trending songs for the selected language
  useEffect(() => {
    const fetchTrendingSongs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://ipsune-pvt.vercel.app/api/trending?language=${encodeURIComponent(selectedLanguage)}`, {
          cache: 'no-store',
        });
        if (!response.ok) throw new Error(`Failed to fetch trending songs: ${response.status}`);
        const data = await response.json();
        console.log('✅ Fetched trending songs for language:', selectedLanguage, data);
        setTrendingSongs(formatData(data || []));
      } catch (error) {
        console.error('❌ Error fetching trending songs:', error.message);
        setError('Failed to fetch trending songs.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingSongs();
  }, [selectedLanguage, formatData]);

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-300 ${
      isDarkMode
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800'
        : 'bg-gradient-to-br from-slate-50 via-white to-gray-50'
    }`}>
      <Navbar
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        goHome={goHome}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className={`text-2xl sm:text-3xl font-bold mb-6 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>Browse by Language</h1>
        
        {/* Language Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          {languages.map(lang => (
            <button
              key={lang.value}
              onClick={() => setSelectedLanguage(lang.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-md border ${
                selectedLanguage === lang.value
                  ? 'bg-teal-500 text-white border-teal-600'
                  : isDarkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>

        {/* Trending Songs Section */}
        {isLoading ? (
          <p className={`text-center text-base sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
            Loading...
          </p>
        ) : error ? (
          <p className="text-center text-base sm:text-lg text-red-500">Error: {error}</p>
        ) : trendingSongs.length > 0 ? (
          <MediaCardList
            title={`Trending in ${languages.find(lang => lang.value === selectedLanguage)?.name || selectedLanguage}`}
            items={trendingSongs}
            isDarkMode={isDarkMode}
            label="Song"
            onItemClick={handleCardClick}
          />
        ) : (
          <p className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} opacity-70`}>
            No trending songs available for {selectedLanguage}
          </p>
        )}
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