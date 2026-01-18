// Options calculation utilities

export type OptionType = 'call' | 'put' | 'stock';
export type PositionType = 'long' | 'short';

export interface OptionLeg {
  type: OptionType;
  position: PositionType;
  strike: number; // For stock, this is the purchase price
  premium: number; // For stock, this is 0
  quantity: number;
}

export interface OptionStrategy {
  name: string;
  introduction:string;
  legs: OptionLeg[];
}

export interface PayoffPoint {
  price: number;
  payoff: number;
}

export interface StrategyAnalysis {
  breakevens: number[];
  maxProfit: number | 'unlimited';
  maxLoss: number | 'unlimited';
  netPremium: number;
  payoffData: PayoffPoint[];
}

// Calculate payoff for a single option leg at a given underlying price
export function calculateLegPayoff(leg: OptionLeg, underlyingPrice: number): number {
  const { type, position, strike, premium, quantity } = leg;
  
  // Stock has linear payoff
  if (type === 'stock') {
    const multiplier = position === 'long' ? 1 : -1;
    return (underlyingPrice - strike) * multiplier * quantity * 100;
  }
  
  let intrinsicValue = 0;
  
  if (type === 'call') {
    intrinsicValue = Math.max(0, underlyingPrice - strike);
  } else {
    intrinsicValue = Math.max(0, strike - underlyingPrice);
  }
  
  const multiplier = position === 'long' ? 1 : -1;
  const premiumCost = position === 'long' ? -premium : premium;
  
  return (intrinsicValue * multiplier + premiumCost) * quantity * 100;
}

// Calculate total strategy payoff at a given price
export function calculateStrategyPayoff(legs: OptionLeg[], underlyingPrice: number): number {
  return legs.reduce((total, leg) => total + calculateLegPayoff(leg, underlyingPrice), 0);
}

// Generate payoff data points for charting
export function generatePayoffData(
  legs: OptionLeg[],
  minPrice?: number,
  maxPrice?: number,
  points: number = 100
): PayoffPoint[] {
  if (legs.length === 0) return [];
  
  const strikes = legs.map(l => l.strike);
  const avgStrike = strikes.reduce((a, b) => a + b, 0) / strikes.length;
  const range = Math.max(avgStrike * 0.5, 50);
  
  const min = minPrice ?? Math.max(0, avgStrike - range);
  const max = maxPrice ?? avgStrike + range;
  const step = (max - min) / points;
  
  const data: PayoffPoint[] = [];
  
  for (let i = 0; i <= points; i++) {
    const price = min + step * i;
    data.push({
      price: Math.round(price * 100) / 100,
      payoff: Math.round(calculateStrategyPayoff(legs, price) * 100) / 100,
    });
  }
  
  return data;
}

// Calculate net premium (positive = credit, negative = debit)
export function calculateNetPremium(legs: OptionLeg[]): number {
  return legs.reduce((total, leg) => {
    if (leg.type === 'stock') return total; // Stock has no premium
    const multiplier = leg.position === 'long' ? -1 : 1;
    return total + leg.premium * leg.quantity * 100 * multiplier;
  }, 0);
}

// Find breakeven points
export function findBreakevens(payoffData: PayoffPoint[]): number[] {
  const breakevens: number[] = [];
  
  for (let i = 1; i < payoffData.length; i++) {
    const prev = payoffData[i - 1];
    const curr = payoffData[i];
    
    // Check if payoff crosses zero
    if ((prev.payoff <= 0 && curr.payoff >= 0) || (prev.payoff >= 0 && curr.payoff <= 0)) {
      // Linear interpolation to find exact breakeven
      const ratio = Math.abs(prev.payoff) / (Math.abs(prev.payoff) + Math.abs(curr.payoff));
      const breakeven = prev.price + (curr.price - prev.price) * ratio;
      breakevens.push(Math.round(breakeven * 100) / 100);
    }
  }
  
  return breakevens;
}

