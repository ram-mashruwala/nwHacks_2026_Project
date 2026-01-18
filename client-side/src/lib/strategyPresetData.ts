import type { OptionLeg } from '@/lib/options';

export interface PresetConfig {
  name: string;
  description: string;
  legs: OptionLeg[];
}

export function getPresets(basePrice: number = 100): PresetConfig[] {
  return [
    {
      name: 'Long Call',
      description: 'Bullish, unlimited upside',
      legs: [{ type: 'call', position: 'long', strike: basePrice, premium: 5, quantity: 1 }],
    },
    {
      name: 'Long Put',
      description: 'Bearish, profit on decline',
      legs: [{ type: 'put', position: 'long', strike: basePrice, premium: 5, quantity: 1 }],
    },
    {
      name: 'Covered Call',
      description: 'Income on existing stock',
      legs: [
        { type: 'stock', position: 'long', strike: basePrice, premium: 0, quantity: 1 },
        { type: 'call', position: 'short', strike: basePrice + 10, premium: 3, quantity: 1 },
      ],
    },
    {
      name: 'Long Straddle',
      description: 'Profit from volatility',
      legs: [
        { type: 'call', position: 'long', strike: basePrice, premium: 5, quantity: 1 },
        { type: 'put', position: 'long', strike: basePrice, premium: 5, quantity: 1 },
      ],
    },
    {
      name: 'Short Straddle',
      description: 'Profit from stability',
      legs: [
        { type: 'call', position: 'short', strike: basePrice, premium: 5, quantity: 1 },
        { type: 'put', position: 'short', strike: basePrice, premium: 5, quantity: 1 },
      ],
    },
    {
      name: 'Long Strangle',
      description: 'Cheaper volatility bet',
      legs: [
        { type: 'put', position: 'long', strike: basePrice - 10, premium: 3, quantity: 1 },
        { type: 'call', position: 'long', strike: basePrice + 10, premium: 3, quantity: 1 },
      ],
    },
    {
      name: 'Bull Call Spread',
      description: 'Limited risk bullish',
      legs: [
        { type: 'call', position: 'long', strike: basePrice, premium: 5, quantity: 1 },
        { type: 'call', position: 'short', strike: basePrice + 10, premium: 2, quantity: 1 },
      ],
    },
    {
      name: 'Bear Put Spread',
      description: 'Limited risk bearish',
      legs: [
        { type: 'put', position: 'long', strike: basePrice, premium: 5, quantity: 1 },
        { type: 'put', position: 'short', strike: basePrice - 10, premium: 2, quantity: 1 },
      ],
    },
    {
      name: 'Iron Condor',
      description: 'Range-bound profit',
      legs: [
        { type: 'put', position: 'long', strike: basePrice - 20, premium: 1, quantity: 1 },
        { type: 'put', position: 'short', strike: basePrice - 10, premium: 2.5, quantity: 1 },
        { type: 'call', position: 'short', strike: basePrice + 10, premium: 2.5, quantity: 1 },
        { type: 'call', position: 'long', strike: basePrice + 20, premium: 1, quantity: 1 },
      ],
    },
    {
      name: 'Iron Butterfly',
      description: 'Pinpoint stability bet',
      legs: [
        { type: 'put', position: 'long', strike: basePrice - 10, premium: 2, quantity: 1 },
        { type: 'put', position: 'short', strike: basePrice, premium: 5, quantity: 1 },
        { type: 'call', position: 'short', strike: basePrice, premium: 5, quantity: 1 },
        { type: 'call', position: 'long', strike: basePrice + 10, premium: 2, quantity: 1 },
      ],
    },
  ];
}
