export default function FloatingPlayer({ 
  showFloatingPlayer, 
  songs, 
  currentSong, 
  isPlaying, 
  togglePlay, 
  nextSong, 
  prevSong, 
  closeFloatingPlayer, 
  setShowFullPlayer, 
  currentTime, 
  duration, 
  isDarkMode,
  seekTo
}) {
  if (!showFloatingPlayer) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-24 left-4 right-4 max-w-md mx-auto z-40">
      <div className={`backdrop-blur-md rounded-2xl shadow-2xl border p-4 transition-all duration-300 hover:shadow-3xl ${
        isDarkMode 
          ? 'bg-gray-800/95 border-gray-700' 
          : 'bg-white/95 border-gray-200'
      }`}>
        <div className="flex items-center space-x-3">
          <div 
            className="flex items-center space-x-3 cursor-pointer min-w-0 flex-1"
            onClick={() => setShowFullPlayer(true)}
          >
            <img 
              src={songs[currentSong].image} 
              alt={songs[currentSong].title}
              className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className={`font-semibold text-sm truncate transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>{songs[currentSong].title}</h3>
              <p className={`text-xs truncate transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>{songs[currentSong].subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={prevSong}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>
            
            <button
              onClick={togglePlay}
              className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isPlaying ? (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
            
            <button
              onClick={nextSong}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>
            
            <button
              onClick={closeFloatingPlayer}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ml-2 ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={(e) => seekTo(parseFloat(e.target.value))}
            className={`w-full h-1 rounded-full overflow-hidden cursor-pointer border-1 outline-none appearance-none [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:${isDarkMode ? 'bg-gray-100' : 'bg-gray-200'} [&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,#0d9488_0%,#22d3ee_var(--progress),transparent_var(--progress),transparent_100%)] [&::-webkit-slider-runnable-track]:transition-all [&::-webkit-slider-runnable-track]:duration-1000 [&::-webkit-slider-runnable-track]:border-0 [&::-webkit-slider-runnable-track]:outline-none [&::-webkit-slider-thumb]:w-0 [&::-webkit-slider-thumb]:h-0 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:visibility-hidden [&::-webkit-slider-thumb]:opacity-0 [&::-moz-range-track]:h-1 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} [&::-moz-range-track]:border-0 [&::-moz-range-track]:outline-none [&::-moz-range-progress]:h-1 [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:bg-gradient-to-r [&::-moz-range-progress]:from-teal-500 [&::-moz-range-progress]:to-cyan-600 [&::-moz-range-progress]:transition-all [&::-moz-range-progress]:duration-1000 [&::-moz-range-progress]:border-0 [&::-moz-range-progress]:outline-none [&::-moz-range-thumb]:w-0 [&::-moz-range-thumb]:h-0 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:visibility-hidden [&::-moz-range-thumb]:opacity-0`}
            style={{ '--progress': `${(currentTime / (duration || 100)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}