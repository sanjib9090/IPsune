export default function SongList({ songs, currentSong, isPlaying, playSong, isDarkMode }) {
  return (
    <div className="space-y-3">
      {songs.map((song, index) => (
        <div 
          key={index}
          className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 cursor-pointer group ${
            currentSong === index && isPlaying 
              ? 'bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 shadow-md dark:from-teal-900/20 dark:to-cyan-900/20 dark:border-teal-700' 
              : `shadow-sm hover:shadow-md border transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' 
                    : 'bg-white hover:bg-gray-50 border-gray-100'
                }`
          }`}
          onClick={() => playSong(index)}
        >
          <div className="flex-shrink-0 relative">
            <img 
              src={song.albumArt} 
              alt={song.title}
              className="w-14 h-14 rounded-xl object-cover"
            />
            {currentSong === index && isPlaying && (
              <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-teal-500 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold truncate transition-colors duration-300 ${
              isDarkMode ? 'text-black' : 'text-teal-500'
            }`}>{song.title}</h3>
            <p className={`text-sm truncate transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>{song.artists}</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>{song.duration}</span>
            <button className={`p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100 ${
              isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
            }`}>
              <svg className={`w-4 h-4 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}