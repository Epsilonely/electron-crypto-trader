import React from 'react';
import CurrentTime from './CurrentTime';

const Tab = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex justify-between items-center border-b border-slate-700 mb-6">
      <div className="flex">
        <button 
          className={`px-4 py-2 font-medium ${
            activeTab === 'markets' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => onTabChange('markets')}
        >
          코인 목록
        </button>
        <button 
          className={`px-4 py-2 font-medium ${
            activeTab === 'favorites' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => onTabChange('favorites')}
        >
          즐겨찾기
        </button>
        <button 
          className={`px-4 py-2 font-medium ${
            activeTab === 'alerts' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => onTabChange('alerts')}
        >
          알람 설정
        </button>
      </div>
      <CurrentTime />
    </div>
  );
};

export default Tab;