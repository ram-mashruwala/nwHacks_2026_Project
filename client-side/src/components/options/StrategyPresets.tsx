import { Button } from '@/components/ui/button';
import type { OptionLeg } from '@/lib/options';

interface StrategyPresetsProps {
  onSelectPreset: (legs: OptionLeg[], name: string, introduction:string) => void;
  basePrice?: number;
}

interface PresetConfig {
  name: string;
  description: string;
  introduction:string;
  legs: OptionLeg[];
}

export function StrategyPresets({ onSelectPreset, basePrice = 100 }: StrategyPresetsProps) {
  const presets: PresetConfig[] = [
    {
      name: 'Long Call',
      description: 'Bullish, unlimited upside',
      introduction:' A long call is an options strategy where a trader buys a call option to gain the right, but not the obligation, to buy a stock at a fixed price called the strike price before a certain expiration date. The trader pays a premium upfront, which is the maximum possible loss. This strategy is used when the trader expects the stock price to rise. If the stock price stays below the strike price at expiration, the option expires worthless and the loss is limited to the premium. If the stock price rises above the strike price, the trader can profit, with the break-even point being the strike price plus the premium paid and the potential profit theoretically unlimited.',
      legs: [{ type: 'call', position: 'long', strike: basePrice, premium: 5, quantity: 1 }],
    },
    {
      name: 'Long Put',
      description: 'Bearish, profit on decline',
      introduction:'A long put is an options strategy where a trader buys a put option to gain the right, but not the obligation, to sell a stock at a fixed price called the strike price before a certain expiration date. The trader pays a premium upfront, which is the maximum possible loss. This strategy is used when the trader expects the stock price to fall. If the stock price stays above the strike price at expiration, the option expires worthless and the loss is limited to the premium. If the stock price falls below the strike price, the trader can profit, with the break-even point being the strike price minus the premium paid and the potential profit increasing as the stock price drops.',
      legs: [{ type: 'put', position: 'long', strike: basePrice, premium: 5, quantity: 1 }],
    },
    {
      name: 'Covered Call',
      description: 'Income on existing stock',
      introduction:'A covered call is an options strategy where a trader owns the underlying stock and sells a call option on that same stock, usually with the goal of generating extra income from the option premium. This strategy is used when the trader expects the stock price to stay flat or rise only slightly. The premium received provides some downside protection, but the upside is capped because the trader may have to sell the stock at the strike price if the option is exercised.',
      legs: [
        { type: 'stock', position: 'long', strike: basePrice, premium: 0, quantity: 1 },
        { type: 'call', position: 'short', strike: basePrice + 10, premium: 3, quantity: 1 },
      ],
    },
    {
      name: 'Long Straddle',
      description: 'Profit from volatility',
      introduction:'A long straddle options strategy involves simultaneously buying a call option and a put option on the same underlying asset with the same strike price and expiry date. It becomes profitable when the stock significantly shifts in one direction or another. A significant enough shift in either direction is enough to cover the premiums paid for the options and realize a profit. When to use it: When investors believe the underlying assets price will move significantly out of a specific range but are unsure of which direction it will go. Risk vs. profit: Theoretical chance at unlimited gains. Maximum loss is limited to the cost of both options contracts.',
      legs: [
        { type: 'call', position: 'long', strike: basePrice, premium: 5, quantity: 1 },
        { type: 'put', position: 'long', strike: basePrice, premium: 5, quantity: 1 },
      ],
    },
    {
      name: 'Short Straddle',
      description: 'Profit from stability',
      introduction:'A short straddle is an options strategy where a trader sells a call option and a put option on the same stock, with the same strike price and expiration date, and collects two premiums upfront. This strategy is used when the trader expects the stock price to stay close to the strike price and not move much before expiration. The maximum profit is the total premium received if the stock price ends exactly at the strike price at expiration. If the stock makes a large move up or down, losses can grow quickly, with risk being very high and theoretically unlimited on the upside and substantial on the downside, making short straddles risky, especially for new traders.',
    
      legs: [
        { type: 'call', position: 'short', strike: basePrice, premium: 5, quantity: 1 },
        { type: 'put', position: 'short', strike: basePrice, premium: 5, quantity: 1 },
      ],
    },
    {
      name: 'Long Strangle',
      description: 'Cheaper volatility bet',
      introduction:'A long strangle is an options strategy where a trader buys a call option and a put option on the same stock, with the same expiration date but different strike prices, typically an out-of-the-money call and an out-of-the-money put. This strategy is used when the trader expects a big price move but is unsure of the direction. The maximum loss is limited to the total premium paid for both options. If the stock moves sharply up or down, one option can become profitable enough to outweigh the cost of both, with break-even points above the call strike plus total premium and below the put strike minus total premium.',
    
      legs: [
        { type: 'put', position: 'long', strike: basePrice - 10, premium: 3, quantity: 1 },
        { type: 'call', position: 'long', strike: basePrice + 10, premium: 3, quantity: 1 },
      ],
    },
    {
      name: 'Bull Call Spread',
      description: 'Limited risk bullish',
       introduction:'A bull call spread is an options strategy where a trader buys a call option at a lower strike price and sells another call option at a higher strike price, both with the same expiration date. This strategy is used when the trader expects the stock price to rise moderately. The upfront cost is reduced compared to buying a single call because the premium received from selling the higher-strike call helps offset the cost. The maximum profit is capped at the difference between the two strike prices minus the net premium paid, while the maximum loss is limited to the net premium paid if the stock stays below the lower strike price at expiration.',
   
      legs: [
        { type: 'call', position: 'long', strike: basePrice, premium: 5, quantity: 1 },
        { type: 'call', position: 'short', strike: basePrice + 10, premium: 2, quantity: 1 },
      ],
    },
    {
      name: 'Bear Put Spread',
      description: 'Limited risk bearish',
      introduction:'A bear put spread is an options strategy where a trader buys a put option at a higher strike price and sells another put option at a lower strike price, both with the same expiration date. This strategy is used when the trader expects the stock price to fall moderately. The premium received from selling the lower-strike put reduces the overall cost of the trade. The maximum loss is limited to the net premium paid, while the maximum profit is capped at the difference between the two strike prices minus the net premium, achieved if the stock price falls to or below the lower strike price at expiration.',
    
      legs: [
        { type: 'put', position: 'long', strike: basePrice, premium: 5, quantity: 1 },
        { type: 'put', position: 'short', strike: basePrice - 10, premium: 2, quantity: 1 },
      ],
    },
    {
      name: 'Iron Condor',
      description: 'Range-bound profit',
      introduction:'An iron condor is an options strategy that combines a bull put spread and a bear call spread on the same stock, using the same expiration date but four different strike prices. The trader sells an out-of-the-money put and an out-of-the-money call, and buys a further out-of-the-money put and call to limit risk. This strategy is used when the trader expects the stock price to stay within a defined range. The maximum profit is the net premium received if the stock price remains between the two middle strike prices at expiration, while the maximum loss is limited and occurs if the stock moves beyond either outer strike price.',
    
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
      introduction:'An iron butterfly is an options strategy where a trader sells a call and a put at the same at-the-money strike price and expiration date, and buys a further out-of-the-money call and put to limit risk. This strategy is used when the trader expects very little price movement. The maximum profit is the total premium received if the stock price finishes exactly at the strike price at expiration. The maximum loss is limited and occurs if the stock moves sharply up or down beyond the outer strike prices.',
    
      legs: [
        { type: 'put', position: 'long', strike: basePrice - 10, premium: 2, quantity: 1 },
        { type: 'put', position: 'short', strike: basePrice, premium: 5, quantity: 1 },
        { type: 'call', position: 'short', strike: basePrice, premium: 5, quantity: 1 },
        { type: 'call', position: 'long', strike: basePrice + 10, premium: 2, quantity: 1 },
      ],
    },
  ];

  return (
    <div className="glass-card p-4">
      <h3 className="text-sm font-medium text-foreground mb-3">Quick Strategies</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.name}
            variant="outline"
            size="sm"
            className="h-auto py-2 px-3 flex flex-col items-start text-left bg-background/30 hover:bg-primary/10 border-border/50"
            onClick={() => onSelectPreset(preset.legs, preset.name, preset.introduction)}
          >
            <span className="text-xs font-medium">{preset.name}</span>
            <span className="text-[10px] text-muted-foreground">{preset.description}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
