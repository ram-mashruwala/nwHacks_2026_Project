import { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, Play, Activity, BellRing } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import apiClient, { resOk } from '@/lib/apiClient';
import { createPriceAlert } from '@/lib/strategyStorage';

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
  const [inputError, setInputError] = useState(false);
  
  // NEW: State for target price and alert submission loading
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [isSettingAlert, setIsSettingAlert] = useState(false);

  // 1. Define the fetch function
  const fetchPrice = async (stockSymbol: string, isAutoRefresh = false) => {
    if (!stockSymbol.trim()) {
        setInputError(true);
    }
    if (isLoading && !isAutoRefresh) 
        return;

    if (!isAutoRefresh) setIsLoading(true);
    
    try {
      const response = await apiClient.get(`/get-price?stock=${stockSymbol.toUpperCase()}`);
      
      if (!resOk(response.status)) {
        
        throw new Error(response.statusText || 'Failed to fetch price');
      }
      
      const data = await response.data;
      const stockData = data as StockData;
      console.log(stockData.symbol);
      
      onPriceChange(stockData.price, stockData.symbol);
      setSymbol(stockData.symbol);
      
      if (!isAutoRefresh) {
        toast({
          title: 'Live Updates Started',
          description: `Tracking ${stockData.symbol} every 30 seconds.`,
        });
      }
    } catch (error) {
        console.log("invalid symbol or failed to fetch the price")
        setInputError(true);


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

  // 2. Use Ref to prevent stale closures
  const fetchPriceRef = useRef(fetchPrice);
  useEffect(() => {
    fetchPriceRef.current = fetchPrice;
  });

  // NEW: Handle Alert Submission
  const handleSetAlert = async () => {
    if (!currentSymbol || !targetPrice) {
      toast({
        title: "Missing Information",
        description: "Please ensure a stock is loaded and a target price is entered.",
        variant: "destructive",
      });
      return;
    }

    setIsSettingAlert(true);
    try {
      // Sends symbol and numeric price to backend via strategyStorage.ts
      await createPriceAlert(currentSymbol, parseFloat(targetPrice));
      toast({
        title: "Alert Set",
        description: `Notification scheduled for ${currentSymbol} at $${targetPrice}`,
      });
      setTargetPrice(''); 
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create price alert",
        variant: "destructive",
      });
    } finally {
      setIsSettingAlert(false);
    }
  };

  // 3. Stop Live Mode and sync if symbol is empty/changed
  useEffect(() => {
    if (!currentSymbol) {
      setIsLive(false);
      setSymbol("");
      return;
    }

    if (currentSymbol !== symbol) {
      setSymbol(currentSymbol);
      fetchPrice(currentSymbol);
      setIsLive(true);
    }
  }, [currentSymbol]);

  // 4. The Interval Effect
  useEffect(() => {
    let intervalId: ReturnType<typeof setTimeout>;

    if (isLive && currentSymbol) {
      intervalId = setInterval(() => {
        fetchPriceRef.current(currentSymbol, true);
      }, 30000); 
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isLive, currentSymbol]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchPrice(symbol);
    setIsLive(true);
  };

  return (
    <div className="glass-card p-4 space-y-4">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-chart-1" />
          <h3 className="text-sm font-semibold text-foreground">Market Watch</h3>
        </div>
      </div>
      
      <div className="space-y-3">
        {/* Fetch Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
            value={symbol}
            onChange={(e) => {
                setSymbol(e.target.value.toUpperCase());
                setInputError(false);
            }}
            placeholder="Ticker (e.g., AAPL)"
            className={`flex-1 uppercase ${
                inputError ? "border-red-500 focus:ring-red-500" : ""
                }`}
            maxLength={10}
            />

          <Button type="submit" size="sm" disabled={isLoading} className="gap-2 min-w-[100px]">
            {isLoading ? 'Loading...' : isLive && symbol === currentSymbol ? (
              <><Activity className="h-4 w-4" /> Refresh</>
            ) : (
              <><Play className="h-4 w-4" /> Fetch & Live</>
            )}
          </Button>
        </form>

        {/* NEW: Price Alert UI Section */}
        {currentSymbol && (
          <div className="flex gap-2 pt-2 border-t border-border/40 animate-in fade-in slide-in-from-top-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
              <Input
                type="number"
                step="0.01"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="Target Price"
                className="pl-6 h-9 text-sm"
              />
            </div>
            <Button 
              onClick={handleSetAlert} 
              variant="secondary" 
              size="sm" 
              disabled={isSettingAlert || !targetPrice}
              className="gap-2"
            >
              <BellRing className={`h-4 w-4 ${isSettingAlert ? 'animate-pulse' : ''}`} />
              {isSettingAlert ? 'Setting...' : 'Set Alert'}
            </Button>
          </div>
        )}
      </div>

      {currentSymbol && currentPrice > 0 && (
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-2">
            Current Price
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