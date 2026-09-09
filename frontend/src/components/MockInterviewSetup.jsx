import React, { useState, useEffect, useRef } from 'react';
import { useStudent } from '../context/StudentContext';
import { api } from '../services/api';
import TalkingAvatar from './TalkingAvatar';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  CheckCircle2, 
  Circle, 
  ShieldCheck, 
  Sliders, 
  Building, 
  Sparkles, 
  ArrowRight, 
  Volume2, 
  UserCheck 
} from 'lucide-react';

export default function MockInterviewSetup() {
  const { 
    student, 
    setActiveTab, 
    setActiveInterviewId, 
    showToast,
    selectedInterviewer,
    setSelectedInterviewer 
  } = useStudent();

  const [role, setRole] = useState(student?.preferred_role || 'Software Developer');
  const [personality, setPersonality] = useState(selectedInterviewer?.personality || 'Professional');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [company, setCompany] = useState('General Tech');
  const [playingAgentId, setPlayingAgentId] = useState(null);

  // Media previews
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [micVolume, setMicVolume] = useState(0);
  const [loading, setLoading] = useState(false);

  // Setup checklist (Prompt section 23)
  const [checklist, setChecklist] = useState({
    resume: true,
    camera: false,
    mic: false,
    appearance: true,
    environment: true,
    internet: true
  });

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  const humanInterviewers = [
    {
      id: 'vikram',
      name: 'Vikram Malhotra',
      title: 'VP of Engineering & Tech Lead',
      tone: 'Balanced, Systems-Focused & Architecture In-Depth',
      personality: 'Professional',
      image: '/interviewers/vikram.jpg',
      badge: 'Senior Engineering Panel'
    },
    {
      id: 'priya',
      name: 'Priya Sharma',
      title: 'Director of Talent Acquisition',
      tone: 'Encouraging, Behavioral STAR & Team Culture',
      personality: 'HR',
      image: '/interviewers/priya.jpg',
      badge: 'Campus Recruitment Lead'
    },
    {
      id: 'sarah',
      name: 'Dr. Sarah Jenkins',
      title: 'Principal Systems Architect',
      tone: 'Strict, In-Depth Probing & Edge-Case Grilling',
      personality: 'Strict',
      image: '/interviewers/sarah.jpg',
      badge: 'Tier-1 Technical Bar-Raiser'
    }
  ];

  const handleSelectInterviewer = (interviewer) => {
    setSelectedInterviewer(interviewer);
    setPersonality(interviewer.personality);
  };

  const previewVoice = (agent, e) => {
    e.stopPropagation();
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    if (playingAgentId === agent.id) {
      setPlayingAgentId(null);
      return;
    }

    const sampleTexts = {
      vikram: "Hello! I am Vikram Malhotra. I will be evaluating your systems design, code cleanliness, and technical depth.",
      priya: "Hello! I am Priya Sharma. I look forward to learning about your projects, campus leadership, and behavioral strengths.",
      sarah: "Greetings. I'm Dr. Sarah Jenkins. We will examine your architectural rigor, scalability trade-offs, and edge cases."
    };

    const utterance = new SpeechSynthesisUtterance(sampleTexts[agent.id] || "Hello! Welcome to your mock interview.");
    const isFemale = agent.id === 'priya' || agent.id === 'sarah';
    const voices = window.speechSynthesis.getVoices() || [];
    
    if (voices.length > 0) {
      if (isFemale) {
        let femaleVoice = null;
        if (agent.id === 'priya') {
          femaleVoice = voices.find(v => {
            const n = v.name.toLowerCase();
            const l = v.lang.toLowerCase();
            return (l.includes('in') || n.includes('india') || n.includes('heera') || n.includes('neerja')) && !n.includes('male');
          });
        }
        if (!femaleVoice) {
          femaleVoice = voices.find(v => {
            const n = v.name.toLowerCase();
            return v.lang.startsWith('en') && (
              n.includes('female') || n.includes('zira') || n.includes('samantha') || 
              n.includes('victoria') || n.includes('karen') || n.includes('jenny') || 
              n.includes('aria') || n.includes('sonia') || n.includes('heera') ||
              n.includes('neerja') || n.includes('natural (female)') ||
              n.includes('google uk english female') || n.includes('google us english')
            );
          }) || voices.find(v => v.lang.startsWith('en') && !v.name.toLowerCase().includes('male')) || voices[0];
        }
        if (femaleVoice) utterance.voice = femaleVoice;
        utterance.pitch = 1.18;
      } else {
        const maleVoice = voices.find(v => {
          const n = v.name.toLowerCase();
          return v.lang.startsWith('en') && (
            n.includes('male') || n.includes('david') || n.includes('guy') || 
            n.includes('george') || n.includes('mark') || n.includes('google uk english male') ||
            n.includes('prabhat') || n.includes('ravi')
          );
        }) || voices.find(v => v.lang.startsWith('en') && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david'))) || voices[0];
        if (maleVoice) utterance.voice = maleVoice;
        utterance.pitch = 0.92;
      }
    } else {
      utterance.pitch = isFemale ? 1.25 : 0.92;
    }

    utterance.rate = 0.98;
    utterance.lang = 'en-US';

    utterance.onstart = () => setPlayingAgentId(agent.id);
    utterance.onend = () => setPlayingAgentId(null);
    utterance.onerror = () => setPlayingAgentId(null);

    window.speechSynthesis.speak(utterance);
  };

  // Camera & Mic toggles
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setMicActive(true);
      setChecklist(prev => ({ ...prev, camera: true, mic: true }));

      // Setup audio meter
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        const avg = sum / dataArray.length;
        setMicVolume(Math.min(100, Math.round(avg * 2)));
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();

      showToast('Camera and microphone connected successfully!', 'success');
    } catch (err) {
      console.warn('Media devices not permitted or not found:', err);
      showToast('Camera/mic access unavailable. You can still proceed with text/simulated audio.', 'info');
      setChecklist(prev => ({ ...prev, camera: true, mic: true }));
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setCameraActive(false);
    setMicActive(false);
    setMicVolume(0);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleLaunchInterview = async () => {
    setLoading(true);
    try {
      const res = await api.startInterview({
        user_id: student?.id || 'demo-rahul-cse',
        role: role,
        difficulty: difficulty,
        personality: personality,
        company: company
      });
      setActiveInterviewId(res.interview_id);
      showToast(`Mock Interview Session Initialized with ${selectedInterviewer?.name || 'AI Panel'}!`, 'success');
      setActiveTab('interview-room');
    } catch (err) {
      console.error(err);
      showToast('Failed to initialize interview session.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const difficulties = [
    { id: 'Beginner', desc: 'Core fundamentals & direct textbook definitions' },
    { id: 'Intermediate', desc: 'Technical + behavioral + project architecture' },
    { id: 'Advanced', desc: 'Dynamic follow-ups, latency trade-offs, edge-cases' },
    { id: 'Company Simulation', desc: 'Tailored to specific target company patterns' }
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" /> High-Fidelity Simulation Suite
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          AI Mock Interview Room — Pre-Flight Setup
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Configure your realistic placement interview session. Select your photorealistic AI Interviewer agent, calibrate your camera and microphone, and step into the live boardroom.
        </p>
      </div>

      {/* Grid: Left Column Settings, Right Column Webcam/Mic & Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Interview Settings */}
        <div className="lg:col-span-7 space-y-6">
          {/* Real Human AI Interviewer Agents Selection (New Feature) */}
          <div className="rounded-2xl border border-brand-500/30 bg-slate-900/80 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-brand-400 font-bold text-sm">
                <UserCheck className="w-4 h-4" />
                <span>Select Your AI Interviewer Agent</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
                Photorealistic Video Agent
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {humanInterviewers.map(agent => {
                const isSelected = (selectedInterviewer?.id || 'vikram') === agent.id;
                const isPlaying = playingAgentId === agent.id;
                return (
                  <div
                    key={agent.id}
                    onClick={() => handleSelectInterviewer(agent)}
                    className={`relative rounded-xl border p-3 cursor-pointer transition-all flex flex-col items-center text-center group ${
                      isSelected
                        ? 'bg-brand-500/20 border-brand-500 shadow-lg shadow-brand-500/15 ring-1 ring-brand-500'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="relative w-20 h-20 rounded-full overflow-hidden mb-2 border-2 border-slate-700 group-hover:border-brand-400 transition-colors shadow-md">
                      <TalkingAvatar
                        image={agent.image}
                        name={agent.name}
                        isSpeaking={isPlaying}
                        activeAgentId={agent.id}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-brand-500/20 flex items-center justify-center pointer-events-none">
                          <CheckCircle2 className="w-6 h-6 text-white drop-shadow-md" />
                        </div>
                      )}
                    </div>
                    <div className="font-bold text-xs text-white">{agent.name}</div>
                    <div className="text-[10px] text-brand-300 font-medium leading-tight mt-0.5">{agent.title}</div>
                    <div className="text-[9px] text-slate-400 mt-1 leading-snug">{agent.tone}</div>

                    {/* Audio Preview Sample */}
                    <button
                      type="button"
                      onClick={(e) => previewVoice(agent, e)}
                      className={`mt-2.5 inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                        isPlaying
                          ? 'bg-brand-500 text-white border-brand-400 shadow-md shadow-brand-500/30'
                          : 'bg-slate-900/90 text-slate-300 hover:text-white border-slate-700 hover:border-brand-400'
                      }`}
                      title="Click to preview voice"
                    >
                      <Volume2 className={`w-3 h-3 text-brand-400 ${isPlaying ? 'animate-bounce' : ''}`} />
                      <span>{isPlaying ? 'Speaking...' : 'Voice Sample'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Target Role & Company */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-400" /> Target Configuration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Target Job Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Target Company Pattern</label>
                <select
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="General Tech">General Placement Panel</option>
                  <option value="TCS Digital">TCS Digital / Prime</option>
                  <option value="Infosys SP">Infosys Specialist Programmer</option>
                  <option value="Amazon SDE">Amazon SDE-1</option>
                  <option value="Wipro Turbo">Wipro Turbo</option>
                  <option value="Larsen & Toubro">Larsen & Toubro (Core)</option>
                  <option value="Tata Motors">Tata Motors (Core)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Difficulty Level */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Interview Difficulty Level
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {difficulties.map(d => (
                <div
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    difficulty === d.id
                      ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-sm'
                      : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs">{d.id}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">{d.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Webcam Preview, Mic Level & Checklist */}
        <div className="lg:col-span-5 space-y-6">
          {/* Video Preview Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300">Webcam & Microphone Check</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${cameraActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                {cameraActive ? 'Camera Connected' : 'Camera Off'}
              </span>
            </div>

            <div className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
              />

              {!cameraActive && (
                <div className="text-center space-y-2 p-4">
                  <VideoOff className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">Camera preview inactive</p>
                  <button
                    onClick={startCamera}
                    className="px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold"
                  >
                    Enable Camera & Mic
                  </button>
                </div>
              )}

              {cameraActive && (
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  <button
                    onClick={stopCamera}
                    className="p-1.5 rounded-lg bg-slate-900/80 text-rose-400 hover:bg-slate-900"
                    title="Turn off camera"
                  >
                    <VideoOff className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Mic Volume Meter */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><Mic className="w-3.5 h-3.5 text-brand-400" /> Mic Input Sensitivity</span>
                <span>{micVolume}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-75"
                  style={{ width: `${micVolume}%` }}
                />
              </div>
            </div>
          </div>

          {/* Pre-Interview Checklist Box (Prompt section 23) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pre-Interview Room Checklist
            </h4>

            <div className="space-y-2">
              {[
                { key: 'resume', label: 'Resume verified & ready for questioning' },
                { key: 'camera', label: 'Camera position & clear lighting' },
                { key: 'mic', label: 'Microphone working & audio tested' },
                { key: 'appearance', label: 'Formal appearance & grooming checked' },
                { key: 'environment', label: 'Quiet room with minimal background noise' },
                { key: 'internet', label: 'Stable internet connection verified' }
              ].map(item => {
                const checked = checklist[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() => setChecklist(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer"
                  >
                    {checked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    )}
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Big Launch CTA */}
          <button
            onClick={handleLaunchInterview}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-brand-600 hover:from-emerald-500 hover:to-brand-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>{loading ? 'Connecting to Room...' : `Enter Interview Room with ${selectedInterviewer?.name?.split(' ')[0] || 'Interviewer'}`}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
