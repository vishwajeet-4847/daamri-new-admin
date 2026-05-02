import React from 'react';
import { Clock, CheckCircle2, AlertCircle, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { useActivities } from '../../services/api';
import { cn } from '../../lib/utils';

export function ActivityFeed() {
  const { data: activities, isLoading } = useActivities();

  const getIcon = (type: string) => {
    switch (type) {
      case 'listing': return <Clock className="w-4 h-4 text-indigo-600" />;
      case 'kyc': return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'payment': return <RefreshCcw className="w-4 h-4 text-amber-600" />;
      default: return <AlertCircle className="w-4 h-4 text-slate-600" />;
    }
  };

  if (isLoading) return <div className="h-64 flex items-center justify-center text-slate-400">Loading flux...</div>;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
        <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View All</button>
      </div>

      <div className="space-y-6">
        {activities?.map((activity, index) => (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            key={activity.id} 
            className="flex gap-4 group"
          >
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center border border-slate-100 transition-colors group-hover:bg-slate-50",
                activity.type === 'listing' ? "bg-indigo-50/50" : 
                activity.type === 'kyc' ? "bg-emerald-50/50" : "bg-amber-50/50"
              )}>
                {getIcon(activity.type)}
              </div>
              {index !== (activities?.length || 0) - 1 && (
                <div className="w-[1px] flex-1 bg-slate-100 my-2"></div>
              )}
            </div>
            
            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-bold text-slate-900">{activity.title}</h4>
                <span className="text-[11px] font-medium text-slate-400">{activity.time}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed tracking-wide">
                {activity.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
