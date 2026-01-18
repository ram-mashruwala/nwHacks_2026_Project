import { Button } from '@/components/ui/button';
import { getPresets, type PresetConfig } from '../../lib/strategyPresetData';

interface TutorialStrategyPresetsProps {
  selectedStrategy: string | null;
  onSelectStrategy: (preset: PresetConfig) => void;
  basePrice?: number;
}

export function TutorialStrategyPresets({ 
  selectedStrategy, 
  onSelectStrategy, 
  basePrice = 100 
}: TutorialStrategyPresetsProps) {
  const presets = getPresets(basePrice);

  return (
    <div className="glass-card p-4">
      <h3 className="text-sm font-medium text-foreground mb-3">Select a Strategy to Learn</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {presets.map((preset) => {
          const isSelected = selectedStrategy === preset.name;
          return (
            <Button
              key={preset.name}
              variant="outline"
              size="sm"
              className={`
                h-auto py-2 px-3 flex flex-col items-start text-left border-border/50 transition-all
                ${isSelected 
                  ? 'bg-primary/20 border-primary ring-1 ring-primary' 
                  : 'bg-background/30 hover:bg-primary/10'
                }
              `}
              onClick={() => onSelectStrategy(preset)}
            >
              <span className="text-xs font-medium">{preset.name}</span>
              <span className="text-[10px] text-muted-foreground">{preset.description}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
