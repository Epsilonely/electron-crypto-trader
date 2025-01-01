import React from 'react';

const NotificationItem = ({ notification, onRemove }) => {
  const getStatusColor = (triggered) => {
    return triggered ? 'bg-green-500' : 'bg-yellow-500';
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const renderContent = () => {
    const priceChange = notification.triggerPrice && notification.registeredPrice
      ? ((notification.triggerPrice - notification.registeredPrice) / notification.registeredPrice * 100).toFixed(2)
      : null;

    return (
      <div className="mt-2 text-sm text-white">
        <div className="flex items-center gap-2 mb-1">
          <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(notification.triggered)}`}>
            {notification.triggered ? '발생' : '대기'}
          </span>
          <span className="text-gray-400">
            {notification.triggered ? formatTime(notification.triggeredAt) : formatTime(notification.createdAt)}
          </span>
        </div>
        <p>
          목표 {notification.type === 'price' ? '가격' : '변동률'}: {notification.value}
          {notification.type === 'price' ? ' KRW' : '%'}
        </p>
        {notification.triggered && (
          <>
            <p>발생 가격: {notification.triggerPrice?.toLocaleString()} KRW</p>
            {priceChange && (
              <p className={priceChange >= 0 ? 'text-green-400' : 'text-red-400'}>
                변동률: {priceChange}%
              </p>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#313143] rounded-lg p-4 shadow-lg hover:bg-[#3a3a4f] transition-colors relative group">
      <div className="flex justify-between items-start relative">
        <div className="flex-1">
          <h3 className="font-semibold text-white flex items-center gap-2">
            {notification.market.korean_name}
            <span className="text-xs text-gray-400">
              {notification.market.market}
            </span>
          </h3>
        </div>
        <button
          onClick={() => onRemove(notification.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 top-0 text-gray-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

const NotificationHistory = ({ notifications, onClear, onRemove }) => {
  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        알림 내역이 없습니다
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-lg font-bold text-white">알림 히스토리</h2>
        <button
          onClick={onClear}
          className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 rounded text-white"
        >
          전체 삭제
        </button>
      </div>
      <div className="flex flex-col gap-2 p-4">
        {notifications.map(notification => (
          <NotificationItem 
            key={notification.id} 
            notification={notification}
            onRemove={() => onRemove(notification.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationHistory;
