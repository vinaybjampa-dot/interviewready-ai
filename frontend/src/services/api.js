const API_BASE = (typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '8000'))
  ? ''
  : 'http://127.0.0.1:8000';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.detail || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Profiles
  getDemoProfile: () => request('/api/profile/demo'),
  resetDemoProfile: () => request('/api/profile/reset-demo', { method: 'POST' }),
  getProfile: (userId) => request(`/api/profile/${userId}`),
  saveProfile: (data) => request('/api/profile', { method: 'POST', body: JSON.stringify(data) }),

  // Roadmap & Readiness
  getRoadmap: (userId) => request(`/api/roadmap/${userId}`),

  // Pre-Interview & Grooming
  getCompanyChecklist: () => request('/api/pre-interview/company-checklist'),
  getGroomingGuide: () => request('/api/pre-interview/grooming-guide'),

  // Resume
  getSampleResume: () => request('/api/resume/sample'),
  analyzeResume: (resumeText, userId) => request('/api/resume/analyze', {
    method: 'POST',
    body: JSON.stringify({ resume_text: resumeText, user_id: userId })
  }),
  uploadResume: (file, userId) => {
    const formData = new FormData();
    formData.append('file', file);
    if (userId) formData.append('user_id', userId);
    const url = `${API_BASE}/api/resume/upload`;
    return fetch(url, {
      method: 'POST',
      body: formData
    }).then(async res => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Upload failed');
      }
      return res.json();
    });
  },

  // Etiquette
  getEtiquetteScenarios: () => request('/api/etiquette/scenarios'),
  submitEtiquetteScenario: (scenarioId, selectedOption) => request('/api/etiquette/submit', {
    method: 'POST',
    body: JSON.stringify({ scenario_id: scenarioId, selected_option: selectedOption })
  }),

  // Communication
  analyzeIntro: (transcript, userId) => request('/api/communication/analyze-intro', {
    method: 'POST',
    body: JSON.stringify({ transcript, user_id: userId })
  }),

  // Technical Prep
  getBranches: () => request('/api/technical/branches'),
  getTechnicalDrills: (branch) => request(`/api/technical/${encodeURIComponent(branch)}`),

  // Live Interview
  startInterview: (params) => request('/api/interview/start', {
    method: 'POST',
    body: JSON.stringify(params)
  }),
  submitAnswer: (params) => request('/api/interview/answer', {
    method: 'POST',
    body: JSON.stringify(params)
  }),
  requestHint: (interviewId, questionId) => request('/api/interview/hint', {
    method: 'POST',
    body: JSON.stringify({ interview_id: interviewId, question_id: questionId })
  }),
  getInterviewReport: (interviewId) => request(`/api/interview/${interviewId}/report`),

  // Progress
  getProgress: (userId) => request(`/api/progress/${userId}`)
};
