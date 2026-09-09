import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import { api } from '../services/api';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  Target 
} from 'lucide-react';

export default function PreparationRoadmap() {
  const { student, setActiveTab } = useStudent();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState({});

  useEffect(() => {
    if (!student?.id) return;
    setLoading(true);
    api.getRoadmap(student.id)
      .then(data => {
        setRoadmap(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [student?.id]);

  const toggleTask = (weekIdx, taskIdx) => {
    const key = `${weekIdx}-${taskIdx}`;
    setCompletedTasks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Generating personalized placement preparation roadmap...
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center text-slate-400">
        No roadmap available. Please onboard a student first.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> 3-Week Structured Placement Roadmap
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Roadmap for {student.name} ({roadmap.branch})
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Targeting: <span className="text-white font-medium">{roadmap.target_role}</span> • Focus areas mapped to your academic profile and weak areas.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="text-right">
            <div className="text-[11px] text-slate-400">Calculated Readiness</div>
            <div className="text-xl font-extrabold text-brand-400">{roadmap.readiness.overall_readiness}%</div>
          </div>
          <button
            onClick={() => setActiveTab('interview-setup')}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md"
          >
            Practice Now
          </button>
        </div>
      </div>

      {/* Week-by-Week Accordion / Cards */}
      <div className="space-y-6">
        {roadmap.weeks.map((week, wIdx) => {
          return (
            <div 
              key={week.week_number}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-7 space-y-5 transition-all hover:border-slate-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center font-mono font-bold text-brand-400 text-sm">
                    W0{week.week_number}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {week.title}
                    </h3>
                    <p className="text-xs text-brand-300 font-medium mt-0.5">
                      {week.focus}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Est: {week.estimated_hours} Hours</span>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Action Checklist
                </div>
                {week.tasks.map((task, tIdx) => {
                  const key = `${wIdx}-${tIdx}`;
                  const isDone = Boolean(completedTasks[key]);
                  return (
                    <div
                      key={tIdx}
                      onClick={() => toggleTask(wIdx, tIdx)}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        isDone
                          ? 'bg-slate-950/40 border-slate-800/80 text-slate-500 line-through'
                          : 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-brand-500/40'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span className="text-xs sm:text-sm leading-relaxed">{task}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
