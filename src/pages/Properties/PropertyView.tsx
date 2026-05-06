import React from 'react';
import { X, Building2, MapPin, DollarSign, Ruler, CheckCircle2, Globe, Video, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { Property } from '../../types';
import { toTitleCase, formatPrice } from '../../lib/stringUtils';
import { PROPERTY_CATEGORIES, PropertyTypeKey } from '../../constants/propertyCategories';

interface PropertyViewProps {
  property: Property;
  onClose: () => void;
}

export default function PropertyView({ property, onClose }: PropertyViewProps) {
  const propertyTypeData = PROPERTY_CATEGORIES[property.proprtyType as PropertyTypeKey];
  const typeLabel = propertyTypeData?.label || toTitleCase(property.proprtyType);
  const categoryLabel = propertyTypeData?.subcategories.find(s => s.value === property.category)?.label 
    || toTitleCase(property.category);

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 no-scrollbar" onClick={onClose}  />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }} className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col" >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Property Details</h3>
              <p className="text-xs text-slate-500 font-medium">Full information view</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {property.media?.coverImage && (
            <div className="w-full aspect-video relative">
              <img src={property.media.coverImage} className="w-full h-full object-cover" alt={property.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="px-3 py-1 bg-indigo-600 text-[10px] font-bold text-white rounded-full uppercase tracking-wider mb-2 inline-block">{property.purpose}</span>
                <h2 className="text-2xl font-bold text-white leading-tight">{property.title}</h2>
                <div className="flex items-center gap-1.5 text-white/80 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">
                    {[property.location.address, property.location.locality, property.location.city, property.location.state]
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
                  <DollarSign className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Price</span>
                </div>
                <p className="text-lg font-bold text-slate-900">₹{formatPrice(property.price)}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Ruler className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Area</span>
                </div>
                <p className="text-lg font-bold text-slate-900">{property.area?.value} {property.area?.unit}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Building2 className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Config</span>
                </div>
                <p className="text-lg font-bold text-slate-900">{property.configuration}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Status</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${property.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {property.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Building2 className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Type</span>
                </div>
                <p className="text-lg font-bold text-slate-900">{typeLabel}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Building2 className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Category</span>
                </div>
                <p className="text-lg font-bold text-slate-900">{categoryLabel}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Available</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${property.propertyAvailability ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {property.propertyAvailability ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Globe className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Featured</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${property.isFeatured ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                  {property.isFeatured ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Description</h4>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{property.description}</p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {property.amenities?.map((amenity, i) => (
                  <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-xl border border-slate-200">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {property.tags && property.tags.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {property.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-xl border border-amber-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {property.media?.gallery && property.media.gallery.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Gallery</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.media.gallery.map((url, i) => (
                    <img key={i} src={url} className="aspect-video w-full object-cover rounded-xl border border-slate-100" alt={`Gallery ${i}`} />
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Links & Files</h4>
              <div className="flex flex-wrap gap-4">
                {property.media?.brochure && (
                  <a href={property.media.brochure} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100 text-sm font-bold hover:bg-indigo-100 transition-colors">
                    <FileText className="w-4 h-4" /> Download Brochure
                  </a>
                )}
                {property.ytVideo && (
                  <a href={property.ytVideo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 text-sm font-bold hover:bg-rose-100 transition-colors">
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
