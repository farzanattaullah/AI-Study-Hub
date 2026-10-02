import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CosmicOrbitalSphere3D from '../components/three/CosmicOrbitalSphere3D';

interface SignupPageProps {
  onSuccess: () => void;
  onNavigateLogin: () => void;
  onNavigateLanding: () => void;
}

export default function SignupPage({
  onSuccess,
  onNavigateLogin,
  onNavigateLanding,
}: SignupPageProps) {
  const { loginWithToken, showToast } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields (Full Name, Email, Password, and Confirm Password).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid college or personal email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please check your Confirm Password field.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.register(name.trim(), email.trim(), password);
      await loginWithToken(res.token, res.user);
      showToast(`Account created! Welcome to AI Study Assistant, ${res.user?.name || 'Student'}.`, 'success');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Could not create account. Please try again.');
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
        <div className="lg:col-span-6 bg-[#0a1022]/90 border border-white/[0.09] rounded-2xl p-6 sm:p-9 shadow-2xl space-y-5">
          <div className="space-y-1.5">
            <p className="text-xs font-mono text-indigo-400">Create Student Account</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Start studying smarter
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Upload PDFs and TXT notes for instant AI summaries, exam questions, and quizzes.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full bg-[#060a17] border border-white/10 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Email
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full bg-[#060a17] border border-white/10 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
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
                  placeholder="At least 6 characters"
                  className="w-full bg-[#060a17] border border-white/10 focus:border-indigo-500 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
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

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full bg-[#060a17] border border-white/10 focus:border-indigo-500 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm shadow-[0_0_25px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
            <span className="text-xs text-slate-400">Already have an account?</span>
            <button
              type="button"
              onClick={onNavigateLogin}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              Log In →
            </button>
          </div>
        </div>

        {/* Right 3D Orbital Showcase */}
        <div className="lg:col-span-6 hidden lg:flex flex-col items-center justify-center text-center space-y-4">
          <CosmicOrbitalSphere3D />
          <div className="max-w-sm space-y-1">
            <p className="text-sm font-semibold text-white">
              Engineered for College &amp; University Students
            </p>
            <p className="text-xs text-slate-400">
              Summaries, formulas, high-yield exam questions, MCQ quizzes, and Source-First AI tutoring.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500">
        AI Study Assistant · Upload. Understand. Practice. Learn.
      </div>
    </div>
  );
}
