'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import SearchPage from '../components/SearchPage';
import SongList from '../components/SongList';
import PlayControls from '../components/PlayControls';
import FloatingPlayer from '../components/FloatingPlayer';
import FullPlayer from '../components/FullPlayer';
import SongCard from '../components/Songcard';
import ArtistCard from '../components/ArtistCard';
import MediaCardList from '../components/MediaCardList';
import BrowsePage from '../components/BrowsePage';
import '/app/globalsAlbum.css';
import LoginPage from '../components/LoginPage';
import ProPage from '../components/ProPage';

export default function Home() {
  // Centralized state management
  const [viewMode, setViewMode] = useState('home');
  const [mediaType, setMediaType] = useState(null);
  const [mediaId, setMediaId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [songs, setSongs] = useState([]);
  const [recommendedSongs, setRecommendedSongs] = useState([]);
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [yearlyRecoAlbums, setYearlyRecoAlbums] = useState([]);
  const [albumRecoAlbums, setAlbumRecoAlbums] = useState([]);
  const [homeData, setHomeData] = useState({ new_trending: [], top_playlists: [], new_albums: [] });
  const [mediaData, setMediaData] = useState({ title: '', subtitle: '', image: '', year: '', album_id: '', language: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showFullPlayer, setShowFullPlayer] = useState(false);
  const [showFloatingPlayer, setShowFloatingPlayer] = useState(false);
  const [volume, setVolume] = useState(75);
  const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: all, 2: one
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [fetchedSearchResults, setFetchedSearchResults] = useState([]);
  const [audioLoaded, setAudioLoaded] = useState(false);

  const audioRef = useRef(null);
  const hasFetchedHomeData = useRef(false);

  // Helper function to fetch auth_url
  const fetchAuthUrl = useCallback(async (encryptedMediaUrl) => {
    try {
      const response = await fetch(`https://ipsunepvt.onrender.com/api/fetchaudio?encryptedMediaUrl=${encodeURIComponent(encryptedMediaUrl)}`, {
        cache: 'no-store',
      });
      if (!response.ok) throw new Error(`Failed to fetch auth_url: ${response.status}`);
      const data = await response.json();
      console.log('✅ Fetched auth_url:', data.auth_url);
      return data.auth_url || '';
    } catch (error) {
      console.error('❌ Error fetching auth_url:', error.message);
      return '';
    }
  }, []);

  // Audio setup
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    audio.volume = volume / 100;

    const updateTime = () => {
      if (audio && !audio.paused && !isNaN(audio.currentTime)) {
        setCurrentTime(audio.currentTime);
        if (!isNaN(audio.duration) && audio.duration > 0) {
          setDuration(audio.duration);
        }
      }
    };

    const handleCanPlay = () => {
      if (audio && !isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
        setAudioLoaded(true);
      }
    };

    const handleError = (e) => {
      console.error('❌ Audio error:', audio?.error, e);
      setError('Failed to load audio. Please try another song.');
      setAudioLoaded(false);
      setIsPlaying(false);
      setShowFloatingPlayer(false);
    };

    const handleLoadedData = () => {
      if (audio && !isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
        setAudioLoaded(true);
      }
    };

    const handleEnded = () => {
      if (repeatMode === 2) {
        audio.currentTime = 0;
        audio.play().catch(err => console.error('❌ Repeat play failed:', err));
      } else if (repeatMode === 1 || currentSong < songs.length - 1) {
        nextSong();
      } else {
        setIsPlaying(false);
        setShowFloatingPlayer(false);
      }
    };

    const handlePlay = () => {
      if (audio.src && songs[currentSong]?.audioUrl) {
        setIsPlaying(true);
        setShowFloatingPlayer(true);
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', handleCanPlay);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', handleCanPlay);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [volume, repeatMode, currentSong, songs.length]);

  // Handle song change and audio source update
  useEffect(() => {
    if (!audioRef.current || !songs[currentSong]?.audioUrl) return;

    const audio = audioRef.current;
    const currentSongData = songs[currentSong];

    if (audio.src !== currentSongData.audioUrl) {
      setAudioLoaded(false);
      setError(null);
      audio.src = currentSongData.audioUrl;
      audio.load();
      if (isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('❌ Audio play failed:', error);
            setError('Failed to play audio. Please try another song.');
            setIsPlaying(false);
            setShowFloatingPlayer(false);
          });
        }
      }
    }
  }, [currentSong, songs, isPlaying]);

  // Fetch search results when searchQuery changes
  useEffect(() => {
    if (viewMode !== 'search' || !searchQuery) {
      setFetchedSearchResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://ipsunepvt.onrender.com/api/searchapi?livesearch=${encodeURIComponent(searchQuery)}`, {
          cache: 'no-store',
        });
        if (!response.ok) throw new Error(`Search API request failed with status ${response.status}`);
        const data = await response.json();

        const transformedResults = (data.results || []).map(item => ({
          title: item.title || 'Loading...',
          artists: item.artists || item.subtitle || 'Unknown Artist',
          albumArt: item.image || 'https://img.icons8.com/sci-fi/48/apple-music.png',
          album: item.more_info?.album || 'Unknown Album',
          type: item.type || 'song',
          id: item.perma_url?.split('/').pop() || 'unknown',
          album_id: item.album_id || item.more_info?.album_id || 'default_album_id',
        }));

        setFetchedSearchResults(transformedResults);
      } catch (error) {
        console.error('❌ Error fetching search results:', error.message);
        setError('Failed to fetch search results.');
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, viewMode]);

  // Toggle dark mode
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Navigate to home view
  const goHome = useCallback(() => {
    console.log('goHome triggered');
    setViewMode('home');
    setMediaType(null);
    setMediaId(null);
    setMediaData({ title: '', subtitle: '', image: '', year: '', album_id: '', language: '' });
    setShowFullPlayer(false);
    setRecommendedSongs([]);
    setTrendingSongs([]);
    setYearlyRecoAlbums([]);
    setAlbumRecoAlbums([]);
    // Audio state (songs, currentSong, isPlaying, showFloatingPlayer) is preserved to allow playback to continue
  }, []);

  // Set current page
  const setCurrentPage = useCallback((page) => {
    console.log('setCurrentPage:', page);
    setViewMode(page);
    if (page === 'home') {
      goHome();
    }
  }, [goHome]);

  // Data fetching for music player
  useEffect(() => {
    if (viewMode !== 'music' || !mediaType || !mediaId) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let urlParams = `token=${encodeURIComponent(mediaId)}&type=${mediaType}`;
        if (mediaType === "featured") urlParams += "&p=1&n=50";
        const response = await fetch(`https://ipsunepvt.onrender.com/api/jiosaavn?${urlParams}`);
        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

        const data = await response.json();
        console.log("✅ Fetched from https://ipsunepvt.onrender.com/api/jiosaavn", data);

        let transformedSongs = [];
        const album_id = getAlbumId(data.songs?.[0] || null, data);

        if (mediaType === "song" && data.songs?.length > 0) {
          const song = data.songs[0];
          const authUrl = song.more_info?.encrypted_media_url ? await fetchAuthUrl(song.more_info.encrypted_media_url) : '';
          setMediaData({
            title: song.title?.replace(/"/g, '') || 'Loading...',
            subtitle: song.subtitle?.split(' - ')[0] || 'Unknown Artist',
            image: song.image || 'https://img.icons8.com/sci-fi/48/apple-music.png',
            year: song.year || (song.more_info?.year || '2025'),
            album_id,
            language: song.language || song.more_info?.language || 'hindi',
          });
          transformedSongs = [{
            ...song,
            title: song.title || "",
            subtitle: song.subtitle || "",
            image: song.image || 'https://img.icons8.com/sci-fi/48/apple-music.png',
            audioUrl: authUrl,
            encrypted_media_url: song.more_info?.encrypted_media_url || '',
            more_info: { ...song.more_info, duration: parseInt(song.more_info?.duration || '225', 10) },
          }];
        } else if (mediaType === "album" && (data.title || data.songs)) {
          setMediaData({
            title: data.title || (data.songs?.[0]?.title || 'Unknown Album'),
            subtitle: data.name || (data.songs?.[0]?.subtitle?.split(' - ')[0] || 'Various Artists'),
            image: data.image || (data.songs?.[0]?.image || 'https://img.icons8.com/sci-fi/48/apple-music.png'),
            year: data.year || (data.songs?.[0]?.year || '2025'),
            album_id,
            language: data.language || (data.songs?.[0]?.language || 'hindi'),
          });
          transformedSongs = await Promise.all(
            (data.list || data.songs || []).map(async (song) => {
              const authUrl = song.more_info?.encrypted_media_url ? await fetchAuthUrl(song.more_info.encrypted_media_url) : '';
              return {
                ...song,
                title: song.title || "",
                subtitle: song.subtitle || "",
                image: song.image || data.image || 'https://img.icons8.com/sci-fi/48/apple-music.png',
                audioUrl: authUrl,
                encrypted_media_url: song.more_info?.encrypted_media_url || '',
                more_info: { ...song.more_info, duration: parseInt(song.more_info?.duration || '225', 10) },
              };
            })
          );
        } else if ((mediaType === "featured" || mediaType === "playlist") && data.title) {
          setMediaData({
            title: data.title || 'Unknown Playlist',
            subtitle: data.subtitle || 'Unknown Curator',
            image: data.image || 'https://img.icons8.com/sci-fi/48/apple-music.png',
            year: data.year || "2025",
            album_id,
            language: data.language || 'mixed',
          });
          transformedSongs = await Promise.all(
            (data.list || data.songs || []).map(async (song) => {
              const authUrl = song.more_info?.encrypted_media_url ? await fetchAuthUrl(song.more_info.encrypted_media_url) : '';
              return {
                ...song,
                title: song.title || "",
                subtitle: song.subtitle || "",
                image: song.image || data.image || 'https://img.icons8.com/sci-fi/48/apple-music.png',
                audioUrl: authUrl,
                encrypted_media_url: song.more_info?.encrypted_media_url || '',
                more_info: { ...song.more_info, duration: parseInt(song.more_info?.duration || '225', 10) },
              };
            })
          );
        } else {
          setMediaData({
            title: 'Loading...',
            subtitle: 'Artists Loading...',
            image: 'https://img.icons8.com/sci-fi/48/apple-music.png',
            year: '2025',
            album_id: 'default_album_id',
            language: 'unknown',
          });
        }

        setSongs(transformedSongs);
        console.log("✅ Set Songs with audioUrl:", transformedSongs);
      } catch (error) {
        console.error("❌ Error fetching data:", error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [viewMode, mediaType, mediaId, fetchAuthUrl]);

  // Data fetching for home page with caching
  useEffect(() => {
    if (viewMode !== 'home' || hasFetchedHomeData.current) return;

    const fetchMainApi = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('https://ipsunepvt.onrender.com/api/mainapi', { cache: 'no-store' });
        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
        const json = await response.json();
        setHomeData(json);
        hasFetchedHomeData.current = true;
      } catch (err) {
        console.error('Error fetching API:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMainApi();
  }, [viewMode]);

  // Recommendations fetching
  useEffect(() => {
    if (viewMode !== 'music' || isLoading || error || !mediaData.language) return;

    const fetchRecoData = async () => {
      try {
        const promises = [];
        if (mediaData.language) {
          promises.push(
            fetch(`https://ipsunepvt.onrender.com/api/trending/?language=${encodeURIComponent(mediaData.language)}`, { cache: "no-store" })
              .then(res => res.ok ? res.json() : null)
              .then(data => data ? setRecommendedSongs(formatData(data.reco || [])) : null)
              .catch(err => console.error('❌ Error fetching language reco:', err))
          );
        }
        if (mediaData.year) {
          promises.push(
            fetch(`https://ipsunepvt.onrender.com/api/yearlyReco?year=${encodeURIComponent(mediaData.year)}`, { cache: "no-store" })
              .then(res => res.ok ? res.json() : null)
              .then(data => data ? setYearlyRecoAlbums(formatData(data)) : null)
              .catch(err => console.error('❌ Error fetching yearly reco:', err))
          );
        }
        if (mediaData.album_id && mediaData.album_id !== 'default_album_id') {
          promises.push(
            fetch(`https://ipsunepvt.onrender.com/api/albumreco?albumid=${encodeURIComponent(mediaData.album_id)}`, { cache: "no-store" })
              .then(res => res.ok ? res.json() : null)
              .then(data => data && Array.isArray(data) ? setAlbumRecoAlbums(formatData(data)) : null)
              .catch(err => console.error('❌ Error fetching album reco:', err))
          );
        }
        promises.push(
          fetch(`https://ipsunepvt.onrender.com/api/trending?language=${encodeURIComponent(mediaData.language)}`, { cache: "no-store" })
            .then(res => res.ok ? res.json() : null)
            .then(data => data ? setTrendingSongs(formatData(data)) : null)
            .catch(err => console.error('❌ Error fetching trending:', err))
        );

        await Promise.allSettled(promises);
      } catch (error) {
        console.error("❌ Error fetching reco data:", error.message);
      }
    };

    fetchRecoData();
  }, [viewMode, mediaData.language, mediaData.year, mediaData.album_id, isLoading, error]);

  // Audio controls
  const togglePlay = useCallback(() => {
    if (!audioRef.current || !songs[currentSong]?.audioUrl) {
      setError('No audio source available.');
      return;
    }

    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('❌ Play failed:', error);
          setError('Failed to play audio.');
          setIsPlaying(false);
          setShowFloatingPlayer(false);
        });
      }
    }
  }, [isPlaying, songs, currentSong]);

  const toggleLike = useCallback(() => setIsLiked(!isLiked), [isLiked]);

  const playSong = useCallback(async (index) => {
    if (!songs[index]?.audioUrl) {
      setError('No valid audio source for this song.');
      return;
    }

    setCurrentSong(index);
    setCurrentTime(0);
    setError(null);

    if (audioRef.current) {
      try {
        audioRef.current.src = songs[index].audioUrl;
        audioRef.current.load();
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
          setShowFloatingPlayer(true);
        }
      } catch (error) {
        console.error('❌ Error playing song:', error);
        if (songs[index].encrypted_media_url) {
          try {
            const newAuthUrl = await fetchAuthUrl(songs[index].encrypted_media_url);
            if (newAuthUrl) {
              setSongs(prev => prev.map((song, i) => i === index ? { ...song, audioUrl: newAuthUrl } : song));
            } else {
              setError('Failed to fetch valid audio URL.');
            }
          } catch (fetchError) {
            console.error('❌ Error fetching new auth URL:', fetchError);
            setError('Failed to fetch valid audio URL.');
          }
        } else {
          setError('No valid audio source available.');
        }
      }
    }
  }, [songs, fetchAuthUrl]);

  const nextSong = useCallback(() => {
    if (songs.length === 0) return;
    setCurrentSong(prev => isShuffled ? Math.floor(Math.random() * songs.length) : (prev + 1) % songs.length);
    setCurrentTime(0);
  }, [songs.length, isShuffled]);

  const prevSong = useCallback(() => {
    if (songs.length === 0) return;
    if (currentTime > 10) {
      setCurrentTime(0);
      if (audioRef.current) audioRef.current.currentTime = 0;
    } else {
      setCurrentSong(prev => (prev - 1 + songs.length) % songs.length);
      setCurrentTime(0);
    }
  }, [currentTime, songs.length]);

  const seekTo = useCallback((newTime) => {
    if (audioRef.current && !isNaN(newTime) && !isNaN(audioRef.current.duration)) {
      const validTime = Math.max(0, Math.min(newTime, audioRef.current.duration));
      audioRef.current.currentTime = validTime;
      setCurrentTime(validTime);
    }
  }, []);

  const closeFloatingPlayer = useCallback(() => {
    setShowFloatingPlayer(false);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
      setCurrentTime(0);
      setDuration(0);
    }
  }, []);

  const toggleShuffle = useCallback(() => setIsShuffled(!isShuffled), [isShuffled]);

  const toggleRepeat = useCallback(() => setRepeatMode(prev => (prev + 1) % 3), []);

  const getAlbumId = (song, data) => {
    function findFirstAlbumId(obj) {
      if (!obj || typeof obj !== 'object') return null;
      for (let key in obj) {
        if (key === 'album_id' && obj[key]) return obj[key];
        if (typeof obj[key] === 'object') {
          const result = findFirstAlbumId(obj[key]);
          if (result) return result;
        }
      }
      return null;
    }
    return findFirstAlbumId(data) || 'default_album_id';
  };

  const formatData = (items) =>
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
      });

  const homeTrendingSongs = formatData(homeData.new_trending?.filter(item => item.type === 'song'));
  const homeTrendingAlbums = formatData(homeData.new_trending?.filter(item => item.type === 'album'));
  const homeTrendingPlaylists = formatData(homeData.new_trending?.filter(item => item.type === 'playlist'));
  const homeTopPlaylists = formatData(homeData.top_playlists);
  const homeNewAlbums = formatData(homeData.new_albums);

  const handleItemClick = useCallback((type, id, album_id) => {
    console.log('Search result clicked:', type, id, album_id);
    setViewMode('music');
    setMediaType(type);
    setMediaId(album_id || id);
  }, []);

  const handleCardClick = useCallback((type, id) => {
    console.log('Card clicked:', type, id);
    setViewMode('music');
    setMediaType(type);
    setMediaId(id);
  }, []);

  const MusicPlayerPage = () => (
    <div
      className={`min-h-screen pb-20 transition-colors duration-300 ${isDarkMode
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800'
        : 'bg-gradient-to-br from-slate-50 via-white to-gray-50'
        }`}
    >
      <Navbar
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        currentPage={viewMode}
        setCurrentPage={setCurrentPage}
        goHome={goHome}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center mb-8">
          <div className="relative mb-6">
            <div className="w-64 h-64 mx-auto bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 rounded-2xl shadow-2xl overflow-hidden">
              <img
                src={mediaData.image.replace('150x150', '500x500') || "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop"}
                alt={`${mediaData.title} cover`}
                className="w-full h-full object-cover mix-blend-overlay opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-2 leading-snug max-w-[90%] mx-auto break-normal whitespace-normal">
                    {(() => {
                      const title = mediaData.title.replace(/&quot;/g, " ");
                      const match = title.match(/^(.*?)\s*(\([^)]+\))$/);
                      if (match) {
                        return (
                          <>
                            {match[1]}
                            <br />
                            <span className="text-lg font-normal opacity-80">{match[2]}</span>
                          </>
                        );
                      } else {
                        return title || "Loading...";
                      }
                    })()}
                  </h3>


                  {/* <p className="text-xl opacity-90">{mediaData.subtitle || "Artists Loading..."}</p> */}
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{mediaData.title.replace(/&quot;/g, " ") || "Loading..."}</h1>
          <p className="text-gray-600 mb-1">by <span className="font-semibold">{mediaData.subtitle || "Artists Loading..."}</span></p>
          <p className="text-sm text-gray-500">{mediaData.year ? `${mediaData.year} • ${mediaType === "song" ? "70,827,486 Plays" : mediaType === "featured" ? "Plays Loading..." : "3,425,777 Plays"}` : "2025 • Plays Loading..."}</p>
        </div>

        <PlayControls
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          isLiked={isLiked}
          toggleLike={toggleLike}
          isDarkMode={isDarkMode}
        />
        <div className="flex justify-center space-x-4 mb-10">
          <button className={`flex items-center space-x-3 px-6 py-3 rounded-full transition-all duration-200 shadow-md border ${isDarkMode
            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600'
            : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
            }`}>
            <span className="font-medium">Download</span>
          </button>
          <button className={`flex items-center space-x-3 px-6 py-3 rounded-full transition-all duration-200 shadow-md border ${isDarkMode
            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600'
            : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
            }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span className="font-medium">Share</span>
          </button>
        </div>
        <div className="space-y-8">
          {songs.length > 0 && (
            <SongList
              songs={songs.map(song => ({
                title: song.title || '',
                artists: song.subtitle || 'Unknown Artist',
                albumArt: song.image || mediaData.image || 'https://img.icons8.com/sci-fi/48/apple-music.png',
                duration: song.more_info?.duration
                  ? `${Math.floor(song.more_info.duration / 60)}:${(song.more_info.duration % 60).toString().padStart(2, '0')}`
                  : '3:45',
                audioUrl: song.audioUrl || '',
                encrypted_media_url: song.encrypted_media_url || '',
              }))}
              currentSong={currentSong}
              isPlaying={isPlaying}
              playSong={playSong}
              isDarkMode={isDarkMode}
            />
          )}
          {albumRecoAlbums.length > 0 && (
            <MediaCardList
              title="Album Recommended Albums"
              items={albumRecoAlbums}
              isDarkMode={isDarkMode}
              label="Album"
              onItemClick={handleCardClick}
            />
          )}
          {trendingSongs.length > 0 && (
            <MediaCardList
              title="Trending Songs"
              items={trendingSongs}
              isDarkMode={isDarkMode}
              label="Song"
              onItemClick={handleCardClick}
            />
          )}
          {yearlyRecoAlbums.length > 0 && (
            <MediaCardList
              title="Yearly Recommended Albums"
              items={yearlyRecoAlbums}
              isDarkMode={isDarkMode}
              label="Album"
              onItemClick={handleCardClick}
            />
          )}
        </div>
      </main>
    </div>
  );

  const HomePage = () => {
    const isAllDataLoaded =
      homeTrendingSongs?.length &&
      homeTrendingAlbums?.length &&
      homeTrendingPlaylists?.length &&
      homeTopPlaylists?.length &&
      homeNewAlbums?.length;

    return (
      <div className={`min-h-screen pb-20 transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800' : 'bg-gradient-to-br from-slate-50 via-white to-gray-50'}`}>
        <Navbar
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          currentPage={viewMode}
          setCurrentPage={setCurrentPage}
          goHome={goHome}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {isLoading || !isAllDataLoaded ? (
            <p className={`text-center text-base sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Loading...</p>
          ) : error ? (
            <p className="text-center text-base sm:text-lg text-red-500">Error: {error}</p>
          ) : (
            <>
              <Section title="Trending Songs" data={homeTrendingSongs} cardType="song" isDarkMode={isDarkMode} />
              <Section title="Trending Albums" data={homeTrendingAlbums} cardType="artist" isDarkMode={isDarkMode} />
              <Section title="Trending Playlists" data={homeTrendingPlaylists} cardType="artist" isDarkMode={isDarkMode} />
              <Section title="Top Playlists" data={homeTopPlaylists} cardType="artist" isDarkMode={isDarkMode} />
              <Section title="New Albums" data={homeNewAlbums} cardType="artist" isDarkMode={isDarkMode} />
            </>
          )}
        </main>
      </div>
    );
  };

  function Section({ title, data, cardType = 'song', isDarkMode }) {
    return (
      <section className="section my-4 sm:my-8">
        <h2 className={`section-title text-xl sm:text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {title}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {data.length > 0 ? (
            data.map(item => (
              <div
                key={item.id}
                onClick={() => handleCardClick(item.type, item.id)}
                className="cursor-pointer"
              >
                {cardType === 'artist' ? (
                  <ArtistCard item={item} isDarkMode={isDarkMode} />
                ) : (
                  <SongCard song={item} isDarkMode={isDarkMode} />
                )}
              </div>
            ))
          ) : (
            <p className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} opacity-70`}>
              No {title.toLowerCase()} available
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {console.log('Current viewMode:', viewMode)}
      {viewMode === 'home' && <HomePage />}
      {viewMode === 'music' && <MusicPlayerPage />}
      {viewMode === 'search' && (
        <SearchPage
          setCurrentPage={setCurrentPage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={fetchedSearchResults}
          isDarkMode={isDarkMode}
          onItemClick={handleItemClick}
        />
      )}
      {viewMode === 'browse' && (
        <BrowsePage
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          currentPage={viewMode}
          setCurrentPage={setCurrentPage}
          goHome={goHome}
          handleCardClick={handleCardClick}
        />
      )}

      {/* Login */}
      {viewMode === 'login' && (
        <LoginPage
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          currentPage={viewMode}
          setCurrentPage={setCurrentPage}
          goHome={goHome}
        />
      )}
      {/* Pro */}
      {viewMode === 'pro' && (
        <ProPage
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          currentPage={viewMode}
          setCurrentPage={setCurrentPage}
          goHome={goHome}
        />
      )}





      {songs.length > 0 && songs[currentSong]?.audioUrl && (
        <FloatingPlayer
          showFloatingPlayer={showFloatingPlayer}
          songs={songs}
          currentSong={currentSong}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          nextSong={nextSong}
          prevSong={prevSong}
          closeFloatingPlayer={closeFloatingPlayer}
          setShowFullPlayer={setShowFullPlayer}
          currentTime={currentTime}
          duration={duration}
          isDarkMode={isDarkMode}
          seekTo={seekTo}
        />
      )}
      {viewMode === 'music' && (
        <FullPlayer
          showFullPlayer={showFullPlayer}
          setShowFullPlayer={setShowFullPlayer}
          songs={songs}
          currentSong={currentSong}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          nextSong={nextSong}
          prevSong={prevSong}
          isLiked={isLiked}
          toggleLike={toggleLike}
          currentTime={currentTime}
          duration={duration}
          isShuffled={isShuffled}
          toggleShuffle={toggleShuffle}
          repeatMode={repeatMode}
          toggleRepeat={toggleRepeat}
          volume={volume}
          setVolume={setVolume}
          showQueue={showQueue}
          setShowQueue={setShowQueue}
          playSong={playSong}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          seekTo={seekTo}
        />
      )}
      <BottomNav
        currentPage={viewMode}
        setCurrentPage={setCurrentPage}
        isDarkMode={isDarkMode}
        goHome={goHome}
      />
      <audio ref={audioRef} />
    </div>
  );
}