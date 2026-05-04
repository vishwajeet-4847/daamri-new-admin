import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  Building2,
  Layers,
  Users2,
  Settings,
  LogOut,
  ChevronRight,
  PlusCircle,
  Briefcase,

  User
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { icon: BarChart3, label: 'Analytics', path: '/' },
  { icon: Building2, label: 'Properties', path: '/properties' },
  { icon: Briefcase, label: 'Projects', path: '/projects' },
  { icon: User, label: 'Users', path: '/users' },
  { icon: Users2, label: 'Investors', path: '/investors' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const { logout, user } = useAuth();

  return (
    <aside id="sidebar" className="fixed left-0 top-0 h-screen w-64 bg-slate-950 border-r border-slate-800 flex flex-col z-50">
      {/* Brand */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Building2 className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-white font-bold text-xl tracking-tight">Daamrideals Admin</h1>
          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Enterprise v2.0</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-1">
        <p className="px-2 mb-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Main Menu</p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
              isActive
                ? "bg-indigo-600/10 text-indigo-400"
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </div>
            {/* Indication of active state */}
            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}

        <div className="mt-10 mb-4 px-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Quick Actions</p>
        </div>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-all group">
          <PlusCircle className="w-4 h-4 text-emerald-500" />
          <span>New Property</span>
        </button>
      </nav>

      {/* Footer Profile */}
      <div className="mt-auto p-4 border-t border-slate-900 bg-slate-950/50">
        <div className="flex items-center gap-3 p-2">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80"}
            alt="User"
            className="w-10 h-10 rounded-full border border-slate-700 p-0.5"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-200 truncate">{user?.name || "Alex Wright"}</p>
            <p className="text-[11px] text-slate-500 truncate">{user?.role || "Global Manager"}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
