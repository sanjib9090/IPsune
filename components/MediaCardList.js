'use client';

import { Play } from 'lucide-react';

export default function MediaCardList({ title, items = [], isDarkMode, label, onItemClick }) {
  if (!items.length) return null;

  return (
    <div className="mt-16">
      <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${
        isDarkMode ? 'text-white' : 'text-gray-800'
      }`}>{title}</h2>

      <div className="grid grid-cols-1 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onItemClick(item.type, item.id)}
            className={`rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-100'
            }`}
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.image.replace('150x150', '500x500')}
                alt={item.title}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-lg truncate transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>{item.title}</h3>
                <p className={`text-sm mb-1 truncate transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>{item.subtitle}</p>
                <p className={`text-xs transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>{label}</p>
              </div>

              <button 
                className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the parent div's onClick
                  onItemClick(item.type, item.id);
                }}
              >
                <Play className="w-6 h-6 text-white ml-0.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}