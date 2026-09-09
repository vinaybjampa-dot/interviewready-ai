import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const StudentContext = createContext();

export function StudentProvider({ children }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('landing'); // landing, onboarding, dashboard, roadmap, pre-interview, dress-grooming, etiquette, resume, communication, technical, interview-setup, interview-room, interview-results, progress
  const [activeInterviewId, setActiveInterviewId] = useState(null);
  const [lastCompletedInterviewId, setLastCompletedInterviewId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedInterviewer, setSelectedInterviewer] = useState({
    id: 'vikram',
    name: 'Vikram Malhotra',
    role: 'VP of Engineering & Tech Lead',
    personality: 'Professional',
    image: '/interviewers/vikram.jpg',
    tagline: '20+ yrs building scalable architectures'
  });

  const showToast = (msg, type = 'info') => {
    setToastMessage({ msg, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadDemoStudent = async () => {
    setLoading(true);
    try {
      const data = await api.getDemoProfile();
      setStudent(data);
      showToast('Loaded Rahul Sharma (B.Tech CSE) demo profile!', 'success');
      setActiveTab('dashboard');
    } catch (err) {
      console.error('Failed to load demo profile:', err);
      showToast('Backend connection error. Make sure FastAPI server is running.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetDemoStudent = async () => {
    setLoading(true);
    try {
      const data = await api.resetDemoProfile();
      setStudent(data);
      showToast('Demo profile and interview history reset to initial state!', 'success');
      setActiveTab('dashboard');
    } catch (err) {
      console.error('Failed to reset demo profile:', err);
      showToast('Failed to reset demo data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const refreshStudent = async () => {
    if (!student?.id) return;
    try {
      const data = await api.getProfile(student.id);
      setStudent(data);
    } catch (err) {
      console.error('Failed to refresh student:', err);
    }
  };

  useEffect(() => {
    // Initial fetch of demo profile in background
    api.getDemoProfile()
      .then(data => {
        setStudent(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <StudentContext.Provider
      value={{
        student,
        setStudent,
        loading,
        activeTab,
        setActiveTab,
        activeInterviewId,
        setActiveInterviewId,
        lastCompletedInterviewId,
        setLastCompletedInterviewId,
        loadDemoStudent,
        resetDemoStudent,
        refreshStudent,
        showToast,
        selectedInterviewer,
        setSelectedInterviewer
      }}
    >
      {children}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-slate-900/95 border border-slate-700 text-white px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md animate-bounce-short">
          <div className={`w-2.5 h-2.5 rounded-full ${toastMessage.type === 'success' ? 'bg-emerald-400' : toastMessage.type === 'error' ? 'bg-rose-400' : 'bg-brand-400'}`} />
          <span className="text-sm font-medium">{toastMessage.msg}</span>
        </div>
      )}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  return useContext(StudentContext);
}
