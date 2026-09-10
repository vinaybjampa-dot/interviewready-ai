import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Volume2, Copy, Check, Sparkles, User, Bot, HelpCircle } from 'lucide-react';

const SUGGESTIONS = [
  { label: '🌟 STAR Method?', query: 'Explain the STAR method for behavioral interview questions with an example.' },
  { label: '🎯 Self-Intro formula', query: 'How should I answer "Tell me about yourself" for campus placements?' },
  { label: '💻 5-Step DSA Approach', query: 'What is the best 5-step approach to solve a coding interview problem?' },
  { label: '📄 ATS Resume Tips', query: 'How can I optimize my resume to score 85%+ on campus ATS screeners?' },
  { label: '⚖️ Weakness Question', query: 'How do I answer "What is your greatest weakness" without sounding cliché?' }
];

function getOfflinePlacementAnswer(q) {
  const text = q.toLowerCase();
  
  if (text.includes('star') || text.includes('behavioral') || text.includes('situation')) {
    return `### 🌟 The STAR Method Framework

The **STAR method** is the gold standard for answering behavioral interview questions (*"Tell me about a time when..."*):

* **S – Situation (15%):** Set the context. Where were you working? What was the project or challenge?
* **T – Task (15%):** What was your specific responsibility? What goal needed to be achieved?
* **A – Action (50%):** **This is the most critical part.** Detail what *YOU* specifically did. Mention tools, algorithms, trade-offs, and collaboration.
* **R – Result (20%):** Conclude with quantifiable outcomes (*e.g., "Reduced latency by 35%", "Delivered 2 days ahead of schedule"*).

💡 **Pro Tip:** Keep your total answer between **90 to 120 seconds**. Never dwell too long on the situation; focus on your actions!`;
  }

  if (text.includes('intro') || text.includes('yourself') || text.includes('tell me about')) {
    return `### 🎯 How to Ace "Tell Me About Yourself"

Use the **Present-Past-Future Formula** (60–90 seconds):

1. **Present (30 sec):** Your current education/role and core technical stack:
   > *"I am currently a final-year B.Tech student in Computer Science with hands-on focus on full-stack development, Python, and scalable web architectures."*
2. **Past (30 sec):** Highlight 1–2 notable projects or internships with concrete results:
   > *"Recently, I built an automated mock interview platform that processed over 500 candidate submissions with real-time feedback."*
3. **Future (20 sec):** Connect your goals directly to the company:
   > *"I'm excited about this opportunity because your team's work in distributed systems matches where I want to build and make an impact."*

🚫 **Common Mistake:** Avoid reading your resume chronologically. Tell a compelling story!`;
  }

  if (text.includes('weakness') || text.includes('strength')) {
    return `### ⚖️ Handling "What is Your Greatest Weakness?"

The winning strategy is **genuine self-awareness + active remediation**:

* **Formula:** Name a real technical or operational habit + show the specific system you implemented to fix it + show positive progress.
* **Winning Example:**
  > *"Earlier, I used to jump straight into coding without whiteboarding the architecture first, which led to rework on complex edge cases. To fix this, I adopted a strict rule to spend the first 20% of my time drafting system diagrams and test cases before writing code. This improved my first-pass pass rate on algorithmic tests significantly."*

🚫 **Avoid Clichés:** Never say *"I am a perfectionist"* or *"I work too hard"*—interviewers immediately spot insincerity.`;
  }

  if (text.includes('dsa') || text.includes('coding') || text.includes('algorithm') || text.includes('leet')) {
    return `### 💻 5-Step Framework for Coding & DSA Rounds

Follow this structured sequence during technical rounds:

1. **Clarify (2 mins):** Ask about constraints (*input size, negative numbers, space complexity limits, edge cases*).
2. **Brute Force First (2 mins):** State the naive approach and analyze its Big-O (*e.g., "A nested loop would take O(N²)..."*).
3. **Optimize Before Coding (3-5 mins):** Discuss optimal data structures (*Hash Maps, Two Pointers, Sliding Window, Monotonic Stack*). Get the interviewer's nod!
4. **Clean Implementation (10-15 mins):** Write modular, readable code with descriptive variable names.
5. **Dry Run with Edge Cases (3 mins):** Trace through empty inputs, duplicates, and boundary limits before declaring you're done.`;
  }

  if (text.includes('ats') || text.includes('resume') || text.includes('cv')) {
    return `### 📄 High-Impact Resume & ATS Guidelines

To score **85%+ on Campus ATS screeners**:

* **Use the Google X-Y-Z Formula for Bullet Points:**
  > *"Accomplished **[X]**, as measured by **[Y]**, by doing **[Z]**."*
  > *Example:* *"Optimized database query response time by 42% (Y) by implementing Redis caching and indexing on PostgreSQL user tables (Z)."*
* **Single Column Format:** Avoid tables, multi-column layouts, graphics, or text boxes that confuse ATS parsers.
* **Standard Section Headers:** Stick to *Education, Technical Skills, Projects, Experience, Certifications*.
* **Keyword Density:** Ensure relevant technologies from the Job Description appear naturally in both your skills list and project descriptions.`;
  }

  return `### 💡 Placement Coach Guidance for: *"${q}"*

Here are key strategies to keep in mind for campus placements:

1. **Structured Articulation:** Always structure responses into 3 distinct points. This makes your communication crisp and authoritative.
2. **Quantify Your Contributions:** Replace generic phrases like *"I worked on the backend"* with *"I designed 6 REST endpoints using FastAPI that handled user authentication with JWT"*.
3. **Clarification Habit:** When given an ambiguous problem, take 30 seconds to ask clarifying questions before answering.
4. **STAR Method:** For situational questions, use **S**ituation, **T**ask, **A**ction, and **R**esult to showcase decisive problem solving.`;
}

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'bot',
      text: `👋 **Hi there! I am your AI Placement Mentor.**\n\nI can help you ace campus recruitment interviews! Ask me anything about:\n* **STAR method** for behavioral questions\n* **"Tell me about yourself"** self-intro scripts\n* **Coding/DSA interview** strategies\n* **Resume & ATS** score optimization\n* Overcoming **interview anxiety**`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/<[^>]+>/g, '').replace(/[*#`_>]/g, '');
    const utter = new SpeechSynthesisUtterance(clean);
    utter.rate = 1.0;
    utter.pitch = 1.05;
    window.speechSynthesis.speak(utter);
  };

  const copyText = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (queryText) => {
    const text = (queryText || inputValue).trim();
    if (!text) return;

    setInputValue('');
    const userMsg = { id: `user-${Date.now()}`, sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.reply || getOfflinePlacementAnswer(text);
        setMessages((prev) => [...prev, { id: `bot-${Date.now()}`, sender: 'bot', text: reply }]);
        setIsTyping(false);
        return;
      }
      throw new Error(`Server status ${res.status}`);
    } catch (e) {
      // Graceful intelligent fallback
      const offlineReply = getOfflinePlacementAnswer(text);
      setMessages((prev) => [...prev, { id: `bot-${Date.now()}`, sender: 'bot', text: offlineReply }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-semibold text-sm shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-105 active:scale-95 transition-all duration-200 border border-white/20 select-none group"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <MessageSquare className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
        <span>AI Placement Mentor</span>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        />
      )}

      {/* Slide-out Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[440px] bg-slate-950/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                AI Placement Mentor
                <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  24/7 Coach
                </span>
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Ready to answer interview doubts
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-400 border border-slate-700 text-slate-400 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Suggestion Pills */}
        <div className="px-4 py-2.5 bg-slate-900/40 border-b border-slate-800/60 overflow-x-auto flex gap-2 no-scrollbar">
          {SUGGESTIONS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.query)}
              className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-slate-800/90 hover:bg-indigo-600/30 hover:border-indigo-500/50 border border-slate-700/80 text-slate-300 hover:text-white transition-all whitespace-nowrap"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-sm shadow-md shadow-indigo-600/20'
                      : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-sm shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans space-y-1.5">
                    {m.text}
                  </div>

                  {!isUser && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center gap-3 text-[11px] text-slate-400">
                      <button
                        onClick={() => speakText(m.text)}
                        className="flex items-center gap-1 hover:text-indigo-400 transition-colors"
                        title="Listen with Text-to-Speech"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen</span>
                      </button>
                      <button
                        onClick={() => copyText(m.id, m.text)}
                        className="flex items-center gap-1 hover:text-indigo-400 transition-colors"
                        title="Copy answer"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-2.5 items-center text-xs text-slate-400">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-slate-400 text-[11px] ml-1">AI Mentor formulating advice...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-900/90 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask an interview doubt (e.g. STAR method?)..."
              className="flex-1 bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
