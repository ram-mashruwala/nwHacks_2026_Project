import { FileText, TrendingUp, TrendingDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { OptionLeg } from '@/lib/options';

interface StrategyContractExampleProps {
  strategyName: string;
  legs: OptionLeg[];
  basePrice: number;
}

export function StrategyContractExample({ strategyName, legs, basePrice }: StrategyContractExampleProps) {
  const getMoneyness = (leg: OptionLeg): 'ITM' | 'ATM' | 'OTM' => {
    const diff = Math.abs(leg.strike - basePrice);
    if (diff <= 2) return 'ATM';
    if (leg.type === 'call') {
      return leg.strike < basePrice ? 'ITM' : 'OTM';
    } else {
      return leg.strike > basePrice ? 'ITM' : 'OTM';
    }
  };

  const getBreakeven = (leg: OptionLeg): number => {
    if (leg.type === 'call') {
      return leg.position === 'long' 
        ? leg.strike + leg.premium 
        : leg.strike + leg.premium;
    } else {
      return leg.position === 'long' 
        ? leg.strike - leg.premium 
        : leg.strike - leg.premium;
    }
  };

  const moneynessColors = {
    ITM: 'bg-green-500/20 text-green-400 border-green-500/30',
    ATM: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    OTM: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const totalPremium = legs.reduce((sum, leg) => {
    return sum + (leg.position === 'long' ? -leg.premium : leg.premium);
  }, 0);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-chart-3/10">
          <FileText className="h-5 w-5 text-chart-3" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Contract Structure</h2>
          <p className="text-sm text-muted-foreground">How the {strategyName} is built • <span className="text-foreground font-medium">1 contract = 100 shares</span></p>
        </div>
      </div>

      <div className="mb-3 p-3 rounded-lg bg-background/50 border border-border/30">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Underlying Price:</span> ${basePrice.toFixed(2)}
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/30 hover:bg-transparent">
              <TableHead className="text-xs">Position</TableHead>
              <TableHead className="text-xs">Type</TableHead>
              <TableHead className="text-xs text-right">Strike</TableHead>
              <TableHead className="text-xs text-right">Premium</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs text-right">Breakeven</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {legs.map((leg, index) => {
              const moneyness = getMoneyness(leg);
              return (
                <TableRow key={index} className="border-border/30">
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        leg.position === 'long' 
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                          : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                      }`}
                    >
                      {leg.position === 'long' ? 'BUY' : 'SELL'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {leg.type === 'call' ? (
                        <TrendingUp className="h-3.5 w-3.5 text-green-400" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                      )}
                      <span className={`text-sm ${leg.type === 'call' ? 'text-green-400' : 'text-red-400'}`}>
                        {leg.type.charAt(0).toUpperCase() + leg.type.slice(1)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium">${leg.strike}</TableCell>
                  <TableCell className="text-right text-sm">
                    <span className={leg.position === 'long' ? 'text-red-400' : 'text-green-400'}>
                      {leg.position === 'long' ? '-' : '+'}${leg.premium.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${moneynessColors[moneyness]}`}>
                      {moneyness}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm">${getBreakeven(leg).toFixed(2)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-background/50 border border-border/30">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Net Premium (per share):</span>
          <span className={`text-sm font-medium ${totalPremium >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalPremium >= 0 ? '+' : ''}{totalPremium.toFixed(2)} ({totalPremium >= 0 ? 'Credit' : 'Debit'})
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          <span className="font-medium text-foreground">Per Contract:</span> {Math.abs(totalPremium * 100).toFixed(0)} total {totalPremium >= 0 ? 'received' : 'paid'}
        </p>
      </div>
    </div>
  );
}
