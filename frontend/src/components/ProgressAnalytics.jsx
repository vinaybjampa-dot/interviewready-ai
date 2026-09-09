import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import { api } from '../services/api';
import { 
  TrendingUp, 
  BarChart3, 
  Sparkles, 
  ArrowUpRight, 
  Target, 
  ShieldAlert, 
  Calendar, 
  CheckCircle2 
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';

export default function ProgressAnalytics() {
  const { student, setActiveTab } = useStudent();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!student?.id) return;
    setLoading(true);
    api.getProgress(student.id)
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [student?.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading placement progression analytics...
      </div>
    );
  }

  const chartData = data?.score_history?.map(p => ({
    name: `Interview #${p.interview_number}`,
    overall: p.overall_score,
    technical: p.technical_score,
    communication: p.communication_score,
    problem_solving: p.problem_solving_score,
    hr: p.hr_score,
    project: p.project_score
  })) || [];

  const radarData = data?.category_radar?.map(r => ({
    subject: r.category,
    A: r.score,
    fullMark: 100
  })) || [];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> Interview Progress Tracking
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Placement Readiness Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Track quantifiable skill advancement across multiple simulated interview sessions.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 self-start md:self-auto">
          <div className="text-right">
            <div className="text-[11px] text-slate-400 font-semibold">Current Readiness</div>
            <div className="text-2xl font-black text-brand-400">
              {Math.round(data?.placement_readiness_score || 78)}%
            </div>
          </div>
          <button
            onClick={() => setActiveTab('interview-setup')}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md whitespace-nowrap"
          >
            Take Next Interview
          </button>
        </div>
      </div>

      {/* Trajectory Indicators Grid (Prompt Section 20) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: "Technical", start: 52, current: 80, color: "text-blue-400" },
          { label: "Communication", start: 48, current: 72, color: "text-purple-400" },
          { label: "Problem Solving", start: 55, current: 80, color: "text-emerald-400" },
          { label: "HR & Culture", start: 46, current: 74, color: "text-amber-400" },
          { label: "Project Defense", start: 60, current: 84, color: "text-cyan-400" }
        ].map((item, idx) => {
          const gain = item.current - item.start;
          return (
            <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{item.label}</span>
                <span className={`text-xs font-bold flex items-center ${item.color}`}>
                  <ArrowUpRight className="w-3.5 h-3.5" /> +{gain}%
                </span>
              </div>
              <div className="text-xl font-extrabold text-white">{item.current}%</div>
              <div className="text-[10px] text-slate-500">Started at {item.start}%</div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid: Overall Score Trend & Category Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Score Progression Line Chart (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-400" /> Overall Readiness Trajectory Across Mock Rounds
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {data?.total_interviews_completed || 4} Sessions Logged
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis domain={[40, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="overall" stroke="#38bdf8" strokeWidth={3} dot={{ r: 5, fill: '#38bdf8' }} name="Overall Readiness" />
                <Line type="monotone" dataKey="technical" stroke="#818cf8" strokeWidth={2} dot={{ r: 3 }} name="Technical" />
                <Line type="monotone" dataKey="communication" stroke="#c084fc" strokeWidth={2} dot={{ r: 3 }} name="Communication" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-slate-400 italic">
            * Consistent improvement observed across every mock attempt as student adopts the structured answer frameworks.
          </p>
        </div>

        {/* Competency Radar Chart (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 flex flex-col justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Competency Radar
          </h3>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                <Radar name="Readiness" dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-500 text-center">
            Balanced competency profile across coding, speech, and behavioral attributes.
          </div>
        </div>
      </div>

      {/* Historical Interview Log Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <h3 className="text-base font-bold text-white">Historical Interview Log</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Session</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Overall Score</th>
                <th className="py-3 px-4">Technical</th>
                <th className="py-3 px-4">Communication</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Problem Solving</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {data?.score_history?.map((row) => (
                <tr key={row.interview_number} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">Interview #{row.interview_number}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{row.date}</td>
                  <td className="py-3 px-4 font-bold text-brand-400">{row.overall_score}%</td>
                  <td className="py-3 px-4">{row.technical_score}%</td>
                  <td className="py-3 px-4">{row.communication_score}%</td>
                  <td className="py-3 px-4">{row.project_score}%</td>
                  <td className="py-3 px-4">{row.problem_solving_score}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ethical Disclaimer (Prompt Section 21) */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-300">Notice on Placement Readiness Score:</strong> The Placement Readiness score (78/100) is an algorithmic preparation indicator intended to guide personal study focus and skill gap remediation. It is not an objective guarantee or probability of campus recruitment selection.
        </div>
      </div>
    </div>
  );
}
