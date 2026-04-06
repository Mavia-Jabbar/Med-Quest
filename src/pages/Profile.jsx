import React, { useState } from 'react';
import { useFirebase, db } from '@/Context/firebase';
import { updatePassword, getAuth } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { User, Shield, Crown, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Profile() {
  const { user, userData } = useFirebase();
  const [newPassword, setNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState({ type: null, message: '' });
  const [planStatus, setPlanStatus] = useState({ type: null, message: '' });

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordStatus({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }
    
    setPasswordStatus({ type: 'loading', message: 'Updating password...' });
    try {
      const auth = getAuth();
      await updatePassword(auth.currentUser, newPassword);
      setPasswordStatus({ type: 'success', message: 'Password updated successfully!' });
      setNewPassword('');
    } catch (error) {
      console.error(error);
      setPasswordStatus({ type: 'error', message: error.message || 'Failed to update password. Please log out and back in, then try again.' });
    }
  };

  const handleUpgradePlan = async () => {
    setPlanStatus({ type: 'loading', message: 'Processing upgrade...' });
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { plan: 'pro' });
      setPlanStatus({ type: 'success', message: 'Successfully upgraded to Pro! Reloading...' });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error(error);
      setPlanStatus({ type: 'error', message: 'Failed to upgrade plan.' });
    }
  };

  if (!userData) return null;

  const isPro = userData.plan === 'pro';

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 relative">
      <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <User className="text-primary flex-shrink-0 h-6 w-6 sm:h-7 sm:w-7" /> Account Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-xs sm:text-sm font-medium">
          Manage your auth details and subscription plan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
        
        {/* Profile Card */}
        <div className="bg-white/60 dark:bg-black/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-6 ring-4 ring-white/20">
            {userData.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{userData.name}</h2>
          <p className="text-gray-500 font-medium mb-6">{userData.email}</p>
          
          <div className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-4 flex justify-between items-center text-sm font-bold mt-auto">
            <span className="text-gray-500">Account Role</span>
            <span className="text-primary uppercase tracking-widest">{userData.role || 'Student'}</span>
          </div>
        </div>

        {/* Auth Settings */}
        <div className="bg-white/60 dark:bg-black/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
            <Shield size={20} className="text-primary" /> Security
          </h3>
          
          <form className="flex flex-col gap-4" onSubmit={handleUpdatePassword}>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Change Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="bg-black/5 dark:bg-white/10 border border-transparent rounded-xl px-4 py-3 focus:outline-none focus:bg-white dark:focus:bg-black focus:border-black/10 dark:focus:border-white/10 focus:ring-4 focus:ring-primary/10 text-gray-900 dark:text-white transition-all font-medium"
              />
            </div>
            
            <button 
              type="submit" 
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 rounded-xl shadow-md hover:-translate-y-0.5 transition-transform"
            >
              Update Password
            </button>

            {passwordStatus.message && (
              <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 mt-2 ${passwordStatus.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : passwordStatus.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600'}`}>
                {passwordStatus.type === 'error' ? <AlertCircle size={18}/> : passwordStatus.type === 'success' ? <CheckCircle2 size={18}/> : null}
                {passwordStatus.message}
              </div>
            )}
          </form>
        </div>

        {/* Subscription Plan Checkout Mock */}
        <div className="lg:col-span-2 bg-gradient-to-br from-emerald-50 to-indigo-50 dark:from-emerald-950/20 dark:to-indigo-950/20 border border-emerald-200/50 dark:border-emerald-500/20 rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl rounded-tr-none rotate-12 flex items-center justify-center shrink-0 shadow-[0_10px_40px_rgba(16,185,129,0.3)]">
            <Crown size={36} className="text-white -rotate-12" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Active Plan</h3>
              <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${isPro ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-gray-200 text-gray-600 dark:bg-white/10 dark:text-gray-300'}`}>
                {userData.plan}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              {isPro
                ? "You have full, unrestricted lifetime access to MedQuest Pro features including dynamic flashcards and the advanced Assessment Engine."
                : "Upgrade to Pro to unlock advanced AI flashcard synthesis, infinite chat sessions, and detailed analytics for mock tests!"}
            </p>
          </div>
          
          <div className="shrink-0 flex flex-col w-full md:w-auto">
            {!isPro ? (
               <button 
                  onClick={handleUpgradePlan}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)] font-black tracking-widest px-8 py-4 rounded-2xl transition-all hover:scale-105 hover:-translate-y-1 w-full md:w-auto"
               >
                 UPGRADE TO PRO
               </button>
            ) : (
               <div className="flex items-center gap-2 font-bold text-emerald-500 text-lg px-6">
                 <CheckCircle2 /> Lifetime Pro Active
               </div>
            )}
            {planStatus.message && (
              <div className="text-sm font-bold text-center mt-3 text-emerald-600">
                {planStatus.message}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
