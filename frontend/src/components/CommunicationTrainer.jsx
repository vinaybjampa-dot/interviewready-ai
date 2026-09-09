import React, { useState, useEffect, useRef } from 'react';
import { useStudent } from '../context/StudentContext';
import { api } from '../services/api';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  BarChart2, 
  Play, 
  RotateCcw, 
  Volume2 
} from 'lucide-react';

export default function CommunicationTrainer() {
  const { student, showToast, refreshStudent } = useStudent();
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState(null);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  // Initialize Web Speech API if supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript + ' ';
        }
        setTranscript(fullTranscript);
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition event:', err);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const startRecording = () => {
    setResult(null);
    setTranscript('');
    setTimerSeconds(0);
    setIsRecording(true);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Recognition already active or failed:', e);
      }
    } else {
      showToast('Speech recognition not supported in this browser. You can type your answer below!', 'info');
    }

    timerRef.current = setInterval(() => {
      setTimerSeconds(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const handleEvaluate = async () => {
    if (!transcript.trim()) {
      showToast('Please record or enter an introduction first.', 'error');
      return;
    }
    setEvaluating(true);
    try {
      const res = await api.analyzeIntro(transcript, student?.id);
      setResult(res);
      showToast('Speech analysis complete!', 'success');
      refreshStudent();
    } catch (err) {
      console.error(err);
      showToast('Speech evaluation failed.', 'error');
    } finally {
      setEvaluating(false);
    }
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const loadSampleIntro = () => {
    const sample = (
      "Good morning, I am Rahul. Currently in my 4th year of B.Tech in Computer Science at NIT with an 8.2 CGPA. " +
      "I am proficient in Java, Python, and SQL, and I developed a Face Recognition Attendance System using OpenCV. " +
      "I also completed a 2-month internship at Infotech Labs where I optimized backend APIs. " +
      "I am very excited about the Software Developer role on your team."
    );
    setTranscript(sample);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold">
            <Mic className="w-3.5 h-3.5" /> Communication Training Module
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            "Tell Me About Yourself" Coach
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            The single most pivotal opening question. Practice speaking with confidence, ideal pacing, and zero vocal filler.
          </p>
        </div>

        <button
          onClick={loadSampleIntro}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 whitespace-nowrap self-start md:self-auto"
        >
          Load Sample Intro
        </button>
      </div>

      {/* Recording Studio Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-slate-700'}`} />
            <span className="text-sm font-bold text-white">
              {isRecording ? 'Recording Live Audio...' : 'Voice Practice Room'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-brand-400" />
              <span>{formatTimer(timerSeconds)} (Target: 1:30)</span>
            </div>
          </div>
        </div>

        {/* Audio Waveform Animation when Recording */}
        {isRecording && (
          <div className="h-16 flex items-center justify-center gap-1.5 bg-slate-950/60 rounded-xl p-4 border border-brand-500/20">
            {[...Array(16)].map((_, i) => (
              <div 
                key={i} 
                className="w-1.5 rounded-full bg-brand-500 wave-bar"
                style={{ animationDelay: `${(i % 8) * 0.15}s` }}
              />
            ))}
          </div>
        )}

        {/* Live Transcript / Text Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Speech-to-Text Transcript</span>
            <span>{transcript.split(/\s+/).filter(Boolean).length} words</span>
          </div>
          <textarea
            rows={5}
            value={transcript}
            onChange={e => setTranscript(e.target.value)}
            placeholder="Click 'Start Speaking' and introduce yourself, or type/paste your speech transcript directly here..."
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-brand-500 font-sans leading-relaxed resize-y"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-3">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/25 transition-all"
              >
                <Mic className="w-4 h-4" /> Start Speaking
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700"
              >
                <MicOff className="w-4 h-4 text-rose-400" /> Stop Speaking
              </button>
            )}

            <button
              onClick={() => { setTranscript(''); setResult(null); setTimerSeconds(0); }}
              className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800"
              title="Clear transcript"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleEvaluate}
            disabled={evaluating || isRecording || !transcript.trim()}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-brand-500/20"
          >
            {evaluating ? 'Analyzing Speech Delivery...' : 'Analyze My Introduction'}
          </button>
        </div>
      </div>

      {/* Analysis Results Display */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Metrics Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-xs text-slate-400">Speaking Clarity</div>
              <div className="text-2xl font-extrabold text-brand-400 mt-1">{result.speaking_clarity_score}/100</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-xs text-slate-400">Structure Score</div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">{result.answer_structure_score}/100</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-xs text-slate-400">Filler Words</div>
              <div className={`text-2xl font-extrabold mt-1 ${result.filler_words_count > 2 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {result.filler_words_count}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-xs text-slate-400">Est. Duration</div>
              <div className="text-2xl font-extrabold text-white mt-1">{result.duration_estimate_sec}s</div>
            </div>
          </div>

          {/* Structural Milestones Check */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Structural Milestones (Present → Past Projects → Future Goals)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { key: 'present', label: '1. Present Identity' },
                { key: 'education', label: '2. Education Details' },
                { key: 'skills', label: '3. Technical Skills' },
                { key: 'projects', label: '4. Concrete Projects' },
                { key: 'achievements', label: '5. Achievements' },
                { key: 'career_goal', label: '6. Role Alignment' }
              ].map((item) => {
                const checked = result.structure_feedback[item.key];
                return (
                  <div 
                    key={item.key}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold ${
                      checked 
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-500'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${checked ? 'text-emerald-400' : 'text-slate-700'}`} />
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feedback details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> What You Did Well
              </h4>
              <div className="space-y-2 text-xs text-slate-300">
                {result.what_you_did_well.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> What to Improve
              </h4>
              <div className="space-y-2 text-xs text-slate-300">
                {result.what_to_improve.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Model Improved Sample */}
          <div className="rounded-2xl border border-brand-500/30 bg-slate-900/80 p-6 space-y-3">
            <div className="flex items-center gap-2 text-brand-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" /> Model Authentic Answer Tailored to Your Profile
            </div>
            <p className="text-xs sm:text-sm text-slate-200 font-sans italic leading-relaxed p-4 rounded-xl bg-slate-950 border border-slate-800">
              {result.model_improved_sample}
            </p>
            <p className="text-[11px] text-slate-400">
              💡 {result.suggested_authenticity_tip}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
