import React from 'react';
import CurrentTime from './CurrentTime';

const TabButton = ({ label, isActive, onClick }) => (
  <button 
    className={`
      relative px-4 py-2 font-medium transition-all duration-300
      ${isActive 
        ? 'text-blue-400' 
        : 'text-gray-400 hover:text-gray-300'
      }
    `}
    onClick={onClick}
  >
    {label}
    {/* 밑줄 애니메이션 */}
    <div 
      className={`
        absolute bottom-0 left-0 w-full h-0.5 
        transition-transform duration-300 ease-out
        ${isActive 
          ? 'bg-blue-400 scale-x-100' 
          : 'bg-transparent scale-x-0'
        }
      `}
    />
  </button>
);

const Tab = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'markets', label: '코인 목록' },
    { id: 'favorites', label: '즐겨찾기' },
    { id: 'alarms', label: '알람 목록' },
  ];
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#18181C] shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center border-b border-slate-700 px-6">
          <div className="flex">
            {tabs.map(tab => (
              <TabButton
                key={tab.id}
                label={tab.label}
                isActive={activeTab === tab.id}
                onClick={() => onTabChange(tab.id)}
              />
            ))}
          </div>
          <CurrentTime />
        </div>
      </div>
    </div>
  );
};

export default Tab;