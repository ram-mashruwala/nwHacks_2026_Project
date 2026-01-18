import { useState } from 'react';
import { Search, RefreshCw, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = 'http://localhost:5000';

interface StockData {
  symbol: string;
  price: number;
  source: string;
}

interface StockPriceFetcherProps {
  onPriceChange: (price: number, symbol: string) => void;
  currentPrice: number;
  currentSymbol: string;
}

export function StockPriceFetcher({ onPriceChange, currentPrice, currentSymbol }: StockPriceFetcherProps) {
  const [symbol, setSymbol] = useState(currentSymbol || '');
  const [isLoading, setIsLoading] = useState(false);

  const fetchPrice = async (stockSymbol: string) => {
    if (!stockSymbol.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a stock symbol',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/getprice?stock=${stockSymbol.toUpperCase()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch price');
      }

      const stockData = data as StockData;
      onPriceChange(stockData.price, stockData.symbol);
      setSymbol(stockData.symbol);
      
      toast({
        title: 'Price Updated',
        description: `${stockData.symbol}: $${stockData.price.toFixed(2)} (${stockData.source})`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch stock price',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPrice(symbol);
  };

  const handleRefresh = () => {
    if (currentSymbol) {
      fetchPrice(currentSymbol);
    }
  };

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="h-5 w-5 text-chart-1" />
        <h3 className="text-sm font-semibold text-foreground">Stock Price</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="Enter ticker (e.g., AAPL)"
          className="flex-1 uppercase"
          maxLength={10}
        />
        <Button type="submit" size="sm" disabled={isLoading} className="gap-1">
          <Search className="h-4 w-4" />
          {isLoading ? 'Loading...' : 'Fetch'}
        </Button>
        {currentSymbol && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </form>

      {currentSymbol && currentPrice > 0 && (
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Current Price:</span>
          <span className="font-semibold text-chart-1">
            {currentSymbol} @ ${currentPrice.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}
