import React, { useState } from 'react';
import { Building2, Plus, Filter, Search, MoreHorizontal, Trash2, Edit2, CheckCircle, XCircle, Eye, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useProperties, useDeleteProperty, useTogglePropertyStatus } from '../../services/api';
import { cn } from '../../lib/utils';
import PropertyForm from './PropertyForm';
import PropertyMediaForm from './PropertyMediaForm';
import PropertyView from './PropertyView';
import { Property } from '../../types';

export default function Properties() {
  const { data: properties, isLoading } = useProperties();
  const deleteProperty = useDeleteProperty();
  const toggleStatus = useTogglePropertyStatus();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editProperty, setEditProperty] = useState<Property | null>(null);
  const [viewProperty, setViewProperty] = useState<Property | null>(null);
  const [mediaFormId, setMediaFormId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProperties = properties?.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location?.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this property? This will also remove all associated media.')) {
      deleteProperty.mutate(id);
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
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Building2 className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Properties Module</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Property Management</h2>
          <p className="text-slate-500 font-medium mt-1">Manage your real estate portfolio, listings, and assets.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-64"
            />
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Property</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            Fetching properties...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Property</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Price</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredProperties?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      {searchQuery ? 'No properties match your search.' : 'No properties found. Click "Add Property" to create one.'}
                    </td>
                  </tr>
                ) : null}
                {filteredProperties?.map((property) => (
                  <tr key={property.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {property.media?.coverImage ? (
                          <img
                            src={property.media.coverImage}
                            alt={property.title}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-100 p-0.5"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
                            <Building2 className="w-5 h-5 text-slate-400" />
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 leading-tight">{property.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-tight">{property.category}</span>
                            <span className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">{property.location?.city}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">₹{property.price?.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-500 uppercase">{property.purpose}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(property.id)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors",
                          property.status === 'active'
                            ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                        )}
                      >
                        {property.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {property.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2  transition-opacity">
                        <button onClick={() => setViewProperty(property)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditProperty(property)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all" title="Edit Basic Info">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setMediaFormId(property.id)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Manage Media">
                          <ImageIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(property.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Delete Property">
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
          <PropertyForm
            onClose={() => setIsFormOpen(false)}
            onSuccess={(newPropertyId) => {
              setIsFormOpen(false);
              if (newPropertyId) setMediaFormId(newPropertyId);
            }}
          />
        )}
        {editProperty && (
          <PropertyForm
            initialData={editProperty}
            onClose={() => setEditProperty(null)}
            onSuccess={() => setEditProperty(null)}
          />
        )}
        {viewProperty && (
          <PropertyView
            property={viewProperty}
            onClose={() => setViewProperty(null)}
          />
        )}
        {mediaFormId && (
          <PropertyMediaForm
            propertyId={mediaFormId}
            onClose={() => setMediaFormId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
