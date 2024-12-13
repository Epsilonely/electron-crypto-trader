import React, { useState, useEffect } from 'react';

const CurrentTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // 100ms로 업데이트 주기 늘림 (밀리초는 10ms 단위로만 표시)
    const timer = setInterval(() => {
      setTime(new Date());
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-[#CBCBCB]/50 font-light text-sm font-mono"> {/* font-mono 추가 */}
      <span>
        {time.getFullYear()}.
        {String(time.getMonth() + 1).padStart(2, '0')}.
        {String(time.getDate()).padStart(2, '0')}
      </span>
      <span className="ml-2 tabular-nums"> {/* tabular-nums 추가 */}
        {String(time.getHours()).padStart(2, '0')}:
        {String(time.getMinutes()).padStart(2, '0')}:
        {String(time.getSeconds()).padStart(2, '0')}.
        {String(Math.floor(time.getMilliseconds() / 10)).padStart(2, '0')} {/* 밀리초 2자리만 표시 */}
      </span>
    </div>
  );
};

export default CurrentTime;