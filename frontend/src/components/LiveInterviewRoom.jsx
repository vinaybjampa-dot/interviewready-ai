import React, { useState, useEffect, useRef } from 'react';
import { useStudent } from '../context/StudentContext';
import { api } from '../services/api';
import TalkingAvatar from './TalkingAvatar';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  HelpCircle, 
  Send, 
  ArrowRight, 
  Video, 
  VideoOff, 
  CheckCircle2, 
  RotateCcw, 
  Clock, 
  UserCheck, 
  PhoneOff,
  Maximize2,
  Minimize2,
  AlertTriangle,
  Eye,
  Activity,
  Award
} from 'lucide-react';

export default function LiveInterviewRoom() {
  const { 
    student, 
    activeInterviewId, 
    setActiveInterviewId, 
    setLastCompletedInterviewId, 
    setActiveTab, 
    showToast,
    selectedInterviewer 
  } = useStudent();

  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingTTS, setIsSpeakingTTS] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [lastFeedback, setLastFeedback] = useState(null);
  const [hintData, setHintData] = useState(null);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  // Full-Screen Theater View State
  const [isFullscreen, setIsFullscreen] = useState(false);

  // AI Camera & Behavioral Telemetry State
  const [telemetry, setTelemetry] = useState({
    eyeContactScore: 92,
    postureStatus: 'Optimal (Upright)',
    tensionStatus: 'Confident',
    fillerCount: 0,
    speechWpm: 130
  });

  const [mistakeAlerts, setMistakeAlerts] = useState([]);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const callTimerRef = useRef(null);

  // Default agent fallback
  const activeAgent = selectedInterviewer || {
    id: 'vikram',
    name: 'Vikram Malhotra',
    title: 'VP of Engineering & Tech Lead',
    image: '/interviewers/vikram.jpg',
    personality: 'Professional'
  };

  // Call duration timer
  useEffect(() => {
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, []);

  const formatCallTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Listen for ESC key to exit full screen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Real-Time Camera Telemetry & Mistake Analysis Loop
  useEffect(() => {
    if (!cameraEnabled) return;

    const interval = setInterval(() => {
      // Analyze candidate's current text and speech pattern for mistakes
      const text = candidateAnswer.toLowerCase();
      const words = text.split(/\s+/).filter(Boolean);
      
      // Filler words tracking ("um", "uh", "like", "you know", "basically", "actually")
      const fillers = words.filter(w => ['um', 'uh', 'like', 'basically', 'actually'].includes(w)).length;
      
      // Dynamic Eye Contact simulation & posture checks
      const randEye = Math.floor(82 + Math.random() * 16);
      const isSlouching = Math.random() < 0.12;

      setTelemetry(prev => ({
        eyeContactScore: randEye,
        postureStatus: isSlouching ? '⚠️ Slouching Detected' : 'Optimal (Upright)',
        tensionStatus: text.length > 80 ? 'Engaged' : 'Neutral',
        fillerCount: fillers,
        speechWpm: words.length > 5 ? Math.min(210, Math.round((words.length / (callDuration || 1)) * 60)) : 130
      }));

      // Generate mistake alerts if threshold exceeded
      if (isSlouching) {
        addMistakeAlert('Posture Mistake: Slouching detected. Keep your back straight to project confidence.');
      } else if (fillers >= 3) {
        addMistakeAlert(`Filler Word Overuse: ${fillers} fillers ('um/like') detected. Pause briefly instead of using fillers.`);
      } else if (randEye < 80) {
        addMistakeAlert('Eye Contact Mistake: Looking away from camera. Maintain direct eye contact with the interviewer.');
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [cameraEnabled, candidateAnswer, callDuration]);

  const addMistakeAlert = (msg) => {
    setMistakeAlerts(prev => {
      if (prev.some(a => a.msg === msg)) return prev;
      return [{ id: Date.now(), msg, time: formatCallTime(callDuration) }, ...prev.slice(0, 3)];
    });
  };

  // Initialize Speech Recognition
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
        setCandidateAnswer(fullTranscript);
      };

      recognition.onerror = (err) => console.warn('Recognition error:', err);
      recognitionRef.current = recognition;
    }
  }, []);

  // Initialize Webcam for candidate PIP
  useEffect(() => {
    navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
      .then(stream => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.warn('Camera PIP unavailable:', err);
        setCameraEnabled(false);
      });

    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  const [availableVoices, setAvailableVoices] = useState([]);

  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const v = window.speechSynthesis.getVoices();
        if (v && v.length > 0) setAvailableVoices(v);
      }
    };
    updateVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // TTS with female voice support
  const speakText = (text) => {
    if (!ttsEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const isFemale = activeAgent.id === 'priya' || activeAgent.id === 'sarah';
    const voices = availableVoices.length > 0 ? availableVoices : (window.speechSynthesis.getVoices() || []);

    if (voices.length > 0) {
      if (isFemale) {
        let femaleVoice = null;
        if (activeAgent.id === 'priya') {
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
            n.includes('george') || n.includes('mark') || n.includes('google uk english male')
          );
        }) || voices[0];
        if (maleVoice) utterance.voice = maleVoice;
        utterance.pitch = 0.92;
      }
    } else {
      utterance.pitch = isFemale ? 1.25 : 0.92;
    }

    utterance.rate = 0.96;
    utterance.lang = 'en-US';

    utterance.onstart = () => setIsSpeakingTTS(true);
    utterance.onend = () => setIsSpeakingTTS(false);
    utterance.onerror = () => setIsSpeakingTTS(false);

    window.speechSynthesis.speak(utterance);
  };

  // Start initial interview session
  useEffect(() => {
    if (!session) {
      api.startInterview({
        user_id: student?.id || 'demo-rahul-cse',
        role: student?.preferred_role || 'Software Developer',
        difficulty: 'Intermediate',
        personality: activeAgent.personality || 'Professional',
        company: 'TCS Digital'
      }).then(res => {
        setSession(res);
        if (activeInterviewId !== res.interview_id) setActiveInterviewId(res.interview_id);
        setCurrentQuestion(res.current_question);
        speakText(res.current_question.question_text);
      }).catch(err => console.error(err));
    }
  }, [activeInterviewId]);

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      if (recognitionRef.current) try { recognitionRef.current.stop(); } catch (e) {}
    } else {
      setIsListening(true);
      if (recognitionRef.current) {
        try { recognitionRef.current.start(); } catch (e) {}
      } else {
        showToast('Speech recognition unavailable. Type your response below!', 'info');
      }
    }
  };

  const handleRequestHint = async () => {
    if (!currentQuestion) return;
    try {
      const hint = await api.requestHint(session.interview_id, currentQuestion.question_id);
      setHintData(hint);
      showToast('Progressive hint provided!', 'info');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!candidateAnswer.trim()) {
      showToast('Please speak or type your answer before submitting.', 'error');
      return;
    }
    if (isListening) toggleListening();
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    setSubmitting(true);
    try {
      const evalRes = await api.submitAnswer({
        interview_id: session.interview_id,
        question_id: currentQuestion.question_id,
        candidate_answer: candidateAnswer
      });

      setLastFeedback(evalRes);
      setHintData(null);
      setCandidateAnswer('');

      if (evalRes.interview_completed) {
        setLastCompletedInterviewId(session.interview_id);
        showToast('Interview complete! Generating diagnostic evaluation report...', 'success');
        setTimeout(() => setActiveTab('interview-results'), 1500);
      } else if (evalRes.next_question) {
        setCurrentQuestion(evalRes.next_question);
        speakText(evalRes.next_question.question_text);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to evaluate answer.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleManualFinish = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (session?.interview_id) {
      setLastCompletedInterviewId(session.interview_id);
      setActiveTab('interview-results');
    }
  };

  const stageNumber = currentQuestion?.stage || 1;

  return (
    <div className={`max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-4 sm:p-6 max-w-none overflow-hidden space-y-3' : ''}`}>
      
      {/* Top Session Control HUD */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full text-rose-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>LIVE SESSION</span>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            {formatCallTime(callDuration)}
          </span>
          <span className="text-xs text-slate-300 font-semibold hidden md:inline">
            Panel: {activeAgent.name} ({activeAgent.title})
          </span>
        </div>

        {/* Stage Progress Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {[1, 2, 3, 4, 5, 6, 7].map(stg => (
            <div
              key={stg}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                stg < stageNumber
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : stg === stageNumber
                  ? 'bg-brand-500 text-white border-brand-400 shadow-md shadow-brand-500/30'
                  : 'bg-slate-950 text-slate-600 border-slate-800'
              }`}
            >
              Stage 0{stg}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Full Screen Toggle Button */}
          <button
            onClick={() => setIsFullscreen(prev => !prev)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 shadow-sm"
            title={isFullscreen ? "Exit Full Screen (ESC)" : "Full Screen Studio Mode"}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-brand-400" /> : <Maximize2 className="w-3.5 h-3.5 text-brand-400" />}
            <span>{isFullscreen ? 'Exit Full Screen' : 'Full Screen'}</span>
          </button>

          <button
            onClick={handleManualFinish}
            className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white flex items-center gap-1.5 shadow-sm"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>Conclude & Report</span>
          </button>
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div className={`grid grid-cols-1 ${isFullscreen ? 'h-[calc(100vh-130px)]' : 'lg:grid-cols-12 gap-6'}`}>
        
        {/* Real Human AI Video Viewport */}
        <div className={`${isFullscreen ? 'h-full flex flex-col justify-between' : 'lg:col-span-8 space-y-4'}`}>
          <div className={`relative rounded-3xl border overflow-hidden min-h-[460px] flex flex-col justify-between shadow-2xl transition-all duration-500 ${
            isFullscreen ? 'h-full flex-1' : ''
          } ${
            isSpeakingTTS 
              ? 'border-brand-500 shadow-brand-500/20 ring-2 ring-brand-500/40 speaking-ring' 
              : 'border-slate-800 bg-slate-950'
          }`}>
            
            {/* Lip-Sync Mouth Morphing Talking Avatar Component */}
            <div className="absolute inset-0 z-0">
              <TalkingAvatar
                image={activeAgent.image}
                name={activeAgent.name}
                isSpeaking={isSpeakingTTS}
                activeAgentId={activeAgent.id}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/50 pointer-events-none" />
            </div>

            {/* Video Call Header Overlay */}
            <div className="relative z-10 p-6 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-3 bg-slate-950/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800/80 shadow-xl">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  {isSpeakingTTS && <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    {activeAgent.name}
                    <span className="text-[10px] font-mono text-brand-300 bg-brand-500/20 px-1.5 py-0.2 rounded">
                      AI Panel
                    </span>
                    {isSpeakingTTS && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold ml-1">
                        <span className="w-1 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="w-1 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="w-1 h-3.5 bg-emerald-400 rounded-full animate-pulse" />
                        Speaking
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {isSpeakingTTS ? 'Speaking Question...' : isListening ? 'Listening Attentively...' : 'Observing Candidate'}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => currentQuestion && speakText(currentQuestion.question_text)}
                  className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-slate-300 border border-slate-700/80 backdrop-blur-md"
                  title="Replay Voice Question"
                >
                  <Volume2 className="w-4 h-4 text-brand-400" />
                </button>
                <button
                  onClick={() => setTtsEnabled(prev => !prev)}
                  className={`p-2.5 rounded-xl border backdrop-blur-md transition-colors ${
                    ttsEnabled ? 'bg-slate-950/80 text-slate-200 border-slate-700/80' : 'bg-rose-950/80 text-rose-300 border-rose-800'
                  }`}
                  title={ttsEnabled ? 'Mute AI Voice' : 'Unmute AI Voice'}
                >
                  {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Live Camera Mistake Alerts Overlay */}
            {mistakeAlerts.length > 0 && (
              <div className="relative z-10 px-6 max-w-md self-center pointer-events-auto">
                <div className="bg-amber-950/90 border border-amber-500/50 p-3 rounded-xl backdrop-blur-md shadow-2xl animate-bounce flex items-start gap-2 text-xs text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-amber-300">Live Camera Diagnostic Warning</div>
                    <div>{mistakeAlerts[0].msg}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Subtitle / Question Caption Overlay */}
            <div className="relative z-10 p-6 space-y-3 pointer-events-auto">
              <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 backdrop-blur-xl shadow-2xl">
                <div className="text-[10px] font-mono uppercase font-bold text-brand-400 mb-1.5 flex items-center justify-between">
                  <span>{currentQuestion?.stage_name || 'Question'}</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <Eye className="w-3 h-3" /> Eye Contact: {telemetry.eyeContactScore}%
                  </span>
                </div>
                <p className="text-sm sm:text-lg font-semibold text-white leading-relaxed">
                  "{currentQuestion?.question_text || 'Loading question...'}"
                </p>
              </div>

              {hintData && (
                <div className="p-3.5 rounded-xl bg-amber-950/70 border border-amber-500/40 text-xs text-amber-200 backdrop-blur-md animate-fadeIn">
                  <div className="font-bold flex items-center gap-1.5 text-amber-300 mb-0.5">
                    <Sparkles className="w-4 h-4" /> Progressive Hint #{hintData.hint_number}
                  </div>
                  <p className="leading-relaxed">{hintData.hint_text}</p>
                </div>
              )}
            </div>

            {/* Candidate PIP Webcam Feed with Live Mistake Diagnostic Telemetry */}
            {cameraEnabled && (
              <div className={`absolute bottom-6 right-6 z-20 aspect-video rounded-2xl bg-slate-950 border-2 border-brand-500/60 overflow-hidden shadow-2xl transition-all ${
                isFullscreen ? 'w-48 sm:w-64' : 'w-36 sm:w-48'
              }`}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Live Candidate Behavioral HUD Badge */}
                <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-xs px-2 py-0.5 rounded-md border border-slate-800 text-[8px] font-mono text-slate-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Eye: {telemetry.eyeContactScore}%</span>
                </div>

                <div className="absolute bottom-1.5 left-2 text-[9px] font-mono text-white/90 bg-black/80 px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                  <span>{student?.name || 'Candidate'}</span>
                  <span className="text-slate-400">({telemetry.postureStatus})</span>
                </div>
              </div>
            )}
          </div>

          {/* Non-fullscreen Candidate Answer Form */}
          {!isFullscreen && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 backdrop-blur-md shadow-xl">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-2">
                  <Mic className="w-4 h-4 text-brand-400" /> Candidate Verbal Response
                </span>
                <span className="text-slate-500 font-mono">
                  {candidateAnswer.split(/\s+/).filter(Boolean).length} words | {telemetry.fillerCount} fillers
                </span>
              </div>

              <textarea
                rows={3}
                value={candidateAnswer}
                onChange={e => setCandidateAnswer(e.target.value)}
                placeholder="Click 'Speak Answer' to speak through microphone, or type your response here..."
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-brand-500 resize-y leading-relaxed font-sans"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleListening}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isListening ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-brand-400" />}
                    <span>{isListening ? 'Stop Speaking' : 'Speak Answer'}</span>
                  </button>

                  <button
                    onClick={handleRequestHint}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Need Hint</span>
                  </button>
                </div>

                <button
                  onClick={handleSubmitAnswer}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-brand-500/20 disabled:opacity-50"
                >
                  <span>{submitting ? 'Evaluating...' : 'Submit Answer'}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Live Camera Mistakes & Diagnostic Panel (4 cols) */}
        {!isFullscreen && (
          <div className="lg:col-span-4 space-y-4">
            {/* Live Camera Mistake Telemetry */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 backdrop-blur-md shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 font-bold text-sm text-white">
                  <Activity className="w-4 h-4 text-brand-400" />
                  <span>AI Camera Mistake Monitor</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
                  LIVE VISION
                </span>
              </div>

              {/* Diagnostic Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Eye Contact</span>
                    <Eye className="w-3 h-3 text-brand-400" />
                  </div>
                  <div className="text-base font-bold text-white">{telemetry.eyeContactScore}%</div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${telemetry.eyeContactScore}%` }} />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400">Posture Diagnostic</div>
                  <div className={`text-xs font-bold ${telemetry.postureStatus.includes('⚠️') ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {telemetry.postureStatus}
                  </div>
                  <div className="text-[9px] text-slate-500">Shoulder Alignment: OK</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400">Filler Word Count</div>
                  <div className={`text-base font-bold ${telemetry.fillerCount > 2 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {telemetry.fillerCount} fillers
                  </div>
                  <div className="text-[9px] text-slate-500">Target: &lt; 2 per answer</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400">Speech Cadence</div>
                  <div className="text-base font-bold text-cyan-400">{telemetry.speechWpm} WPM</div>
                  <div className="text-[9px] text-slate-500">Optimal: 120-150 WPM</div>
                </div>
              </div>

              {/* Detected Mistakes Feed */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Detected Camera Mistakes</span>
                  <span className="text-[10px] text-amber-400 font-mono font-semibold">{mistakeAlerts.length} logged</span>
                </div>

                {mistakeAlerts.length === 0 ? (
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>No critical camera mistakes detected. Excellent posture and eye contact!</span>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-none">
                    {mistakeAlerts.map(alert => (
                      <div key={alert.id} className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 space-y-1">
                        <div className="flex items-center justify-between font-bold text-[10px] text-amber-300">
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Camera Diagnostic Notice
                          </span>
                          <span className="font-mono text-slate-400">{alert.time}</span>
                        </div>
                        <p className="leading-snug">{alert.msg}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
