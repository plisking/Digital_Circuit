'use client';

import { useEffect, useState } from 'react';

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const checkAndIncrement = () => {
      const lastVisit = localStorage.getItem('last_visit_timestamp');
      const now = Date.now();
      const tenMinutes = 10 * 60 * 1000;

      const storedCount = parseInt(localStorage.getItem('visitor_count') || '0', 10);
      const safeCount = Number.isFinite(storedCount) ? storedCount : 0;

      let nextCount = safeCount;
      let shouldIncrement = false;

      if (!lastVisit) {
        shouldIncrement = true;
      } else {
        const lastTime = parseInt(lastVisit, 10);
        if (isNaN(lastTime) || (now - lastTime > tenMinutes)) {
          shouldIncrement = true;
        }
      }

      if (shouldIncrement) {
        nextCount = safeCount + 1;
        localStorage.setItem('visitor_count', nextCount.toString());
        localStorage.setItem('last_visit_timestamp', now.toString());
      }

      setCount(nextCount);
    };

    checkAndIncrement();
  }, []);

  if (count === null) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 text-sm text-slate-900 bg-white px-4 py-2 rounded-full border-2 border-slate-900 shadow-none pointer-events-none select-none font-mono flex items-center gap-2 font-bold">
      <span className="w-3 h-3 rounded-full bg-green-600 animate-pulse border border-black"></span>
      VISITOR #<span className="font-black text-blue-800">{count}</span>
    </div>
  );
}
