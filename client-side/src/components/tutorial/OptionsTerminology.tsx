import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface Term {
  term: string;
  definition: string;
  example?: string;
}

const optionsTerms: Term[] = [
  {
    term: 'Call Option',
    definition: 'A contract giving you the right to BUY 100 shares of a stock at a specific price (strike) before a certain date.',
    example: 'Buying a $100 call means you can buy shares at $100 each, even if they trade at $120.',
  },
  {
    term: 'Put Option',
    definition: 'A contract giving you the right to SELL 100 shares of a stock at a specific price (strike) before a certain date.',
    example: 'Buying a $100 put means you can sell shares at $100 each, even if they trade at $80.',
  },
  {
    term: 'Long (Buying)',
    definition: 'Going "long" means you are BUYING an option. You pay premium upfront and have the right, not obligation, to exercise.',
    example: 'Long call = buying a call. Long put = buying a put. You want the option to increase in value.',
  },
  {
    term: 'Short (Selling)',
    definition: 'Going "short" means you are SELLING an option. You receive premium upfront but have an OBLIGATION if the buyer exercises.',
    example: 'Short call = selling a call. Short put = selling a put. You want the option to decrease in value or expire worthless.',
  },
  {
    term: 'Strike Price',
    definition: 'The predetermined price at which the option holder can buy (call) or sell (put) the underlying stock.',
    example: 'A $100 strike call gives you the right to buy shares at $100 each.',
  },
  {
    term: 'Premium',
    definition: 'The price paid to purchase an option contract. This is your cost (when buying) or income (when selling).',
    example: 'If you pay $5 premium per share, one contract (100 shares) costs $500.',
  },
  {
    term: 'Expiration Date',
    definition: 'The date on which the option contract expires and becomes worthless if not exercised.',
    example: 'A January 20th expiration means the option expires at market close on that date.',
  },
  {
    term: 'In-the-Money (ITM)',
    definition: 'A call is ITM when stock price > strike price. A put is ITM when stock price < strike price. ITM options have real value.',
    example: 'A $100 call is ITM if the stock trades at $105.',
  },
  {
    term: 'Out-of-the-Money (OTM)',
    definition: 'A call is OTM when stock price < strike price. A put is OTM when stock price > strike price. OTM options have no immediate exercise value.',
    example: 'A $100 call is OTM if the stock trades at $95.',
  },
  {
    term: 'At-the-Money (ATM)',
    definition: 'When the strike price equals or is very close to the current stock price.',
    example: 'A $100 strike is ATM when the stock trades at $100.',
  },
  {
    term: 'Breakeven',
    definition: 'The stock price at which your position neither makes nor loses money at expiration.',
    example: 'For a $100 call with $5 premium, breakeven is $105.',
  },
];

export function OptionsTerminology() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-chart-2/10">
          <HelpCircle className="h-5 w-5 text-chart-2" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Options Terminology</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Master these key terms to understand options trading.
      </p>
      
      <Accordion type="single" collapsible className="w-full">
        {optionsTerms.map((item, index) => (
          <AccordionItem key={item.term} value={`item-${index}`} className="border-border/30">
            <AccordionTrigger className="text-sm font-medium hover:no-underline hover:text-primary">
              {item.term}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              <p className="mb-2">{item.definition}</p>
              {item.example && (
                <p className="text-xs bg-background/50 rounded p-2 border border-border/30">
                  <span className="font-medium text-foreground">Example:</span> {item.example}
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
