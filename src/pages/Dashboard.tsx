import React from 'react';
import {
  Users,
  Building2,
  DollarSign,
  PieChart,
  ArrowUpRight,
  Download,
  Filter,
  Briefcase,
  ImageIcon,
  FileText
} from 'lucide-react';
import { StatsCard } from '../components/Dashboard/StatsCard';
import { PropertyTable } from '../components/Dashboard/PropertyTable';
import { ActivityFeed } from '../components/Dashboard/ActivityFeed';
import { ProjectCards } from '../components/Dashboard/ProjectCards';
import { motion } from 'motion/react';
import { useDashboardStats } from '../services/api';

export default function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Operational Status: Active</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h2>
          <p className="text-slate-500 font-medium mt-1">Welcome back. Here is what is happening across your portfolio today.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <Filter className="w-4 h-4" />
            <span>Customize</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            <Download className="w-4 h-4" />
            <span>Reports</span>
          </button> */}
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Total Users"
          value={isLoading ? '...' : stats?.users.total.toString() || '0'}
          subValue={isLoading ? '' : `${stats?.users.active} Active`}
          icon={Users}
          trend={{ value: 'Real-time', isUp: true }}
          color="indigo"
        />
        <StatsCard
          label="Total Properties"
          value={isLoading ? '...' : stats?.properties.total.toString() || '0'}
          subValue={isLoading ? '' : `${stats?.properties.active} Active`}
          icon={Building2}
          trend={{ value: 'Live', isUp: true }}
          color="emerald"
        />
        <StatsCard
          label="Total Projects"
          value={isLoading ? '...' : stats?.projects.total.toString() || '0'}
          subValue={isLoading ? '' : `${stats?.projects.featured} Featured`}
          icon={Briefcase}
          trend={{ value: 'Active', isUp: true }}
          color="rose"
        />
        <StatsCard
          label="Requirements"
          value={isLoading ? '...' : stats?.requirements.total.toString() || '0'}
          subValue={isLoading ? '' : 'Client Requests'}
          icon={FileText}
          trend={{ value: 'New', isUp: true }}
          color="amber"
        />
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left / Center Column: Properties & Projects */}
        <div className="xl:col-span-2 space-y-8">
          <PropertyTable />
          <ProjectCards />
        </div>

        {/* Right Column: Activity & Performance Insights */}
        <div className="space-y-8">
          <ActivityFeed />

          {/* Market Insight Card */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <ArrowUpRight className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <h4 className="text-xl font-bold mb-2">Portfolio Health</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                You have <span className="text-emerald-400 font-bold">{stats?.properties.active}</span> active properties and <span className="text-emerald-400 font-bold">{stats?.users.active}</span> active users across your platform.
              </p>
              <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors backdrop-blur-sm border border-white/10">
                View Detailed Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
