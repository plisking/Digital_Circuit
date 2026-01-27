'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChipDef, Pin } from '@/lib/chip-definitions';

interface ChipSimulatorProps {
  chip: ChipDef;
}

export default function ChipSimulator({ chip }: ChipSimulatorProps) {
  const [inputs, setInputs] = useState<Record<string, boolean>>({});
  const [internalState, setInternalState] = useState<any>(chip.initialState);
  const [outputs, setOutputs] = useState<Record<string, boolean>>({});
  const [scale, setScale] = useState(0.6);

  // Initialize inputs
  useEffect(() => {
    const initialInputs: Record<string, boolean> = {};
    chip.pins.forEach(pin => {
      if (pin.type === 'input' || pin.type === 'clock') {
        initialInputs[pin.id] = false;
      }
    });
    setInputs(initialInputs);
    setInternalState(chip.initialState);
    setOutputs({});
  }, [chip]);

  // Run logic when inputs or internal state changes
  useEffect(() => {
    const result = chip.logic(inputs, internalState);
    setOutputs(result.outputs);
    // We don't automatically update internalState here to avoid infinite loops if logic is purely combinational
    // But for sequential, we need to be careful.
    // The logic function returns 'nextState'.
    // If nextState is different, we should update it?
    // React state updates are async.
    // Let's assume logic is pure function of (inputs, state) -> (outputs, nextState).
    // We only update state if it changed.
    
    // Actually, for sequential logic (counters), we need a clock edge.
    // The 'logic' function in my definition handles edge detection by comparing current input with stored 'lastCP'.
    // So we should update internalState if it changed.
    
    if (JSON.stringify(result.nextState) !== JSON.stringify(internalState)) {
       setInternalState(result.nextState);
    }
  }, [inputs, chip]); // internalState is not in dependency to avoid loop, but we need to be careful.
  // Actually, if we update internalState, it triggers re-render, but 'inputs' hasn't changed, so effect won't run again?
  // Wait, if we depend on internalState, it will loop.
  // The logic function should be: (inputs, currentState) -> (outputs, nextState).
  // We run this whenever inputs change.
  // But what if the state update itself causes output change?
  // Yes, so we should run it when inputs change.
  // And if state updates, we might need to run it again?
  // Usually: Input Change -> Calculate Next State & Output -> Update State & Output.
  // So we don't need to re-run on state change if the state change was caused by input change.
  
  const toggleInput = (id: string) => {
    setInputs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const setInput = (id: string, val: boolean) => {
    setInputs(prev => ({ ...prev, [id]: val }));
  };

  const pulseCP = () => {
    // Find clock pins
    const clockPins = chip.pins.filter(p => p.type === 'clock');
    if (clockPins.length === 0) return;
    
    // Pulse logic: Low -> High -> Low (or High -> Low -> High)
    // Usually CP is active rising edge.
    // We toggle to High, wait, then Low.
    
    // For simplicity, let's just toggle the first clock pin found or all of them?
    // Usually there is one main CP.
    // Let's assume CP is named 'CP' or 'CP0'.
    
    clockPins.forEach(p => {
        // Trigger Rising Edge
        setInputs(prev => ({ ...prev, [p.id]: true }));
        setTimeout(() => {
            setInputs(prev => ({ ...prev, [p.id]: false }));
        }, 100);
    });
  };

  const resetChip = () => {
      setInternalState(chip.initialState);
      // Also reset inputs? Maybe not switches.
      // But maybe reset pins like MR?
      // If the chip has a MR pin, the user should toggle it.
      // This 'Reset' button might be a hard reset of the simulation state.
      setInternalState(chip.initialState);
  };

  // Layout constants
  const width = 1000; // Increased width
  const height = 700; // Increased height
  const isShiftReg = chip.id === 'shift-register-d';
  const chipWidth = isShiftReg ? 600 : 260; // Wider chip for shift register
  const chipHeight = isShiftReg ? 250 : 450; // Taller chip to spread pins, but shorter for shift reg
  const chipX = (width - chipWidth) / 2 + (isShiftReg ? 50 : 0);
  const chipY = (height - chipHeight) / 2;

  return (
    <div className="flex flex-col items-center w-full h-full text-slate-950 p-4">
      <div className="mb-8 text-center relative z-10">
        <h2 className="text-5xl font-black text-blue-900 tracking-tight">{chip.name}</h2>
        <p className="text-slate-700 text-xl mt-2 font-bold">{chip.description}</p>
      </div>

      <div 
        className="relative bg-white rounded-2xl shadow-2xl border-4 border-slate-900 overflow-hidden w-full min-w-[600px] flex flex-col"
      >
        <div className="absolute top-2 right-2 z-20 flex gap-2">
            <button 
                onClick={() => setScale(s => Math.min(s + 0.1, 1.5))}
                className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-full font-bold border-2 border-slate-300 shadow-sm transition-colors"
                title="放大"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
            <button 
                onClick={() => setScale(s => Math.max(s - 0.1, 0.4))}
                className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-full font-bold border-2 border-slate-300 shadow-sm transition-colors"
                title="缩小"
            >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                </svg>
            </button>
        </div>
        
        <div className="w-full h-full overflow-auto flex justify-center items-center p-2 sm:p-6">
            <svg 
                viewBox={`0 0 ${width} ${height}`} 
                className="select-none font-sans transition-all duration-200 ease-out"
                style={{ width: `${scale * 100}%`, height: 'auto' }}
            >
          {/* Chip Body */}
          {isShiftReg ? (
            <g>
              {/* Main Container Outline */}
              <rect
                x={chipX}
                y={chipY}
                width={chipWidth}
                height={chipHeight}
                rx={12}
                fill="#ffffff"
                stroke="#000000"
                strokeWidth={3}
                strokeDasharray="8,4"
              />
              
              {/* 4 D-FlipFlops */}
              {[0, 1, 2, 3].map(i => {
                const ffWidth = 100;
                const ffHeight = 120;
                const gap = 40;
                const startX = chipX + (chipWidth - (4 * ffWidth + 3 * gap)) / 2;
                const ffX = startX + i * (ffWidth + gap);
                const ffY = chipY + (chipHeight - ffHeight) / 2;
                
                const qVal = !!(internalState.val & (1 << i));
                const qPrevVal = i > 0 ? !!(internalState.val & (1 << (i - 1))) : inputs['D'];

                return (
                  <g key={i}>
                    {/* FF Box */}
                    <rect
                      x={ffX}
                      y={ffY}
                      width={ffWidth}
                      height={ffHeight}
                      fill="#ffffff"
                      stroke="#000000"
                      strokeWidth={3}
                      rx={4}
                    />
                    {/* Labels */}
                    <text x={ffX + 15} y={ffY + 30} fontSize="16" fontWeight="900" fill="#000000">D</text>
                    <text x={ffX + ffWidth - 25} y={ffY + 30} fontSize="16" fontWeight="900" fill="#000000">Q</text>
                    <text x={ffX + ffWidth - 25} y={ffY + ffHeight - 15} fontSize="16" fontWeight="900" fill="#000000">Q'</text>
                    
                    {/* Clock Triangle */}
                    <path d={`M ${ffX} ${ffY + ffHeight - 25} L ${ffX + 10} ${ffY + ffHeight - 20} L ${ffX} ${ffY + ffHeight - 15}`} fill="none" stroke="#000000" strokeWidth={3} />
                    <text x={ffX + 12} y={ffY + ffHeight - 16} fontSize="14" fontWeight="900" fill="#000000">CP</text>

                    {/* Connections */}
                    {/* Input D Wire */}
                    {i === 0 ? (
                       <path 
                         d={`M ${chipX} ${chipY + 0.36 * chipHeight} L ${ffX - 20} ${chipY + 0.36 * chipHeight} L ${ffX - 20} ${ffY + 25} L ${ffX} ${ffY + 25}`}
                         fill="none"
                         stroke={inputs['D'] ? '#1d4ed8' : '#64748b'} 
                         strokeWidth={4} 
                       />
                    ) : (
                       <line 
                         x1={ffX - gap} y1={ffY + 25} 
                         x2={ffX} y2={ffY + 25} 
                         stroke={qPrevVal ? '#1d4ed8' : '#64748b'} 
                         strokeWidth={4} 
                       />
                    )}

                    {/* Output Q Wire */}
                    {(() => {
                        const factors = [0.266, 0.5, 0.733, 0.966];
                        const pinX = chipX + factors[i] * chipWidth;
                        const pinY = chipY; 
                        const qOutX = ffX + ffWidth;
                        const qOutY = ffY + 25;
                        
                        return (
                            <path 
                                d={`M ${qOutX} ${qOutY} L ${pinX} ${qOutY} L ${pinX} ${pinY}`}
                                fill="none"
                                stroke={qVal ? '#1d4ed8' : '#64748b'}
                                strokeWidth={4}
                            />
                        );
                    })()}

                    {/* Clock Line */}
                    {(() => {
                        const busY = chipY + 0.86 * chipHeight;
                        const cpPortY = ffY + ffHeight - 20;
                        const wireX = ffX - 15; 
                        
                        return (
                            <path 
                                d={`M ${wireX} ${busY} L ${wireX} ${cpPortY} L ${ffX} ${cpPortY}`}
                                fill="none"
                                stroke={inputs['CP'] ? '#dc2626' : '#64748b'}
                                strokeWidth={4}
                            />
                        );
                    })()}

                  </g>
                );
              })}
              
              {/* Main CP Bus Line */}
              {(() => {
                  const startX = chipX + (chipWidth - (4 * 100 + 3 * 40)) / 2;
                  const lastBranchX = startX + 3 * (100 + 40) - 15;
                  const busY = chipY + 0.86 * chipHeight;
                  return (
                    <line 
                        x1={chipX} y1={busY} 
                        x2={lastBranchX} y2={busY} 
                        stroke={inputs['CP'] ? '#dc2626' : '#64748b'} 
                        strokeWidth={4} 
                    />
                  );
              })()}

            </g>
          ) : (
            <>
              <rect
                x={chipX}
                y={chipY}
                width={chipWidth}
                height={chipHeight}
                rx={12}
                fill="#ffffff"
                stroke="#000000"
                strokeWidth={4}
              />
              {/* Chip Notch */}
              <path d={`M ${chipX + chipWidth/2 - 15} ${chipY} A 15 15 0 0 0 ${chipX + chipWidth/2 + 15} ${chipY}`} fill="#ffffff" stroke="#000000" strokeWidth={4} />
              
              <text x={width/2} y={height/2} textAnchor="middle" fill="#000000" fontSize="36" fontWeight="900" letterSpacing="2">
                {chip.name}
              </text>
              <text x={width/2} y={height/2 + 40} textAnchor="middle" fill="#000000" fontSize="18" fontFamily="monospace" fontWeight="bold">
                74LS SERIES
              </text>
            </>
          )}

          {/* Pins and Wires */}
          {chip.pins.map(pin => {
            // Calculate pin position
            let px = 0, py = 0;
            let tx = 0, ty = 0; // Text position
            let wx = 0, wy = 0; // Wire end position (switch/led)

            if (pin.side === 'left') {
              px = chipX;
              py = chipY + pin.y * chipHeight;
              tx = px + 15;
              ty = py + 6;
              wx = 140;
              wy = py;
            } else if (pin.side === 'right') {
              px = chipX + chipWidth;
              py = chipY + pin.y * chipHeight;
              tx = px - 15;
              ty = py + 6;
              wx = width - 80;
              wy = py;
            } else if (pin.side === 'top') {
              px = chipX + pin.x * chipWidth;
              py = chipY;
              tx = px;
              ty = py + 25;
              wx = px;
              wy = chipY - 50;
            } else if (pin.side === 'bottom') {
              px = chipX + pin.x * chipWidth;
              py = chipY + chipHeight;
              tx = px;
              ty = py - 15;
              wx = px;
              wy = height - 60;
            }

            const isHigh = pin.type === 'output' ? outputs[pin.id] : inputs[pin.id];
            const wireColor = isHigh ? (pin.type === 'clock' ? '#dc2626' : '#1d4ed8') : '#64748b';
            // No glow filter for high contrast

            return (
              <g key={pin.id}>
                {/* Wire */}
                <line 
                    x1={px} y1={py} x2={wx} y2={wy} 
                    stroke={wireColor} 
                    strokeWidth={4} 
                />
                
                {/* Pin Circle on Chip */}
                <circle cx={px} cy={py} r={6} fill="#ffffff" stroke="#000000" strokeWidth={3} />
                
                {/* Pin Label */}
                {!isShiftReg && (
                <text 
                    x={tx} 
                    y={ty} 
                    textAnchor={pin.side === 'right' ? 'end' : (pin.side === 'left' ? 'start' : 'middle')} 
                    fill="#000000" 
                    fontSize="16"
                    fontWeight="900"
                    fontFamily="monospace"
                    textDecoration={pin.activeLow ? "overline" : "none"}
                >
                  {pin.label}
                </text>
                )}

                {/* Input Switch or Output LED */}
                {(pin.type === 'input' || pin.type === 'clock') && (
                  <g 
                    onClick={() => pin.type !== 'clock' && toggleInput(pin.id)} 
                    className={pin.type !== 'clock' ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
                  >
                    {/* Switch Body */}
                    <rect 
                        x={wx - 24} 
                        y={wy - 14} 
                        width={48} 
                        height={28} 
                        rx={14} 
                        fill={isHigh ? '#1d4ed8' : '#e2e8f0'} 
                        stroke={isHigh ? '#1e40af' : '#64748b'}
                        strokeWidth={3}
                        className="transition-colors duration-300"
                    />
                    {/* Switch Knob */}
                    <circle 
                        cx={isHigh ? wx + 10 : wx - 10} 
                        cy={wy} 
                        r={10} 
                        fill={isHigh ? '#ffffff' : '#64748b'}
                        stroke="#000000"
                        strokeWidth={1}
                        className="transition-all duration-300"
                    />
                    
                    {/* Label for switch */}
                    <text 
                        x={pin.side === 'left' ? wx - 40 : (pin.side === 'right' ? wx + 40 : wx)} 
                        y={pin.side === 'left' || pin.side === 'right' ? wy + 5 : (pin.side === 'bottom' ? wy + 32 : wy - 22)} 
                        textAnchor={pin.side === 'left' ? "end" : (pin.side === 'right' ? "start" : "middle")} 
                        fill="#000000" 
                        fontSize="14" 
                        fontWeight="bold"
                        fontFamily="monospace"
                    >
                        {pin.label}
                    </text>
                  </g>
                )}

                {pin.type === 'output' && (
                  <g>
                    {/* LED Body */}
                    <circle cx={wx} cy={wy} r={10} fill={isHigh ? '#dc2626' : '#cbd5e1'} stroke="#000000" strokeWidth={3} />
                    
                    {/* LED Reflection */}
                    <circle cx={wx - 3} cy={wy - 3} r={3} fill="white" opacity={isHigh ? 0.9 : 0.5} />

                    <text 
                        x={pin.side === 'left' ? wx - 30 : (pin.side === 'right' ? wx + 30 : wx)} 
                        y={pin.side === 'left' || pin.side === 'right' ? wy + 5 : (pin.side === 'bottom' ? wy + 32 : wy - 22)} 
                        textAnchor={pin.side === 'left' ? "end" : (pin.side === 'right' ? "start" : "middle")} 
                        fill="#000000" 
                        fontSize="14" 
                        fontWeight="bold"
                        fontFamily="monospace"
                    >
                        {pin.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
            </svg>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex gap-6">
        {chip.pins.some(p => p.type === 'clock') && (
            <button 
                onClick={pulseCP}
                className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full border-2 border-rose-800 transition-all transform hover:scale-105 active:scale-95"
            >
                CP 脉冲
            </button>
        )}
        <button 
            onClick={resetChip}
            className="px-8 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-full border-2 border-slate-950 transition-all transform hover:scale-105 active:scale-95"
        >
            复位 (Reset)
        </button>
      </div>
      
      <div className="mt-6 text-base text-slate-900 font-bold font-mono">
        // 点击开关切换状态 (0/1) // 红色LED代表高电平
      </div>
    </div>
  );
}
