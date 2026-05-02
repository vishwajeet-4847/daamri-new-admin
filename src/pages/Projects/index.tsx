import React, { useState } from 'react';
import { Briefcase, Plus, Filter, Search, Edit2, Trash2, CheckCircle, XCircle, Eye, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useProjects, useDeleteProject, useToggleProjectStatus } from '../../services/api';
import { cn } from '../../lib/utils';
import ProjectForm from './ProjectForm';
import ProjectMediaForm from './ProjectMediaForm';
import ProjectView from './ProjectView';
import { Project } from '../../types';

export default function Projects() {
  const { data: projects, isLoading } = useProjects();
  const deleteProject = useDeleteProject();
  const toggleStatus = useToggleProjectStatus();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [viewProject, setViewProject] = useState<Project | null>(null);
  const [mediaFormId, setMediaFormId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects?.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location?.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project? This will also remove all associated media.')) {
      deleteProject.mutate(id);
    }
  };

  const handleToggleStatus = (id: string) => {
    toggleStatus.mutate(id);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-rose-100 rounded-lg">
              <Briefcase className="w-5 h-5 text-rose-600" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Projects Module</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Project Management</h2>
          <p className="text-slate-500 font-medium mt-1">Oversee developments, commercial projects, and their milestones.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all w-64"
            />
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mb-4"></div>
            Fetching projects...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Project</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Pricing Strategy</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredProjects?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      {searchQuery ? 'No projects match your search.' : 'No projects found. Click "Add Project" to create one.'}
                    </td>
                  </tr>
                ) : null}
                {filteredProjects?.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {project.media?.coverImage ? (
                          <img
                            src={project.media.coverImage}
                            alt={project.title}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-100 p-0.5"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
                            <Briefcase className="w-5 h-5 text-slate-400" />
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 leading-tight">{project.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-tight">{project.projectStatus?.replace(/_/g, ' ') || 'Project'}</span>
                            <span className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">{project.location?.city}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-900">
                        {project.priceRange?.min && project.priceRange?.max
                          ? `₹${project.priceRange.min.toLocaleString()} - ₹${project.priceRange.max.toLocaleString()}`
                          : 'N/A'
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(project.id)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors",
                          project.availabilityStatus === 'active'
                            ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        )}
                      >
                        {project.availabilityStatus === 'active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {project.availabilityStatus}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2  transition-opacity">
                        <button onClick={() => setViewProject(project)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditProject(project)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all" title="Edit Basic Info">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setMediaFormId(project.id)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Manage Media">
                          <ImageIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(project.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Delete Project">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <ProjectForm
            onClose={() => setIsFormOpen(false)}
            onSuccess={(newProjectId) => {
              setIsFormOpen(false);
              if (newProjectId) setMediaFormId(newProjectId);
            }}
          />
        )}
        {editProject && (
          <ProjectForm
            initialData={editProject}
            onClose={() => setEditProject(null)}
            onSuccess={() => setEditProject(null)}
          />
        )}
        {viewProject && (
          <ProjectView
            project={viewProject}
            onClose={() => setViewProject(null)}
          />
        )}
        {mediaFormId && (
          <ProjectMediaForm
            projectId={mediaFormId}
            onClose={() => setMediaFormId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
