import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import { api } from '../services/api';
import { 
  Briefcase, 
  CheckCircle2, 
  AlertOctagon, 
  HelpCircle, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ChevronRight 
} from 'lucide-react';

export default function TechnicalPrep() {
  const { student, setActiveTab } = useStudent();
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(student?.branch || 'CSE');
  const [drills, setDrills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState({});

  useEffect(() => {
    api.getBranches()
      .then(res => setBranches(res))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    setLoading(true);
    api.getTechnicalDrills(selectedBranch)
      .then(res => {
        setDrills(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedBranch]);

  const toggleReveal = (idx) => {
    setRevealed(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold">
            <Briefcase className="w-3.5 h-3.5" /> Technical Preparation Module
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Branch-Specific Technical Drills
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Core subject fundamentals, standard interview proof points, and common traps to avoid.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('interview-setup')}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md whitespace-nowrap self-start md:self-auto"
        >
          Practice in AI Mock Room
        </button>
      </div>

      {/* Branch Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil'].map((b) => (
          <button
            key={b}
            onClick={() => {
              setSelectedBranch(b);
              setRevealed({});
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
              selectedBranch.toUpperCase() === b.toUpperCase()
                ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            {b} Engineering
          </button>
        ))}
      </div>

      {/* Drills List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading technical drills for {selectedBranch}...
        </div>
      ) : (
        <div className="space-y-6">
          {drills.map((drill, idx) => {
            const isRevealed = Boolean(revealed[idx]);
            return (
              <div 
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-5 transition-all hover:border-slate-700 shadow-lg"
              >
                <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 font-bold border border-brand-500/20">
                        {drill.category}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {drill.difficulty}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white pt-1">
                      {drill.question}
                    </h3>
                  </div>

                  <button
                    onClick={() => toggleReveal(idx)}
                    className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 flex-shrink-0"
                  >
                    {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{isRevealed ? 'Hide Answer' : 'Model Answer'}</span>
                  </button>
                </div>

                <div className="text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Core Concept:</span> {drill.core_concept}
                </div>

                {isRevealed && (
                  <div className="space-y-4 pt-2 border-t border-slate-800/80 animate-fadeIn">
                    {/* Ideal Answer Points */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Key Answer Points to Mention
                      </h4>
                      <div className="space-y-1.5 text-xs text-slate-300">
                        {drill.ideal_answer_points.map((pt, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-2">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span className="leading-relaxed">{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Common Mistakes */}
                    {drill.common_mistakes?.length > 0 && (
                      <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                        <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                          <AlertOctagon className="w-4 h-4" /> Common Student Pitfalls & Blunders
                        </h4>
                        <div className="space-y-1 text-xs text-rose-200/90">
                          {drill.common_mistakes.map((m, mIdx) => (
                            <div key={mIdx} className="flex items-start gap-2">
                              <span>⚠</span>
                              <span>{m}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
