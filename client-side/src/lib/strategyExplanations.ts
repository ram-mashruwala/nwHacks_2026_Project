export type RiskLevel = 'low' | 'medium' | 'high' | 'very-high';

export interface StrategyExplanation {
  name: string;
  whatItIs: string;
  whenToUse: string;
  howItWorks: string;
  riskLevel: RiskLevel;
  riskExplanation: string;
}

export const strategyExplanations: Record<string, StrategyExplanation> = {
  'Long Call': {
    name: 'Long Call',
    whatItIs: 'A long call is the simplest bullish options strategy. You buy a call option, giving you the right (but not obligation) to purchase the underlying stock at the strike price before expiration.',
    whenToUse: 'Use when you expect the stock price to rise significantly. It\'s ideal when you want leveraged exposure to upside movement with limited downside risk.',
    howItWorks: 'You pay a premium upfront to buy the call. If the stock rises above the strike price plus your premium paid (breakeven), you profit. Your maximum loss is limited to the premium paid, while your profit potential is unlimited as the stock rises.',
    riskLevel: 'medium',
    riskExplanation: 'Limited loss (premium paid only) but requires correct timing and direction. You can lose 100% of your investment if the stock doesn\'t rise above breakeven.',
  },
  'Long Put': {
    name: 'Long Put',
    whatItIs: 'A long put is the simplest bearish options strategy. You buy a put option, giving you the right to sell the underlying stock at the strike price before expiration.',
    whenToUse: 'Use when you expect the stock price to decline significantly. It\'s also commonly used as insurance (protective put) for existing stock positions.',
    howItWorks: 'You pay a premium upfront to buy the put. If the stock falls below the strike price minus your premium (breakeven), you profit. Maximum profit occurs if the stock goes to zero. Maximum loss is limited to the premium paid.',
    riskLevel: 'medium',
    riskExplanation: 'Limited loss (premium paid only) but requires correct timing and direction. You can lose 100% of your investment if the stock doesn\'t fall below breakeven.',
  },
  'Covered Call': {
    name: 'Covered Call',
    whatItIs: 'A covered call combines owning 100 shares of stock with selling a call option against those shares. It\'s a conservative income-generating strategy.',
    whenToUse: 'Use when you own stock and have a neutral to slightly bullish outlook. It\'s ideal for generating income from shares you plan to hold anyway.',
    howItWorks: 'You own the stock and sell a call option at a higher strike price, collecting premium. If the stock stays below the strike, you keep the premium and your shares. If it rises above the strike, your shares get called away at that price, capping your upside.',
    riskLevel: 'low',
    riskExplanation: 'Conservative strategy that reduces risk by collecting premium. Main risk is if the stock drops significantly, though the premium provides some cushion.',
  },
  'Long Straddle': {
    name: 'Long Straddle',
    whatItIs: 'A long straddle involves buying both a call and a put at the same strike price (typically at-the-money). You profit from large moves in either direction.',
    whenToUse: 'Use when you expect a big move but are unsure of the direction. Common before earnings announcements, FDA decisions, or other volatile events.',
    howItWorks: 'You pay premium for both options. You need the stock to move far enough in either direction to cover the cost of both premiums. Profits if stock moves significantly up or down; loses if stock stays near the strike.',
    riskLevel: 'medium',
    riskExplanation: 'Loss is limited to total premium paid, but that premium can be substantial. Requires a large move to profit, and time decay works against you.',
  },
  'Short Straddle': {
    name: 'Short Straddle',
    whatItIs: 'A short straddle involves selling both a call and a put at the same strike price. It\'s the opposite of a long straddle—you profit from stability.',
    whenToUse: 'Use when you expect low volatility and the stock to stay near the current price. It\'s a high-risk strategy suitable for experienced traders.',
    howItWorks: 'You collect premium from selling both options. Maximum profit occurs if the stock expires exactly at the strike. Any significant move in either direction causes losses. Risk is unlimited on the upside and substantial on the downside.',
    riskLevel: 'very-high',
    riskExplanation: 'Unlimited loss potential on the upside and substantial loss on the downside. Only suitable for experienced traders with proper risk management.',
  },
  'Long Strangle': {
    name: 'Long Strangle',
    whatItIs: 'A long strangle is similar to a straddle but uses out-of-the-money options. You buy a put below the current price and a call above it.',
    whenToUse: 'Use when you expect a large move but want to pay less premium than a straddle. Requires a bigger move to profit but has lower cost.',
    howItWorks: 'You pay less total premium since both options are OTM. The stock must move significantly beyond either strike to profit. Loss is limited to total premium if stock stays between the strikes.',
    riskLevel: 'medium',
    riskExplanation: 'Loss is limited to the total premium paid, which is less than a straddle. However, requires an even larger move to become profitable.',
  },
  'Bull Call Spread': {
    name: 'Bull Call Spread',
    whatItIs: 'A bull call spread (or call debit spread) involves buying a call and selling a higher-strike call. It\'s a defined-risk bullish strategy.',
    whenToUse: 'Use when moderately bullish. It costs less than a single call and has defined risk, making it suitable when you expect limited upside.',
    howItWorks: 'You buy a lower-strike call and sell a higher-strike call, reducing your net cost. Profits are capped at the difference between strikes minus net premium. Max loss is the net premium paid.',
    riskLevel: 'low',
    riskExplanation: 'Defined risk with capped profit potential. Maximum loss is limited to the net premium paid, making it a controlled-risk strategy.',
  },
  'Bear Put Spread': {
    name: 'Bear Put Spread',
    whatItIs: 'A bear put spread (or put debit spread) involves buying a put and selling a lower-strike put. It\'s a defined-risk bearish strategy.',
    whenToUse: 'Use when moderately bearish. It costs less than a single put and limits both risk and reward, ideal for expecting limited downside.',
    howItWorks: 'You buy a higher-strike put and sell a lower-strike put, reducing net cost. Max profit is the difference between strikes minus premium. Max loss is the net premium paid.',
    riskLevel: 'low',
    riskExplanation: 'Defined risk with capped profit potential. Maximum loss is limited to the net premium paid, making it a controlled-risk strategy.',
  },
  'Iron Condor': {
    name: 'Iron Condor',
    whatItIs: 'An iron condor combines a bull put spread and a bear call spread. You sell options closer to the money and buy further OTM options for protection.',
    whenToUse: 'Use when you expect the stock to stay within a range. It\'s a popular income strategy that profits from time decay and low volatility.',
    howItWorks: 'You collect net premium by selling the inner strikes and buying the outer strikes for protection. Max profit if stock stays between the two short strikes. Max loss is limited by the long options.',
    riskLevel: 'medium',
    riskExplanation: 'Defined risk on both sides, but can lose more than you collect in premium. Requires the stock to stay in a range, which doesn\'t always happen.',
  },
  'Iron Butterfly': {
    name: 'Iron Butterfly',
    whatItIs: 'An iron butterfly is like an iron condor but with the short options at the same strike (typically ATM). It profits if the stock stays exactly at that strike.',
    whenToUse: 'Use when you expect very low volatility and the stock to pin at a specific price. It offers higher premium but narrower profit zone than iron condor.',
    howItWorks: 'You sell a straddle at the middle strike and buy a strangle for protection. Maximum profit if stock expires exactly at the short strike. Any move away from center reduces profit.',
    riskLevel: 'medium',
    riskExplanation: 'Defined risk with higher premium than iron condor, but requires more precise prediction of stock price. Profit zone is narrower.',
  },
};
