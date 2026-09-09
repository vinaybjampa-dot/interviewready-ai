import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  RotateCcw, 
  ShieldAlert, 
  BookOpen 
} from 'lucide-react';

export default function EtiquetteSimulator() {
  const [scenarios, setScenarios] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [userScoreTotal, setUserScoreTotal] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  useEffect(() => {
    api.getEtiquetteScenarios()
      .then(data => {
        setScenarios(data);
      })
      .catch(err => console.error(err));
  }, []);

  const currentScenario = scenarios[currentIndex];

  const handleSelectOption = (optId) => {
    if (result) return;
    setSelectedOption(optId);
  };

  const handleSubmit = async () => {
    if (!selectedOption || submitting) return;
    setSubmitting(true);
    try {
      const res = await api.submitEtiquetteScenario(currentScenario.id, selectedOption);
      setResult(res);
      setAnsweredCount(prev => prev + 1);
      if (res.is_correct) {
        setUserScoreTotal(prev => prev + 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setResult(null);
    setCurrentIndex(prev => (prev + 1) % scenarios.length);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setResult(null);
    setUserScoreTotal(0);
    setAnsweredCount(0);
  };

  if (!scenarios.length) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading etiquette scenarios...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-md shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" /> Interactive Simulation Lab
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            How Should I Behave? — Etiquette Training
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-world workplace situations: practice professional poise, active listening, and gracious responses.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 self-start sm:self-auto">
          <div className="text-right">
            <div className="text-[11px] text-slate-400">Mastery Score</div>
            <div className="text-lg font-bold text-brand-400">{userScoreTotal} / {answeredCount} Solved</div>
          </div>
          <button
            onClick={handleReset}
            title="Reset Quiz"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scenario Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
          <span className="font-semibold uppercase tracking-wider text-brand-400">
            Scenario {currentIndex + 1} of {scenarios.length} • {currentScenario.category}
          </span>
          <span>{currentScenario.title}</span>
        </div>

        {/* Context & Prompt */}
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400">
            <span className="font-bold text-slate-300">Situation:</span> {currentScenario.context}
          </div>

          <div className="p-4 rounded-xl bg-brand-950/30 border border-brand-500/30 text-sm font-semibold text-white">
            {currentScenario.interviewer_prompt}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentScenario.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            const isCorrect = result && opt.id === result.correct_option;
            const isWrong = result && isSelected && !result.is_correct;

            return (
              <button
                key={opt.id}
                type="button"
                disabled={Boolean(result)}
                onClick={() => handleSelectOption(opt.id)}
                className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${
                  isCorrect
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                    : isWrong
                    ? 'bg-rose-950/40 border-rose-500 text-rose-200'
                    : isSelected
                    ? 'bg-brand-500/20 border-brand-500 text-white'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  isCorrect 
                    ? 'bg-emerald-500 text-white'
                    : isWrong 
                    ? 'bg-rose-500 text-white'
                    : isSelected 
                    ? 'bg-brand-500 text-white' 
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {opt.id}
                </div>
                <span className="leading-relaxed">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Evaluation Feedback */}
        {result && (
          <div className={`p-4 rounded-xl border space-y-2 animate-fadeIn ${
            result.is_correct ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-rose-950/30 border-rose-500/40'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              {result.is_correct ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-300">Correct Etiquette! (+100 Points)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-400" />
                  <span className="text-rose-300">Incorrect Choice</span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-white">Why:</span> {result.explanation}
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          {!result ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedOption || submitting}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-brand-500/20"
            >
              {submitting ? 'Evaluating...' : 'Confirm Response'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20"
            >
              Next Scenario <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
