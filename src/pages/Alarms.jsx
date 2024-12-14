import React from 'react';

const AlarmsPage = ({ alarms, onRemoveAlarm }) => {
  return (
    <div className="space-y-4">
      {alarms.length === 0 ? (
        <div className="text-center text-[#CBCBCB]/50 mt-8">
          등록된 알람이 없습니다
        </div>
      ) : (
        alarms.map(alarm => (
          <div 
            key={alarm.id}
            className="bg-[#313143] rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-medium">{alarm.market.korean_name}</h3>
                <span className="text-sm text-gray-400">{alarm.market.market}</span>
              </div>
              <p className="text-gray-400 mt-1">
                등록 시점: {alarm.registeredPrice.toLocaleString()} KRW
              </p>
              <p className="text-blue-400 mt-1">
                {alarm.type === 'price' 
                  ? `목표가: ${alarm.value.toLocaleString()} KRW`
                  : `목표 변동률: ${alarm.value}%`}
              </p>
            </div>
            <button
              onClick={() => onRemoveAlarm(alarm.id)}
              className="text-gray-400 hover:text-red-400 transition-colors"
            >
              삭제
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AlarmsPage;