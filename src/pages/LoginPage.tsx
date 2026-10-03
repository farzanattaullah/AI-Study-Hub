import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CosmicOrbitalSphere3D from '../components/three/CosmicOrbitalSphere3D';

interface LoginPageProps {
  onSuccess: () => void;
  onNavigateSignup: () => void;
  onNavigateLanding: () => void;
}

export default function LoginPage({
  onSuccess,
  onNavigateSignup,
  onNavigateLanding,
}: LoginPageProps) {
  const { loginWithToken, loginWithGoogle, showToast } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      await loginWithGoogle();
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.login(email.trim(), password);
      await loginWithToken(res.token, res.user);
      showToast(`Welcome back, ${res.user?.name || 'Student'}!`, 'success');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid login credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const res = await api.login('alex@university.edu', 'password123');
      await loginWithToken(res.token, res.user);
      showToast(`Logged in as Demo Student (${res.user?.name || 'Alex Rivera'})`, 'success');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050811] text-slate-100 flex flex-col justify-between p-4 sm:p-8">
      {/* Top Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <button
          type="button"
          onClick={onNavigateLanding}
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to AI Study Assistant</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl w-full mx-auto my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Form Card */}
        <div className="lg:col-span-6 bg-[#0a1022]/90 border border-white/[0.09] rounded-2xl p-6 sm:p-9 shadow-2xl space-y-6">
          <div className="space-y-1.5">
            <p className="text-xs font-mono text-sky-400">Student Portal</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Log in to your workspace
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Access your uploaded PDFs, AI summaries, quizzes, and Source-First Tutor.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@university.edu"
                  className="w-full bg-[#060a17] border border-white/10 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#060a17] border border-white/10 focus:border-indigo-500 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm shadow-[0_0_25px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Firebase Google Auth Button */}
          <div className="space-y-3">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative bg-[#0a1022] px-3 text-[11px] font-mono text-slate-400">
                OR FIREBASE AUTH
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-slate-100 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Instant Demo Account Helper */}
          <div className="pt-2 border-t border-white/[0.08] space-y-3">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/30 text-sky-200 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Instant Demo Login (Alex Rivera · Engineering Notes Preloaded)</span>
            </button>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">New to AI Study Assistant?</span>
              <button
                type="button"
                onClick={onNavigateSignup}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
              >
                Create Account →
              </button>
            </div>
          </div>
        </div>

        {/* Right 3D Orbital Showcase */}
        <div className="lg:col-span-6 hidden lg:flex flex-col items-center justify-center text-center space-y-4">
          <CosmicOrbitalSphere3D />
          <div className="max-w-sm space-y-1">
            <p className="text-sm font-semibold text-white">
              Upload. Understand. Practice. Learn.
            </p>
            <p className="text-xs text-slate-400">
              Your personal AI study companion with strict source-first verification.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500">
        AI Study Assistant · Secure JWT Authentication
      </div>
    </div>
  );
}
