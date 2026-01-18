import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { TutorialStrategyPresets } from '@/components/tutorial/TutorialStrategyPresets';
import { StrategyExplanation } from '@/components/tutorial/StrategyExplanation';
import { OptionsTerminology } from '@/components/tutorial/OptionsTerminology';
import { StrategyContractExample } from '@/components/tutorial/StrategyContractExample';
import { OptionsPayoffChart } from '@/components/options/OptionsPayoffChart';import { StrategyMetrics } from '@/components/options/StrategyMetrics';
import { analyzeStrategy } from '@/lib/options';
import type { PresetConfig } from '@/lib/strategyPresetData';
import { BookOpen } from 'lucide-react';

const Tutorial = () => {
  const [selectedPreset, setSelectedPreset] = useState<PresetConfig | null>(null);
  const basePrice = 100;

  const analysis = useMemo(() => {
    if (!selectedPreset) return null;
    return analyzeStrategy(selectedPreset.legs);
  }, [selectedPreset]);

  const handleSelectStrategy = (preset: PresetConfig) => {
    setSelectedPreset(preset);
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <Header />
        
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Options Strategy Tutorial</h1>
          </div>
          <p className="text-muted-foreground">
            Learn about common options strategies. Click on any strategy below to see a detailed explanation and visualize its payoff diagram.
          </p>
        </div>

         {/* Terminology Section */}
        <div className="mb-6">
          <OptionsTerminology />
        </div>

        <div className="space-y-6">
          <TutorialStrategyPresets
            selectedStrategy={selectedPreset?.name ?? null}
            onSelectStrategy={handleSelectStrategy}
            basePrice={basePrice}
          />

          {selectedPreset && analysis && (
            <>
              <StrategyExplanation strategyName={selectedPreset.name} />
              <StrategyContractExample 
              strategyName={selectedPreset.name} 
              legs={selectedPreset.legs} 
              basePrice={basePrice} 
              />
              <StrategyMetrics analysis={analysis} />
              <OptionsPayoffChart analysis={analysis} strategyName={selectedPreset.name} />
            </>
          )}

          {!selectedPreset && (
            <div className="glass-card p-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                Select a strategy above to learn more about it
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
