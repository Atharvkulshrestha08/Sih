(function(){
  const chatLog = document.getElementById('chatLog');
  const chatForm = document.getElementById('chatForm');
  const messageInput = document.getElementById('messageInput');
  const languageSelect = null;
  const typing = document.getElementById('typing');
  const quickButtons = document.getElementById('quickButtons');

  const QUICK_ACTIONS = [
    { label: 'Fees', text: 'What are the fee deadlines?' },
    { label: 'Scholarship', text: 'Scholarship forms and eligibility?' },
    { label: 'Exam Dates', text: 'Upcoming exam dates?' },
    { label: 'Timetable', text: 'Timetable for this semester' },
    { label: 'Results', text: 'Latest results' },
    { label: 'Hostel', text: 'Hostel admission process' },
  ];

  function initBrand() {
    if (!window.APP_CONFIG) return;
    const { branding } = window.APP_CONFIG;
    if (!branding) return;
    if (branding.brandColor) {
      document.documentElement.style.setProperty('--brand', branding.brandColor);
    }
    if (branding.logoSrc) {
      const logos = document.querySelectorAll('img[alt="Logo"]');
      logos.forEach(img => img.src = branding.logoSrc);
    }
  }

  function initLanguages() { /* removed */ }

  function addMessage(role, text) {
    const wrapper = document.createElement('div');
    wrapper.className = `msg ${role}`;
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;
    const meta = document.createElement('span');
    meta.className = 'meta';
    meta.textContent = role === 'user' ? 'You' : 'Assistant';
    bubble.appendChild(document.createElement('br'));
    bubble.appendChild(meta);
    wrapper.appendChild(bubble);
    chatLog.appendChild(wrapper);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function setTyping(on) {
    typing.hidden = !on;
  }

  function sendToBackend(message, history) {
    const hasBackend = Boolean(window.APP_CONFIG && window.APP_CONFIG.backend && window.APP_CONFIG.backend.apiBaseUrl);
    if (!hasBackend) {
      return new Promise(resolve => {
        const canned = 'Demo mode: No backend connected. Your team can plug in Dialogflow or an API later.';
        setTimeout(() => resolve({ reply: canned }), 600);
      });
    }
    const base = window.APP_CONFIG.backend.apiBaseUrl.replace(/\/$/, '');
    const url = base + '/chat';
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    }).then(r => r.json());
  }

  function setupQuickButtons() {
    QUICK_ACTIONS.forEach(a => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip';
      btn.textContent = a.label;
      btn.addEventListener('click', () => {
        messageInput.value = a.text;
        messageInput.focus();
      });
      quickButtons.appendChild(btn);
    });
  }

  const history = [];

  chatForm.addEventListener('submit', function(e){
    e.preventDefault();
    const text = messageInput.value.trim();
    if (!text) return;
    addMessage('user', text);
    history.push({ role: 'user', content: text });
    messageInput.value = '';

    setTyping(true);
    sendToBackend(text, history).then(({ reply }) => {
      setTyping(false);
      const response = reply || 'Sorry, I could not understand that.';
      addMessage('bot', response);
      history.push({ role: 'assistant', content: response });
    }).catch(() => {
      setTyping(false);
      addMessage('bot', 'Network error. Please try again.');
    });
  });

  // Greeting
  function greet() {
    addMessage('bot', 'Namaste! I can help with fees, scholarships, exams, and more. Aap Hindi ya English dono mein pooch sakte hain.');
  }

  // Initialize
  initBrand();
  initLanguages();
  setupQuickButtons();
  greet();
})();


