import React from 'react';
import { useStudent } from '../context/StudentContext';
import { 
  Sparkles, 
  User, 
  BarChart3, 
  BookOpen, 
  Briefcase, 
  FileText, 
  Mic2, 
  Award, 
  Shirt, 
  CheckCircle2, 
  Play,
  RotateCcw
} from 'lucide-react';

export default function Navbar() {
  const { student, activeTab, setActiveTab, resetDemoStudent, loadDemoStudent } = useStudent();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'roadmap', label: 'Roadmap', icon: BookOpen },
    { id: 'pre-interview', label: 'Pre-Interview', icon: CheckCircle2 },
    { id: 'dress-grooming', label: 'Dress & Grooming', icon: Shirt },
    { id: 'etiquette', label: 'Etiquette Lab', icon: Award },
    { id: 'resume', label: 'Resume ATS', icon: FileText },
    { id: 'communication', label: 'Speech Lab', icon: Mic2 },
    { id: 'technical', label: 'Technical Core', icon: Briefcase },
    { id: 'interview-setup', label: 'AI Mock Room', icon: Play, highlight: true },
    { id: 'progress', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-blue-500 to-cyan-400 p-0.5 shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  InterviewReady<span className="text-brand-400"> AI</span>
                </span>
                <span className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  B.Tech Edition
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden md:block">
                Comprehensive Placement Interview Coach
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30 shadow-sm shadow-brand-500/10'
                      : item.highlight
                      ? 'bg-gradient-to-r from-emerald-500/15 to-teal-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${item.highlight ? 'text-emerald-400' : ''}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action / Student Profile Indicator */}
          <div className="flex items-center gap-3">
            {student ? (
              <div className="flex items-center gap-2">
                {/* Readiness Score Pill */}
                <div 
                  onClick={() => setActiveTab('progress')}
                  className="cursor-pointer hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 hover:border-brand-500/40 transition-colors"
                  title="Placement Readiness Indicator"
                >
                  <div className="text-[11px] text-slate-400 font-medium">Readiness</div>
                  <div className="text-xs font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full">
                    {Math.round(student.readiness_score || 78)}%
                  </div>
                </div>

                {/* Profile Pill */}
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="text-xs font-semibold text-slate-200">{student.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{student.branch} • {student.year}</div>
                  </div>
                </div>

                {/* Reset demo / switch profile buttons */}
                <button
                  onClick={resetDemoStudent}
                  title="Reset Demo Data to default"
                  className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors border border-slate-700/50"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveTab('onboarding')}
                  className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                >
                  New Profile
                </button>
              </div>
            ) : (
              <button
                onClick={loadDemoStudent}
                className="text-xs font-semibold px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20"
              >
                Load Demo Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sub-header for Mobile Navigation */}
      <div className="xl:hidden flex items-center gap-1 px-4 py-2 overflow-x-auto border-t border-slate-800/60 bg-slate-950/90 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1 whitespace-nowrap px-3 py-1 rounded-lg text-xs font-medium ${
                isActive
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3 h-3" />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
