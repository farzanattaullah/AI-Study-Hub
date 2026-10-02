import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  HelpCircle,
  Brain,
  MessageSquare,
  BarChart2,
  UploadCloud,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Clock,
  Layers,
  ShieldCheck,
  X,
} from 'lucide-react';
import CosmicOrbitalSphere3D from '../components/three/CosmicOrbitalSphere3D';
import StudyCompanionHub3D from '../components/three/StudyCompanionHub3D';

interface LandingPageProps {
  onNavigateLogin: () => void;
  onNavigateSignup: () => void;
}

export default function LandingPage({
  onNavigateLogin,
  onNavigateSignup,
}: LandingPageProps) {
  const [infoModal, setInfoModal] = useState<{
    title: string;
    content: string;
  } | null>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050811] text-slate-100 flex flex-col selection:bg-indigo-500/30">
      {/* Top Bar Contract: Zone 1 Brand | Zone 2 Nav Links | Zone 3 Primary Actions */}
      <header className="sticky top-0 z-40 h-16 bg-[#050811]/85 backdrop-blur-md border-b border-white/[0.07] px-4 sm:px-8 lg:px-12 flex items-center justify-between">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-lg font-bold tracking-tight text-white font-display whitespace-nowrap"
        >
          AI Study Assistant
        </a>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            type="button"
            onClick={() => scrollToSection('features')}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Features
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('how-it-works')}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            How It Works
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('companion-hub')}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            3D Companion
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('dashboard-preview')}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Workspace
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onNavigateLogin}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            Login
          </button>
          <button
            type="button"
            onClick={onNavigateSignup}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-[0_0_24px_rgba(99,102,241,0.4)] transition-all cursor-pointer whitespace-nowrap"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* HERO SECTION (Matches Reference Image Top Viewport + Required Copy) */}
      <section
        id="top"
        className="relative max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-12 pt-12 pb-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
      >
        {/* Left Hero Content */}
        <div className="lg:col-span-7 space-y-6">
          <p className="text-xs font-mono tracking-wider text-sky-400">
            Upload. Understand. Practice. Learn.
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-white leading-[1.08] font-display max-w-2xl">
            Study Smarter with AI
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl font-normal">
            Upload your notes and let AI create summaries, important questions, explanations and quizzes.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              type="button"
              onClick={onNavigateSignup}
              className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-[0_0_30px_rgba(99,102,241,0.45)] flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onNavigateLogin}
              className="px-6 py-3 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
            >
              Login
            </button>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span>Supports PDF &amp; TXT Notes</span>
            <span aria-hidden="true">·</span>
            <span>Source-First AI Tutor</span>
            <span aria-hidden="true">·</span>
            <span>Interactive MCQ Quizzes</span>
          </div>
        </div>

        {/* Right Hero 3D Component (Cosmic Orbital Sphere from Reference Image) */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <CosmicOrbitalSphere3D
            onSelectNode={() => scrollToSection('companion-hub')}
          />
        </div>
      </section>

      {/* SECTION 2: THE PROBLEM (From Reference Screenshot) */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-12 py-16 border-t border-white/[0.05]">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <p className="text-xs font-mono text-sky-400">The Challenge</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Studying Shouldn&apos;t Feel This Complicated
          </h2>
          <p className="text-sm text-slate-400">
            Less time searching. More time truly understanding your coursework.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Information Overload',
              desc: 'Hundreds of lecture pages and dense textbooks make it difficult to isolate high-yield exam concepts and formulas.',
            },
            {
              title: 'Lack of Personalization',
              desc: 'Static PDFs cannot answer follow-up questions, test your active recall, or adapt explanations to your pace.',
            },
            {
              title: 'Unverified Hallucinations',
              desc: 'Generic chatbots mix outside trivia with your syllabus. Our Source-First engine checks your uploaded material first.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#0a1022]/80 border border-white/[0.08] space-y-3"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400 font-mono text-xs">
                0{idx + 1}
              </div>
              <h3 className="text-base font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: 3D INTELLIGENT STUDY COMPANION HUB (From Reference Screenshot) */}
      <section
        id="companion-hub"
        className="max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-12 py-16"
      >
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <p className="text-xs font-mono text-sky-400">AI-Powered Architecture</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Meet Your Intelligent Study Companion
          </h2>
          <p className="text-sm text-slate-400">
            Your knowledge, connected. Your next step, clear.
          </p>
        </div>

        <StudyCompanionHub3D
          onGetStarted={onNavigateSignup}
        />
      </section>

      {/* SECTION 4: FEATURE CARDS (Matches Reference Image Bento + Required 5 Feature Cards) */}
      <section
        id="features"
        className="max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-12 py-16"
      >
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <p className="text-xs font-mono text-indigo-400">Built For University Rigor</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Everything you need. Nothing in your way.
          </h2>
          <p className="text-sm text-slate-400">
            Grounded strictly in your uploaded PDF and TXT study materials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: AI Summaries */}
          <div className="p-6 rounded-2xl bg-[#0a1022]/90 border border-white/[0.08] hover:border-white/20 transition-colors space-y-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-white">AI Summaries</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Turn long study materials into simple summaries, detailed breakdowns, key points, definitions, and formulas.
            </p>
          </div>

          {/* Card 2: Important Questions */}
          <div className="p-6 rounded-2xl bg-[#0a1022]/90 border border-white/[0.08] hover:border-white/20 transition-colors space-y-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-white">Important Questions</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Generate exam-oriented questions from your notes, including short-answer, long-answer, and high-yield conceptual questions.
            </p>
          </div>

          {/* Card 3: AI Quiz */}
          <div className="p-6 rounded-2xl bg-[#0a1022]/90 border border-white/[0.08] hover:border-white/20 transition-colors space-y-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
              <Brain className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-white">AI Quiz</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Test your knowledge with AI-generated quizzes featuring instant scoring, accuracy percentages, and answer explanations.
            </p>
          </div>

          {/* Card 4: AI Tutor */}
          <div className="p-6 rounded-2xl bg-[#0a1022]/90 border border-white/[0.08] hover:border-white/20 transition-colors space-y-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-white">AI Tutor</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Ask questions about your study material. Checks your PDF first and asks permission before consulting external academic sources.
            </p>
          </div>

          {/* Card 5: Topic Explanations */}
          <div className="p-6 rounded-2xl bg-[#0a1022]/90 border border-white/[0.08] hover:border-white/20 transition-colors space-y-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-white">Deep Topic Explanations</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Select any topic from your syllabus for a clear college-level explanation, practical example, and key terminology.
            </p>
          </div>

          {/* Card 6: Smart Learning (Highlighted Violet Border matching Reference Image!) */}
          <div className="p-6 rounded-2xl bg-[#0d1229] border-2 border-indigo-500 shadow-[0_0_35px_rgba(99,102,241,0.2)] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <BarChart2 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-white">Smart Learning</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Track your quiz scores and learning progress across all uploaded documents with real-time analytics.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: HOW IT WORKS (5 Required Steps in Clean Editorial Numbering) */}
      <section
        id="how-it-works"
        className="max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-12 py-16 border-t border-white/[0.05]"
      >
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <p className="text-xs font-mono text-sky-400">From Material To Mastery</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            A smarter rhythm. Step by step.
          </h2>
          <p className="text-sm text-slate-400">
            How AI Study Assistant transforms raw lecture files into exam readiness.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'Upload your study material',
              desc: 'Drag and drop your PDF lecture slides or TXT study notes.',
            },
            {
              step: '02',
              title: 'AI analyzes the content',
              desc: 'Extracts text, core topics, definitions, and mathematical formulas.',
            },
            {
              step: '03',
              title: 'Get summary & questions',
              desc: 'Review concise summaries and short, long, and exam-oriented questions.',
            },
            {
              step: '04',
              title: 'Practice with AI quizzes',
              desc: 'Take interactive MCQ quizzes with instant scoring and explanations.',
            },
            {
              step: '05',
              title: 'Ask the AI Tutor',
              desc: 'Get source-first answers from your PDF or verified external sources.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-5 rounded-2xl bg-[#0a1022]/85 border border-white/[0.08] flex flex-col justify-between space-y-4"
            >
              <span className="text-lg font-mono font-semibold text-indigo-400 tabular-nums">
                {item.step}.
              </span>
              <div className="space-y-1.5">
                <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: CLARITY LOOKS GOOD ON YOU — WORKSPACE PREVIEW (Matches Reference Screenshot) */}
      <section
        id="dashboard-preview"
        className="max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-12 py-16"
      >
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <p className="text-xs font-mono text-sky-400">Your Personal Learning Space</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Clarity looks good on you.
          </h2>
          <p className="text-sm text-slate-400">
            A calm command center for everything you are studying this semester.
          </p>
        </div>

        <div className="rounded-2xl bg-[#090e1f] border border-indigo-500/30 shadow-[0_0_60px_rgba(79,70,229,0.12)] p-6 sm:p-8 lg:p-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] pb-4">
            <div>
              <p className="text-xs font-mono text-indigo-400">
                Student · Engineering Workspace
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 font-display">
                Welcome back, Alex Rivera.
              </h3>
            </div>
            <button
              type="button"
              onClick={onNavigateLogin}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              Open Live Dashboard →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-[#0d142b] border border-white/[0.07] space-y-3">
              <p className="text-xs text-slate-400 font-medium">Average Quiz Mastery</p>
              <p className="text-3xl font-bold text-sky-400 font-mono tabular-nums">90%</p>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-[90%] bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full" />
              </div>
              <p className="text-xs text-slate-400">
                3 engineering study documents analyzed · 9 practice questions mastered
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0d142b] border border-white/[0.07] space-y-2">
              <div className="flex items-center justify-between text-xs text-sky-400">
                <span className="font-semibold">Source-First AI Tutor</span>
                <span className="font-mono">Source: PDF Only</span>
              </div>
              <p className="text-xs font-semibold text-white">
                &ldquo;Explain multiplexing.&rdquo;
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                According to your uploaded material (Section 1: Introduction to Multiplexing), multiplexing allows simultaneous transmission of multiple signals across a single shared data link using a MUX and DEMUX pair...
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0d142b] border border-white/[0.07] space-y-2">
              <p className="text-xs font-semibold text-white">Important Exam Topics</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Multiplexing (FDM, WDM, TDM) · Shannon Channel Capacity · Intel 8086 BIU &amp; EU Pipelining · Neural Network Backpropagation
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0d142b] border border-white/[0.07] space-y-2">
              <p className="text-xs font-semibold text-white">Uploaded Study Documents</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Computer Networks &amp; Multiplexing (PDF) · Microprocessors &amp; 8086 Architecture (PDF) · Machine Learning Fundamentals (TXT)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: MAKE ROOM FOR YOUR POTENTIAL (4 Cards from Reference Image) */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-12 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <p className="text-xs font-mono text-sky-400">Less Effort, More Progress</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Make room for your potential.
          </h2>
          <p className="text-sm text-slate-400">
            Not just another study tool. A transparent, source-verified way to learn.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              title: 'Learn Faster',
              desc: 'Spend less time formatting notes and more time understanding core engineering concepts.',
            },
            {
              title: 'Understand Better',
              desc: 'Break down complex formulas and definitions into clear, example-driven explanations.',
            },
            {
              title: 'Stay Organized',
              desc: 'Keep every PDF, summary, saved exam question, and quiz result in one workspace.',
            },
            {
              title: 'Study Consistently',
              desc: 'Build exam confidence with repeatable MCQ quizzes and detailed answer rationales.',
            },
          ].map((card, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-[#0a1022]/85 border border-white/[0.08] space-y-2"
            >
              <h3 className="text-sm font-semibold text-white">{card.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA BANNER (Matches Reference Screenshot Bottom Glow) */}
      <section className="relative max-w-5xl w-full mx-auto px-4 sm:px-8 py-20 text-center">
        <div className="absolute inset-0 bg-radial from-indigo-600/20 via-sky-500/5 to-transparent blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-5">
          <p className="text-xs font-mono text-sky-400">
            Upload. Understand. Practice. Learn.
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">
            Transform The Way You Study
          </h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            Your next exam breakthrough starts with uploading a single lecture note.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <button
              type="button"
              onClick={onNavigateSignup}
              className="px-7 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all cursor-pointer whitespace-nowrap"
            >
              Get Started
            </button>
            <button
              type="button"
              onClick={onNavigateLogin}
              className="px-6 py-3 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-200 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
            >
              Login
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER (Required links: AI Study Assistant, About, Features, Privacy, Contact) */}
      <footer className="mt-auto border-t border-white/[0.08] bg-[#04060e] px-4 sm:px-8 lg:px-12 py-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-sm font-bold text-white font-display">AI Study Assistant</p>
            <p className="text-xs text-slate-500 mt-1">
              Upload. Understand. Practice. Learn.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <button
              type="button"
              onClick={() =>
                setInfoModal({
                  title: 'About AI Study Assistant',
                  content:
                    'AI Study Assistant is a full-stack academic learning platform engineered for college and university students. Upload PDF or TXT notes to generate structured summaries, exam questions, interactive MCQ quizzes, and consult a Source-First AI Tutor.',
                })
              }
              className="hover:text-white transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() =>
                setInfoModal({
                  title: 'Privacy & Source Transparency',
                  content:
                    'Your uploaded PDFs and TXT study materials are private to your student account. All AI requests run securely on the backend without exposing API keys, and our Source-First Tutor strictly distinguishes between your uploaded material and external academic sources.',
                })
              }
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy
            </button>
            <button
              type="button"
              onClick={() =>
                setInfoModal({
                  title: 'Contact & Academic Support',
                  content:
                    'Built as a full-stack engineering platform using React, TypeScript, Tailwind CSS, Node.js, Express, MongoDB/Mongoose, and Gemini AI. For academic inquiries, reach out to support@aistudyassistant.edu.',
                })
              }
              className="hover:text-white transition-colors cursor-pointer"
            >
              Contact
            </button>
          </div>
        </div>
      </footer>

      {/* Footer Info Modal */}
      {infoModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1224] border border-white/15 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">{infoModal.title}</h3>
              <button
                type="button"
                onClick={() => setInfoModal(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{infoModal.content}</p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setInfoModal(null)}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
