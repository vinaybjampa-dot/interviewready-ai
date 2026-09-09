import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  CheckCircle2, 
  Circle, 
  Search, 
  FileCheck, 
  HelpCircle, 
  Sparkles, 
  Building2, 
  FolderCheck 
} from 'lucide-react';

export default function PreInterviewGuide() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState({});
  const [affirmations, setAffirmations] = useState({});

  useEffect(() => {
    api.getCompanyChecklist()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const toggleItem = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAffirmation = (idx) => {
    setAffirmations(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading pre-interview preparation guide...
      </div>
    );
  }

  const completedCount = Object.values(affirmations).filter(Boolean).length;
  const totalAffirmations = data?.readiness_affirmations?.length || 5;
  const progressPercent = Math.round((completedCount / totalAffirmations) * 100);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Hero Header */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-md shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold">
          <Building2 className="w-3.5 h-3.5" /> Pre-Interview Preparation Module
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Before You Enter the Interview
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          {data?.description}
        </p>
      </div>

      {/* Mandatory Affirmations Bar */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-brand-950/40 via-slate-900/90 to-slate-900 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Candidate Readiness Checklist</h3>
          </div>
          <span className="text-xs font-bold text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full border border-brand-500/20">
            {progressPercent}% Ready
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {data?.readiness_affirmations?.map((item, idx) => {
            const checked = Boolean(affirmations[idx]);
            return (
              <div
                key={idx}
                onClick={() => toggleAffirmation(idx)}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  checked
                    ? 'bg-slate-950/40 border-slate-800/80 text-slate-400 line-through'
                    : 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-brand-500/40'
                }`}
              >
                {checked ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-600 flex-shrink-0" />
                )}
                <span className="text-xs font-medium">{item}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Research Sections */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-brand-400" />
          <h3 className="text-lg font-bold text-white">Research the Company Deeply</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.checklist_items?.map((item) => {
            const checked = Boolean(checkedItems[item.id]);
            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all ${
                  checked ? 'bg-slate-950/50 border-slate-800/80' : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    {item.title}
                  </h4>
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="text-slate-500 hover:text-emerald-400 transition-colors"
                  >
                    {checked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {item.description}
                </p>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-brand-300 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                  <span>Coach Tip: {item.action_prompt}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
