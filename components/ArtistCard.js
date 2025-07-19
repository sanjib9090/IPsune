export default function ArtistCard({ item, isDarkMode }) {
  if (!item) {
    return (
      <div className={`artist-card rounded-lg text-center cursor-pointer transition-colors shadow-md p-2.5 w-[150px] h-[220px] flex flex-col justify-between ${
        isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-800'
      }`}>
        <p>No item data available</p>
      </div>
    );
  }

  return (
    <div className={`artist-card rounded-xl text-center cursor-pointer transition-colors shadow-md p-2.5 w-[150px] h-[220px] flex flex-col justify-between group ${
      isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-800'
    }`}>
      <div className="image-container relative w-full pt-[100%]">
        <img
          src={item.image.replace('150x150', '500x500') || "/placeholder.jpg"}
          alt={item.title || "Unknown Item"}
          className="artist-image absolute top-0 left-0 w-full h-full object-cover rounded-full"
        />
        <div className="play-overlay absolute top-0 left-0 w-full h-full bg-black/60 flex items-center justify-center opacity-0 transition-opacity duration-300 rounded-full group-hover:opacity-100">
          <span className="play-icon text-3xl text-white bg-black/80 rounded-full w-[50px] h-[50px] flex items-center justify-center transition-transform duration-300">▶</span>
        </div>
      </div>
      <h3 className="song-title mt-2 text-base font-medium whitespace-nowrap overflow-hidden text-ellipsis">
        {item.title || "Unknown Item"}
      </h3>
      <p className={`song-artist mt-1 text-xs whitespace-nowrap overflow-hidden text-ellipsis ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        {item.subtitle || "No Subtitle"}
      </p>
    </div>
  );
}