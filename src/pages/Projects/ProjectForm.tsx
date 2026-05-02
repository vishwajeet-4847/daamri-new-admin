import React, { useState, useEffect } from 'react';
import { X, Briefcase, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { useCreateProject, useUpdateProject } from '../../services/api';
import { Project } from '../../types';

interface ProjectFormProps {
  onClose: () => void;
  onSuccess: (id?: string) => void;
  initialData?: Project;
}

export default function ProjectForm({ onClose, onSuccess, initialData }: ProjectFormProps) {
  const isEdit = !!initialData;
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    about: '',
    minPrice: '',
    maxPrice: '',
    projectStatus: 'pre_launch',
    availabilityStatus: 'inactive',
    locationCity: '',
    locationAddress: '',
    locationLocality: '',
    locationState: '',
    totalUnits: '',
    launchDate: '',
    amenities: '',
    tags: '',
    ytVideo: '',
    isFeatured: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        about: initialData.about || '',
        minPrice: initialData.priceRange?.min?.toString() || '',
        maxPrice: initialData.priceRange?.max?.toString() || '',
        projectStatus: initialData.projectStatus || 'pre_launch',
        availabilityStatus: initialData.availabilityStatus || 'inactive',
        locationCity: initialData.location?.city || '',
        locationAddress: initialData.location?.address || '',
        locationLocality: initialData.location?.locality || '',
        locationState: initialData.location?.state || '',
        totalUnits: initialData.totalUnits?.toString() || '',
        launchDate: initialData.launchDate ? new Date(initialData.launchDate).toISOString().split('T')[0] : '',
        amenities: initialData.amenities?.join(', ') || '',
        tags: initialData.tags?.join(', ').toUpperCase() || '',
        ytVideo: initialData.ytVideo || '',
        isFeatured: !!initialData.isFeatured,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const normalizedValue = name === 'tags' ? value.toUpperCase() : value;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : normalizedValue 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      title: formData.title,
      description: formData.description,
      about: formData.about,
      priceRange: { min: Number(formData.minPrice), max: Number(formData.maxPrice) },
      projectStatus: formData.projectStatus,
      availabilityStatus: formData.availabilityStatus,
      location: {
        city: formData.locationCity,
        address: formData.locationAddress,
        locality: formData.locationLocality,
        state: formData.locationState,
      },
      totalUnits: Number(formData.totalUnits),
      launchDate: formData.launchDate || null,
      amenities: formData.amenities.split(',').map(s => s.trim()).filter(Boolean),
      tags: formData.tags.toUpperCase().split(',').map(s => s.trim()).filter(Boolean),
      ytVideo: formData.ytVideo,
      isFeatured: formData.isFeatured,
    };

    try {
      if (isEdit && initialData?.id) {
        await updateProject.mutateAsync({ id: initialData.id, data: payload });
        onSuccess(initialData.id);
      } else {
        const result = await createProject.mutateAsync(payload);
        onSuccess(result?.id || result?._id);
      }
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project. See console for details.');
    }
  };

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
              <h3 className="text-lg font-bold text-slate-900">{isEdit ? 'Edit Project' : 'Create New Project'}</h3>
              <p className="text-xs text-slate-500 font-medium">{isEdit ? 'Update project details' : 'Step 1: Enter project details'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="project-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Project Title</label>
                <input required name="title" value={formData.title} onChange={handleChange} type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500" placeholder="e.g. Waterfront Residences Phase II" />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Short Description</label>
                <input required name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500" placeholder="Brief summary..." />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">About Project</label>
                <textarea name="about" value={formData.about} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500" placeholder="Detailed information about the project..." />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Min Price ($)</label>
                <input required name="minPrice" value={formData.minPrice} onChange={handleChange} type="number" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500" placeholder="500000" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Max Price ($)</label>
                <input required name="maxPrice" value={formData.maxPrice} onChange={handleChange} type="number" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500" placeholder="1500000" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Project Status</label>
                <select name="projectStatus" value={formData.projectStatus} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500 bg-white">
                  <option value="pre_launch">Pre Launch</option>
                  <option value="under_construction">Under Construction</option>
                  <option value="ready_to_move">Ready to Move</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Total Units</label>
                <input name="totalUnits" value={formData.totalUnits} onChange={handleChange} type="number" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500" placeholder="250" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Launch Date</label>
                <input name="launchDate" value={formData.launchDate} onChange={handleChange} type="date" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">City</label>
                <input required name="locationCity" value={formData.locationCity} onChange={handleChange} type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500" placeholder="Pune" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Address</label>
                <input required name="locationAddress" value={formData.locationAddress} onChange={handleChange} type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500" placeholder="Main Street, Area" />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">YouTube Video URL</label>
                <input name="ytVideo" value={formData.ytVideo} onChange={handleChange} type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500" placeholder="https://youtube.com/watch?v=..." />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Amenities (Comma separated)</label>
                <input name="amenities" value={formData.amenities} onChange={handleChange} type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500" placeholder="Clubhouse, Pool, Security" />
              </div>

              <div className="flex items-center gap-3 md:col-span-2 py-2">
                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} id="isFeatured" className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500" />
                <label htmlFor="isFeatured" className="text-sm font-bold text-slate-700">Featured Project</label>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 mt-auto">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors">
            Cancel
          </button>
          <button type="submit" form="project-form" disabled={createProject.isPending || updateProject.isPending} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 transition-colors disabled:opacity-50" >
            {(createProject.isPending || updateProject.isPending) ? 'Saving...' : <><Save className="w-4 h-4" /> {isEdit ? 'Update Project' : 'Save & Continue to Media'}</>}
          </button>
        </div>
      </motion.div>
    </>
  );
}