// Analyze a complete strategy
export function analyzeStrategy(legs: OptionLeg[]): StrategyAnalysis {
  if (legs.length === 0) {
    return {
      breakevens: [],
      maxProfit: 0,
      maxLoss: 0,
      netPremium: 0,
      payoffData: [],
    };
  }
  
  const payoffData = generatePayoffData(legs);
  const breakevens = findBreakevens(payoffData);
  const netPremium = calculateNetPremium(legs);
  
  const payoffs = payoffData.map(p => p.payoff);
  const maxPayoff = Math.max(...payoffs);
  const minPayoff = Math.min(...payoffs);
  
  // Check if profit/loss is unlimited (at edges of range)
  const firstPayoff = payoffs[0];
  const lastPayoff = payoffs[payoffs.length - 1];
  const edgeTolerance = 100; // Consider unlimited if still changing at edges
  
  const hasUnlimitedProfit = 
    (maxPayoff === firstPayoff && Math.abs(firstPayoff - payoffs[5]) > edgeTolerance) ||
    (maxPayoff === lastPayoff && Math.abs(lastPayoff - payoffs[payoffs.length - 6]) > edgeTolerance);
    
  const hasUnlimitedLoss =
    (minPayoff === firstPayoff && Math.abs(firstPayoff - payoffs[5]) > edgeTolerance) ||
    (minPayoff === lastPayoff && Math.abs(lastPayoff - payoffs[payoffs.length - 6]) > edgeTolerance);
  
  return {
    breakevens,
    maxProfit: hasUnlimitedProfit ? 'unlimited' : maxPayoff,
    maxLoss: hasUnlimitedLoss ? 'unlimited' : Math.abs(minPayoff),
    netPremium,
    payoffData,
  };
}

