import React from 'react';
import { Search, Bell, Calendar, HelpCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function TopNav() {
  const { user } = useAuth();
  
  return (
    <header id="top-nav" className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex items-center gap-8 flex-1">
        {/* Search Bar */}
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search properties, projects, or documents..."
            className="w-full bg-slate-100 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Date Widget */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-600">{new Date().toLocaleDateString()}</span>
        </div>

        {/* Notifications */}
        <div className="flex items-center gap-2 px-1">
          <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full relative transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Divider */}
        <div className="w-[1px] h-6 bg-slate-200 mx-2"></div>

        {/* User Mini Profile */}
        <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-slate-100 transition-colors">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-900 leading-tight">{user?.name?.split(' ')[0] || "Alexander"}</p>
            <p className="text-[10px] text-slate-500 font-medium leading-tight">Admin</p>
          </div>
          <img 
            src={user?.avatar || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80"} 
            alt="Profile" 
            className="w-8 h-8 rounded-full border border-slate-200"
          />
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </header>
  );
}
