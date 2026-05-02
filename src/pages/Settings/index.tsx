import React, { useState, useEffect } from 'react';
import { User, Shield, Bell, Key, Save, Settings2, Globe, Share2, ToggleLeft, Wrench, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../lib/apiClient';
import { useSettings, useUpdateSettings, usePatchSettings, useResetSettings } from '../../services/api';
import { AppSettings } from '../../types';

export default function Settings() {
  const { user } = useAuth();
  
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const resetSettings = useResetSettings();

  const [activeTab, setActiveTab] = useState<'app' | 'contact' | 'features' | 'maintenance' | 'security'>('app');
  
  // Local state for app settings
  const [formData, setFormData] = useState<Partial<AppSettings>>({});

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  // Security Form State
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecurityData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    try {
      await apiClient.post('/api/admin/auth/password/reset', {
        email: user?.email,
        newPassword: securityData.newPassword
      });
      alert('Password updated successfully');
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      alert('Failed to update password');
    }
  };

  const handleChange = (section: keyof AppSettings, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value
      }
    }));
  };

  const handleNestedChange = (section: keyof AppSettings, parent: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [parent]: {
          ...(prev[section]?.[parent] || {}),
          [field]: value
        }
      }
    }));
  };

  const handleSaveSettings = () => {
    if (formData) {
      updateSettings.mutate(formData as AppSettings, {
        onSuccess: () => alert('Settings updated successfully!'),
        onError: () => alert('Failed to update settings.')
      });
    }
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to their default values? This cannot be undone.')) {
      resetSettings.mutate(undefined, {
        onSuccess: () => alert('Settings reset to defaults.'),
      });
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading settings...</div>;
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">System Settings</h2>
          <p className="text-slate-500 font-medium mt-1">Manage global app configuration, SEO, and security.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleResetSettings}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 bg-rose-50 text-sm font-bold hover:bg-rose-100 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Defaults
          </button>
          <button 
            onClick={handleSaveSettings}
            disabled={updateSettings.isPending}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="w-full lg:w-64 space-y-1">
          <button 
            onClick={() => setActiveTab('app')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'app' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Settings2 className="w-4 h-4" />
            App & Theme
          </button>
          <button 
            onClick={() => setActiveTab('contact')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'contact' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Share2 className="w-4 h-4" />
            Contact & Social
          </button>
          <button 
            onClick={() => setActiveTab('features')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'features' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Globe className="w-4 h-4" />
            Features & SEO
          </button>
          <button 
            onClick={() => setActiveTab('maintenance')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'maintenance' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Wrench className="w-4 h-4" />
            Maintenance
          </button>
          <div className="pt-4 pb-2">
            <div className="h-px bg-slate-200 w-full" />
          </div>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'security' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Shield className="w-4 h-4" />
            Admin Security
          </button>
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
          
          {activeTab === 'app' && (
            <div className="p-8 space-y-8 animate-in fade-in">
              <div>
                <h3 className="text-lg font-bold text-slate-900">App & Theme Configuration</h3>
                <p className="text-sm text-slate-500 mt-1">Basic details and visual identity of your platform.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Application Name</label>
                  <input 
                    type="text" 
                    value={formData.app?.name || ''} 
                    onChange={(e) => handleChange('app', 'name', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Logo URL</label>
                  <input 
                    type="text" 
                    value={formData.app?.logo || ''} 
                    onChange={(e) => handleChange('app', 'logo', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Favicon URL</label>
                  <input 
                    type="text" 
                    value={formData.app?.favicon || ''} 
                    onChange={(e) => handleChange('app', 'favicon', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Primary Color (Hex)</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={formData.app?.theme?.primaryColor || '#0A66C2'} 
                      onChange={(e) => handleNestedChange('app', 'theme', 'primaryColor', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer" 
                    />
                    <input 
                      type="text" 
                      value={formData.app?.theme?.primaryColor || '#0A66C2'} 
                      onChange={(e) => handleNestedChange('app', 'theme', 'primaryColor', e.target.value)}
                      className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Secondary Color (Hex)</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={formData.app?.theme?.secondaryColor || '#FFFFFF'} 
                      onChange={(e) => handleNestedChange('app', 'theme', 'secondaryColor', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer" 
                    />
                    <input 
                      type="text" 
                      value={formData.app?.theme?.secondaryColor || '#FFFFFF'} 
                      onChange={(e) => handleNestedChange('app', 'theme', 'secondaryColor', e.target.value)}
                      className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm" 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="p-8 space-y-8 animate-in fade-in">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Contact & Social Media</h3>
                <p className="text-sm text-slate-500 mt-1">Platform contact details and social connections.</p>
              </div>

              <div className="space-y-6 max-w-3xl">
                <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Primary Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Phone Number</label>
                    <input type="text" value={formData.contact?.phone || ''} onChange={(e) => handleChange('contact', 'phone', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Email Address</label>
                    <input type="email" value={formData.contact?.email || ''} onChange={(e) => handleChange('contact', 'email', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Office Address</label>
                    <textarea value={formData.contact?.address || ''} onChange={(e) => handleChange('contact', 'address', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" rows={2}></textarea>
                  </div>
                </div>

                <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2 pt-4">WhatsApp Integration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">WhatsApp Number</label>
                    <input type="text" value={formData.whatsapp?.number || ''} onChange={(e) => handleChange('whatsapp', 'number', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Default Message</label>
                    <input type="text" value={formData.whatsapp?.message || ''} onChange={(e) => handleChange('whatsapp', 'message', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" />
                  </div>
                </div>

                <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2 pt-4">Social Links</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Facebook</label>
                    <input type="url" value={formData.social?.facebook || ''} onChange={(e) => handleChange('social', 'facebook', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Instagram</label>
                    <input type="url" value={formData.social?.instagram || ''} onChange={(e) => handleChange('social', 'instagram', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">LinkedIn</label>
                    <input type="url" value={formData.social?.linkedin || ''} onChange={(e) => handleChange('social', 'linkedin', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">YouTube</label>
                    <input type="url" value={formData.social?.youtube || ''} onChange={(e) => handleChange('social', 'youtube', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="p-8 space-y-8 animate-in fade-in">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Features & SEO</h3>
                <p className="text-sm text-slate-500 mt-1">Toggle platform modules and update search engine details.</p>
              </div>

              <div className="space-y-6 max-w-3xl">
                <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Module Toggles</h4>
                <div className="space-y-4">
                  {[
                    { key: 'enableLeads', label: 'Enable Leads Tracking', desc: 'Allow tracking of user inquiries.' },
                    { key: 'enableFavorites', label: 'Enable Favorites', desc: 'Allow users to wishlist properties.' },
                    { key: 'enableProjects', label: 'Enable Projects Module', desc: 'Display large-scale projects and developments.' }
                  ].map((feat) => (
                    <div key={feat.key} className="flex items-center justify-between py-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{feat.label}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{feat.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={formData.features?.[feat.key as keyof typeof formData.features] || false}
                          onChange={(e) => handleChange('features', feat.key, e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2 pt-4">Search Engine Optimization</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Global Meta Title</label>
                    <input type="text" value={formData.seo?.metaTitle || ''} onChange={(e) => handleChange('seo', 'metaTitle', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Global Meta Description</label>
                    <textarea value={formData.seo?.metaDescription || ''} onChange={(e) => handleChange('seo', 'metaDescription', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" rows={3}></textarea>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="p-8 space-y-8 animate-in fade-in">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Maintenance Mode</h3>
                <p className="text-sm text-slate-500 mt-1">Temporarily disable public access to the platform.</p>
              </div>

              <div className="max-w-xl p-6 rounded-2xl border border-amber-200 bg-amber-50">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-sm font-bold text-amber-900">Enable Maintenance Mode</h4>
                    <p className="text-xs text-amber-700 mt-1">Users will see a maintenance screen.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={formData.maintenance?.isEnabled || false}
                      onChange={(e) => handleChange('maintenance', 'isEnabled', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-amber-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-amber-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-amber-800 uppercase tracking-wide">Maintenance Message</label>
                  <textarea 
                    value={formData.maintenance?.message || ''} 
                    onChange={(e) => handleChange('maintenance', 'message', e.target.value)} 
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-white text-sm" 
                    rows={3}
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="p-8 space-y-8 animate-in fade-in">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Admin Security</h3>
                <p className="text-sm text-slate-500 mt-1">Manage your administrative password.</p>
              </div>

              <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-md">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Current Password</label>
                  <input required name="currentPassword" value={securityData.currentPassword} onChange={handleSecurityChange} type="password" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">New Password</label>
                  <input required name="newPassword" value={securityData.newPassword} onChange={handleSecurityChange} type="password" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Confirm New Password</label>
                  <input required name="confirmPassword" value={securityData.confirmPassword} onChange={handleSecurityChange} type="password" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div className="pt-4 flex">
                  <button type="submit" className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-black transition-all">
                    <Key className="w-4 h-4" />
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