// Preset strategies
export const presetStrategies = {
  longCall: (strike: number, premium: number): OptionStrategy => ({
    name: 'Long Call',
    introduction:' A long call is an options strategy where a trader buys a call option to gain the right, but not the obligation, to buy a stock at a fixed price called the strike price before a certain expiration date. The trader pays a premium upfront, which is the maximum possible loss. This strategy is used when the trader expects the stock price to rise. If the stock price stays below the strike price at expiration, the option expires worthless and the loss is limited to the premium. If the stock price rises above the strike price, the trader can profit, with the break-even point being the strike price plus the premium paid and the potential profit theoretically unlimited.',
    legs: [{ type: 'call', position: 'long', strike, premium, quantity: 1 }],
  }),
  
  longPut: (strike: number, premium: number): OptionStrategy => ({
    name: 'Long Put',
    introduction:'A long put is an options strategy where a trader buys a put option to gain the right, but not the obligation, to sell a stock at a fixed price called the strike price before a certain expiration date. The trader pays a premium upfront, which is the maximum possible loss. This strategy is used when the trader expects the stock price to fall. If the stock price stays above the strike price at expiration, the option expires worthless and the loss is limited to the premium. If the stock price falls below the strike price, the trader can profit, with the break-even point being the strike price minus the premium paid and the potential profit increasing as the stock price drops.',
    legs: [{ type: 'put', position: 'long', strike, premium, quantity: 1 }],
  }),
  
  shortCall: (strike: number, premium: number): OptionStrategy => ({
    name: 'Short Call',
    introduction:'A short call is an options strategy where a trader sells a call option and receives a premium upfront, taking on the obligation to sell a stock at the strike price if the buyer chooses to exercise the option before expiration. This strategy is used when the trader expects the stock price to stay below the strike price or fall. If the stock price stays at or below the strike price at expiration, the option expires worthless and the trader keeps the premium as profit. If the stock price rises above the strike price, the trader may face losses because they must sell the stock at the lower strike price, with potential losses theoretically unlimited, making short calls a higher-risk strategy for new traders.',
    legs: [{ type: 'call', position: 'short', strike, premium, quantity: 1 }],
  }),
  
  shortPut: (strike: number, premium: number): OptionStrategy => ({
    name: 'Short Put',
    introduction:'A short put is an options strategy where a trader sells a put option and receives a premium upfront, taking on the obligation to buy a stock at the strike price if the buyer chooses to exercise the option before expiration. This strategy is used when the trader expects the stock price to stay above the strike price or rise. If the stock price stays at or above the strike price at expiration, the option expires worthless and the trader keeps the premium as profit. If the stock price falls below the strike price, the trader must buy the stock at the higher strike price, which can lead to losses, with the maximum loss occurring if the stock falls to zero.',
    legs: [{ type: 'put', position: 'short', strike, premium, quantity: 1 }],
  }),
  
  longStraddle: (strike: number, callPremium: number, putPremium: number): OptionStrategy => ({
    name: 'Long Straddle',
    introduction:'A long straddle options strategy involves simultaneously buying a call option and a put option on the same underlying asset with the same strike price and expiry date. It becomes profitable when the stock significantly shifts in one direction or another. A significant enough shift in either direction is enough to cover the premiums paid for the options and realize a profit. When to use it: When investors believe the underlying assets price will move significantly out of a specific range but are unsure of which direction it will go. Risk vs. profit: Theoretical chance at unlimited gains. Maximum loss is limited to the cost of both options contracts.',
    legs: [
      { type: 'call', position: 'long', strike, premium: callPremium, quantity: 1 },
      { type: 'put', position: 'long', strike, premium: putPremium, quantity: 1 },
    ],
  }),
  
  shortStraddle: (strike: number, callPremium: number, putPremium: number): OptionStrategy => ({
    name: 'Short Straddle',
    introduction:'A short straddle is an options strategy where a trader sells a call option and a put option on the same stock, with the same strike price and expiration date, and collects two premiums upfront. This strategy is used when the trader expects the stock price to stay close to the strike price and not move much before expiration. The maximum profit is the total premium received if the stock price ends exactly at the strike price at expiration. If the stock makes a large move up or down, losses can grow quickly, with risk being very high and theoretically unlimited on the upside and substantial on the downside, making short straddles risky, especially for new traders.',
    legs: [
      { type: 'call', position: 'short', strike, premium: callPremium, quantity: 1 },
      { type: 'put', position: 'short', strike, premium: putPremium, quantity: 1 },
    ],
  }),
  
  longStrangle: (putStrike: number, callStrike: number, putPremium: number, callPremium: number): OptionStrategy => ({
    name: 'Long Strangle',
    introduction:'A long strangle is an options strategy where a trader buys a call option and a put option on the same stock, with the same expiration date but different strike prices, typically an out-of-the-money call and an out-of-the-money put. This strategy is used when the trader expects a big price move but is unsure of the direction. The maximum loss is limited to the total premium paid for both options. If the stock moves sharply up or down, one option can become profitable enough to outweigh the cost of both, with break-even points above the call strike plus total premium and below the put strike minus total premium.',
    legs: [
      { type: 'put', position: 'long', strike: putStrike, premium: putPremium, quantity: 1 },
      { type: 'call', position: 'long', strike: callStrike, premium: callPremium, quantity: 1 },
    ],
  }),
  
  shortStrangle: (putStrike: number, callStrike: number, putPremium: number, callPremium: number): OptionStrategy => ({
    name: 'Short Strangle',
    introduction:'A short strangle is an options strategy where a trader sells an out-of-the-money call and an out-of-the-money put on the same stock, with the same expiration date, and collects two premiums upfront. This strategy is used when the trader expects the stock price to stay within a range and not make a large move. The maximum profit is the total premium received if the stock price stays between the two strike prices at expiration. If the stock moves strongly up or down, losses can be large, with upside risk theoretically unlimited and downside risk substantial, making short strangles a high-risk strategy for new traders.',
    legs: [
      { type: 'put', position: 'short', strike: putStrike, premium: putPremium, quantity: 1 },
      { type: 'call', position: 'short', strike: callStrike, premium: callPremium, quantity: 1 },
    ],
  }),
  
  bullCallSpread: (lowerStrike: number, upperStrike: number, longPremium: number, shortPremium: number): OptionStrategy => ({
    name: 'Bull Call Spread',
    introduction:'A bull call spread is an options strategy where a trader buys a call option at a lower strike price and sells another call option at a higher strike price, both with the same expiration date. This strategy is used when the trader expects the stock price to rise moderately. The upfront cost is reduced compared to buying a single call because the premium received from selling the higher-strike call helps offset the cost. The maximum profit is capped at the difference between the two strike prices minus the net premium paid, while the maximum loss is limited to the net premium paid if the stock stays below the lower strike price at expiration.',
    legs: [
      { type: 'call', position: 'long', strike: lowerStrike, premium: longPremium, quantity: 1 },
      { type: 'call', position: 'short', strike: upperStrike, premium: shortPremium, quantity: 1 },
    ],
  }),
  
  bearPutSpread: (upperStrike: number, lowerStrike: number, longPremium: number, shortPremium: number): OptionStrategy => ({
    name: 'Bear Put Spread',
    introduction:'A bear put spread is an options strategy where a trader buys a put option at a higher strike price and sells another put option at a lower strike price, both with the same expiration date. This strategy is used when the trader expects the stock price to fall moderately. The premium received from selling the lower-strike put reduces the overall cost of the trade. The maximum loss is limited to the net premium paid, while the maximum profit is capped at the difference between the two strike prices minus the net premium, achieved if the stock price falls to or below the lower strike price at expiration.',
    legs: [
      { type: 'put', position: 'long', strike: upperStrike, premium: longPremium, quantity: 1 },
      { type: 'put', position: 'short', strike: lowerStrike, premium: shortPremium, quantity: 1 },
    ],
  }),
  
  ironCondor: (
    putLongStrike: number,
    putShortStrike: number,
    callShortStrike: number,
    callLongStrike: number,
    putLongPremium: number,
    putShortPremium: number,
    callShortPremium: number,
    callLongPremium: number
  ): OptionStrategy => ({
    name: 'Iron Condor',
    introduction:'An iron condor is an options strategy that combines a bull put spread and a bear call spread on the same stock, using the same expiration date but four different strike prices. The trader sells an out-of-the-money put and an out-of-the-money call, and buys a further out-of-the-money put and call to limit risk. This strategy is used when the trader expects the stock price to stay within a defined range. The maximum profit is the net premium received if the stock price remains between the two middle strike prices at expiration, while the maximum loss is limited and occurs if the stock moves beyond either outer strike price.',
    legs: [
      { type: 'put', position: 'long', strike: putLongStrike, premium: putLongPremium, quantity: 1 },
      { type: 'put', position: 'short', strike: putShortStrike, premium: putShortPremium, quantity: 1 },
      { type: 'call', position: 'short', strike: callShortStrike, premium: callShortPremium, quantity: 1 },
      { type: 'call', position: 'long', strike: callLongStrike, premium: callLongPremium, quantity: 1 },
    ],
  }),
  
  ironButterfly: (
    lowerStrike: number,
    middleStrike: number,
    upperStrike: number,
    putLongPremium: number,
    putShortPremium: number,
    callShortPremium: number,
    callLongPremium: number
  ): OptionStrategy => ({
    name: 'Iron Butterfly',
    introduction:'An iron butterfly is an options strategy where a trader sells a call and a put at the same at-the-money strike price and expiration date, and buys a further out-of-the-money call and put to limit risk. This strategy is used when the trader expects very little price movement. The maximum profit is the total premium received if the stock price finishes exactly at the strike price at expiration. The maximum loss is limited and occurs if the stock moves sharply up or down beyond the outer strike prices.',
    legs: [
      { type: 'put', position: 'long', strike: lowerStrike, premium: putLongPremium, quantity: 1 },
      { type: 'put', position: 'short', strike: middleStrike, premium: putShortPremium, quantity: 1 },
      { type: 'call', position: 'short', strike: middleStrike, premium: callShortPremium, quantity: 1 },
      { type: 'call', position: 'long', strike: upperStrike, premium: callLongPremium, quantity: 1 },
    ],
  }),
};
