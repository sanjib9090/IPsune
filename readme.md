# IPsune - Music Streaming Web App

## Overview

Note : APIs are Not pushed for Legal issues and Security.
Contact For Any removal.

Ipsune is a JioSaavn-inspired music streaming web application built with **Next.js** and **React**, designed to provide a seamless music experience. It features song search, playlists, multi-language support, and MP4 to MP3 conversion, all powered by scraping data from **JioSaavn** (`www.jiosaavn.com`) and **FreeConvert** (`www.freeconvert.com`) without requiring API keys. Ipsune combines modern web technologies with a responsive, user-friendly interface for streaming music and converting audio files.

**⚠️ Critical Legal Note**: Scraping `www.jiosaavn.com` and `www.freeconvert.com` without explicit permission violates their Terms of Service and may contravene applicable laws in your jurisdiction. This project uses scraping for **educational purposes only**. For production use, we strongly recommend using official APIs from JioSaavn and FreeConvert (available at FreeConvert.com) with valid API keys to ensure compliance, reliability, and respect for service providers’ terms.

   

##Deployments
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

> 🚀 **Live Deployment:** [https://ipsune.vercel.app](https://ipsune.vercel.app)



## Features

- **Music Streaming**: Stream songs, albums, and playlists scraped from JioSaavn.
- **Song Search**: Real-time search for songs, albums, and playlists across multiple languages (e.g., Hindi, English, Tamil).
- **Playlists & Queue**: Create and manage playlists with a dynamic playback queue.
- **Multi-Language Support**: Filter content by language for personalized recommendations.
- **MP4 to MP3 Conversion**: Convert MP4 audio files to MP3 by scraping FreeConvert’s website (see Conversion Notes).
- **Responsive UI**: Light and dark mode support with smooth transitions.
- **Playback Controls**: Play, pause, skip, repeat, shuffle, and seek via floating and full-screen players.
- **Progress Bar**: Real-time song progress with smooth updates and seeking capability.
- **Recommendations**: Discover trending songs, albums, and playlists scraped from JioSaavn.
- **Error Handling**: Robust handling for scraping failures, audio playback, and conversion errors.

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Icons**: Lucide React
- **Audio Playback**: HTML5 `<audio>` element with React refs
- **State Management**: React hooks (`useState`, `useEffect`, `useRef`, `useCallback`)
- **Data Fetching**:
  - Music data: Scraped from `www.jiosaavn.com` via custom server-side routes
  - Audio conversion: Scraped from `www.freeconvert.com` for MP4 to MP3 conversion
- **Scraping Libraries**: `axios`, `cheerio`, `puppeteer`
- **Styling**: Tailwind CSS with custom gradients and responsive design

## Installation

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**

### Steps

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/ipsune.git
   cd ipsune
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```

   This installs required packages, including `axios`, `cheerio`, and `puppeteer` for scraping JioSaavn and FreeConvert.

3. **Configure Environment (Optional)**: No API keys are required, as the app relies on scraping. Optionally, create a `.env.local` file for advanced scraping configurations (e.g., proxy settings to bypass rate limits):

   ```env
   # Optional: Proxy for scraping
   SCRAPING_PROXY_URL=https://your-optional-proxy.com
   ```

4. **Run the Development Server**:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The app will be available at `http://localhost:3000`.

## Usage

- **Home Page**: Browse trending songs, albums, and playlists scraped from JioSaavn. Use the language dropdown to filter by language (e.g., Hindi, English, Tamil).
- **Search Page**: Search for songs, albums, or playlists in real-time using scraped JioSaavn data.
- **Music Player Page**: View detailed song, album, or playlist information with scraped recommendations.
- **Floating Player**: Appears when a song is playing, offering play/pause, skip, and progress tracking.
- **Full Player**: Click the floating player to access advanced controls (shuffle, repeat, queue, seek).
- **MP4 to MP3 Conversion**: Navigate to the **Convert** section, upload an MP4 file, and convert it to MP3 using scraped FreeConvert endpoints.
- **Dark Mode**: Toggle between light and dark themes via the navbar or full player.

## Project Structure

```
ipsune/
├── app/
│   ├── api/
│   │   ├── fetchaudio/         # Scrapes JioSaavn audio URLs
│   │   ├── jiosaavn/           # Scrapes song, album, and playlist data
│   │   ├── mainapi/            # Scrapes home page data
│   │   ├── searchapi/          # Scrapes search results
│   │   ├── trending/           # Scrapes trending content
│   │   ├── yearlyReco/         # Scrapes yearly recommendations
│   │   ├── albumreco/          # Scrapes album recommendations
│   │   ├── downloadapi/            # Scrapes FreeConvert for MP4 to MP3 conversion
│   ├── components/
│   │   ├── BottomNav.js        # Bottom navigation bar
│   │   ├── FloatingPlayer.js   # Floating audio player with progress bar
│   │   ├── FullPlayer.js       # Full-screen player with advanced controls
│   │   ├── Navbar.js           # Top navigation bar
│   │   ├── PlayControls.js     # Play and like buttons
│   │   ├── SearchPage.js       # Search interface
│   │   ├── SongCard.js         # Song card component
│   │   ├── SongList.js         # Song list component
│   │   ├── ArtistCard.js       # Artist card component
│   │   ├── MediaCardList.js    # Media card list component
│   │   ├── AudioConverter.js   # Handles MP4 to MP3 conversion via scraping
│   ├── globalsAlbum.css        # Global CSS styles
│   ├── page.js                 # Main page component
├── public/                     # Static assets
├── package.json                # Project dependencies
├── README.md                   # This file
```

## Conversion Notes

Ipsune’s MP4 to MP3 conversion feature is implemented by scraping `www.freeconvert.com`. The `AudioConverter.js` component sends HTTP requests to scraped FreeConvert endpoints to upload MP4 files and retrieve MP3 outputs, bypassing the need for an API key.

**⚠️ Legal and Ethical Warning**:

- Scraping `www.freeconvert.com` without permission violates their Terms of Service () and may infringe on intellectual property or data usage laws.
- For production use, use FreeConvert’s official API (available at FreeConvert.com), which requires an API key and supports conversions up to 1 GB on the free plan.
- Scraping may lead to rate-limiting, IP bans, or service disruptions due to anti-scraping measures.

**To Use Conversion**:

1. Navigate to the **Convert** section in the app (via `AudioConverter.js`).
2. Upload an MP4 audio file using the provided interface.
3. The app sends a request to the scraped FreeConvert endpoint, processes the file, and provides a downloadable MP3.
4. Monitor for errors (e.g., rate limits, invalid files) displayed in the UI.

## Scraping Notes

Ipsune scrapes `www.jiosaavn.com` for all music data, including:

- **Songs, Albums, Playlists**: Via `/api/jiosaavn` and `/api/mainapi`.
- **Search Results**: Via `/api/searchapi` for real-time queries.
- **Audio URLs**: Via `/api/fetchaudio` for streamable links.
- **Recommendations**: Via `/api/trending`, `/api/yearlyReco`, and `/api/albumreco`.

**⚠️ Risks**:

- Scraping `www.jiosaavn.com` without permission violates their Terms of Service and may lead to legal consequences.
- Website structure changes may break scraping logic.
- Anti-scraping measures (e.g., CAPTCHAs, IP blocks) may disrupt functionality.
- For production, contact JioSaavn for official API access or licensing.

## Scraping Implementation

- **Libraries**: Uses `axios` for HTTP requests, `cheerio` for HTML parsing, and `puppeteer` for dynamic, JavaScript-rendered content.
- **Endpoints**: Custom server-side routes (`/api/*`) handle scraping logic, mimicking API responses.
- **Proxy (Optional)**: Configure `SCRAPING_PROXY_URL` in `.env.local` to bypass rate limits or IP bans.

## Optimization Notes

- **Throttled Audio Updates**: The `timeupdate` event in `FloatingPlayer.js` is throttled to 100ms, ensuring smooth progress bar updates without excessive re-renders.
- **React.memo**: Applied to `FloatingPlayer.js` to optimize rendering performance.
- **Error Handling**: Handles scraping failures, audio playback errors, and conversion issues with user-friendly messages.
- **Responsive Design**: Tailwind CSS ensures compatibility across devices.

## Known Issues

- **Progress Bar Stability**: UseRef should be constant due to progress in audio time its re rendring till the audio plays .
- **Scraping Reliability**: Scraped JioSaavn and FreeConvert endpoints may fail due to website changes, rate limits, or anti-scraping measures. Official APIs are recommended.
- **Legal Risks**: Unauthorized scraping may lead to service disruptions or legal action.

## Future Improvements

- Transition to official JioSaavn and FreeConvert APIs for compliance and reliability.
- Add volume control sliders in `FloatingPlayer` and `FullPlayer`.
- Implement offline caching for recently played songs.
- Support drag-and-drop queue reordering.
- Add user-created playlists and favorites.
- Enhance accessibility with ARIA labels and keyboard navigation.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

Ensure contributions respect JioSaavn’s and FreeConvert’s Terms of Service and avoid unauthorized scraping in production.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For questions or feedback, open an issue on GitHub or contact your-email@example.com.