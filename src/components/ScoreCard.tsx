import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { CheckCircle2, AlertCircle, TrendingUp, ShieldCheck } from 'lucide-react';

interface ScoreCardProps {
  score: number;
  label: string;
  description: string;
  type?: 'ats' | 'match' | 'german';
  isLoading?: boolean;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ score, label, description, type = 'ats', isLoading }) => {
  const getScoreColor = (s: number) => {
    if (s >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (s >= 70) return 'text-blue-600 bg-blue-50 border-blue-100';
    if (s >= 50) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-rose-600 bg-rose-50 border-rose-100';
  };

  const getIcon = () => {
    if (type === 'ats') return <ShieldCheck className="w-5 h-5" />;
    if (type === 'match') return <TrendingUp className="w-5 h-5" />;
    return <CheckCircle2 className="w-5 h-5" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-3xl p-8 border transition-all duration-500 shadow-sm",
        getScoreColor(score)
      )}
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-xl bg-white/50 shadow-sm")}>
              {getIcon()}
            </div>
            <span className="font-bold text-lg tracking-tight uppercase opacity-80">{label}</span>
          </div>
          {score >= 85 && (
            <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-white/50 px-3 py-1 rounded-full shadow-sm">
              <CheckCircle2 className="w-3 h-3" />
              Strong
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-7xl font-black tracking-tighter leading-none">
            {isLoading ? "..." : score}
          </span>
          <span className="text-2xl font-bold opacity-50">%</span>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium leading-relaxed opacity-80">
            {description}
          </p>
          <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-current opacity-80"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
