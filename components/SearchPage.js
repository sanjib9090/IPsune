export default function SearchPage({ setCurrentPage, searchQuery, setSearchQuery, searchResults, isDarkMode, onItemClick }) {
  return (
    <div
      className={`min-h-screen pb-32 transition-colors duration-300 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800'
          : 'bg-gradient-to-br from-slate-50 via-white to-gray-50'
      }`}
    >
      {/* Header */}
      <header
        className={`backdrop-blur-md shadow-sm border-b sticky top-0 z-30 transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-100'
        }`}
      >
        <div className="px-6 py-4 max-w-md mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentPage('home')}
              className={`p-2 rounded-xl transition-colors ${
                isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search songs, artists, albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-5 py-3 rounded-2xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
                  isDarkMode ? 'bg-gray-700 text-white focus:bg-gray-600' : 'bg-gray-100 text-gray-800 focus:bg-white'
                }`}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Search Results */}
      <main className="max-w-md mx-auto px-6 py-8">
        {searchQuery ? (
          <div>
            <h2
              className={`text-xl font-semibold mb-6 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}
            >
              Search Results
            </h2>
            <div className="space-y-3">
              {searchResults.map((song) => (
                <div
                  key={song.id}
                  className={`flex items-center space-x-4 p-4 rounded-2xl border hover:shadow-md transition-all duration-200 cursor-pointer shadow-sm ${
                    isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-100 hover:bg-gray-50'
                  }`}
                  onClick={() => onItemClick(song.type, song.id)}
                >
                  <img src={song.albumArt} alt={song.title} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold truncate transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}
                    >
                      {song.title}
                    </h3>
                    <p
                      className={`text-sm truncate transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {song.artists}
                    </p>
                    <p
                      className={`text-xs transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    >
                      {song.album}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    >
                      {song.duration}
                    </span>
                    <button
                      className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the parent onClick
                        onItemClick(song.type, song.id);
                      }}
                    >
                      <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-gray-100 to-gray-200'
              }`}
            >
              <svg
                className={`w-12 h-12 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h2
              className={`text-2xl font-semibold mb-3 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Search Music
            </h2>
            <p
              className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
            >
              Find your favorite songs, artists, and albums
            </p>
          </div>
        )}
      </main>
    </div>
  );
}