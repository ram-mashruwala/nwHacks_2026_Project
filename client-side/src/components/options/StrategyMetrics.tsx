import { TrendingUp, TrendingDown, Target, DollarSign } from 'lucide-react';
import type { StrategyAnalysis } from '@/lib/options';

interface StrategyMetricsProps {
  analysis: StrategyAnalysis;
}

export function StrategyMetrics({ analysis }: StrategyMetricsProps) {
  const { breakevens, maxProfit, maxLoss, netPremium } = analysis;

  const formatValue = (value: number | 'unlimited') => {
    if (value === 'unlimited') return '∞';
    return `$${Math.abs(value).toLocaleString()}`;
  };

  const metrics = [
    {
      label: 'Max Profit',
      value: formatValue(maxProfit),
      icon: TrendingUp,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
    },
    {
      label: 'Max Loss',
      value: formatValue(maxLoss),
      icon: TrendingDown,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      label: 'Net Premium',
      value: `$${netPremium.toLocaleString()}`,
      subLabel: netPremium >= 0 ? 'Credit' : 'Debit',
      icon: DollarSign,
      color: netPremium >= 0 ? 'text-chart-2' : 'text-chart-4',
      bgColor: netPremium >= 0 ? 'bg-chart-2/10' : 'bg-chart-4/10',
    },
    {
      label: 'Breakeven',
      value: breakevens.length > 0 ? breakevens.map(b => `$${b}`).join(', ') : 'N/A',
      icon: Target,
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${metric.bgColor}`}>
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <p className={`text-lg font-semibold ${metric.color}`}>{metric.value}</p>
              {metric.subLabel && (
                <p className="text-xs text-muted-foreground">{metric.subLabel}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
