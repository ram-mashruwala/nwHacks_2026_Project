import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { PayoffPoint, StrategyAnalysis } from '@/lib/options';

interface OptionsPayoffChartProps {
  analysis: StrategyAnalysis;
  strategyName?: string;
  strategyIntroduction?:string;
  currentPrice?: number; // Add the '?' here
  currentSymbol?: string; // Usually good to make this optional too
}

export function OptionsPayoffChart({ analysis, strategyName, strategyIntroduction,currentPrice, currentSymbol }: OptionsPayoffChartProps){
  const { payoffData, breakevens } = analysis;

  const chartData = useMemo(() => {
    return payoffData.map((point) => ({
      ...point,
      profit: point.payoff > 0 ? point.payoff : 0,
      loss: point.payoff < 0 ? point.payoff : 0,
    }));
  }, [payoffData]);

  if (payoffData.length === 0) {
    return (
      <div className="glass-card p-6 flex items-center justify-center h-80">
        <p className="text-muted-foreground">Add options to see payoff diagram</p>
      </div>
    );
  }

  const minPayoff = Math.min(...payoffData.map(p => p.payoff));
  const maxPayoff = Math.max(...payoffData.map(p => p.payoff));
  const padding = Math.max(Math.abs(minPayoff), Math.abs(maxPayoff)) * 0.1;

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4 text-foreground">
        {strategyName ? `${strategyName} Payoff` : 'Payoff Diagram'}
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.6} />
              <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="lossGradient" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity={0.6} />
              <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="price"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
            domain={[minPayoff - padding, maxPayoff + padding]}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as PayoffPoint;
                return (
                  <div className="glass-card p-3 border border-border/50">
                    <p className="text-sm text-muted-foreground">
                      Price: <span className="text-foreground font-medium">${data.price}</span>
                    </p>
                    <p className={`text-sm font-medium ${data.payoff >= 0 ? 'text-chart-2' : 'text-destructive'}`}>
                      P/L: ${data.payoff.toLocaleString()}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          
          {/* Zero line */}
          <ReferenceLine y={0} stroke="hsl(var(--foreground))" strokeWidth={1.5} />
          
          <ReferenceLine y={0} stroke="hsl(var(--foreground))" strokeWidth={1.5} />
          
          {/* Current stock price line */}
          {currentPrice && currentPrice > 0 && (
            <ReferenceLine
              x={currentPrice}
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              strokeDasharray="3 3"
              label={{
                value: `${currentSymbol || 'Price'}: $${currentPrice.toFixed(2)}`,
                position: 'top',
                fill: 'hsl(var(--chart-1))',
                fontSize: 12,
                fontWeight: 'bold',
              }}
            />
          )}
          
          {/* Breakeven lines */}
          {breakevens.map((be, index) => (
            <ReferenceLine
              key={index}
              x={be}
              stroke="hsl(var(--chart-4))"
              strokeDasharray="5 5"
              label={{
                value: `BE: $${be}`,
                position: 'top',
                fill: 'hsl(var(--chart-4))',
                fontSize: 11,
              }}
            />
          ))}
          
          {/* Profit area */}
          <Area
            type="monotone"
            dataKey="profit"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
            fill="url(#profitGradient)"
          />
          
          {/* Loss area */}
          <Area
            type="monotone"
            dataKey="loss"
            stroke="hsl(var(--destructive))"
            strokeWidth={2}
            fill="url(#lossGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
