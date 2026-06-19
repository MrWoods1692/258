import { useState, useEffect } from 'react';

export const useDaysCalculator = (startDateStr: string, endDateStr: string) => {
  const [days, setDays] = useState({
    sinceStart: 0,
    untilEnd: 0,
    isAfterEnd: false,
    afterEndDays: 0,
  });

  useEffect(() => {
    const calculate = () => {
      const now = new Date();
      const start = new Date(startDateStr);
      const end = new Date(endDateStr);

      // Start date: 2023-08-23
      // Natural days since start (including start date)
      const diffStart = now.getTime() - start.getTime();
      const sinceStart = Math.max(0, Math.floor(diffStart / (1000 * 60 * 60 * 24)) + 1);

      // Graduation: 2026-07-01
      const isAfterEnd = now.getTime() >= end.getTime();
      const diffEnd = Math.abs(now.getTime() - end.getTime());
      const endDays = Math.floor(diffEnd / (1000 * 60 * 60 * 24));

      setDays({
        sinceStart,
        untilEnd: isAfterEnd ? 0 : endDays,
        isAfterEnd,
        afterEndDays: isAfterEnd ? endDays : 0,
      });
    };

    calculate();
    // Refresh every minute to be safe, though daily is enough
    const timer = setInterval(calculate, 60000);
    return () => clearInterval(timer);
  }, [startDateStr, endDateStr]);

  return days;
};
