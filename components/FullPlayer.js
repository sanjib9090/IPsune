'use client';

import { useState } from 'react';

export default function FullPlayer({ 
  showFullPlayer, 
  setShowFullPlayer, 
  songs, 
  currentSong, 
  isPlaying, 
  togglePlay, 
  nextSong, 
  prevSong, 
  isLiked, 
  toggleLike, 
  currentTime, 
  duration, 
  isShuffled, 
  toggleShuffle, 
  repeatMode, 
  toggleRepeat, 
  showQueue, 
  setShowQueue, 
  playSong, 
  isDarkMode, 
  toggleDarkMode,
  seekTo
}) {
  if (!showFullPlayer) return null;

  const [isDownloading, setIsDownloading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const showNotification = (message, url = '') => {
    console.log('Showing popup with message:', message, 'and URL:', url);
    setPopupMessage(message);
    setAudioUrl(url);
    setShowPopup(true);
  };

  const handleRedirect = () => {
    if (audioUrl) {
      console.log('Redirecting to:', audioUrl);
      window.location.href = audioUrl;
      setShowPopup(false);
    } else {
      console.warn('No audioUrl set for redirect');
    }
  };

  const downloadFile = async (url, filename) => {
    try {
      console.log('Fetching blob for download:', url);
      const response = await fetch(url, { method: 'GET' });
      if (!response.ok) throw new Error(`Failed to fetch file: ${response.status}`);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      console.log('Triggering download for:', filename);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download file error:', error);
   
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    console.log('Starting download process');
    try {
      const currentSongData = songs[currentSong];
      const audioUrl = songs[currentSong].audioUrl;
      if (!audioUrl) {
        console.error('No audioUrl provided for song:', currentSongData);
        showNotification('No audio URL available for download.', '');
        return;
      }
      const filename = currentSongData.title.replace(/[^a-zA-Z0-9]/g, '_') + '.mp4';

      console.log('Requesting conversion for:', filename, 'with URL:', audioUrl);

      const response = await fetch(`/api/downloadapi?url=${encodeURIComponent(audioUrl)}&filename=${encodeURIComponent(filename)}`, {
        redirect: 'manual',
        headers: { 'Accept': 'application/json' }
      });
      console.log('API response status:', response.status);
      const data = await response.json();
      console.log('API response data:', data);

      if (!data.url) {
        console.log('Conversion failed, showing popup and downloading MP4');
        showNotification(
          'Failed to convert song: API limit of 20 conversions per IP reached or error occurred. Try changing your IP  or use the original MP4.',
          audioUrl
        );
        // Delay MP4 download to ensure popup is visible
        setTimeout(() => {
          console.log('Initiating MP4 download after delay');
          downloadFile(audioUrl, `${currentSongData.title || 'song'}.mp4`);
        }, 1000);
        return;
      }

      // Successful conversion
      console.log('Conversion successful, downloading MP3:', data.url);
      await downloadFile(data.url, `${currentSongData.title || 'song'}.mp3`);
    } catch (error) {
      console.error('Download error:', error);
      const currentSongData = songs[currentSong];
      const audioUrl = songs[currentSong].audioUrl;
      showNotification(
        'Failed to download song: API limit of 20 conversions per IP reached or error occurred. Try changing your IP or use the original MP4.',
        audioUrl
      );
      if (audioUrl) {
        // Delay MP4 download to ensure popup is visible
        setTimeout(() => {
          console.log('Initiating MP4 download after delay');
          downloadFile(audioUrl, `${currentSongData.title || 'song'}.mp4`);
        }, 1000);
      }
    } finally {
      setIsDownloading(false);
      console.log('Download process completed');
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800' 
        : 'bg-gradient-to-br from-white via-gray-50 to-slate-100'
    }`}>
      {/* Popup Notification */}
      {showPopup && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] p-4 rounded-lg shadow-lg max-w-md w-full text-center transition-all duration-300 ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}>
          <p className="mb-4">{popupMessage}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleRedirect}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                  : 'bg-teal-500 hover:bg-teal-600 text-white'
              }`}
              disabled={!audioUrl}
            >
              Redirect to MP4
            </button>
            <button
              onClick={() => {
                console.log('Closing popup');
                setShowPopup(false);
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`flex items-center justify-between p-6 border-b transition-colors duration-300 flex-shrink-0 ${
        isDarkMode ? 'border-gray-700' : 'border-gray-100'
      }`}>
        <button 
          onClick={() => setShowFullPlayer(false)}
          className={`p-2 rounded-xl transition-colors ${
            isDarkMode 
              ? 'hover:bg-gray-700 text-gray-300' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className={`text-lg font-semibold transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>Now Playing</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleDarkMode}
            className={`p-2 rounded-xl transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
              }`}
          >
            {isDarkMode ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <button className={`p-2 rounded-xl transition-colors ${
            isDarkMode 
              ? 'hover:bg-gray-700 text-gray-300' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Album Art */}
        <div className="flex items-center justify-center p-6">
          <div className="w-[280px] h-[280px] max-w-full">
            <img 
              src={songs[currentSong].image.replace('150x150', '500x500')} 
              alt={songs[currentSong].title.replace(/&quot;/g, " ")}
              className="w-full h-full rounded-3xl object-cover shadow-2xl"
            />
          </div>
        </div>

        {/* Song Info */}
        <div className="px-8 pb-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h2 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>{songs[currentSong].title.replace(/&quot;/g, " ")}</h2>
              <p className={`text-xs transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>{songs[currentSong].subtitle}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleLike}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isLiked 
                    ? 'bg-red-500 text-white' 
                    : `transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                      }`
                }`}
              >
                <svg className="w-6 h-6" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button 
                onClick={handleDownload}
                disabled={isDownloading}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 relative ${
                  isDownloading
                    ? 'bg-gray-500 cursor-not-allowed'
                    : isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                {isDownloading ? (
                  <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8v2a6 6 0 00-6 6h2m-2 4a8 8 0 008 8v-2a6 6 0 01-6-6h2m4-4a8 8 0 008-8v2a6 6 0 01-6 6h2m4 4a8 8 0 01-8 8v-2a6 6 0 006-6h-2" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
              </button>
              <button className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-8 pb-1">
          <div className="flex items-center space-x-3 mb-4">
            <button 
              onClick={toggleShuffle}
              className={`p-1 rounded-full transition-all duration-200 transform hover:scale-110 ${
                isShuffled 
                  ? 'bg-teal-500 text-white' 
                  : `${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3m10.5-7.5L3 12m10.5 7.5L3 12" />
              </svg>
            </button>
            <span className={`text-sm w-12 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seekTo(parseFloat(e.target.value))}
              className={`flex-1 h-2 rounded-full overflow-hidden cursor-pointer border-0 outline-none appearance-none [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} [&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,#0d9488_0%,#22d3ee_var(--progress),transparent_var(--progress),transparent_100%)] [&::-webkit-slider-runnable-track]:transition-all [&::-webkit-slider-runnable-track]:duration-1000 [&::-webkit-slider-runnable-track]:border-0 [&::-webkit-slider-runnable-track]:outline-none [&::-webkit-slider-thumb]:w-0 [&::-webkit-slider-thumb]:h-0 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:visibility-hidden [&::-webkit-slider-thumb]:opacity-0 [&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} [&::-moz-range-track]:border-0 [&::-moz-range-track]:outline-none [&::-moz-range-progress]:h-2 [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:bg-gradient-to-r [&::-moz-range-progress]:from-teal-500 [&::-moz-range-progress]:to-cyan-600 [&::-moz-range-progress]:transition-all [&::-moz-range-progress]:duration-1000 [&::-moz-range-progress]:border-0 [&::-moz-range-progress]:outline-none [&::-moz-range-thumb]:w-0 [&::-moz-range-thumb]:h-0 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:visibility-hidden [&::-moz-range-thumb]:opacity-0`}
              style={{ '--progress': `${(currentTime / (duration || 100)) * 100}%` }}
            />
            <span className={`text-sm w-12 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>{formatTime(duration)}</span>
            <button 
              onClick={toggleRepeat}
              className={`p-3 rounded-full transition-colors relative ${
                repeatMode > 0 
                  ? 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400' 
                  : `${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {repeatMode === 2 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-teal-600 text-white text-xs rounded-full flex items-center justify-center">1</span>
              )}
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="px-8 pb-1">
          {/* Main Controls */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            <button 
              onClick={prevSong}
              className={`p-4 rounded-full transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>
            
            <button
              onClick={togglePlay}
              className="w-20 h-20 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              {isPlaying ? (
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
            
            <button 
              onClick={nextSong}
              className={`p-4 rounded-full transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Queue Section */}
        <div className="px-8 pb-1">
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>Up Next</h3>
            <button 
              onClick={() => setShowQueue(!showQueue)}
              className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span className="text-sm font-medium">Queue</span>
            </button>
          </div>
          
          {showQueue && (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {songs.slice(currentSong + 1).concat(songs.slice(0, currentSong)).map((song, index) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-colors cursor-pointer ${
                    isDarkMode 
                      ? 'hover:bg-gray-700' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => playSong((currentSong + 1 + index) % songs.length)}
                >
                  <img 
                    src={song.image} 
                    alt={song.title}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium truncate text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>{song.title}</h4>
                    <p className={`text-xs truncate transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>{song.subtitle}</p>
                  </div>
                  <span className={`text-xs transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>{song.duration}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-center pb-8">
          <button 
            onClick={() => setShowQueue(!showQueue)}
            className={`flex items-center space-x-2 transition-colors ${
              isDarkMode 
                ? 'text-gray-300 hover:text-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <svg className={`w-5 h-5 transition-transform duration-200 ${showQueue ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            <span className="text-sm font-medium">SONGS</span>
          </button>
        </div>
      </div>
    </div>
  );
}