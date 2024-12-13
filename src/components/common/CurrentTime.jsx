import React, { useState, useEffect } from 'react';

const formatNumber = (num, digits = 2) => String(num).padStart(digits, '0');

const CurrentTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-[#CBCBCB]/55 font-light text-sm font-mono">
      <span>
        {time.getFullYear()}.
        {formatNumber(time.getMonth() + 1)}.
        {formatNumber(time.getDate())}
      </span>
      <span className="ml-2 tabular-nums">
        {formatNumber(time.getHours())}:
        {formatNumber(time.getMinutes())}:
        {formatNumber(time.getSeconds())}.
        {formatNumber(Math.floor(time.getMilliseconds() / 10))}
      </span>
    </div>
  );
};

export default CurrentTime;