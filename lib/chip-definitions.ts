
export type PinType = 'input' | 'output' | 'power' | 'ground' | 'clock';

export interface Pin {
  id: string;
  label: string;
  type: PinType;
  x: number; // Relative position 0-1 or absolute
  y: number;
  side: 'left' | 'right' | 'top' | 'bottom';
  activeLow?: boolean;
}

export interface ChipDef {
  id: string;
  name: string;
  description: string;
  pins: Pin[];
  logic: (inputs: Record<string, boolean>, state: any) => { outputs: Record<string, boolean>; nextState: any };
  initialState: any;
}

// Helper to create standard DIP pins
const createDipPins = (count: number, names: string[], types: PinType[]) => {
  const pins: Pin[] = [];
  const half = count / 2;
  for (let i = 0; i < count; i++) {
    const isLeft = i < half;
    const index = isLeft ? i : count - 1 - (i - half); // Standard DIP numbering 1..N counter-clockwise
    // But for visual simplicity, we might just list them left/right.
    // Let's stick to visual left/right for the simulator, not necessarily physical pinout, 
    // unless the user wants physical pinout. The user said "logic diagram", so functional layout is better.
    // However, "show pin functions" implies we should probably show them somewhat logically.
    // Let's define them manually for best layout.
  }
  return pins;
};

