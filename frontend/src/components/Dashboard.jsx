import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import { 
  Sparkles, 
  ArrowRight, 
  CheckSquare, 
  Square, 
  Video, 
  Mic2, 
  FileText, 
  Award, 
  Shirt, 
  Briefcase, 
  TrendingUp, 
  Target, 
  AlertCircle 
} from 'lucide-react';

export default function Dashboard() {
  const { student, setActiveTab, loadDemoStudent } = useStudent();

  const [dailyGoals, setDailyGoals] = useState([
    { id: 1, text: "Practice 3 core branch technical concepts", done: false, tab: "technical" },
    { id: 2, text: "Record self-introduction in Speech Lab", done: true, tab: "communication" },
    { id: 3, text: "Review Dress & Grooming placement checklist", done: true, tab: "dress-grooming" },
    { id: 4, text: "Complete 1 full-length AI Mock Interview session", done: false, tab: "interview-setup" }
  ]);

  const toggleGoal = (id) => {
    setDailyGoals(prev => prev.map(g => g.id === id ? { ...g, done: !g.done } : g));
  };

  if (!student) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">No Active Student Profile</h2>
        <p className="text-sm text-slate-400">Please complete onboarding or load the demo candidate profile to access your AI coach dashboard.</p>
        <div className="flex justify-center gap-4 pt-2">
          <button onClick={loadDemoStudent} className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-semibold">
            Load Rahul's Demo Profile
          </button>
          <button onClick={() => setActiveTab('onboarding')} className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold">
            Start Onboarding
          </button>
        </div>
      </div>
    );
  }

  const readiness = Math.round(student.readiness_score || 78);
  const tech = Math.round(student.technical_score || 65);
  const comm = Math.round(student.communication_score || 58);
  const resume = Math.round(student.resume_score || 72);
  const hr = Math.round(student.hr_score || 45);
  const conf = Math.round(student.confidence_score || 55);

  const categories = [
    { label: "Technical Skills", score: tech, color: "bg-blue-500", tab: "technical" },
    { label: "Communication", score: comm, color: "bg-purple-500", tab: "communication" },
    { label: "Resume Audit", score: resume, color: "bg-emerald-500", tab: "resume" },
    { label: "HR Preparation", score: hr, color: "bg-amber-500", tab: "etiquette" },
    { label: "Confidence", score: conf, color: "bg-cyan-500", tab: "interview-setup" }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner Greeting */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/40 p-6 sm:p-8 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> AI Personal Placement Coach Active
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Good day, {student.name} 👋
          </h2>
          <p className="text-sm text-slate-400">
            Targeting: <span className="text-white font-medium">{student.preferred_role}</span> • {student.branch} ({student.year}) • CGPA {student.cgpa}
          </p>
        </div>

        {/* Readiness Gauge Banner */}
        <div className="w-full md:w-80 rounded-2xl bg-slate-950/70 border border-slate-800 p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">Placement Readiness</span>
            <span className="text-brand-400 font-bold text-sm">{readiness}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-1000"
              style={{ width: `${readiness}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500">
            *AI-generated preparation indicator based on rubrics, not a guaranteed hiring probability.
          </p>
        </div>
      </div>

      {/* Main Grid: Today's Goal + Category Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Goal Checklist & Next Practice */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-brand-400" />
                <h3 className="text-lg font-bold text-white">Today's Placement Goals</h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {dailyGoals.filter(g => g.done).length} of {dailyGoals.length} completed
              </span>
            </div>

            <div className="space-y-3">
              {dailyGoals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    goal.done
                      ? 'bg-slate-950/40 border-slate-800/80 text-slate-500 line-through'
                      : 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-brand-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {goal.done ? (
                      <CheckSquare className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-600 flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium">{goal.text}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab(goal.tab);
                    }}
                    className="text-xs text-brand-400 hover:text-brand-300 font-semibold px-2 py-1 rounded bg-brand-500/10 border border-brand-500/20"
                  >
                    Open Lab
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80">
              <div className="text-xs text-slate-400">
                AI Coach Recommendation: <span className="text-slate-200 font-medium">Your communication score has highest upside. Practice a 90-sec intro.</span>
              </div>
              <button
                onClick={() => setActiveTab('communication')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-500/20"
              >
                <span>Start Today's Practice</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Launch Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { title: "Live Mock Interview", desc: "Voice room with AI avatar", icon: Video, tab: "interview-setup", highlight: true },
              { title: "Speech & Intro Lab", desc: "Filler words & pacing drill", icon: Mic2, tab: "communication" },
              { title: "Resume ATS Audit", desc: "Auto question generator", icon: FileText, tab: "resume" },
              { title: "Etiquette Scenarios", desc: "Interactive room behaviors", icon: Award, tab: "etiquette" },
              { title: "Dress & Grooming", desc: "Professional attire guide", icon: Shirt, tab: "dress-grooming" },
              { title: "Technical Drills", desc: "Branch-specific flashcards", icon: Briefcase, tab: "technical" },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  onClick={() => setActiveTab(card.tab)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all hover:-translate-y-0.5 group ${
                    card.highlight
                      ? 'bg-gradient-to-b from-brand-950/40 to-slate-900/90 border-brand-500/40 shadow-lg shadow-brand-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-brand-500/20 transition-colors">
                    <Icon className={`w-5 h-5 ${card.highlight ? 'text-brand-400' : 'text-slate-300'}`} />
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Category Breakdown Radar / Progress bars */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Readiness Breakdown</h3>
              <button
                onClick={() => setActiveTab('progress')}
                className="text-xs text-brand-400 hover:underline flex items-center gap-1"
              >
                Full Analytics <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-4">
              {categories.map((cat, i) => (
                <div key={i} className="space-y-1.5 cursor-pointer" onClick={() => setActiveTab(cat.tab)}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium hover:text-white transition-colors">{cat.label}</span>
                    <span className="font-bold text-slate-200">{cat.score}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full ${cat.color} rounded-full transition-all duration-700`}
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTA inside right card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <TrendingUp className="w-4 h-4" /> Next Milestone
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Complete your next full-length mock interview to advance past the 80% readiness benchmark.
            </p>
            <button
              onClick={() => setActiveTab('interview-setup')}
              className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold text-center transition-colors"
            >
              Enter AI Mock Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
