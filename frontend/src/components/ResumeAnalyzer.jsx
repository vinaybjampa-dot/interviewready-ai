import React, { useState, useRef } from 'react';
import { useStudent } from '../context/StudentContext';
import { api } from '../services/api';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ZoomIn, 
  ZoomOut, 
  BrainCircuit, 
  Eye, 
  FileCheck, 
  FileCode, 
  ArrowRight, 
  RotateCcw, 
  Copy, 
  Check 
} from 'lucide-react';

export default function ResumeAnalyzer() {
  const { student, showToast, setActiveTab } = useStudent();
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [fileName, setFileName] = useState('Rahul_Sharma_Resume.pdf');
  const [fileSize, setFileSize] = useState(48200);
  const [loading, setLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeHighlight, setActiveHighlight] = useState('all'); // all, projects, skills, education, experience
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  const loadSample = async () => {
    try {
      const sample = await api.getSampleResume();
      setResumeText(sample.sample_text);
      setFileName('Rahul_Sharma_CSE_Resume.pdf');
      setFileSize(52300);
      
      // Auto-analyze sample
      setLoading(true);
      const res = await api.analyzeResume(sample.sample_text, student?.id);
      setAnalysis(res);
      showToast('Loaded & analyzed Rahul Sharma\'s official resume document!', 'success');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setFileName(file.name);
    setFileSize(file.size);

    try {
      const res = await api.uploadResume(file, student?.id);
      setResumeText(res.extracted_text);
      setAnalysis(res.analysis);
      showToast(`Uploaded and extracted ${file.name} successfully!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to parse uploaded document. Try uploading a PDF or TXT.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const fakeEvent = { target: { files: [file] } };
      handleFileUpload(fakeEvent);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleAnalyzeText = async () => {
    if (!resumeText.trim()) {
      showToast('Please upload a resume file or enter text.', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await api.analyzeResume(resumeText, student?.id);
      setAnalysis(res);
      showToast('Resume ATS audit complete with generated questions!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Analysis failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(resumeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  // Split text into formatted paragraphs for the realistic paper document viewer
  const renderDocumentContent = () => {
    if (!resumeText.trim()) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-3">
          <FileText className="w-16 h-16 text-slate-700 stroke-1" />
          <p className="text-sm font-medium">No document loaded yet.</p>
          <p className="text-xs text-slate-600 max-w-xs">
            Upload your resume (PDF/DOCX/TXT) or click "Load Sample Resume" to view the interactive document preview.
          </p>
        </div>
      );
    }

    const lines = resumeText.split('\n');
    return (
      <div 
        className="text-slate-900 font-serif leading-relaxed text-xs sm:text-[13px] space-y-2 p-6 sm:p-8 select-text"
        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center', transition: 'transform 0.2s ease' }}
      >
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-2" />;

          const isHeader = /^(OBJECTIVE|EDUCATION|TECHNICAL SKILLS|PROJECTS|INTERNSHIP EXPERIENCE|CERTIFICATIONS|ACHIEVEMENTS)/i.test(trimmed);
          const isProjectLine = /Face Recognition|Campus Placement|Attendance System/i.test(trimmed);
          const isBullet = trimmed.startsWith('-') || trimmed.startsWith('•');

          let highlightClass = '';
          if (activeHighlight === 'projects' && (isProjectLine || (isBullet && idx > 15 && idx < 30))) {
            highlightClass = 'bg-amber-200/90 text-amber-950 font-medium px-1 rounded';
          } else if (activeHighlight === 'skills' && /Languages:|Frameworks:|Databases:|Core Concepts:/i.test(trimmed)) {
            highlightClass = 'bg-blue-200/90 text-blue-950 font-medium px-1 rounded';
          } else if (activeHighlight === 'education' && /B\.Tech|Higher Secondary|CGPA/i.test(trimmed)) {
            highlightClass = 'bg-emerald-200/90 text-emerald-950 font-medium px-1 rounded';
          }

          if (isHeader) {
            return (
              <div key={idx} className="pt-3 pb-1 border-b-2 border-slate-300 font-bold uppercase tracking-wider text-xs text-slate-900 font-sans">
                {trimmed}
              </div>
            );
          }

          if (idx === 0) {
            return (
              <div key={idx} className="text-center pb-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-950 font-sans">{trimmed}</h1>
              </div>
            );
          }

          return (
            <p key={idx} className={`${isBullet ? 'pl-4 text-slate-800' : 'text-slate-900'} ${highlightClass}`}>
              {trimmed}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold">
            <FileCheck className="w-3.5 h-3.5" /> Interactive Document Intelligence
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Resume Document Viewer & ATS Diagnostic Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Upload your real resume document (PDF/DOCX/TXT). Inspect the rendered document side-by-side with ATS scores and question generators.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadSample}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 whitespace-nowrap shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Load Sample Resume
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-brand-600/25 whitespace-nowrap"
          >
            <Upload className="w-4 h-4" />
            Upload File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,.doc"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-800 hover:border-brand-500/60 rounded-2xl bg-slate-950/60 p-6 text-center cursor-pointer transition-all group backdrop-blur-sm"
      >
        <div className="max-w-md mx-auto space-y-2">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6" />
          </div>
          <div className="text-sm font-bold text-white">
            Click to upload or drag & drop your resume
          </div>
          <p className="text-xs text-slate-400">
            Supports PDF, DOCX, and TXT (Max 10MB). Automatically parses tables, bullets, and projects.
          </p>
        </div>
      </div>

      {/* Split-Screen Main Layout: Document Viewer (Left) + ATS Analysis (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Document Viewer (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-2xl flex flex-col h-[750px]">
            {/* Viewer Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-800 bg-slate-950/80">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-400" />
                <span className="text-xs font-bold text-white truncate max-w-[200px]">{fileName}</span>
                <span className="text-[10px] text-slate-500 font-mono">({formatFileSize(fileSize)})</span>
              </div>

              {/* Document Highlights filter */}
              <div className="flex items-center gap-1">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'projects', label: 'Projects' },
                  { id: 'skills', label: 'Skills' },
                  { id: 'education', label: 'Edu' }
                ].map((hl) => (
                  <button
                    key={hl.id}
                    onClick={() => setActiveHighlight(hl.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                      activeHighlight === hl.id
                        ? 'bg-brand-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {hl.label}
                  </button>
                ))}
              </div>

              {/* Zoom & Action Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))}
                  className="p-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono text-slate-400 w-10 text-center">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(140, prev + 10))}
                  className="p-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleCopyText}
                  className="p-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs ml-1"
                  title="Copy Text"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Document Canvas (A4 Realistic Paper Simulation) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950 flex justify-center items-start">
              <div className="w-full max-w-2xl min-h-[700px] bg-white text-slate-900 rounded-lg shadow-2xl border border-slate-200 relative overflow-hidden">
                {/* Paper header watermark */}
                <div className="absolute top-2 right-3 text-[9px] font-mono text-slate-400 select-none">
                  INTERVIEWREADY ATS PREVIEW
                </div>
                {renderDocumentContent()}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: ATS Score, Question Generator, Strengths (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {analysis ? (
            <div className="space-y-6 animate-fadeIn">
              {/* ATS Scores Overview Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">ATS Parsing Match</div>
                    <div className="text-xl font-black text-white">Diagnostic Summary</div>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-emerald-400">{analysis.ats_score}</span>
                    <span className="text-xs text-slate-500 font-bold">/100</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">ATS Formatting & Layout</span>
                      <span className="text-brand-400 font-bold">{analysis.formatting_score}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                      <div className="h-full bg-brand-500 rounded-full" style={{ width: `${analysis.formatting_score}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">Section Readability</span>
                      <span className="text-emerald-400 font-bold">{analysis.ats_score}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${analysis.ats_score}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Generated Interview Questions (Prompt Section 6B) */}
              <div className="rounded-2xl border border-brand-500/30 bg-slate-900/80 p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-brand-400 font-bold text-sm">
                    <BrainCircuit className="w-4 h-4" />
                    <span>Generated Interview Questions</span>
                  </div>
                  <span className="text-[10px] font-mono bg-brand-500/10 text-brand-300 px-2 py-0.5 rounded border border-brand-500/20">
                    {analysis.generated_questions.length} Questions
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Every project on your resume turns into an interview question. Practice defending these exact prompts:
                </p>

                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {analysis.generated_questions.map((q, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 font-semibold inline-block">
                        {q.source_item}
                      </div>
                      <h4 className="text-xs font-bold text-white leading-relaxed">
                        "{q.question}"
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        <strong className="text-slate-300">Why asked:</strong> {q.reason}
                      </p>
                      <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-[11px] text-emerald-300/90 flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span><strong>Tip:</strong> {q.sample_answer_hint}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setActiveTab('interview-setup')}
                  className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 flex items-center justify-center gap-1.5"
                >
                  <span>Practice in AI Mock Room</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Strengths & Missing Sections */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> Detected Strengths
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  {analysis.strengths.slice(0, 3).map((str, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center space-y-4">
              <FileCode className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Document Analyzed Yet</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Upload a PDF resume or click "Load Sample Resume" to see real-time ATS scoring and project-based question generation.
              </p>
              <button
                onClick={loadSample}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md"
              >
                Analyze Rahul's Resume Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
