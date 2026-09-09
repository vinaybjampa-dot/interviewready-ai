import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { api } from '../services/api';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  GraduationCap, 
  Code2, 
  Briefcase, 
  Target, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';

export default function OnboardingWizard() {
  const { setStudent, setActiveTab, loadDemoStudent, showToast } = useStudent();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    degree: 'B.Tech',
    branch: 'CSE',
    year: '4th Year',
    cgpa: 8.0,
    skills: ['Java', 'Python', 'SQL'],
    programming_languages: ['Java', 'Python', 'SQL'],
    projects: ['Campus Management System'],
    internships: ['Summer Trainee'],
    certifications: [],
    preferred_role: 'Software Developer',
    target_companies: ['TCS', 'Infosys', 'Wipro'],
    interview_experience: 'Beginner',
    weak_areas: ['Public speaking', 'SQL joins']
  });

  const branches = [
    'CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Other Engineering'
  ];

  const commonSkills = [
    'Java', 'Python', 'C++', 'JavaScript', 'React', 'Node.js', 
    'SQL', 'FastAPI', 'OpenCV', 'Git', 'Data Structures', 'DBMS'
  ];

  const commonRoles = [
    'Software Developer', 'Full Stack Developer', 'Data Analyst', 
    'Frontend Developer', 'Backend Developer', 'Embedded Systems Engineer', 
    'QA/Automation Engineer', 'Graduate Engineer Trainee (GET)'
  ];

  const toggleSkill = (skill) => {
    setFormData(prev => {
      const exists = prev.skills.includes(skill);
      const updated = exists 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills: updated, programming_languages: updated };
    });
  };

  const handleNext = () => {
    if (step === 1 && !formData.name.trim()) {
      showToast('Please enter your name.', 'error');
      return;
    }
    setStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrev = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const saved = await api.saveProfile(formData);
      setStudent(saved);
      showToast('Profile created! Your personalized roadmap is ready.', 'success');
      setActiveTab('dashboard');
    } catch (err) {
      console.error(err);
      showToast('Failed to create profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold">
          Step-by-Step Onboarding Wizard
        </div>
        <h2 className="text-3xl font-extrabold text-white">
          Create Your Student Profile
        </h2>
        <p className="text-sm text-slate-400">
          Help your AI Coach understand your academic background, technical skills, and placement targets.
        </p>

        <div className="pt-2">
          <button
            onClick={loadDemoStudent}
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium underline underline-offset-4"
          >
            <Sparkles className="w-3.5 h-3.5" /> Or load Rahul's demo profile instantly
          </button>
        </div>
      </div>

      {/* Wizard Progress Bar */}
      <div className="grid grid-cols-4 gap-2 mb-8">
        {[
          { label: "Academic", icon: GraduationCap },
          { label: "Skills", icon: Code2 },
          { label: "Projects", icon: Briefcase },
          { label: "Goals", icon: Target }
        ].map((item, idx) => {
          const num = idx + 1;
          const isDone = step > num;
          const isCurrent = step === num;
          const Icon = item.icon;
          return (
            <div key={idx} className="space-y-1 text-center">
              <div 
                className={`h-2 rounded-full transition-all ${
                  isDone ? 'bg-emerald-500' : isCurrent ? 'bg-brand-500' : 'bg-slate-800'
                }`}
              />
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-400 pt-1">
                <Icon className={`w-3 h-3 ${isCurrent ? 'text-brand-400' : isDone ? 'text-emerald-400' : ''}`} />
                <span className={isCurrent ? 'text-white' : ''}>{item.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Form Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-sm shadow-xl space-y-6">
        {/* Step 1: Academic */}
        {step === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-brand-400" />
              Academic & Personal Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Degree</label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={e => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Engineering Branch</label>
                <select
                  value={formData.branch}
                  onChange={e => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500"
                >
                  {branches.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Academic Year</label>
                <select
                  value={formData.year}
                  onChange={e => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year (Placement Year)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Cumulative CGPA (out of 10.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="4.0"
                  max="10.0"
                  value={formData.cgpa}
                  onChange={e => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Skills */}
        {step === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-brand-400" />
              Technical Skills & Languages
            </h3>
            <p className="text-xs text-slate-400">
              Select the primary technologies you are comfortable with. These directly shape your technical interview questions.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {commonSkills.map(skill => {
                const selected = formData.skills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                      selected 
                        ? 'bg-brand-500/20 text-brand-300 border-brand-500/40 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3 text-brand-400" />}
                    {skill}
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Additional Skills (Comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Docker, Spring Boot, TensorFlow, AutoCAD"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const val = e.target.value.trim();
                    if (val && !formData.skills.includes(val)) {
                      setFormData({ ...formData, skills: [...formData.skills, val] });
                      e.target.value = '';
                    }
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Press Enter to add custom skill tags.</span>
            </div>
          </div>
        )}

        {/* Step 3: Projects & Experience */}
        {step === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-brand-400" />
              Projects & Internships
            </h3>
            <p className="text-xs text-slate-400">
              Your AI interviewer drills deep into these projects. Include technical tools and your key contribution.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Major Project Title & Tech</label>
              <input
                type="text"
                value={formData.projects[0] || ''}
                onChange={e => setFormData({ ...formData, projects: [e.target.value] })}
                placeholder="e.g. Face Recognition Attendance System (Python, OpenCV, SQLite)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Internship or Work Experience (Optional)</label>
              <input
                type="text"
                value={formData.internships[0] || ''}
                onChange={e => setFormData({ ...formData, internships: [e.target.value] })}
                placeholder="e.g. Web Development Intern at XYZ Software (2 months)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        )}

        {/* Step 4: Goals & Weak Areas */}
        {step === 4 && (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-brand-400" />
              Placement Target & Self-Assessment
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Preferred Job Role</label>
                <select
                  value={formData.preferred_role}
                  onChange={e => setFormData({ ...formData, preferred_role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500"
                >
                  {commonRoles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Interview Experience</label>
                <select
                  value={formData.interview_experience}
                  onChange={e => setFormData({ ...formData, interview_experience: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="Beginner">Beginner (Never attended a professional interview)</option>
                  <option value="Intermediate">Intermediate (Attended 1-2 college mock sessions)</option>
                  <option value="Experienced">Experienced (Appeared in company technical drives)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Areas Where You Feel Weak (AI will customize exercises)
              </label>
              <input
                type="text"
                placeholder="e.g. SQL joins, Nervous in English speaking, Explaining project bottlenecks"
                value={formData.weak_areas.join(', ')}
                onChange={e => setFormData({ ...formData, weak_areas: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
          {step > 1 ? (
            <button
              onClick={handlePrev}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center gap-2 text-xs font-semibold text-white px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 shadow-lg shadow-brand-500/25"
            >
              {loading ? 'Analyzing Profile...' : 'Complete Onboarding & Build Roadmap'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
