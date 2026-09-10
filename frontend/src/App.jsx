import React from 'react';
import { useStudent } from './context/StudentContext';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import OnboardingWizard from './components/OnboardingWizard';
import Dashboard from './components/Dashboard';
import PreparationRoadmap from './components/PreparationRoadmap';
import PreInterviewGuide from './components/PreInterviewGuide';
import DressGroomingGuide from './components/DressGroomingGuide';
import EtiquetteSimulator from './components/EtiquetteSimulator';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import CommunicationTrainer from './components/CommunicationTrainer';
import TechnicalPrep from './components/TechnicalPrep';
import MockInterviewSetup from './components/MockInterviewSetup';
import LiveInterviewRoom from './components/LiveInterviewRoom';
import InterviewResults from './components/InterviewResults';
import ProgressAnalytics from './components/ProgressAnalytics';
import AIChatBot from './components/AIChatBot';

export default function App() {
  const { activeTab } = useStudent();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
      case 'onboarding':
        return <OnboardingWizard />;
      case 'dashboard':
        return <Dashboard />;
      case 'roadmap':
        return <PreparationRoadmap />;
      case 'pre-interview':
        return <PreInterviewGuide />;
      case 'dress-grooming':
        return <DressGroomingGuide />;
      case 'etiquette':
        return <EtiquetteSimulator />;
      case 'resume':
        return <ResumeAnalyzer />;
      case 'communication':
        return <CommunicationTrainer />;
      case 'technical':
        return <TechnicalPrep />;
      case 'interview-setup':
        return <MockInterviewSetup />;
      case 'interview-room':
        return <LiveInterviewRoom />;
      case 'interview-results':
        return <InterviewResults />;
      case 'progress':
        return <ProgressAnalytics />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Viewport */}
      <main className="flex-1 pb-16">
        {renderActiveTab()}
      </main>

      {/* 24/7 AI Placement Mentor Floating Chatbot */}
      <AIChatBot />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">InterviewReady AI</span>
            <span>• Full-Stack Placement Coach for B.Tech Students</span>
          </div>
          <div className="text-[11px] text-slate-600">
            Engineered for Campus Recruitment Prep • CSE, IT, ECE, EEE, Mechanical & Civil
          </div>
        </div>
      </footer>
    </div>
  );
}
