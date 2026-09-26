import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  User,
  Key,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  X,
  Sparkles,
  Info,
  Cloud
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const AdminLoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    login,
    securityConfig,
    showToast,
    isCloudConnected,
  } = usePortfolio();

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'admin' | 'key'>('admin');
  const [accessKeyInput, setAccessKeyInput] = useState('');

  // Reset inputs when opened
  useEffect(() => {
    if (isLoginModalOpen) {
      setErrorMsg(null);
      setUsernameInput('');
      setPasswordInput('');
      setAccessKeyInput('');
    }
  }, [isLoginModalOpen]);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      let result;
      if (activeTab === 'admin') {
        if (!usernameInput.trim() || !passwordInput) {
          setErrorMsg('Username and password are required.');
          setIsLoading(false);
          return;
        }
        result = await login(usernameInput.trim(), passwordInput, rememberDevice);
      } else {
        if (!accessKeyInput.trim()) {
          setErrorMsg('Please enter a valid access key.');
          setIsLoading(false);
          return;
        }
        result = await login('', accessKeyInput.trim(), rememberDevice);
      }

      setIsLoading(false);

      if (result.success) {
        showToast('Login successful! Welcome back.');
      } else {
        setErrorMsg(result.message || 'Invalid credentials. Access denied.');
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMsg('An error occurred during authentication. Please try again.');
    }
  };

  const handleQuickFillDefaults = () => {
    if (!securityConfig.credentials.isCredentialsCustomized) {
      setUsernameInput('admin');
      setPasswordInput('shariful@2025');
      setErrorMsg(null);
    }
  };

  return (
    <AnimatePresence>
      <div
        data-lenis-prevent
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsLoginModalOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          data-lenis-prevent
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden z-10"
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Header Banner */}
          <div className="relative p-6 sm:p-7 bg-gradient-to-br from-purple-900 via-indigo-950 to-zinc-950 text-white overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-purple-500/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl" />

            {/* Close Button */}
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Close and return to site"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm text-purple-300">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-[10px] font-mono font-bold tracking-wider text-purple-200 uppercase">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Admin Access Protected</span>
                  </div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-purple-200">
                    <Cloud className="w-2.5 h-2.5 text-emerald-300" />
                    <span>{isCloudConnected ? 'Cloud Synced' : 'Connecting...'}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Portfolio Security Gateway
                </h3>
              </div>
            </div>

            <p className="text-xs text-purple-200/80 mt-2.5 leading-relaxed">
              This area is restricted for website management. Enter your credentials to access the administrative dashboard.
            </p>
          </div>

          {/* Login Mode Tabs */}
          <div className="flex border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 px-6 pt-3">
            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setErrorMsg(null);
              }}
              className={`pb-3 px-3 text-xs font-bold transition-all relative cursor-pointer flex items-center gap-2 ${
                activeTab === 'admin'
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-slate-500 dark:text-zinc-500 hover:text-slate-800 dark:hover:text-zinc-300'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Admin Username & Password</span>
              {activeTab === 'admin' && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full"
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('key');
                setErrorMsg(null);
              }}
              className={`pb-3 px-3 text-xs font-bold transition-all relative cursor-pointer flex items-center gap-2 ${
                activeTab === 'key'
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-slate-500 dark:text-zinc-500 hover:text-slate-800 dark:hover:text-zinc-300'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Access Key</span>
              {activeTab === 'key' && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full"
                />
              )}
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
            {/* Error Message */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">Authentication Failed</p>
                    <p className="text-[11px] text-rose-700 dark:text-rose-300/90 mt-0.5">{errorMsg}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {activeTab === 'admin' ? (
              <>
                {/* Username Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      autoFocus
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="e.g. admin"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Enter master password..."
                      className="w-full pl-10 pr-11 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Access Key Tab */
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                  Collaborator / Guest Access Key
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    autoFocus
                    value={accessKeyInput}
                    onChange={(e) => setAccessKeyInput(e.target.value)}
                    placeholder="Enter key e.g. COLLAB-XXXXXX"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 font-mono text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all uppercase"
                  />
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                  If you were provided a special collaborator key by the owner, paste it here.
                </p>
              </div>
            )}

            {/* Remember device checkbox */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 text-slate-600 dark:text-zinc-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="w-4 h-4 rounded-md text-purple-600 border-slate-300 dark:border-zinc-700 focus:ring-purple-500"
                />
                <span>Remember this device</span>
              </label>

              {!securityConfig.credentials.isCredentialsCustomized && activeTab === 'admin' && (
                <button
                  type="button"
                  onClick={handleQuickFillDefaults}
                  className="text-purple-600 dark:text-purple-400 hover:underline font-semibold cursor-pointer"
                >
                  Fill Default (admin)
                </button>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-purple-500/25 hover:shadow-purple-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Verify & Unlock Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Security Notice */}
            {!securityConfig.credentials.isCredentialsCustomized && (
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 text-[11px] text-purple-900 dark:text-purple-300 flex items-center gap-2">
                <Info className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <span>
                  Initial Master Credentials: Username: <strong>admin</strong> | Password: <strong>shariful@2025</strong> (You can change both in settings).
                </span>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
