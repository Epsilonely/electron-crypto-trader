import React from 'react';

const NotificationItem = ({ notification }) => {
  const renderContent = () => {
    switch (notification.type) {
      case 'PRICE_ALERT':
        return (
          <div className="mt-2 text-sm text-white">
            <p>
              목표 {notification.alertType === 'price' ? '가격' : '변동률'}: {notification.targetValue}
              {notification.alertType === 'price' ? ' KRW' : '%'}
            </p>
            <p>
              발생 가격: {notification.triggeredPrice.toLocaleString()} KRW
            </p>
          </div>
        );

      case 'TRADE_ORDER':
        return (
          <div className="mt-2 text-sm text-white">
            <p className={notification.orderType === 'buy' ? 'text-green-400' : 'text-red-400'}>
              {notification.orderType === 'buy' ? '매수' : '매도'} 주문 
              {notification.status === 'pending' ? '대기' : 
                notification.status === 'executed' ? '체결' : '취소'}
            </p>
            <p>목표가: {notification.targetPrice.toLocaleString()} KRW</p>
            <p>수량: {notification.amount}</p>
            <p>총액: {notification.total.toLocaleString()} KRW</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-[#313143] rounded-lg p-4 shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-white">
            {notification.market.korean_name}
          </h3>
          <p className="text-sm text-gray-400">
            {notification.market.market}
          </p>
        </div>
        <span className="text-xs text-gray-400">
          {new Date(notification.createdAt).toLocaleString()}
        </span>
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