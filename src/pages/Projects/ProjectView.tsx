import React from 'react';
import { X, Briefcase, MapPin,  Building2, CheckCircle2, Calendar, Users, Video, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { Project } from '../../types';
import { toTitleCase, formatPrice } from '../../lib/stringUtils';

interface ProjectViewProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectView({ project, onClose }: ProjectViewProps) {
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50" onClick={onClose} />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }} className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col" >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Project Details</h3>
              <p className="text-xs text-slate-500 font-medium">Full information view</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {project.media?.coverImage && (
            <div className="w-full aspect-video relative">
              <img src={project.media.coverImage} className="w-full h-full object-cover" alt={project.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="px-3 py-1 bg-rose-600 text-[10px] font-bold text-white rounded-full uppercase tracking-wider mb-2 inline-block">{project.projectStatus.replace('_', ' ')}</span>
                <h2 className="text-2xl font-bold text-white leading-tight">{project.title}</h2>
                <div className="flex items-center gap-1.5 text-white/80 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">
                    {[project.location.address, project.location.locality, project.location.city, project.location.state]
                      .filter(Boolean)
                      .map(toTitleCase)
                      .join(', ')}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="p-8 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                
                  <span className="text-[10px] font-bold uppercase tracking-wider">Price Range</span>
                </div>
                <p className="text-sm font-bold text-slate-900">₹{formatPrice(project.priceRange?.min)} - ₹{formatPrice(project.priceRange?.max)}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Total Units</span>
                </div>
                <p className="text-lg font-bold text-slate-900">{project.totalUnits || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Launch Date</span>
                </div>
                <p className="text-sm font-bold text-slate-900">{project.launchDate ? new Date(project.launchDate).toLocaleDateString() : 'TBA'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Listing</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${project.availabilityStatus === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                  {project.availabilityStatus}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">About Project</h4>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{project.about || project.description}</p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {project.amenities?.map((amenity, i) => (
                  <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-xl border border-slate-200">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {project.tags && project.tags.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-xl border border-amber-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.media?.gallery && project.media.gallery.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Gallery</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {project.media.gallery.map((url, i) => (
                    <img key={i} src={url} className="aspect-video w-full object-cover rounded-xl border border-slate-100" alt={`Gallery ${i}`} />
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Links & Files</h4>
              <div className="flex flex-wrap gap-4">
                {project.media?.brochure && (
                  <a href={project.media.brochure} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100 text-sm font-bold hover:bg-indigo-100 transition-colors">
                    <FileText className="w-4 h-4" /> Download Brochure
                  </a>
                )}
                {project.ytVideo && (
                  <a href={project.ytVideo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 text-sm font-bold hover:bg-rose-100 transition-colors">
                    <Video className="w-4 h-4" /> YouTube Video
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
