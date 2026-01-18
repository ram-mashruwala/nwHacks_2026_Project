import { BookOpen, Target, TrendingUp, Shield, AlertTriangle, AlertOctagon } from 'lucide-react';
import { strategyExplanations, type StrategyExplanation as StrategyExplanationType, type RiskLevel } from '../../lib/strategyExplanations';

interface StrategyExplanationProps {
  strategyName: string;
}

const riskLevelConfig: Record<RiskLevel, { label: string; color: string; bgColor: string; icon: typeof Shield }> = {
  'low': {
    label: 'Low Risk',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10 border-green-500/30',
    icon: Shield,
  },
  'medium': {
    label: 'Medium Risk',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10 border-yellow-500/30',
    icon: AlertTriangle,
  },
  'high': {
    label: 'High Risk',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10 border-orange-500/30',
    icon: AlertTriangle,
  },
  'very-high': {
    label: 'Very High Risk',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10 border-red-500/30',
    icon: AlertOctagon,
  },
};

export function StrategyExplanation({ strategyName }: StrategyExplanationProps) {
  const explanation = strategyExplanations[strategyName];

  if (!explanation) {
    return null;
  }

  const riskConfig = riskLevelConfig[explanation.riskLevel];
  const RiskIcon = riskConfig.icon;

  const sections = [
    {
      icon: BookOpen,
      title: 'What It Is',
      content: explanation.whatItIs,
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10',
    },
    {
      icon: Target,
      title: 'When to Use',
      content: explanation.whenToUse,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
    },
    {
      icon: TrendingUp,
      title: 'How It Works',
      content: explanation.howItWorks,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
    },
  ];

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-foreground">{explanation.name}</h2>
        
        {/* Risk Level Badge */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${riskConfig.bgColor}`}>
          <RiskIcon className={`h-5 w-5 ${riskConfig.color}`} />
          <span className={`font-semibold ${riskConfig.color}`}>{riskConfig.label}</span>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        {sections.map((section) => (
          <div key={section.title} className="p-4 rounded-lg bg-background/50 border border-border/30">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded ${section.bgColor}`}>
                <section.icon className={`h-4 w-4 ${section.color}`} />
              </div>
              <h3 className="font-medium text-foreground">{section.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>

      {/* Risk Explanation */}
      <div className={`p-4 rounded-lg border ${riskConfig.bgColor}`}>
        <div className="flex items-start gap-3">
          <RiskIcon className={`h-5 w-5 mt-0.5 ${riskConfig.color} flex-shrink-0`} />
          <div>
            <h3 className={`font-medium mb-1 ${riskConfig.color}`}>Risk Assessment</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{explanation.riskExplanation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
