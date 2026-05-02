import React, { useState, useEffect, useRef } from 'react';
import { User, Shield, Bell, Key, Save, Settings2, Globe, Share2, ToggleLeft, Wrench, RefreshCw, Mail, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../lib/apiClient';
import { useSettings, useUpdateSettings, usePatchSettings, useResetSettings } from '../../services/api';
import { AppSettings } from '../../types';
import OtpInput from '../../components/input/OtpInput';
// ─── OTP Input Component ───────────────────────────────────────────────────


// ─── Step indicator ────────────────────────────────────────────────────────
function StepBadge({ step, current, label }: { step: number; current: number; label: string }) {
  const done = current > step;
  const active = current === step;
  return (
    <div className="flex items-center gap-2">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
        ${done ? 'bg-emerald-500 text-white' : active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
        {done ? <CheckCircle2 className="w-4 h-4" /> : step}
      </div>
      <span className={`text-sm font-semibold ${active ? 'text-slate-900' : done ? 'text-emerald-600' : 'text-slate-400'}`}>
        {label}
      </span>
    </div>
  );
}

export default function Settings() {
  const { user } = useAuth();
  
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const resetSettings = useResetSettings();

  const [activeTab, setActiveTab] = useState<'app' | 'contact' | 'features' | 'maintenance' | 'security'>('app');
  const [formData, setFormData] = useState<Partial<AppSettings>>({});

  useEffect(() => {
    if (settings) setFormData(settings);
  }, [settings]);

  // ── Security multi-step state ──────────────────────────────────────────
  type SecurityStep = 1 | 2 | 3; 
  const [secStep, setSecStep] = useState<SecurityStep>(1);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [pwUpdating, setPwUpdating] = useState(false);
  const [pwError, setPwError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startResendTimer = () => {
    setResendTimer(30);
    timerRef.current = setInterval(() => {
      setResendTimer(t => {
        if (t <= 1) { clearInterval(timerRef.current!); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  // Step 1 → send OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (newPassword.length < 6) { setPwError('Password must be at least 6 characters.'); return; }
    if (newPassword !== confirmPassword) { setPwError("Passwords don't match."); return; }

    setOtpSending(true);
    try {
      await apiClient.post('/api/admin/auth/password/send-otp', { email: user?.email });
      setSecStep(2);
      startResendTimer();
    } catch {
      setPwError('Failed to send OTP. Please try again.');
    } finally {
      setOtpSending(false);
    }
  };

  // Step 2 → verify OTP & change password
  const handleVerifyAndChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    if (otp.replace(/\D/g,'').length < 6) { setOtpError('Please enter the full 6-digit OTP.'); return; }

    setPwUpdating(true);
    try {
      await apiClient.post('/api/admin/auth/password/reset', {
        email: user?.email,
        otp,
        newPassword,
      });
      setSecStep(3);
    } catch {
      setOtpError('Invalid or expired OTP. Please try again.');
    } finally {
      setPwUpdating(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    try {
      await apiClient.post('/api/admin/auth/password/send-otp', { email: user?.email });
      setOtp('');
      setOtpError('');
      startResendTimer();
    } catch {
      setOtpError('Failed to resend OTP.');
    }
  };

  const resetSecurityFlow = () => {
    setSecStep(1);
    setNewPassword('');
    setConfirmPassword('');
    setOtp('');
    setPwError('');
    setOtpError('');
    setResendTimer(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // ── Generic form helpers ───────────────────────────────────────────────
  const handleChange = (section: keyof AppSettings, field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [section]: { ...(prev[section] || {}), [field]: value } }));
  };

  const handleNestedChange = (section: keyof AppSettings, parent: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [parent]: { ...(prev[section]?.[parent] || {}), [field]: value } }
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
    if (confirm('Reset all settings to defaults? This cannot be undone.')) {
      resetSettings.mutate(undefined, { onSuccess: () => alert('Settings reset to defaults.') });
    }
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading settings...</div>;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">System Settings</h2>
          <p className="text-slate-500 font-medium mt-1">Manage global app configuration, SEO, and security.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleResetSettings} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 bg-rose-50 text-sm font-bold hover:bg-rose-100 transition-all">
            <RefreshCw className="w-4 h-4" />Reset Defaults
          </button>
          <button onClick={handleSaveSettings} disabled={updateSettings.isPending} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70">
            <Save className="w-4 h-4" />
            {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-64 space-y-1">
          {([
            ['app', Settings2, 'App & Theme'],
            ['contact', Share2, 'Contact & Social'],
            ['features', Globe, 'Features & SEO'],
            ['maintenance', Wrench, 'Maintenance'],
          ] as const).map(([id, Icon, label]) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
          <div className="pt-4 pb-2"><div className="h-px bg-slate-200 w-full" /></div>
          <button onClick={() => { setActiveTab('security'); resetSecurityFlow(); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'security' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Shield className="w-4 h-4" />Admin Security
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">

          {/* ── APP TAB ── */}
          {activeTab === 'app' && (
            <div className="p-8 space-y-8 animate-in fade-in">
              <div>
                <h3 className="text-lg font-bold text-slate-900">App & Theme Configuration</h3>
                <p className="text-sm text-slate-500 mt-1">Basic details and visual identity of your platform.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Application Name</label>
                  <input type="text" value={formData.app?.name || ''} onChange={(e) => handleChange('app', 'name', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Logo URL</label>
                  <input type="text" value={formData.app?.logo || ''} onChange={(e) => handleChange('app', 'logo', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Favicon URL</label>
                  <input type="text" value={formData.app?.favicon || ''} onChange={(e) => handleChange('app', 'favicon', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Primary Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.app?.theme?.primaryColor || '#0A66C2'} onChange={(e) => handleNestedChange('app', 'theme', 'primaryColor', e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer" />
                    <input type="text" value={formData.app?.theme?.primaryColor || '#0A66C2'} onChange={(e) => handleNestedChange('app', 'theme', 'primaryColor', e.target.value)} className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Secondary Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.app?.theme?.secondaryColor || '#FFFFFF'} onChange={(e) => handleNestedChange('app', 'theme', 'secondaryColor', e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer" />
                    <input type="text" value={formData.app?.theme?.secondaryColor || '#FFFFFF'} onChange={(e) => handleNestedChange('app', 'theme', 'secondaryColor', e.target.value)} className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm outline-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── CONTACT TAB ── */}
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
                    <input type="text" value={formData.contact?.phone || ''} onChange={(e) => handleChange('contact', 'phone', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Email Address</label>
                    <input type="email" value={formData.contact?.email || ''} onChange={(e) => handleChange('contact', 'email', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Office Address</label>
                    <textarea value={formData.contact?.address || ''} onChange={(e) => handleChange('contact', 'address', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none" rows={2} />
                  </div>
                </div>
                <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2 pt-4">WhatsApp Integration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">WhatsApp Number</label>
                    <input type="text" value={formData.whatsapp?.number || ''} onChange={(e) => handleChange('whatsapp', 'number', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Default Message</label>
                    <input type="text" value={formData.whatsapp?.message || ''} onChange={(e) => handleChange('whatsapp', 'message', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none" />
                  </div>
                </div>
                <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2 pt-4">Social Links</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(['facebook','instagram','linkedin','youtube'] as const).map(platform => (
                    <div key={platform} className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">{platform}</label>
                      <input type="url" value={(formData.social as any)?.[platform] || ''} onChange={(e) => handleChange('social', platform, e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── FEATURES TAB ── */}
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
                        <input type="checkbox" className="sr-only peer" checked={formData.features?.[feat.key as keyof typeof formData.features] || false} onChange={(e) => handleChange('features', feat.key, e.target.checked)} />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
                <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2 pt-4">Search Engine Optimization</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Global Meta Title</label>
                    <input type="text" value={formData.seo?.metaTitle || ''} onChange={(e) => handleChange('seo', 'metaTitle', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Global Meta Description</label>
                    <textarea value={formData.seo?.metaDescription || ''} onChange={(e) => handleChange('seo', 'metaDescription', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none" rows={3} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── MAINTENANCE TAB ── */}
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
                    <input type="checkbox" className="sr-only peer" checked={formData.maintenance?.isEnabled || false} onChange={(e) => handleChange('maintenance', 'isEnabled', e.target.checked)} />
                    <div className="w-11 h-6 bg-amber-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-amber-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-amber-800 uppercase tracking-wide">Maintenance Message</label>
                  <textarea value={formData.maintenance?.message || ''} onChange={(e) => handleChange('maintenance', 'message', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-white text-sm outline-none" rows={3} />
                </div>
              </div>
            </div>
          )}

          {/* ── SECURITY TAB ── */}
          {activeTab === 'security' && (
            <div className="p-8 animate-in fade-in">
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900">Admin Security</h3>
                <p className="text-sm text-slate-500 mt-1">Change your password with OTP verification.</p>
              </div>

              {/* Step indicators */}
              <div className="flex items-center gap-3 mb-8 max-w-md">
                <StepBadge step={1} current={secStep} label="New Password" />
                <div className={`flex-1 h-px transition-colors ${secStep > 1 ? 'bg-emerald-300' : 'bg-slate-200'}`} />
                <StepBadge step={2} current={secStep} label="Verify OTP" />
                <div className={`flex-1 h-px transition-colors ${secStep > 2 ? 'bg-emerald-300' : 'bg-slate-200'}`} />
                <StepBadge step={3} current={secStep} label="Done" />
              </div>

              {/* ── STEP 1: Enter new password ── */}
              {secStep === 1 && (
                <form onSubmit={handleRequestOtp} className="space-y-5 max-w-md animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center gap-3">
                    <Mail className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <p className="text-sm text-indigo-700">
                      An OTP will be sent to <span className="font-bold">{user?.email}</span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        required type="password" value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        required type="password" value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Repeat password"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  {pwError && (
                    <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5">{pwError}</p>
                  )}

                  <button type="submit" disabled={otpSending}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all disabled:opacity-60 mt-2">
                    {otpSending
                      ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending OTP...</>
                      : <><span>Send OTP</span><ArrowRight className="w-4 h-4" /></>
                    }
                  </button>
                </form>
              )}

              {/* ── STEP 2: Enter OTP ── */}
              {secStep === 2 && (
                <form onSubmit={handleVerifyAndChange} className="space-y-6 max-w-md animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
                    <Mail className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <p className="text-sm text-emerald-700">
                      OTP sent to <span className="font-bold">{user?.email}</span>. Check your inbox.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Enter 6-digit OTP</label>
                    <OtpInput value={otp} onChange={setOtp} />
                  </div>

                  {otpError && (
                    <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5">{otpError}</p>
                  )}

                  <div className="flex items-center gap-4 pt-1">
                    <button type="submit" disabled={pwUpdating || otp.replace(/\D/g,'').length < 6}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all disabled:opacity-50">
                      {pwUpdating
                        ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying...</>
                        : <><Key className="w-4 h-4" /><span>Change Password</span></>
                      }
                    </button>

                    <button type="button" onClick={handleResendOtp} disabled={resendTimer > 0}
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors">
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                    </button>
                  </div>

                  <button type="button" onClick={() => { setSecStep(1); setOtp(''); setOtpError(''); }}
                    className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                    ← Go back
                  </button>
                </form>
              )}

              {/* ── STEP 3: Success ── */}
              {secStep === 3 && (
                <div className="max-w-md animate-in fade-in zoom-in-95 duration-300">
                  <div className="text-center py-10 px-6 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">Password Updated!</h4>
                    <p className="text-sm text-slate-500 mb-6">Your admin password has been changed successfully.</p>
                    <button onClick={resetSecurityFlow}
                      className="px-5 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
                      Change Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}