import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Shirt, 
  Check, 
  Sparkles, 
  HeartHandshake, 
  ShieldCheck, 
  CheckCircle2, 
  UserCheck 
} from 'lucide-react';

export default function DressGroomingGuide() {
  const [guide, setGuide] = useState(null);
  const [genderTab, setGenderTab] = useState('men');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getGroomingGuide()
      .then(res => {
        setGuide(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading grooming & attire standards...
      </div>
    );
  }

  const activeGuidelines = genderTab === 'men' ? guide?.men_guidelines : guide?.women_guidelines;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-md shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold">
          <Shirt className="w-3.5 h-3.5" /> Professional Presentation Module
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          How Should I Dress?
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          {guide?.philosophy}
        </p>

        {/* Ethical Standards Alert Box */}
        <div className="p-4 rounded-xl bg-slate-950 border border-brand-500/30 text-xs text-slate-300 flex items-start gap-3 mt-4">
          <ShieldCheck className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-white">Inclusive Professional Standards:</span> Professional grooming evaluates neatness, respect for the occasion, and cleanliness. It never judges candidates based on physical attractiveness, skin tone, body shape, natural hair texture, or personal identity.
          </div>
        </div>
      </div>

      {/* Gender Selection Tabs */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setGenderTab('men')}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold border transition-all ${
            genderTab === 'men'
              ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-500/20'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
          }`}
        >
          Professional Attire for Men
        </button>
        <button
          onClick={() => setGenderTab('women')}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold border transition-all ${
            genderTab === 'women'
              ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-500/20'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
          }`}
        >
          Professional Attire for Women
        </button>
      </div>

      {/* Attire & Grooming Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Attire Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Shirt className="w-5 h-5 text-brand-400" />
            <h3 className="text-base font-bold text-white">Recommended Clothing & Footwear</h3>
          </div>

          <div className="space-y-3">
            {activeGuidelines?.attire?.map((point, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Grooming Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Personal Grooming & Hygiene</h3>
          </div>

          <div className="space-y-3">
            {activeGuidelines?.grooming?.map((point, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Universal Campus Placement Day Rules */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Universal Placement Day Checklist
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {guide?.universal_rules?.map((rule, idx) => (
            <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{rule}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
