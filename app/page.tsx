'use client';

import { useState } from 'react';
import { chips } from '@/lib/chip-definitions';
import ChipSimulator from '@/components/ChipSimulator';

export default function Home() {
  const [selectedChipId, setSelectedChipId] = useState(chips[0].id);

  const selectedChip = chips.find(c => c.id === selectedChipId) || chips[0];

  return (
    <div className="flex h-screen w-screen bg-white text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <span className="text-2xl">⚙️</span> 数字电路仿真
          </h1>
          <p className="text-xs text-gray-500 mt-1">交互式数字逻辑电路学习平台</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {chips.map(chip => (
              <li key={chip.id}>
                <button
                  onClick={() => setSelectedChipId(chip.id)}
                  className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                    selectedChipId === chip.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  <div className="font-medium">{chip.name}</div>
                  <div className="text-xs opacity-70 truncate">{chip.description}</div>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-200 text-xs text-gray-500 text-center">
          数字与逻辑电路课程 DSR
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header/Toolbar could go here */}
        
        {/* Simulation Area */}
        <div className="flex-1 overflow-auto bg-[url('/grid.svg')] bg-repeat">
           {/* We can add a grid background pattern using CSS or SVG */}
           <div className="w-full h-full flex items-center justify-center min-h-[600px]">
             <ChipSimulator chip={selectedChip} />
           </div>
        </div>
      </main>
    </div>
  );
}
