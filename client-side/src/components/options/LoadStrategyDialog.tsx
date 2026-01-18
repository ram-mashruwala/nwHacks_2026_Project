import { useState, useEffect } from "react";
import { FolderOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { loadStrategies, deleteStrategy, type SavedStrategy } from "@/lib/strategyStorage";
import { toast } from "@/hooks/use-toast";

interface LoadStrategyDialogProps {
  onLoad: (strategy: SavedStrategy) => void;
}

export function LoadStrategyDialog({ onLoad }: LoadStrategyDialogProps) {
  const [open, setOpen] = useState(false);
  const [strategies, setStrategies] = useState<SavedStrategy[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStrategies = async () => {
    setIsLoading(true);
    try {
      const loaded = await loadStrategies();
      setStrategies(loaded);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load strategies",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchStrategies();
    }
  }, [open]);

  const handleLoad = (strategy: SavedStrategy) => {
    onLoad(strategy);
    setOpen(false);
    toast({
      title: "Strategy Loaded",
      description: `"${strategy.name}" has been loaded`,
    });
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteStrategy(id);
      setStrategies((prev) => prev.filter((s) => s.id !== id));
      toast({
        title: "Strategy Deleted",
        description: "The strategy has been removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete strategy",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FolderOpen className="h-4 w-4" />
          Load Strategy
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Load Strategy</DialogTitle>
          <DialogDescription>
            Select a saved strategy to load.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              Loading...
            </div>
          ) : strategies.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              No saved strategies yet
            </div>
          ) : (
            <div className="space-y-2">
              {strategies.map((strategy) => (
                <div
                  key={strategy.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => handleLoad(strategy)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{strategy.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {strategy.legs.length} leg{strategy.legs.length !== 1 ? "s" : ""} •{" "}
                      {new Date(strategy.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={(e) => handleDelete(e, strategy.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
