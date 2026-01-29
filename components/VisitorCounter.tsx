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
        if (isNaN(lastTime) || now - lastTime > tenMinutes) {
          shouldIncrement = true;
        }
      }

      try {
        const response = await fetch('/api/visitor-count', {
          method: shouldIncrement ? 'POST' : 'GET',
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to load visitor count');
        }

        const data = (await response.json()) as { count: number };
        if (Number.isFinite(data.count)) {
          setCount(data.count);
        }

        if (shouldIncrement) {
          localStorage.setItem('last_visit_timestamp', now.toString());
        }
      } catch {
        setCount(null);
      }
    };

    checkAndIncrement();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 text-sm text-slate-900 bg-white px-4 py-2 rounded-full border-2 border-slate-900 shadow-none pointer-events-none select-none font-mono flex items-center gap-2 font-bold">
      <span className="w-3 h-3 rounded-full bg-green-600 animate-pulse border border-black"></span>
      VISITOR #<span className="font-black text-blue-800">{count ?? '...'}</span>
    </div>
  );
}
