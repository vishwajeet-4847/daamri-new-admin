import React from 'react';
import { MoreHorizontal, FileText, MapPin, Tag } from 'lucide-react';
import { useProperties } from '../../services/api';
import { cn } from '../../lib/utils';

export function PropertyTable() {
  const { data: properties, isLoading } = useProperties();

  if (isLoading) return <div className="h-64 flex items-center justify-center text-slate-400">Fetching properties...</div>;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Portfolio Overview</h3>
          <p className="text-xs text-slate-500 mt-1">Status and performance of managed assets</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors">Filters</button>
          <button className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors">Export CSV</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Asset Details</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Location</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Price</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {properties?.map((property) => (
              <tr key={property.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={property.media?.coverImage} 
                      alt={property.title} 
                      className="w-12 h-12 rounded-xl object-cover border border-slate-100 p-0.5"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">{property.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-tight">{property.proprtyType}</span>
                        <span className="text-[10px] text-slate-400 font-medium">#{property.id?.substring(0, 8)}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{property.location?.city}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-slate-900">${property.price?.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    property.status === 'active' ? "bg-emerald-50 text-emerald-600" : 
                    property.status === 'inactive' ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                  )}>
                    {property.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                      <FileText className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-auto p-4 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between text-[11px] font-medium text-slate-500">
        <span>Showing {properties?.length} assets out of 24 total</span>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 bg-white border border-slate-200 rounded disabled:opacity-50" disabled>Prev</button>
          <button className="px-2 py-1 bg-white border border-slate-200 rounded">Next</button>
        </div>
      </div>
    </div>
  );
}
