'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User, Lock, Loader2, CheckCircle2, Shield } from 'lucide-react';

export default function SettingsPage() {
  const supabase = createClient();
  
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  
  // Profile State
  const [fullName, setFullName] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  // Security State
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setEmail(session.user.email || '');
        setFullName(session.user.user_metadata?.full_name || '');
      }
      setIsLoading(false);
    };
    fetchUser();
  }, [supabase]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileMessage({ type: '', text: '' });

    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName }
    });

    if (error) {
      setProfileMessage({ type: 'error', text: error.message });
    } else {
      setProfileMessage({ type: 'success', text: 'Profile updated successfully.' });
    }
    setIsUpdatingProfile(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingPassword(true);
    setPasswordMessage({ type: '', text: '' });

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      setPasswordMessage({ type: 'error', text: error.message });
    } else {
      setPasswordMessage({ type: 'success', text: 'Password secured successfully.' });
      setNewPassword(''); // Clear the input field
    }
    setIsUpdatingPassword(false);
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out max-w-3xl mx-auto pb-12">
      
      <div className="mb-10">
        <h1 className="text-3xl font-medium tracking-tight mb-3 text-white">Account Settings</h1>
        <p className="text-zinc-400 font-light">Manage your personal profile and security credentials.</p>
      </div>

      <div className="space-y-8">
        
        {/* PROFILE SECTION */}
        <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-6">
            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-white">Profile Details</h2>
              <p className="text-xs text-zinc-500 font-light">Update your display name.</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">Account Email (Read-only)</label>
              <input type="email" value={email} disabled className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-zinc-500 text-sm cursor-not-allowed" />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">Full Name</label>
              <input required type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors" />
            </div>

            {profileMessage.text && (
              <p className={`text-xs flex items-center gap-1.5 ${profileMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                {profileMessage.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                {profileMessage.text}
              </p>
            )}

            <button type="submit" disabled={isUpdatingProfile} className="px-6 py-3 bg-white/10 border border-white/10 text-white text-sm font-medium rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {isUpdatingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* SECURITY SECTION */}
        <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-6">
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-white">Security</h2>
              <p className="text-xs text-zinc-500 font-light">Update your password.</p>
            </div>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">New Password</label>
              <input required type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Minimum 6 characters" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors" />
            </div>

            {passwordMessage.text && (
              <p className={`text-xs flex items-center gap-1.5 ${passwordMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                {passwordMessage.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                {passwordMessage.text}
              </p>
            )}

            <button type="submit" disabled={isUpdatingPassword || newPassword.length < 6} className="px-6 py-3 bg-emerald-500 text-black text-sm font-semibold rounded-xl hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {isUpdatingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-8 mt-12">
          <h3 className="text-lg font-medium text-red-400 flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5" /> Danger Zone
          </h3>
          <p className="text-sm text-zinc-400 font-light mb-6">
            Permanently delete your account and wipe all operational brief data from the Optima Engine. This action cannot be undone.
          </p>
          <button className="px-5 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium rounded-xl hover:bg-red-500/20 transition-colors">
            Delete Account
          </button>
        </div>

      </div>
    </div>
  );
}