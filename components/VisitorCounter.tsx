'use client';

import { useEffect, useState } from 'react';

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const checkAndIncrement = async () => {
      const lastVisit = localStorage.getItem('last_visit_timestamp');
      const now = Date.now();
      const tenMinutes = 10 * 60 * 1000;

      let shouldIncrement = false;

      if (!lastVisit) {
        shouldIncrement = true;
      } else {
        const lastTime = parseInt(lastVisit, 10);
        if (isNaN(lastTime) || (now - lastTime > tenMinutes)) {
          shouldIncrement = true;
        }
      }

      try {
        let res;
        if (shouldIncrement) {
          res = await fetch('/api/visitor-count', { method: 'POST' });
          if (res.ok) {
            localStorage.setItem('last_visit_timestamp', now.toString());
          }
        } else {
          res = await fetch('/api/visitor-count');
        }

        if (res.ok) {
          const data = await res.json();
          setCount(data.count);
        }
      } catch (error) {
        console.error('Failed to fetch visitor count', error);
      }
    };

    checkAndIncrement();
  }, []);

  if (count === null) return null;

  return (
    <div className="fixed bottom-2 right-2 z-50 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded border border-gray-200 shadow-sm pointer-events-none select-none">
      您是第 <span className="font-bold text-blue-600">{count}</span> 位使用者
    </div>
  );
}
