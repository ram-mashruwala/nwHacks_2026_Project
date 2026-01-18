import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptionLegForm } from "./OptionLegForm";
import { OptionsPayoffChart } from "./OptionsPayoffChart";
import { StrategyMetrics } from "./StrategyMetrics";
import { StrategyPresets } from "./StrategyPresets";
import { SaveStrategyDialog } from "./SaveStrategyDialog";
import { LoadStrategyDialog } from "./LoadStrategyDialog";
import { analyzeStrategy, type OptionLeg } from "@/lib/options";
import { saveStrategy, type SavedStrategy } from "@/lib/strategyStorage";
import { toast } from "@/hooks/use-toast";

const defaultLeg: OptionLeg = {
  type: "call",
  position: "long",
  strike: 100,
  premium: 5,
  quantity: 1,
};

export function OptionsStrategyBuilder() {
  const [legs, setLegs] = useState<OptionLeg[]>([defaultLeg]);
  const [strategyName, setStrategyName] = useState("Custom Strategy");
  const [basePrice] = useState(100);
  const [isSaving, setIsSaving] = useState(false);

  const analysis = useMemo(() => analyzeStrategy(legs), [legs]);

  const handleSaveStrategy = async (name: string) => {
    setIsSaving(true);
    try {
      await saveStrategy(name, legs);
      setStrategyName(name);
      toast({
        title: "Strategy Saved",
        description: `"${name}" has been saved successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save strategy",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadStrategy = (strategy: SavedStrategy) => {
    setLegs(strategy.legs);
    setStrategyName(strategy.name);
  };

  const handleAddLeg = () => {
    const lastLeg = legs[legs.length - 1];
    setLegs([
      ...legs,
      {
        ...defaultLeg,
        strike: lastLeg?.strike || basePrice,
        type: lastLeg?.type === "call" ? "put" : "call",
      },
    ]);
  };

  const handleUpdateLeg = (index: number, leg: OptionLeg) => {
    const newLegs = [...legs];
    newLegs[index] = leg;
    setLegs(newLegs);
    setStrategyName("Custom Strategy");
  };

  const handleRemoveLeg = (index: number) => {
    setLegs(legs.filter((_, i) => i !== index));
    setStrategyName("Custom Strategy");
  };

  const handleSelectPreset = (presetLegs: OptionLeg[], name: string) => {
    // Adjust strikes relative to base price
    const adjustedLegs = presetLegs.map((leg) => ({
      ...leg,
      strike: leg.strike - 100 + basePrice,
    }));
    setLegs(adjustedLegs);
    setStrategyName(name);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Options Strategy Builder</h2>
          <p className="text-muted-foreground text-sm">
            Visualize breakevens, max profit/loss for any options strategy
          </p>
        </div>
        <div className="flex gap-2">
          <SaveStrategyDialog
            currentName={strategyName}
            onSave={handleSaveStrategy}
            isSaving={isSaving}
          />
          <LoadStrategyDialog onLoad={handleLoadStrategy} />
        </div>
      </div>

      {/* Presets */}
      <StrategyPresets onSelectPreset={handleSelectPreset} basePrice={basePrice} />

      {/* Metrics */}
      <StrategyMetrics analysis={analysis} />

      {/* Chart */}
      <OptionsPayoffChart analysis={analysis} strategyName={strategyName} />

      {/* Legs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Option Legs</h3>
          <Button onClick={handleAddLeg} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Leg
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        </div>
      </div>
    </div>
  );
}