export const chips: ChipDef[] = [
  {
    id: '74LS148',
    name: '74LS148',
    description: '8线-3线优先编码器',
    initialState: {},
    pins: [
      // Inputs Left
      { id: 'I0', label: '0', type: 'input', x: 0, y: 0.1, side: 'left', activeLow: true },
      { id: 'I1', label: '1', type: 'input', x: 0, y: 0.2, side: 'left', activeLow: true },
      { id: 'I2', label: '2', type: 'input', x: 0, y: 0.3, side: 'left', activeLow: true },
      { id: 'I3', label: '3', type: 'input', x: 0, y: 0.4, side: 'left', activeLow: true },
      { id: 'I4', label: '4', type: 'input', x: 0, y: 0.5, side: 'left', activeLow: true },
      { id: 'I5', label: '5', type: 'input', x: 0, y: 0.6, side: 'left', activeLow: true },
      { id: 'I6', label: '6', type: 'input', x: 0, y: 0.7, side: 'left', activeLow: true },
      { id: 'I7', label: '7', type: 'input', x: 0, y: 0.8, side: 'left', activeLow: true },
      { id: 'EI', label: 'EI', type: 'input', x: 0, y: 0.9, side: 'left', activeLow: true },
      // Outputs Right
      { id: 'A2', label: 'A2', type: 'output', x: 1, y: 0.3, side: 'right', activeLow: true },
      { id: 'A1', label: 'A1', type: 'output', x: 1, y: 0.4, side: 'right', activeLow: true },
      { id: 'A0', label: 'A0', type: 'output', x: 1, y: 0.5, side: 'right', activeLow: true },
      { id: 'GS', label: 'GS', type: 'output', x: 1, y: 0.7, side: 'right', activeLow: true },
      { id: 'EO', label: 'EO', type: 'output', x: 1, y: 0.8, side: 'right', activeLow: true },
    ],
    logic: (inputs, state) => {
      const EI = inputs['EI']; // Active Low: true means LOW (active) if we simulate voltage? 
      // Let's assume boolean true = High Voltage (1), false = Low Voltage (0).
      // Active Low means 0 is active.
      
      // If EI is High (1), chip is disabled.
      if (EI) {
        return {
          outputs: { A2: true, A1: true, A0: true, GS: true, EO: true }, // All High (inactive)
          nextState: state
        };
      }

      // EI is Low (0), chip enabled.
      // Check inputs I7 down to I0.
      let activeInput = -1;
      for (let i = 7; i >= 0; i--) {
        if (!inputs[`I${i}`]) { // If Input is Low (0)
          activeInput = i;
          break;
        }
      }

      if (activeInput === -1) {
        // No inputs active
        return {
          outputs: { A2: true, A1: true, A0: true, GS: true, EO: false }, // EO Low (active) to signal no inputs but enabled
          nextState: state
        };
      }

      // Encode activeInput
      const a2 = !((activeInput >> 2) & 1);
      const a1 = !((activeInput >> 1) & 1);
      const a0 = !(activeInput & 1);

      return {
        outputs: { A2: a2, A1: a1, A0: a0, GS: false, EO: true }, // GS Low (active), EO High
        nextState: state
      };
    }
  },
  {
    id: '74LS138',
    name: '74LS138',
    description: '3线-8线译码器',
    initialState: {},
    pins: [
      { id: 'A', label: 'A', type: 'input', x: 0, y: 0.2, side: 'left' },
      { id: 'B', label: 'B', type: 'input', x: 0, y: 0.3, side: 'left' },
      { id: 'C', label: 'C', type: 'input', x: 0, y: 0.4, side: 'left' },
      { id: 'G1', label: 'G1', type: 'input', x: 0, y: 0.6, side: 'left' },
      { id: 'G2A', label: 'G2A', type: 'input', x: 0, y: 0.7, side: 'left', activeLow: true },
      { id: 'G2B', label: 'G2B', type: 'input', x: 0, y: 0.8, side: 'left', activeLow: true },
      
      { id: 'Y0', label: 'Y0', type: 'output', x: 1, y: 0.1, side: 'right', activeLow: true },
      { id: 'Y1', label: 'Y1', type: 'output', x: 1, y: 0.2, side: 'right', activeLow: true },
      { id: 'Y2', label: 'Y2', type: 'output', x: 1, y: 0.3, side: 'right', activeLow: true },
      { id: 'Y3', label: 'Y3', type: 'output', x: 1, y: 0.4, side: 'right', activeLow: true },
      { id: 'Y4', label: 'Y4', type: 'output', x: 1, y: 0.5, side: 'right', activeLow: true },
      { id: 'Y5', label: 'Y5', type: 'output', x: 1, y: 0.6, side: 'right', activeLow: true },
      { id: 'Y6', label: 'Y6', type: 'output', x: 1, y: 0.7, side: 'right', activeLow: true },
      { id: 'Y7', label: 'Y7', type: 'output', x: 1, y: 0.8, side: 'right', activeLow: true },
    ],
    logic: (inputs, state) => {
      const G1 = inputs['G1'];
      const G2A = inputs['G2A'];
      const G2B = inputs['G2B'];
      
      // Enable condition: G1=1, G2A=0, G2B=0
      const enabled = G1 && !G2A && !G2B;
      
      const outputs: Record<string, boolean> = {};
      for(let i=0; i<8; i++) outputs[`Y${i}`] = true; // Default High (inactive)

      if (enabled) {
        const A = inputs['A'] ? 1 : 0;
        const B = inputs['B'] ? 1 : 0;
        const C = inputs['C'] ? 1 : 0;
        const idx = A + B*2 + C*4;
        outputs[`Y${idx}`] = false; // Active Low
      }
      
      return { outputs, nextState: state };
    }
  },
  {
    id: '74LS151',
    name: '74LS151',
    description: '8选1数据选择器',
    initialState: {},
    pins: [
      { id: 'D0', label: 'D0', type: 'input', x: 0, y: 0.1, side: 'left' },
      { id: 'D1', label: 'D1', type: 'input', x: 0, y: 0.2, side: 'left' },
      { id: 'D2', label: 'D2', type: 'input', x: 0, y: 0.3, side: 'left' },
      { id: 'D3', label: 'D3', type: 'input', x: 0, y: 0.4, side: 'left' },
      { id: 'D4', label: 'D4', type: 'input', x: 0, y: 0.5, side: 'left' },
      { id: 'D5', label: 'D5', type: 'input', x: 0, y: 0.6, side: 'left' },
      { id: 'D6', label: 'D6', type: 'input', x: 0, y: 0.7, side: 'left' },
      { id: 'D7', label: 'D7', type: 'input', x: 0, y: 0.8, side: 'left' },
      { id: 'A', label: 'A', type: 'input', x: 0.3, y: 0.95, side: 'bottom' },
      { id: 'B', label: 'B', type: 'input', x: 0.5, y: 0.95, side: 'bottom' },
      { id: 'C', label: 'C', type: 'input', x: 0.7, y: 0.95, side: 'bottom' },
      { id: 'S', label: 'S', type: 'input', x: 0.1, y: 0.95, side: 'bottom', activeLow: true },
      { id: 'Y', label: 'Y', type: 'output', x: 1, y: 0.4, side: 'right' },
      { id: 'W', label: 'W', type: 'output', x: 1, y: 0.6, side: 'right', activeLow: true },
    ],
    logic: (inputs, state) => {
      const S = inputs['S'];
      if (S) { // Disabled (S is active low)
        return { outputs: { Y: false, W: true }, nextState: state };
      }
      const idx = (inputs['A']?1:0) + (inputs['B']?2:0) + (inputs['C']?4:0);
      const val = inputs[`D${idx}`];
      return { outputs: { Y: val, W: !val }, nextState: state };
    }
  },
  {
    id: '74LS283',
    name: '74LS283',
    description: '4位二进制全加器',
    initialState: {},
    pins: [
      { id: 'C0', label: 'C0', type: 'input', x: 0.5, y: 0.9, side: 'bottom' },
      { id: 'A0', label: 'A0', type: 'input', x: 0, y: 0.1, side: 'left' },
      { id: 'A1', label: 'A1', type: 'input', x: 0, y: 0.2, side: 'left' },
      { id: 'A2', label: 'A2', type: 'input', x: 0, y: 0.3, side: 'left' },
      { id: 'A3', label: 'A3', type: 'input', x: 0, y: 0.4, side: 'left' },
      { id: 'B0', label: 'B0', type: 'input', x: 0, y: 0.6, side: 'left' },
      { id: 'B1', label: 'B1', type: 'input', x: 0, y: 0.7, side: 'left' },
      { id: 'B2', label: 'B2', type: 'input', x: 0, y: 0.8, side: 'left' },
      { id: 'B3', label: 'B3', type: 'input', x: 0, y: 0.9, side: 'left' },
      
      { id: 'S0', label: 'S0', type: 'output', x: 1, y: 0.2, side: 'right' },
      { id: 'S1', label: 'S1', type: 'output', x: 1, y: 0.4, side: 'right' },
      { id: 'S2', label: 'S2', type: 'output', x: 1, y: 0.6, side: 'right' },
      { id: 'S3', label: 'S3', type: 'output', x: 1, y: 0.8, side: 'right' },
      { id: 'C4', label: 'C4', type: 'output', x: 0.5, y: 0.1, side: 'top' },
    ],
    logic: (inputs, state) => {
      const a = (inputs['A0']?1:0) + (inputs['A1']?2:0) + (inputs['A2']?4:0) + (inputs['A3']?8:0);
      const b = (inputs['B0']?1:0) + (inputs['B1']?2:0) + (inputs['B2']?4:0) + (inputs['B3']?8:0);
      const c0 = inputs['C0'] ? 1 : 0;
      
      const sum = a + b + c0;
      
      return {
        outputs: {
          S0: !!(sum & 1), S1: !!(sum & 2), S2: !!(sum & 4), S3: !!(sum & 8),
          C4: !!(sum & 16)
        },
        nextState: state
      };
    }
  },
  {
    id: '74LS90',
    name: '74LS90',
    description: '二-五-十进制计数器 (支持8421/5421配置)',
    initialState: { q0: 0, q1: 0, q2: 0, q3: 0, lastCP0: false, lastCP1: false },
    pins: [
      { id: 'CP0', label: 'CP0', type: 'clock', x: 0, y: 0.2, side: 'left' },
      { id: 'CP1', label: 'CP1', type: 'clock', x: 0, y: 0.3, side: 'left' },
      { id: 'MR1', label: 'R0(1)', type: 'input', x: 0, y: 0.5, side: 'left' },
      { id: 'MR2', label: 'R0(2)', type: 'input', x: 0, y: 0.6, side: 'left' },
      { id: 'MS1', label: 'R9(1)', type: 'input', x: 0, y: 0.7, side: 'left' },
      { id: 'MS2', label: 'R9(2)', type: 'input', x: 0, y: 0.8, side: 'left' },
      
      { id: 'Q0', label: 'QA', type: 'output', x: 1, y: 0.2, side: 'right' },
      { id: 'Q1', label: 'QB', type: 'output', x: 1, y: 0.4, side: 'right' },
      { id: 'Q2', label: 'QC', type: 'output', x: 1, y: 0.6, side: 'right' },
      { id: 'Q3', label: 'QD', type: 'output', x: 1, y: 0.8, side: 'right' },

      // Configuration Switches
      { id: 'SW_QA_CP1', label: 'QA->CP1', type: 'input', x: 0.3, y: 0.95, side: 'bottom' },
      { id: 'SW_QD_CP0', label: 'QD->CP0', type: 'input', x: 0.7, y: 0.95, side: 'bottom' },
    ],
    logic: (inputs, state) => {
      let { q0, q1, q2, q3, lastCP0, lastCP1 } = state;
      if (lastCP0 === undefined) lastCP0 = false;
      if (lastCP1 === undefined) lastCP1 = false;

      const cp0 = inputs['CP0'];
      const cp1 = inputs['CP1'];
      const mr1 = inputs['MR1'];
      const mr2 = inputs['MR2'];
      const ms1 = inputs['MS1'];
      const ms2 = inputs['MS2'];
      
      const linkQaCp1 = inputs['SW_QA_CP1'];
      const linkQdCp0 = inputs['SW_QD_CP0'];

      // Reset logic
      if (mr1 && mr2) {
        q0=0; q1=0; q2=0; q3=0;
      } else if (ms1 && ms2) {
        q0=1; q1=0; q2=0; q3=1; // Set to 9 (1001)
      } else {
        // Detect external edges
        const extCp0Fall = lastCP0 && !cp0;
        const extCp1Fall = lastCP1 && !cp1;

        let nextQ0 = q0;
        let nextQ1 = q1;
        let nextQ2 = q2;
        let nextQ3 = q3;

        // Helper for Mod-5 increment
        const incMod5 = (c1: number, c2: number, c3: number) => {
            const val = c1 + c2*2 + c3*4;
            let nextVal = val + 1;
            if (nextVal >= 5) nextVal = 0;
            return [nextVal & 1, (nextVal >> 1) & 1, (nextVal >> 2) & 1];
        };

        // Helper for Mod-2 increment
        const incMod2 = (c0: number) => c0 === 0 ? 1 : 0;

        // Determine triggers
        let trigMod2 = false;
        let trigMod5 = false;

        // 1. Check external triggers first
        if (!linkQdCp0 && extCp0Fall) trigMod2 = true;
        if (!linkQaCp1 && extCp1Fall) trigMod5 = true;

        // 2. Apply external triggers
        if (trigMod2) nextQ0 = incMod2(q0);
        if (trigMod5) [nextQ1, nextQ2, nextQ3] = incMod5(q1, q2, q3);

        // 3. Check ripple triggers (Internal connections)
        // If QA->CP1 is linked: Did Q0 fall?
        if (linkQaCp1) {
            // Check if Q0 went from 1 to 0
            if (q0 === 1 && nextQ0 === 0) {
                [nextQ1, nextQ2, nextQ3] = incMod5(nextQ1, nextQ2, nextQ3);
            }
        }

        // If QD->CP0 is linked: Did Q3 fall?
        if (linkQdCp0) {
            // Check if Q3 went from 1 to 0
            if (q3 === 1 && nextQ3 === 0) {
                nextQ0 = incMod2(nextQ0);
            }
        }
        
        q0 = nextQ0;
        q1 = nextQ1;
        q2 = nextQ2;
        q3 = nextQ3;
      }

      return {
        outputs: { Q0: q0===1, Q1: q1===1, Q2: q2===1, Q3: q3===1 },
        nextState: { q0, q1, q2, q3, lastCP0: cp0, lastCP1: cp1 }
      };
    }
  },
  {
    id: '74LS163',
    name: '74LS163',
    description: '4位二进制同步计数器',
    initialState: { val: 0, lastCP: false },
    pins: [
      { id: 'CP', label: 'CP', type: 'clock', x: 0, y: 0.1, side: 'left' },
      { id: 'MR', label: 'MR', type: 'input', x: 0, y: 0.2, side: 'left', activeLow: true },
      { id: 'PE', label: 'PE', type: 'input', x: 0, y: 0.3, side: 'left', activeLow: true },
      { id: 'CEP', label: 'CEP', type: 'input', x: 0, y: 0.4, side: 'left' },
      { id: 'CET', label: 'CET', type: 'input', x: 0, y: 0.5, side: 'left' },
      { id: 'P0', label: 'P0', type: 'input', x: 0, y: 0.6, side: 'left' },
      { id: 'P1', label: 'P1', type: 'input', x: 0, y: 0.7, side: 'left' },
      { id: 'P2', label: 'P2', type: 'input', x: 0, y: 0.8, side: 'left' },
      { id: 'P3', label: 'P3', type: 'input', x: 0, y: 0.9, side: 'left' },
      { id: 'Q0', label: 'Q0', type: 'output', x: 1, y: 0.2, side: 'right' },
      { id: 'Q1', label: 'Q1', type: 'output', x: 1, y: 0.3, side: 'right' },
      { id: 'Q2', label: 'Q2', type: 'output', x: 1, y: 0.4, side: 'right' },
      { id: 'Q3', label: 'Q3', type: 'output', x: 1, y: 0.5, side: 'right' },
      { id: 'TC', label: 'TC', type: 'output', x: 1, y: 0.7, side: 'right' },
    ],
    logic: (inputs, state) => {
      let { val, lastCP } = state;
      const cp = inputs['CP'];
      const mr = inputs['MR']; // Active Low Sync Reset? 163 is Sync Reset.
      const pe = inputs['PE']; // Active Low Load
      const cep = inputs['CEP'];
      const cet = inputs['CET'];
      
      // Rising edge
      if (!lastCP && cp) {
        if (!mr) {
          val = 0;
        } else if (!pe) {
          val = (inputs['P0']?1:0) + (inputs['P1']?2:0) + (inputs['P2']?4:0) + (inputs['P3']?8:0);
        } else if (cep && cet) {
          val = (val + 1) & 0xF;
        }
      }
      
      const tc = (val === 15) && cet;
      
      return {
        outputs: {
          Q0: !!(val & 1), Q1: !!(val & 2), Q2: !!(val & 4), Q3: !!(val & 8), TC: tc
        },
        nextState: { val, lastCP: cp }
      };
    }
  },
  {
    id: '74LS194',
    name: '74LS194',
    description: '4位双向移位寄存器 (支持循环移位)',
    initialState: { val: 0, lastCP: false },
    pins: [
      { id: 'CP', label: 'CP', type: 'clock', x: 0, y: 0.1, side: 'left' },
      { id: 'MR', label: 'MR', type: 'input', x: 0, y: 0.2, side: 'left', activeLow: true },
      { id: 'S1', label: 'S1', type: 'input', x: 0, y: 0.3, side: 'left' },
      { id: 'S0', label: 'S0', type: 'input', x: 0, y: 0.4, side: 'left' },
      { id: 'DSR', label: 'DSR', type: 'input', x: 0, y: 0.5, side: 'left' },
      { id: 'DSL', label: 'DSL', type: 'input', x: 0, y: 0.6, side: 'left' },
      { id: 'D0', label: 'D0', type: 'input', x: 0.2, y: 0.9, side: 'bottom' },
      { id: 'D1', label: 'D1', type: 'input', x: 0.4, y: 0.9, side: 'bottom' },
      { id: 'D2', label: 'D2', type: 'input', x: 0.6, y: 0.9, side: 'bottom' },
      { id: 'D3', label: 'D3', type: 'input', x: 0.8, y: 0.9, side: 'bottom' },
      { id: 'Q0', label: 'Q0', type: 'output', x: 1, y: 0.2, side: 'right' },
      { id: 'Q1', label: 'Q1', type: 'output', x: 1, y: 0.4, side: 'right' },
      { id: 'Q2', label: 'Q2', type: 'output', x: 1, y: 0.6, side: 'right' },
      { id: 'Q3', label: 'Q3', type: 'output', x: 1, y: 0.8, side: 'right' },

      // Configuration Switches
      { id: 'SW_Q3_DSR', label: 'Q3->DSR', type: 'input', x: 0.3, y: 0.1, side: 'top' },
      { id: 'SW_Q0_DSL', label: 'Q0->DSL', type: 'input', x: 0.7, y: 0.1, side: 'top' },
    ],
    logic: (inputs, state) => {
      let { val, lastCP } = state;
      const cp = inputs['CP'];
      const mr = inputs['MR'];
      const s1 = inputs['S1'];
      const s0 = inputs['S0'];
      
      const linkQ3Dsr = inputs['SW_Q3_DSR'];
      const linkQ0Dsl = inputs['SW_Q0_DSL'];

      if (!mr) { // Async Reset
        val = 0;
      } else if (!lastCP && cp) { // Rising Edge
        if (s1 && s0) { // Parallel Load
          val = (inputs['D0']?1:0) + (inputs['D1']?2:0) + (inputs['D2']?4:0) + (inputs['D3']?8:0);
        } else if (!s1 && s0) { // Shift Right (Q0 -> Q3 direction)
          // DSR feeds Q0 (LSB)
          let dsr = inputs['DSR'] ? 1 : 0;
          if (linkQ3Dsr) {
             // Circular: Q3 feeds DSR
             dsr = (val >> 3) & 1;
          }
          // Shift Left mathematically (<<) moves LSB to MSB (Visually Right)
          val = ((val << 1) & 0xF) | dsr;
        } else if (s1 && !s0) { // Shift Left (Q3 -> Q0 direction)
          // DSL feeds Q3 (MSB)
          let dsl = inputs['DSL'] ? 1 : 0;
          if (linkQ0Dsl) {
             // Circular: Q0 feeds DSL
             dsl = val & 1;
          }
          // Shift Right mathematically (>>) moves MSB to LSB (Visually Left)
          val = (val >> 1) | (dsl << 3);
        }
        // s1=0, s0=0 Hold
      }
      
      return {
        outputs: {
          Q0: !!(val & 1), Q1: !!(val & 2), Q2: !!(val & 4), Q3: !!(val & 8)
        },
        nextState: { val, lastCP: cp }
      };
    }
  },
  {
    id: 'shift-register-d',
    name: '移位寄存器 (D触发器)',
    description: '4级D触发器同步级联，展示数据移位',
    initialState: { val: 0, lastCP: false },
    pins: [
      { id: 'CP', label: 'CP', type: 'clock', x: 0, y: 0.86, side: 'left' },
      { id: 'D', label: 'Data In', type: 'input', x: 0, y: 0.36, side: 'left' },
      // Outputs distributed at bottom to match the internal stages
      // Shifted right to avoid overlapping with FF borders
      // FF Right Edges are approx at 0.233, 0.466, 0.7, 0.933
      // We move pins to approx 0.266, 0.5, 0.733, 0.966 (approx +20px)
      { id: 'Q0', label: 'Q0', type: 'output', x: 0.266, y: 0, side: 'top' },
      { id: 'Q1', label: 'Q1', type: 'output', x: 0.5, y: 0, side: 'top' },
      { id: 'Q2', label: 'Q2', type: 'output', x: 0.733, y: 0, side: 'top' },
      { id: 'Q3', label: 'Q3', type: 'output', x: 0.966, y: 0, side: 'top' },
    ],
    logic: (inputs, state) => {
      const cp = inputs['CP'];
      const d = inputs['D'];
      const lastCP = state.lastCP;
      let val = state.val;

      if (!lastCP && cp) { // Rising Edge
        // Shift: Q3=Q2, Q2=Q1, Q1=Q0, Q0=D
        // Data flows D -> Q0 -> Q1 -> Q2 -> Q3
        val = ((val << 1) & 0xF) | (d ? 1 : 0);
      }

      return {
        outputs: {
          Q0: !!(val & 1),
          Q1: !!(val & 2),
          Q2: !!(val & 4),
          Q3: !!(val & 8)
        },
        nextState: { val, lastCP: cp }
      };
    }
  }
];
