import React, { useState, useEffect } from 'react';
import { X, Building2, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { useCreateProperty, useUpdateProperty } from '../../services/api';
import { Property } from '../../types';
import { PROPERTY_CATEGORIES, PropertyTypeKey } from '../../constants/propertyCategories';

interface PropertyFormProps {
  onClose: () => void;
  onSuccess: (id?: string) => void;
  initialData?: Property;
}

export default function PropertyForm({ onClose, onSuccess, initialData }: PropertyFormProps) {
  const isEdit = !!initialData;
  const createProperty = useCreateProperty();
  const updateProperty = useUpdateProperty();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    purpose: 'sale',
    proprtyType: 'residential',
    category: PROPERTY_CATEGORIES.residential.subcategories[0].value,
    configuration: '',
    locationCity: '',
    locationAddress: '',
    locationLocality: '',
    locationState: '',
    areaValue: '',
    areaUnit: 'sqft',
    amenities: '',
    tags: '',
    ytVideo: '',
    isFeatured: false,
  });

  useEffect(() => {
    if (initialData) {
      const propertyType = (initialData.proprtyType || 'residential') as PropertyTypeKey;
      const firstSubcategory = PROPERTY_CATEGORIES[propertyType]?.subcategories[0]?.value;
      
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price?.toString() || '',
        purpose: initialData.purpose || 'sale',
        proprtyType: propertyType,
        category: initialData.category || firstSubcategory || 'flat',
        configuration: initialData.configuration || '',
        locationCity: initialData.location?.city || '',
        locationAddress: initialData.location?.address || '',
        locationLocality: initialData.location?.locality || '',
        locationState: initialData.location?.state || '',
        areaValue: initialData.area?.value?.toString() || '',
        areaUnit: initialData.area?.unit || 'sqft',
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
    
    setFormData(prev => {
      const updated = { 
        ...prev, 
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : normalizedValue 
      };

      // When property type changes, reset category to first available option
      if (name === 'proprtyType') {
        const firstSubcategory = PROPERTY_CATEGORIES[normalizedValue as PropertyTypeKey]?.subcategories[0];
        if (firstSubcategory) {
          updated.category = firstSubcategory.value;
        }
      }

      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      purpose: formData.purpose,
      proprtyType: formData.proprtyType,
      category: formData.category,
      configuration: formData.configuration,
      location: { 
        city: formData.locationCity, 
        address: formData.locationAddress,
        locality: formData.locationLocality,
        state: formData.locationState,
      },
      area: { value: Number(formData.areaValue), unit: formData.areaUnit },
      amenities: formData.amenities.split(',').map(s => s.trim()).filter(Boolean),
      tags: formData.tags.toUpperCase().split(',').map(s => s.trim()).filter(Boolean),
      ytVideo: formData.ytVideo,
      isFeatured: formData.isFeatured,
    };

    try {
      if (isEdit && initialData?.id) {
        await updateProperty.mutateAsync({ id: initialData.id, data: payload });
        onSuccess(initialData.id);
      } else {
        const result = await createProperty.mutateAsync(payload);
        onSuccess(result?.id || result?._id);
      }
    } catch (error) {
      console.error('Failed to save property:', error);
      alert('Failed to save property. See console for details.');
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <motion.div 
        initial={{ x: '100%' }} 
        animate={{ x: 0 }} 
        exit={{ x: '100%' }} 
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{isEdit ? 'Edit Property' : 'Add New Property'}</h3>
              <p className="text-xs text-slate-500 font-medium">{isEdit ? 'Update basic details' : 'Step 1: Enter property details'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="property-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Property Title</label>
                <input required name="title" value={formData.title} onChange={handleChange} type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Luxury Villa in Beverly Hills" />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Description</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Describe the property..." />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Price (₹)</label>
                <input required name="price" value={formData.price} onChange={handleChange} type="number" min="0" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="15000000" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Purpose</label>
                <select name="purpose" value={formData.purpose} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 bg-white">
                  <option value="sale">Sale</option>
                  <option value="rent">Rent</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Property Type</label>
                <select name="proprtyType" value={formData.proprtyType} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 bg-white">
                  {Object.entries(PROPERTY_CATEGORIES).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 bg-white">
                  {PROPERTY_CATEGORIES[formData.proprtyType as PropertyTypeKey]?.subcategories.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Configuration</label>
                <input required name="configuration" value={formData.configuration} onChange={handleChange} type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 4BHK" />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Area</label>
                <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                  <input
                    required
                    name="areaValue"
                    value={formData.areaValue}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    className="flex-1 px-4 py-2.5 text-sm outline-none"
                    placeholder="2500"
                  />
                  <select
                    name="areaUnit"
                    value={formData.areaUnit}
                    onChange={handleChange}
                    className="h-full w-28 border-l border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"
                  >
                    <option value="sqft">sqft</option>
                    <option value="sqm">sqm</option>
                    <option value="sqyd">sqyd</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">City</label>
                <input required name="locationCity" value={formData.locationCity} onChange={handleChange} type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Mumbai" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Address</label>
                <input required name="locationAddress" value={formData.locationAddress} onChange={handleChange} type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Street name, etc." />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">YouTube Video URL</label>
                <input name="ytVideo" value={formData.ytVideo} onChange={handleChange} type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="https://youtube.com/watch?v=..." />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Amenities (Comma separated)</label>
                <input name="amenities" value={formData.amenities} onChange={handleChange} type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Pool, Gym, Parking" />
              </div>

              <div className="flex items-center gap-3 md:col-span-2 py-2">
                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} id="isFeatured" className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                <label htmlFor="isFeatured" className="text-sm font-bold text-slate-700">Featured Property</label>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 mt-auto">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors">
            Cancel
          </button>
          <button 
            type="submit" 
            form="property-form" 
            disabled={createProperty.isPending || updateProperty.isPending}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {(createProperty.isPending || updateProperty.isPending) ? 'Saving...' : <><Save className="w-4 h-4" /> {isEdit ? 'Update Property' : 'Save & Continue to Media'}</>}
          </button>
        </div>
      </motion.div>
    </>
  );
}
