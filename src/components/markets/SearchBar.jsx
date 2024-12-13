import React from 'react';

const SearchBar = ({ onSearch }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="코인명 또는 심볼로 검색 (예: 비트코인, BTC)"
        onChange={(e) => onSearch(e.target.value)}
        className="w-full px-4 py-2 bg-[#313143] text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
};

export default SearchBar;