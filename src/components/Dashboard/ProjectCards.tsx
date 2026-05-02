import React from 'react';
import { Calendar, ChevronRight, LayoutGrid } from 'lucide-react';
import { motion } from 'motion/react';
import { useProjects } from '../../services/api';
import { cn } from '../../lib/utils';

export function ProjectCards() {
  const { data: projects, isLoading } = useProjects();

  if (isLoading) return <div className="h-48 pt-10 text-center text-slate-400">Scanning projects...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">Project Development</h3>
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
          <LayoutGrid className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects?.map((project, index) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            key={project.id} 
            className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <img 
                src={project.media?.coverImage} 
                alt={project.title} 
                className="w-20 h-20 rounded-xl object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{project.title}</h4>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Due {project.launchDate || 'TBD'}
                </p>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1.5">
                    <span className={cn(
                      project.availabilityStatus === 'inactive' ? "text-amber-500" : "text-emerald-500"
                    )}>{project.projectStatus?.replace(/_/g, ' ')}</span>
                    <span className="text-slate-600">{project.totalUnits || 0} Units</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: project.availabilityStatus === 'active' ? '100%' : '50%' }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={cn(
                        "h-full rounded-full",
                        project.availabilityStatus === 'inactive' ? "bg-amber-500" : "bg-emerald-500"
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
