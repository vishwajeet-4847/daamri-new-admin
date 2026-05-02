import React, { useState } from 'react';
import { X, Image as ImageIcon, UploadCloud, FileText, Video, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useUpdateProjectMedia, useDeleteProjectMedia, useProject } from '../../services/api';

interface ProjectMediaFormProps {
  projectId: string;
  onClose: () => void;
}

export default function ProjectMediaForm({ projectId, onClose }: ProjectMediaFormProps) {
  const { data: project, isLoading } = useProject(projectId);
  const updateMedia = useUpdateProjectMedia();
  const deleteMedia = useDeleteProjectMedia();

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [gallery, setGallery] = useState<FileList | null>(null);
  const [brochure, setBrochure] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (coverImage) formData.append('coverImage', coverImage);
    if (brochure) formData.append('brochure', brochure);
    if (video) formData.append('video', video);
    if (gallery) {
      for (let i = 0; i < gallery.length; i++) {
        formData.append('gallery', gallery[i]);
      }
    }

    try {
      await updateMedia.mutateAsync({ id: projectId, formData });
      setCoverImage(null);
      setGallery(null);
      setBrochure(null);
      setVideo(null);
      alert('Media uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload media:', error);
      alert('Failed to upload media.');
    }
  };

  const handleDelete = async (type: 'cover-image' | 'brochure' | 'gallery', images?: string[]) => {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        await deleteMedia.mutateAsync({ id: projectId, type, images });
      } catch (error) {
        alert('Failed to delete media');
      }
    }
  };

  if (isLoading) return null;

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]" >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Manage Project Media</h3>
              <p className="text-xs text-slate-500 font-medium">Update project visual assets</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-8">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Current Assets</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {project?.media?.coverImage && (
                <div className="relative aspect-video rounded-xl overflow-hidden group border border-slate-200">
                  <img src={project.media.coverImage} className="w-full h-full object-cover" alt="Cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => handleDelete('cover-image')} className="p-2 bg-white text-rose-600 rounded-lg shadow-lg hover:scale-110 transition-transform">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-indigo-600 text-[10px] font-bold text-white rounded">Cover</span>
                </div>
              )}
              {project?.media?.brochure && (
                <div className="relative aspect-video rounded-xl overflow-hidden group border border-slate-200 bg-slate-50 flex items-center justify-center p-4">
                  <div className="text-center">
                    <FileText className="w-8 h-8 text-indigo-600 mx-auto mb-1" />
                    <span className="text-[10px] font-bold text-slate-600 block truncate max-w-[120px]">Brochure</span>
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => handleDelete('brochure')} className="p-2 bg-white text-rose-600 rounded-lg shadow-lg hover:scale-110 transition-transform">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
              {project?.media?.video && (
                <div className="relative aspect-video rounded-xl overflow-hidden group border border-slate-200 bg-slate-50 flex items-center justify-center p-4">
                  <div className="text-center">
                    <Video className="w-8 h-8 text-indigo-600 mx-auto mb-1" />
                    <span className="text-[10px] font-bold text-slate-600 block">Video</span>
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => handleDelete('brochure')} className="p-2 bg-white text-rose-600 rounded-lg shadow-lg hover:scale-110 transition-transform">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
              {project?.media?.gallery?.map((url, i) => (
                <div key={i} className="relative aspect-video rounded-xl overflow-hidden group border border-slate-200">
                  <img src={url} className="w-full h-full object-cover" alt="Gallery" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => handleDelete('gallery', [url])} className="p-2 bg-white text-rose-600 rounded-lg shadow-lg hover:scale-110 transition-transform">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Upload New</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Cover Image</label>
                <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors relative">
                  <input type="file" accept="image/*" onChange={e => setCoverImage(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="text-[10px] font-medium text-slate-600 truncate">{coverImage ? coverImage.name : 'Choose cover'}</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Brochure (PDF)</label>
                <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors relative">
                  <input type="file" accept=".pdf" onChange={e => setBrochure(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <FileText className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="text-[10px] font-medium text-slate-600 truncate">{brochure ? brochure.name : 'Choose brochure'}</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Video</label>
                <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors relative">
                  <input type="file" accept="video/*" onChange={e => setVideo(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <Video className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="text-[10px] font-medium text-slate-600 truncate">{video ? video.name : 'Choose video'}</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Gallery Images</label>
                <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors relative">
                  <input type="file" multiple accept="image/*" onChange={e => setGallery(e.target.files)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="text-[10px] font-medium text-slate-600 truncate">{gallery ? `${gallery.length} files` : 'Choose files'}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button onClick={onClose} type="button" className="px-6 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-100">Close</button>
              <button type="submit" disabled={updateMedia.isPending || !coverImage && !gallery && !brochure && !video} className="px-6 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50" >
                {updateMedia.isPending ? 'Uploading...' : 'Upload Selected'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
}
