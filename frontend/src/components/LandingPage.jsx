import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import TalkingAvatar from './TalkingAvatar';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Mic2, 
  Video, 
  FileSearch, 
  BrainCircuit, 
  TrendingUp, 
  Award, 
  Users, 
  Compass, 
  Flame,
  Play,
  Volume2,
  Activity,
  Star,
  Building2,
  GraduationCap,
  Eye,
  Check
} from 'lucide-react';

export default function LandingPage() {
  const { setActiveTab, loadDemoStudent, setSelectedInterviewer } = useStudent();

  // Demo Talking Avatar state inside Hero Section
  const [demoAgentId, setDemoAgentId] = useState('priya');
  const [isDemoSpeaking, setIsDemoSpeaking] = useState(false);

  const demoAgents = [
    {
      id: 'priya',
      name: 'Priya Sharma',
      title: 'Director of Campus Talent Acquisition',
      tag: 'HR & STAR Behavioral Lead',
      image: '/interviewers/priya.jpg',
      sampleText: 'Hello! I am Priya Sharma. I evaluate your behavioral STAR responses, campus leadership, and team communication.'
    },
    {
      id: 'vikram',
      name: 'Vikram Malhotra',
      title: 'VP of Engineering & Systems Architect',
      tag: 'Technical Depth & Architecture',
      image: '/interviewers/vikram.jpg',
      sampleText: 'Hello there, I am Vikram Malhotra. We will dive deep into system design, data structures, and production code cleanliness.'
    },
    {
      id: 'sarah',
      name: 'Dr. Sarah Jenkins',
      title: 'Principal AI & Cloud Architect',
      tag: 'Strict Bar-Raiser Panel',
      image: '/interviewers/sarah.jpg',
      sampleText: 'Greetings. I am Dr. Sarah Jenkins. Prepare for rigorous edge-case probing, latency trade-offs, and algorithmic efficiency.'
    }
  ];

  const currentDemoAgent = demoAgents.find(a => a.id === demoAgentId) || demoAgents[0];

  const playDemoVoice = (agent) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    if (isDemoSpeaking && demoAgentId === agent.id) {
      setIsDemoSpeaking(false);
      return;
    }

    setDemoAgentId(agent.id);
    const utterance = new SpeechSynthesisUtterance(agent.sampleText);
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
              n.includes('jenny') || n.includes('aria') || n.includes('sonia') || n.includes('heera')
            );
          }) || voices[0];
        }
        if (femaleVoice) utterance.voice = femaleVoice;
        utterance.pitch = 1.18;
      } else {
        const maleVoice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('male')) || voices[0];
        if (maleVoice) utterance.voice = maleVoice;
        utterance.pitch = 0.92;
      }
    } else {
      utterance.pitch = isFemale ? 1.25 : 0.92;
    }

    utterance.rate = 0.98;
    utterance.onstart = () => setIsDemoSpeaking(true);
    utterance.onend = () => setIsDemoSpeaking(false);
    utterance.onerror = () => setIsDemoSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const journeySteps = [
    {
      title: "Pre-Interview Audit & ATS Resume Viewer",
      desc: "Interactive A4 document viewer with instant ATS matching, section highlights, and automatic project-defense question generation.",
      icon: Compass,
      color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400"
    },
    {
      title: "Vision AI Camera Mistake Monitor",
      desc: "Real-time webcam telemetry tracking eye contact loss, slouching posture, facial tension, filler words, and lighting during practice.",
      icon: Eye,
      color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400"
    },
    {
      title: "Lip-Synced Full-Screen AI Room",
      desc: "Full-screen studio mode with photorealistic lip-moving video panelists (Vikram, Priya, Sarah), adaptive follow-ups, and hint guidance.",
      icon: Video,
      color: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400"
    },
    {
      title: "Diagnostic Analytics & 3-Week Action Plan",
      desc: "Comprehensive rubric evaluation scorecards, progress trends across multiple sessions, and targeted 21-day improvement roadmaps.",
      icon: TrendingUp,
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400"
    }
  ];

  const targetRecruiters = [
    { name: "TCS Digital / NQT", package: "7.0 – 9.0 LPA", type: "Product & Services Lead" },
    { name: "Infosys Power Programmer", package: "9.5 LPA", type: "Specialist Software Engineer" },
    { name: "Amazon SDE-1", package: "28.0 – 44.0 LPA", type: "Tier-1 Tech Bar" },
    { name: "Google STEP / SWE", package: "30.0+ LPA", type: "Core Algorithms & Systems" },
    { name: "Wipro Turbo", package: "6.5 LPA", type: "Engineering & Architecture" },
    { name: "Accenture Advanced", package: "6.5 LPA", type: "Full-Stack Development" },
  ];

  const branches = [
    { name: "Computer Science (CSE)", subjects: "DSA, OOP, DBMS, OS, Networks, Full-Stack System Design" },
    { name: "Information Technology (IT)", subjects: "Cloud Architecture, REST APIs, Microservices, Security" },
    { name: "Electronics & Comm (ECE)", subjects: "Digital Electronics, Embedded Systems, Microprocessors, Signals" },
    { name: "Electrical Engineering (EEE)", subjects: "Circuit Theory, Power Systems, Control Engineering, Machines" },
    { name: "Mechanical Engineering", subjects: "Thermodynamics, Fluid Mechanics, CAD/CAM, Thermal Systems" },
    { name: "Civil Engineering", subjects: "Structural Analysis, Geotechnical, Surveying, Concrete Tech" },
  ];

  return (
    <div className="relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* Hero Header */}
      <div className="text-center space-y-6 pt-4 sm:pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg shadow-brand-500/5">
          <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
          <span>Real Human AI Panelists • Vision Vision Mistake Analyzer • B.Tech Placements</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.12]">
          Master Campus Interviews with <br />
          <span className="bg-gradient-to-r from-brand-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
            Photorealistic AI Interviewers
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          From ATS resume document analysis and dress code guidance to <strong className="text-white">full-screen lip-synced video mock interviews</strong> and <strong className="text-white">live camera mistake diagnostics</strong>.
        </p>

        {/* Hero Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setActiveTab('onboarding')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-blue-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white font-bold text-base shadow-2xl shadow-brand-600/40 hover:shadow-brand-500/60 transition-all group"
          >
            <span>Start Campus Placement Prep</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={loadDemoStudent}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-base transition-all shadow-xl"
          >
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Try 1-Click Demo Profile</span>
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="pt-2 text-xs text-slate-400 flex flex-wrap items-center justify-center gap-6 font-medium">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Non-Judgmental Feedback</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real-Time Voice STT & TTS</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Live Eye Contact & Posture Tracking</span>
        </div>
      </div>

      {/* Interactive Hero Studio Preview Widget (Live Talking Avatar Demo) */}
      <div className="rounded-3xl border border-brand-500/30 bg-slate-900/90 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold text-brand-400 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Interactive Live Studio Demonstration</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Meet Your Photorealistic AI Placement Panel
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Select an AI interviewer below and click **"Play Live Speech & Lip-Sync"** to experience full lip movement and voice interaction right now!
            </p>
          </div>

          {/* Panel Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {demoAgents.map(ag => (
              <button
                key={ag.id}
                onClick={() => setDemoAgentId(ag.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  demoAgentId === ag.id 
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' 
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{ag.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Interactive Hero Demo Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Avatar Video Canvas Frame (5 cols) */}
          <div className="lg:col-span-5 relative rounded-2xl border-2 border-brand-500/40 overflow-hidden h-[340px] shadow-2xl bg-slate-950 group">
            <TalkingAvatar
              image={currentDemoAgent.image}
              name={currentDemoAgent.name}
              isSpeaking={isDemoSpeaking}
              activeAgentId={currentDemoAgent.id}
              className="w-full h-full object-cover"
            />

            {/* Speaking Status Pill */}
            <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-bold text-white flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isDemoSpeaking ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
              <span>{isDemoSpeaking ? 'Speaking Question...' : 'Ready to Demo'}</span>
            </div>

            {/* Play Button Overlay */}
            <button
              onClick={() => playDemoVoice(currentDemoAgent)}
              className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/20 flex items-center justify-center transition-all"
            >
              <div className={`p-4 rounded-full border border-brand-400/60 backdrop-blur-md transition-transform duration-300 ${
                isDemoSpeaking ? 'bg-brand-500 text-white scale-110 shadow-xl shadow-brand-500/50' : 'bg-slate-950/80 text-brand-400 hover:scale-110'
              }`}>
                {isDemoSpeaking ? <Volume2 className="w-8 h-8 animate-pulse" /> : <Play className="w-8 h-8 ml-1" />}
              </div>
            </button>
          </div>

          {/* Details & Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold">
                {currentDemoAgent.tag}
              </div>
              <h4 className="text-2xl font-bold text-white">{currentDemoAgent.name}</h4>
              <p className="text-xs text-brand-400 font-semibold">{currentDemoAgent.title}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans shadow-inner">
              <span className="text-brand-400 font-mono font-bold block mb-1">PROMPT SAMPLE:</span>
              "{currentDemoAgent.sampleText}"
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => playDemoVoice(currentDemoAgent)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isDemoSpeaking ? 'Stop Demo Voice' : `Play ${currentDemoAgent.name}'s Lip-Sync Voice`}</span>
              </button>

              <button
                onClick={() => {
                  setSelectedInterviewer(currentDemoAgent);
                  setActiveTab('mock-setup');
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all"
              >
                <span>Launch Mock Interview Room with {currentDemoAgent.name.split(' ')[0]}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Target Recruiters & Salary Packages */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-400">Campus Placement Targets</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Simulated Recruitment Patterns & Rubrics
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Our AI engine calibrates question difficulty, behavioral STAR criteria, and technical depth to your target campus recruiter.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {targetRecruiters.map((rec, i) => (
            <div key={i} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-brand-500/40 transition-all space-y-2 group shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-brand-400 font-bold bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                  {rec.package}
                </span>
                <Building2 className="w-4 h-4 text-slate-500 group-hover:text-brand-400 transition-colors" />
              </div>
              <h4 className="text-base font-bold text-white">{rec.name}</h4>
              <p className="text-xs text-slate-400">{rec.type}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4-Step Placement Journey Cards */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            End-to-End Placement Preparation Journey
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Everything you need from initial resume polish and etiquette to live video simulation and performance feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {journeySteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className="relative rounded-2xl border bg-slate-900/70 p-6 backdrop-blur-md hover:border-brand-500/40 transition-all flex flex-col justify-between group shadow-xl"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} border flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Phase 0{idx + 1}
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Engineering Branch Specializations */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950 p-8 sm:p-10 space-y-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-1">Engineering Branch Tailoring</div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Branch-Specific Technical Preparation
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Whether you are in CSE, IT, ECE, EEE, Mechanical, or Civil engineering, our drills cover your core departmental curriculum.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('technical')}
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-400 hover:text-brand-300 self-start md:self-auto bg-brand-500/10 px-4 py-2 rounded-xl border border-brand-500/20"
          >
            <span>Explore Technical Drills</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {branches.map((b, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-brand-500/30 transition-all space-y-1">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-brand-400" />
                <span>{b.name}</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">{b.subjects}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
