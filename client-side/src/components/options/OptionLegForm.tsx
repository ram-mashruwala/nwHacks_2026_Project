import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { OptionLeg, OptionType, PositionType } from '@/lib/options';

interface OptionLegFormProps {
  leg: OptionLeg;
  index: number;
  onChange: (index: number, leg: OptionLeg) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export function OptionLegForm({ leg, index, onChange, onRemove, canRemove }: OptionLegFormProps) {
  const updateField = <K extends keyof OptionLeg>(field: K, value: OptionLeg[K]) => {
    onChange(index, { ...leg, [field]: value });
  };

  return (
    <div className="glass-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Leg {index + 1}</span>
        {canRemove && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Type</Label>
          <Select
            value={leg.type}
            onValueChange={(value: OptionType) => updateField('type', value)}
          >
            <SelectTrigger className="h-9 bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="call">Call</SelectItem>
              <SelectItem value="put">Put</SelectItem>
              <SelectItem value="stock">Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Position</Label>
          <Select
            value={leg.position}
            onValueChange={(value: PositionType) => updateField('position', value)}
          >
            <SelectTrigger className="h-9 bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="long">Long (Buy)</SelectItem>
              <SelectItem value="short">Short (Sell)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">
            {leg.type === 'stock' ? 'Purchase Price ($)' : 'Strike ($)'}
          </Label>
          <Input
            type="number"
            value={leg.strike}
            onChange={(e) => updateField('strike', parseFloat(e.target.value) || 0)}
            className="h-9 bg-background/50"
            min={0}
            step={1}
          />
        </div>

        {leg.type !== 'stock' && (
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Premium ($)</Label>
            <Input
              type="number"
              value={leg.premium}
              onChange={(e) => updateField('premium', parseFloat(e.target.value) || 0)}
              className="h-9 bg-background/50"
              min={0}
              step={0.01}
            />
          </div>
        )}

        <div className="space-y-1.5 col-span-2">
          <Label className="text-xs text-muted-foreground">Quantity (contracts)</Label>
          <Input
            type="number"
            value={leg.quantity}
            onChange={(e) => updateField('quantity', parseInt(e.target.value) || 1)}
            className="h-9 bg-background/50"
            min={1}
            step={1}
          />
        </div>
      </div>

      <div className="text-xs text-muted-foreground pt-2 border-t border-border/30">
        {leg.position === 'long' ? 'Buy' : 'Sell'} {leg.quantity} {leg.type.toUpperCase()}
        {leg.quantity > 1 ? 's' : ''} @ ${leg.strike}{leg.type === 'stock' ? '' : ` strike for $${leg.premium}/contract`}
      </div>
    </div>
  );
}
