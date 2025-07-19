export default function PlayControls({ isPlaying, togglePlay, isLiked, toggleLike, isDarkMode }) {
  return (
    <div className="flex items-center justify-center space-x-8 mb-10">
      <button
        onClick={togglePlay}
        className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 transform hover:scale-110"
      >
        {isPlaying ? (
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
          </svg>
        ) : (
          <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        )}
      </button>
      
      <button
        onClick={toggleLike}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
          isLiked 
            ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg' 
            : `shadow-md border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600' 
                  : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200'
              }`
        }`}
      >
        <svg className="w-6 h-6" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </div>
  );
}