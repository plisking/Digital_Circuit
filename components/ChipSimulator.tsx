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
  const width = 900; // Increased width
  const height = 700; // Increased height
  const chipWidth = 260; // Wider chip
  const chipHeight = 450; // Taller chip to spread pins
  const chipX = (width - chipWidth) / 2;
  const chipY = (height - chipHeight) / 2;

  return (
    <div className="flex flex-col items-center w-full h-full bg-white text-gray-900 p-4">
      <div className="mb-4 text-center">
        <h2 className="text-3xl font-bold text-blue-600">{chip.name}</h2>
        <p className="text-gray-600 text-lg">{chip.description}</p>
      </div>

      <div className="relative bg-white rounded-lg shadow-xl border-2 border-gray-200 overflow-hidden">
        <svg width={width} height={height} className="select-none font-sans">
          {/* Chip Body */}
          <rect
            x={chipX}
            y={chipY}
            width={chipWidth}
            height={chipHeight}
            rx={10}
            fill="#ffffff"
            stroke="#000000"
            strokeWidth={4}
          />
          <text x={width/2} y={height/2} textAnchor="middle" fill="#000000" fontSize="32" fontWeight="bold">
            {chip.name}
          </text>

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
              wx = 80;
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
              wy = 60;
            } else if (pin.side === 'bottom') {
              px = chipX + pin.x * chipWidth;
              py = chipY + chipHeight;
              tx = px;
              ty = py - 15;
              wx = px;
              wy = height - 60;
            }

            const isHigh = pin.type === 'output' ? outputs[pin.id] : inputs[pin.id];
            const color = isHigh ? '#ef4444' : '#000000'; 
            const wireColor = isHigh ? '#ef4444' : '#333333';

            return (
              <g key={pin.id}>
                {/* Wire */}
                <line x1={px} y1={py} x2={wx} y2={wy} stroke={wireColor} strokeWidth={3} />
                
                {/* Pin Circle on Chip */}
                <circle cx={px} cy={py} r={5} fill="#ffffff" stroke="#000000" strokeWidth={2} />
                
                {/* Pin Label */}
                <text 
                    x={tx} 
                    y={ty} 
                    textAnchor={pin.side === 'right' ? 'end' : (pin.side === 'left' ? 'start' : 'middle')} 
                    fill="#000000" 
                    fontSize="16"
                    fontWeight="bold"
                    textDecoration={pin.activeLow ? "overline" : "none"}
                >
                  {pin.label}
                </text>

                {/* Input Switch or Output LED */}
                {(pin.type === 'input' || pin.type === 'clock') && (
                  <g 
                    onClick={() => pin.type !== 'clock' && toggleInput(pin.id)} 
                    className={pin.type !== 'clock' ? "cursor-pointer hover:opacity-80" : ""}
                  >
                    <rect 
                        x={wx - 20} 
                        y={wy - 12} 
                        width={40} 
                        height={24} 
                        rx={4} 
                        fill={isHigh ? '#3b82f6' : '#e2e8f0'} 
                        stroke="#64748b"
                        strokeWidth={2}
                    />
                    <text x={wx} y={wy + 5} textAnchor="middle" fill={isHigh ? 'white' : 'black'} fontSize="14" fontWeight="bold">
                        {isHigh ? '1' : '0'}
                    </text>
                    {/* Label for switch */}
                    <text 
                        x={wx} 
                        y={pin.side === 'bottom' ? wy + 28 : wy - 18} 
                        textAnchor="middle" 
                        fill="#475569" 
                        fontSize="14" 
                        fontWeight="bold"
                    >
                        {pin.label}
                    </text>
                  </g>
                )}

                {pin.type === 'output' && (
                  <g>
                    <circle cx={wx} cy={wy} r={10} fill={isHigh ? '#ef4444' : '#e2e8f0'} stroke="#64748b" strokeWidth={2} />
                    <text x={wx} y={wy - 18} textAnchor="middle" fill="#475569" fontSize="14" fontWeight="bold">
                        {pin.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Controls */}
      <div className="mt-6 flex gap-4">
        {chip.pins.some(p => p.type === 'clock') && (
            <button 
                onClick={pulseCP}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded shadow transition"
            >
                CP 脉冲
            </button>
        )}
        <button 
            onClick={resetChip}
            className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded shadow transition"
        >
            复位 (Reset)
        </button>
      </div>
      
      <div className="mt-4 text-sm text-slate-500">
        点击左侧/底部开关切换输入状态 (0/1)。红色代表高电平/亮灯。
      </div>
    </div>
  );
}
