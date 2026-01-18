import { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, Play, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import apiClient, { resOk } from '@/lib/apiClient';

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
  const [isLive, setIsLive] = useState(false);

  // 1. Define the fetch function
  const fetchPrice = async (stockSymbol: string, isAutoRefresh = false) => {
    if (!stockSymbol.trim() || (isLoading && !isAutoRefresh)) return;

    console.log(`[${new Date().toLocaleTimeString()}] 🚀 Fetching price for ${stockSymbol}...`);

    if (!isAutoRefresh) setIsLoading(true);
    
    try {
      const response = await apiClient.get(`/get-price?stock=${stockSymbol.toUpperCase()}`);
      
      if (!resOk(response.status)) {
        throw new Error(response.statusText || 'Failed to fetch price');
      }
      
      const data = await response.data;

      const stockData = data as StockData;
      onPriceChange(stockData.price, stockData.symbol);
      setSymbol(stockData.symbol);
      
      // Only toast on manual fetch (first load)
      if (!isAutoRefresh) {
        toast({
          title: 'Live Updates Started',
          description: `Tracking ${stockData.symbol} every 30 seconds.`,
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      // If error occurs during auto-refresh, kill the live feed to prevent spam
      if (isAutoRefresh) {
        setIsLive(false);
        toast({
          title: 'Live Update Stopped',
          description: 'Failed to fetch price. Live updates disabled.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch stock price',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Use Ref to prevent stale closures (Leave this as is)
  const fetchPriceRef = useRef(fetchPrice);
  useEffect(() => {
    fetchPriceRef.current = fetchPrice;
  });

  // NEW: Stop Live Mode and sync if symbol is empty/changed
  useEffect(() => {
    if (!currentSymbol) {
      setIsLive(false); // This stops the interval in Section 3
      setSymbol("");    // Clear the internal input
      return;
    }

    // Sync input field if parent loads a new symbol
    if (currentSymbol !== symbol) {
      console.log(currentSymbol);
      setSymbol(currentSymbol);
      fetchPrice(currentSymbol);
      setIsLive(true);
    }
  }, [currentSymbol]);

  // 3. The Interval Effect
  useEffect(() => {
    let intervalId: ReturnType<typeof setTimeout>;

    if (isLive && currentSymbol) {
      // Create the interval (30 seconds)
      intervalId = setInterval(() => {
        console.log("⏰ Interval tick (30s)");
        fetchPriceRef.current(currentSymbol, true);
      }, 30000); 
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isLive, currentSymbol]);

  // 4. Handle Manual Submit (Trigger Live Mode)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchPrice(symbol);
    setIsLive(true);
  };

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-chart-1" />
          <h3 className="text-sm font-semibold text-foreground">Stock Price</h3>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="Enter ticker (e.g., AAPL)"
          className="flex-1 uppercase"
          maxLength={10}
        />
        <Button type="submit" size="sm" disabled={isLoading} className="gap-2 min-w-[100px]">
          {isLoading ? (
            'Loading...'
          ) : isLive && symbol === currentSymbol ? (
            <>
              <Activity className="h-4 w-4" />
              Refresh
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Fetch & Live
            </>
          )}
        </Button>
      </form>

      {currentSymbol && currentPrice > 0 && (
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-2">
            Current Price
            {/* Pulsing indicator to show live status */}
            {isLive && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-2 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-chart-2"></span>
              </span>
            )}
            :
          </span>
          <span className="font-semibold text-chart-1">
            {currentSymbol} @ ${currentPrice.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}