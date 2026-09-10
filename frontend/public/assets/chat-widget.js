(function() {
  // Styles for the chatbot widget
  const style = document.createElement('style');
  style.textContent = `
    .ai-chat-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 18px;
      border-radius: 9999px;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: #ffffff;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 600;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 10px 25px -5px rgba(124, 58, 237, 0.5), 0 8px 10px -6px rgba(124, 58, 237, 0.3);
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .ai-chat-btn:hover {
      transform: translateY(-2px) scale(1.03);
      box-shadow: 0 15px 30px -5px rgba(124, 58, 237, 0.7);
    }
    .ai-chat-btn .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 10px #10b981;
      animation: pulse 1.8s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(0.95); opacity: 0.8; }
      50% { transform: scale(1.3); opacity: 1; }
      100% { transform: scale(0.95); opacity: 0.8; }
    }
    .ai-chat-drawer {
      position: fixed;
      top: 0;
      right: -450px;
      width: 420px;
      max-width: 95vw;
      height: 100vh;
      background: rgba(10, 15, 30, 0.97);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-left: 1px solid rgba(71, 85, 105, 0.4);
      box-shadow: -15px 0 40px rgba(0, 0, 0, 0.7);
      z-index: 10000;
      display: flex;
      flex-direction: column;
      transition: right 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #f8fafc;
    }
    .ai-chat-drawer.open {
      right: 0;
    }
    .ai-chat-header {
      padding: 18px 20px;
      background: rgba(15, 23, 42, 0.85);
      border-bottom: 1px solid rgba(51, 65, 85, 0.6);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .ai-chat-title-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .ai-chat-avatar {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      background: linear-gradient(135deg, #6366f1, #a855f7);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
    }
    .ai-chat-title {
      font-size: 15px;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.2;
    }
    .ai-chat-subtitle {
      font-size: 11px;
      color: #94a3b8;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 2px;
    }
    .ai-chat-close {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(71, 85, 105, 0.5);
      color: #cbd5e1;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: all 0.2s;
    }
    .ai-chat-close:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #f87171;
      border-color: rgba(239, 68, 68, 0.4);
    }
    .ai-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      scroll-behavior: smooth;
    }
    .ai-chat-messages::-webkit-scrollbar {
      width: 6px;
    }
    .ai-chat-messages::-webkit-scrollbar-thumb {
      background: rgba(71, 85, 105, 0.4);
      border-radius: 4px;
    }
    .ai-msg {
      max-width: 88%;
      padding: 12px 16px;
      border-radius: 16px;
      font-size: 13.5px;
      line-height: 1.55;
      word-wrap: break-word;
      animation: fadeIn 0.2s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .ai-msg.user {
      align-self: flex-end;
      background: linear-gradient(135deg, #4f46e5, #4338ca);
      color: #ffffff;
      border-bottom-right-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
    }
    .ai-msg.bot {
      align-self: flex-start;
      background: rgba(30, 41, 59, 0.7);
      border: 1px solid rgba(71, 85, 105, 0.4);
      color: #e2e8f0;
      border-bottom-left-radius: 4px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    .ai-msg.bot h3 {
      font-size: 14px;
      font-weight: 700;
      color: #a5b4fc;
      margin-top: 0;
      margin-bottom: 8px;
    }
    .ai-msg.bot p {
      margin: 6px 0;
    }
    .ai-msg.bot ul, .ai-msg.bot ol {
      margin: 6px 0;
      padding-left: 20px;
    }
    .ai-msg.bot li {
      margin: 4px 0;
    }
    .ai-msg.bot strong {
      color: #ffffff;
    }
    .ai-msg-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
      padding-top: 6px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 11px;
    }
    .ai-msg-action-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 2px 6px;
      border-radius: 4px;
      transition: all 0.2s;
    }
    .ai-msg-action-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #e2e8f0;
    }
    .ai-typing-indicator {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 10px 14px;
      background: rgba(30, 41, 59, 0.5);
      border-radius: 14px;
      align-self: flex-start;
      border: 1px solid rgba(71, 85, 105, 0.3);
    }
    .ai-typing-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #818cf8;
      animation: typing 1.4s infinite;
    }
    .ai-typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .ai-typing-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
      30% { transform: translateY(-5px); opacity: 1; }
    }
    .ai-suggestions-wrap {
      padding: 10px 16px;
      display: flex;
      gap: 8px;
      overflow-x: auto;
      scrollbar-width: none;
      border-top: 1px solid rgba(51, 65, 85, 0.4);
      background: rgba(15, 23, 42, 0.5);
    }
    .ai-suggestions-wrap::-webkit-scrollbar {
      display: none;
    }
    .ai-pill {
      white-space: nowrap;
      padding: 6px 12px;
      border-radius: 9999px;
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(71, 85, 105, 0.5);
      color: #cbd5e1;
      font-size: 11.5px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    .ai-pill:hover {
      background: rgba(99, 102, 241, 0.2);
      border-color: rgba(99, 102, 241, 0.6);
      color: #ffffff;
      transform: translateY(-1px);
    }
    .ai-chat-input-wrap {
      padding: 14px 16px;
      background: rgba(15, 23, 42, 0.95);
      border-top: 1px solid rgba(51, 65, 85, 0.5);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .ai-chat-input {
      flex: 1;
      padding: 12px 14px;
      background: rgba(30, 41, 59, 0.7);
      border: 1px solid rgba(71, 85, 105, 0.6);
      border-radius: 12px;
      color: #ffffff;
      font-size: 13.5px;
      outline: none;
      transition: border-color 0.2s;
    }
    .ai-chat-input:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.25);
    }
    .ai-chat-input::placeholder {
      color: #64748b;
    }
    .ai-chat-send {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      border: none;
      color: #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: transform 0.2s;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
    }
    .ai-chat-send:hover {
      transform: scale(1.05);
    }
    .ai-chat-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
    .ai-chat-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(2px);
      z-index: 9999;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s;
    }
    .ai-chat-overlay.open {
      opacity: 1;
      pointer-events: auto;
    }
  `;
  document.head.appendChild(style);

  // Simple Markdown to HTML formatter
  function formatMarkdown(text) {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h3>$1</h3>')
      .replace(/^# (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/`([^`]+)`/gim, '<code style="background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px; font-size: 12px; color: #a5b4fc;">$1</code>')
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^[0-9]+\. (.*$)/gim, '<li>$1</li>')
      .replace(/\n\n/gim, '<br/><br/>');
    return html;
  }

  // Create UI elements
  const triggerBtn = document.createElement('button');
  triggerBtn.className = 'ai-chat-btn';
  triggerBtn.title = 'Ask InterviewReady AI Placement Coach';
  triggerBtn.innerHTML = `
    <span class="pulse-dot"></span>
    <span>💬 AI Placement Mentor</span>
  `;

  const overlay = document.createElement('div');
  overlay.className = 'ai-chat-overlay';

  const drawer = document.createElement('div');
  drawer.className = 'ai-chat-drawer';
  drawer.innerHTML = `
    <div class="ai-chat-header">
      <div class="ai-chat-title-wrap">
        <div class="ai-chat-avatar">🎓</div>
        <div>
          <div class="ai-chat-title">AI Placement Mentor</div>
          <div class="ai-chat-subtitle">
            <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#10b981;"></span>
            <span>Gemini 3.6 • Clarify any interview doubt</span>
          </div>
        </div>
      </div>
      <button class="ai-chat-close" title="Close chat">&times;</button>
    </div>

    <div class="ai-chat-messages" id="aiChatMsgs">
      <div class="ai-msg bot">
        <h3>👋 Welcome to InterviewReady AI!</h3>
        <p>I am your <strong>Placement Coach & Interview Doubt Clarifier</strong>. Ask me anything about:</p>
        <ul>
          <li><strong>STAR Method</strong> for behavioral & HR rounds</li>
          <li><strong>Coding & DSA</strong> interview tips and answering frameworks</li>
          <li><strong>Project Architecture</strong> explanation strategies</li>
          <li><strong>Resume ATS optimization</strong> and defense tactics</li>
          <li><strong>TCS, Infosys, Amazon</strong> & Tech company patterns</li>
        </ul>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 8px;">Select a quick question below or type your doubt to get instant structured advice!</p>
      </div>
    </div>

    <div class="ai-suggestions-wrap">
      <button class="ai-pill" data-q="What is the STAR method and give an example?">⭐ STAR Method</button>
      <button class="ai-pill" data-q="How to introduce myself in an interview?">🎯 Introduce Myself</button>
      <button class="ai-pill" data-q="What should I do if I get stuck on a coding problem?">💻 Stuck in Coding</button>
      <button class="ai-pill" data-q="How should I answer what is your greatest weakness?">⚡ Greatest Weakness</button>
      <button class="ai-pill" data-q="How do I optimize my resume for ATS scanners?">📄 Resume ATS Tips</button>
    </div>

    <div class="ai-chat-input-wrap">
      <input type="text" class="ai-chat-input" id="aiChatInput" placeholder="Ask any interview doubt (e.g. STAR method?)..." />
      <button class="ai-chat-send" id="aiChatSend" title="Send Question">➤</button>
    </div>
  `;

  document.body.appendChild(triggerBtn);
  document.body.appendChild(overlay);
  document.body.appendChild(drawer);

  const msgsContainer = document.getElementById('aiChatMsgs');
  const chatInput = document.getElementById('aiChatInput');
  const sendBtn = document.getElementById('aiChatSend');
  const closeBtn = drawer.querySelector('.ai-chat-close');

  function toggleChat(open) {
    if (open) {
      drawer.classList.add('open');
      overlay.classList.add('open');
      chatInput.focus();
    } else {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
    }
  }

  triggerBtn.addEventListener('click', () => toggleChat(true));
  closeBtn.addEventListener('click', () => toggleChat(false));
  overlay.addEventListener('click', () => toggleChat(false));

  // Voice speech synthesis for answers
  function speakText(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    // Strip markdown tags for voice
    const cleanText = text.replace(/<[^>]+>/g, '').replace(/[*#`_]/g, '');
    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.rate = 1.0;
    utter.pitch = 1.05;
    window.speechSynthesis.speak(utter);
  }

  function appendMessage(text, isUser = false) {
    const msg = document.createElement('div');
    msg.className = `ai-msg ${isUser ? 'user' : 'bot'}`;
    
    if (isUser) {
      msg.textContent = text;
    } else {
      msg.innerHTML = formatMarkdown(text);
      
      // Add actions (Speak & Copy)
      const actions = document.createElement('div');
      actions.className = 'ai-msg-actions';
      
      const speakBtn = document.createElement('button');
      speakBtn.className = 'ai-msg-action-btn';
      speakBtn.innerHTML = '🔊 <span>Listen</span>';
      speakBtn.onclick = () => speakText(text);
      
      const copyBtn = document.createElement('button');
      copyBtn.className = 'ai-msg-action-btn';
      copyBtn.innerHTML = '📋 <span>Copy</span>';
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(text);
        copyBtn.innerHTML = '✓ <span>Copied!</span>';
        setTimeout(() => copyBtn.innerHTML = '📋 <span>Copy</span>', 2000);
      };
      
      actions.appendChild(speakBtn);
      actions.appendChild(copyBtn);
      msg.appendChild(actions);
    }
    
    msgsContainer.appendChild(msg);
    msgsContainer.scrollTop = msgsContainer.scrollHeight;
    return msg;
  }

  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'ai-typing-indicator';
    indicator.id = 'aiTypingIndicator';
    indicator.innerHTML = `
      <span class="ai-typing-dot"></span>
      <span class="ai-typing-dot"></span>
      <span class="ai-typing-dot"></span>
      <span style="font-size: 11px; color: #94a3b8; margin-left: 6px;">AI Coach thinking...</span>
    `;
    msgsContainer.appendChild(indicator);
    msgsContainer.scrollTop = msgsContainer.scrollHeight;
    return indicator;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('aiTypingIndicator');
    if (indicator) indicator.remove();
  }


  // Built-in intelligent placement counselor for instant answers & fallback
  function getPlacementDoubtAnswer(q) {
    const text = q.toLowerCase();
    
    if (text.includes('star') || text.includes('behavioral') || text.includes('situation')) {
      return `### 🌟 The STAR Method Framework

The **STAR method** is the gold standard for answering behavioral interview questions (*"Tell me about a time when..."*).

* **S – Situation (15%):** Set the context. Where were you working? What was the project or challenge?
* **T – Task (15%):** What was your specific responsibility? What goal needed to be achieved?
* **A – Action (50%):** **This is the most critical part.** Detail what *YOU* specifically did. Mention tools, algorithms, decisions, and collaboration techniques.
* **R – Result (20%):** Conclude with quantifiable outcomes (*e.g., "Reduced latency by 35%", "Delivered 2 days ahead of schedule"*).

💡 **Pro Tip:** Keep your total answer between **90 to 120 seconds**. Never dwell too long on the situation; focus on your actions!`;
    }

    if (text.includes('intro') || text.includes('yourself') || text.includes('tell me about')) {
      return `### 🎯 How to Ace "Tell Me About Yourself"

Use the **Present-Past-Future Formula** (Aim for 60–90 seconds):

1. **Present (30 sec):** Your current education/role and core technical stack:
   > *"I am currently a final-year B.Tech student specializing in Computer Science, with deep hands-on expertise in Python, full-stack React, and cloud systems."*
2. **Past (30 sec):** Highlight 1–2 notable projects or internships with concrete impact:
   > *"Recently, I engineered a high-throughput mock assessment system that processed over 500 candidate submissions with real-time feedback."*
3. **Future (20 sec):** Connect your goals directly to the company:
   > *"I'm excited about this opportunity because your team's work in scalable AI aligns directly with where I want to contribute and grow."*

🚫 **Common Mistake:** Avoid reading your resume chronologically. Tell a compelling story!`;
    }

    if (text.includes('weakness') || text.includes('strength')) {
      return `### ⚖️ Handling "What is Your Greatest Weakness?"

The key is **genuine self-awareness + active remediation**:

* **Formula:** Name a real technical/working weakness + show the specific system you implemented to fix it + show positive progress.
* **Winning Example:**
  > *"Earlier, I used to dive into coding immediately without whiteboarding the architecture first, which led to rework on complex edge cases. To fix this, I adopted a strict rule to spend the first 20% of my time drafting system diagrams and test cases before writing code. This improved my first-pass pass rate on algorithmic tests significantly."*

🚫 **Avoid Clichés:** Never say *"I am a perfectionist"* or *"I work too hard"*—interviewers immediately spot insincerity.`;
    }

    if (text.includes('dsa') || text.includes('coding') || text.includes('algorithm') || text.includes('leet')) {
      return `### 💻 5-Step Framework for Coding & DSA Rounds

When given a coding problem, follow this exact interview sequence:

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

    if (text.includes('nervous') || text.includes('anxiety') || text.includes('fear') || text.includes('confident')) {
      return `### 🧘 Managing Interview Nervousness & Mindset

* **Reframe Nervousness as Excitement:** Physiologically, anxiety and excitement are identical (elevated heart rate, adrenaline). Tell yourself: *"I am excited to demonstrate what I know."*
* **The Physiological Sigh:** Inhale deeply through your nose, take a quick top-off sniff, then do a long, slow exhale through your mouth. Doing this twice resets your autonomic nervous system instantly.
* **Remember the True Nature of the Interview:** It is **not an interrogation**, it is a **collaborative technical conversation**. Interviewers *want* you to succeed so they can fill the role!`;
    }

    return `### 💡 Placement Coach Guidance for: *"${q}"*

Here are key strategies to keep in mind for campus placements:

1. **Structured Articulation:** Always structure responses into 3 distinct points. This makes your communication sound crisp and authoritative.
2. **Quantify Your Contributions:** Replace generic phrases like *"I worked on the backend"* with *"I designed 6 REST endpoints using FastAPI that handled user authentication with JWT"*.
3. **Clarification Habit:** When given an ambiguous problem, take 30 seconds to ask clarifying questions before answering. Interviewers reward thoughtful questions as much as correct answers.
4. **STAR Method:** For situational questions, use **S**ituation, **T**ask, **A**ction, and **R**esult to showcase decisive problem solving.`;
  }

  async function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = '';
    appendMessage(text, true);
    showTypingIndicator();
    sendBtn.disabled = true;

    try {
      const resp = await fetch('/api/chat/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      if (resp.ok) {
        const data = await resp.json();
        removeTypingIndicator();
        appendMessage(data.reply || getPlacementDoubtAnswer(text));
        return;
      }
      throw new Error('Server returned ' + resp.status);
    } catch (e) {
      console.warn('Backend chat API unavailable, using offline placement engine:', e);
      removeTypingIndicator();
      appendMessage(getPlacementDoubtAnswer(text));
    } finally {
      sendBtn.disabled = false;
      chatInput.focus();
    }
  }

  sendBtn.addEventListener('click', handleSend);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  // Quick suggestion pills
  drawer.querySelectorAll('.ai-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const q = pill.getAttribute('data-q');
      chatInput.value = q;
      handleSend();
    });
  });

})();
