'use client';

import { useState } from 'react';
import { chips } from '@/lib/chip-definitions';
import ChipSimulator from '@/components/ChipSimulator';

export const runtime = 'edge';

export default function Home() {
  const [selectedChipId, setSelectedChipId] = useState(chips[0].id);

  const selectedChip = chips.find(c => c.id === selectedChipId) || chips[0];

  return (
    <div className="flex h-screen w-screen bg-white text-slate-950 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r-2 border-slate-300 flex flex-col shadow-lg z-10">
        <div className="p-6 border-b-2 border-slate-200">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-2xl font-black text-blue-800 gap-3 tracking-wide">
              <span>数字电路仿真</span>
            </h1>
            <p className="text-sm font-bold text-slate-600 mt-2 font-mono">交互式数字电路仿真平台</p>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {chips.map(chip => (
              <li key={chip.id}>
                <button
                  onClick={() => setSelectedChipId(chip.id)}
                  className={`w-full text-left px-4 py-4 rounded-lg transition-all duration-200 group border-2 ${
                    selectedChipId === chip.id
                      ? 'bg-blue-100 border-blue-700 text-blue-900 shadow-md'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-400'
                  }`}
                >
                  <div className="font-bold text-lg flex justify-between items-center">
                    {chip.name}
                    {selectedChipId === chip.id && <div className="w-3 h-3 rounded-full bg-blue-700"></div>}
                  </div>
                  <div className="text-sm font-semibold opacity-80 truncate mt-1 font-mono">{chip.description}</div>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t-2 border-slate-200 text-sm font-bold text-slate-500 text-center font-mono">
          重庆邮电大学 DSR  v1.1
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-white">
        {/* Simulation Area */}
        <div className="flex-1 overflow-auto circuit-grid relative">
           {/* No Vignette for high contrast */}
           
           <div className="w-full h-full flex items-center justify-center p-4">
             <ChipSimulator chip={selectedChip} />
           </div>
        </div>
      </main>
    </div>
  );
}
