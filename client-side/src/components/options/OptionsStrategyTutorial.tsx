import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OptionLegForm } from './OptionLegForm';
import { OptionsPayoffChart } from './OptionsPayoffChart';
import { StrategyMetrics } from './StrategyMetrics';
import { StrategyPresets } from './StrategyPresets';
import { analyzeStrategy, type OptionLeg } from '@/lib/options';

const defaultLeg: OptionLeg = {
  type: 'call',
  position: 'long',
  strike: 100,
  premium: 5,
  quantity: 1,
};

export function OptionsStrategyTutorial() {
  const [legs, setLegs] = useState<OptionLeg[]>([defaultLeg]);
  const [strategyName, setStrategyName] = useState('Custom Strategy');
  const[StrategyIntroduction,setStrategyIntroduction] = useState ('Custom Strategy');
  const [basePrice, setBasePrice] = useState(100);

  const analysis = useMemo(() => analyzeStrategy(legs), [legs]);

  const handleAddLeg = () => {
    const lastLeg = legs[legs.length - 1];
    setLegs([
      ...legs,
      {
        ...defaultLeg,
        strike: lastLeg?.strike || basePrice,
        type: lastLeg?.type === 'call' ? 'put' : 'call',
      },
    ]);
  };

  const handleUpdateLeg = (index: number, leg: OptionLeg) => {
    const newLegs = [...legs];
    newLegs[index] = leg;
    setLegs(newLegs);
    setStrategyName('Custom Strategy');
    setStrategyIntroduction('Custom Strategy');
  };

  const handleRemoveLeg = (index: number) => {
    setLegs(legs.filter((_, i) => i !== index));
    setStrategyName('Custom Strategy');
    setStrategyIntroduction('Custom Strategy');
  };

  const handleSelectPreset = (presetLegs: OptionLeg[], name: string, introduction:string) => {
    // Adjust strikes relative to base price
    const adjustedLegs = presetLegs.map((leg) => ({
      ...leg,
      strike: leg.strike - 100 + basePrice,
    }));
    setLegs(adjustedLegs);
    setStrategyName(name);
    setStrategyIntroduction(introduction);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Options Strategy Tutorial</h2>
          <p className="text-muted-foreground text-sm">
            10 Options Strategies Every Investor Should Know
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Label className="text-sm text-muted-foreground whitespace-nowrap">Base Price</Label>
          <Input
            type="number"
            value={basePrice}
            onChange={(e) => setBasePrice(parseFloat(e.target.value) || 100)}
            className="w-24 h-9 bg-background/50"
            min={1}
            step={1}
          />
        </div>
      </div>

      {/* Presets */}
      <StrategyPresets onSelectPreset={handleSelectPreset} basePrice={basePrice} />

      {/* Metrics */}
      {/* <StrategyMetrics analysis={analysis} /> */}

      {/* Chart */}
      <OptionsPayoffChart analysis={analysis} strategyName={strategyName} StrategyIntroduction = {StrategyIntroduction}/>

      {/* Legs */}
      <div className="space-y-4">
        {/* <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Option Legs</h3>
          <Button onClick={handleAddLeg} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Leg
          </Button>
        </div> */}

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {legs.map((leg, index) => (
            <OptionLegForm
              key={index}
              leg={leg}
              index={index}
              onChange={handleUpdateLeg}
              onRemove={handleRemoveLeg}
              canRemove={legs.length > 1}
            />
          ))}
        </div> */}
      </div>
    </div>
  );
}
