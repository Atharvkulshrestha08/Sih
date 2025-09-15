// Modern EduBot Pro - Interactive Frontend
(function() {
    'use strict';

    // DOM Elements
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const chatForm = document.getElementById('chatForm');
    const quickActions = document.getElementById('quickActions');
    const typingIndicator = document.getElementById('typingIndicator');
    const clearChat = document.getElementById('clearChat');
    const earth = document.getElementById('earth');
    
    // Storage
    const STORAGE_KEY = 'edubot-conversations-v2';
    
    // Configuration - merge with global config
    const CONFIG = {
        typingDelay: { min: 800, max: 1500 },
        responseDelay: { min: 100, max: 300 },
        maxMessages: 50,
        backend: {
            enabled: window.APP_CONFIG?.backend?.enabled ?? true,
            apiBaseUrl: window.APP_CONFIG?.backend?.apiBaseUrl ?? 'http://localhost:3001',
            timeout: window.APP_CONFIG?.backend?.timeout ?? 10000
        },
        ...(window.APP_CONFIG || {})
    };

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        initializeChat();
        if (CONFIG.features?.parallax !== false) {
            initializeParallax();
        }
        initializeAnimations();
        loadConversationHistory();
        applyTheme();
    });

    // Chat Functions
    function initializeChat() {
        // Form submission
        chatForm.addEventListener('submit', handleFormSubmit);
        
        // Quick actions
        quickActions.addEventListener('click', handleQuickAction);
        
        // Clear chat
        clearChat.addEventListener('click', clearConversation);
        
        // Auto-resize input
        messageInput.addEventListener('input', autoResizeInput);
        
        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        const message = messageInput.value.trim();
        if (!message) return;
        
        sendMessage(message);
        messageInput.value = '';
        autoResizeInput();
    }

    function handleQuickAction(e) {
        const button = e.target.closest('.quick-btn');
        if (!button) return;
        
        const message = button.dataset.message;
        if (message) {
            sendMessage(message);
        }
    }

    function sendMessage(text) {
        // Add user message
        addMessage('user', text);
        saveMessage('user', text);
        
        // Show typing indicator
        showTypingIndicator();
        
        // Send to backend or use fallback
        if (CONFIG.backend.enabled) {
            sendToBackend(text).then(response => {
                hideTypingIndicator();
                addMessage('bot', response.reply);
                saveMessage('bot', response.reply);
            }).catch(error => {
                console.warn('Backend error, using fallback:', error);
                hideTypingIndicator();
                const response = generateResponse(text);
                addMessage('bot', response);
                saveMessage('bot', response);
            });
        } else {
            // Fallback to local response generation
            setTimeout(() => {
                hideTypingIndicator();
                const response = generateResponse(text);
                addMessage('bot', response);
                saveMessage('bot', response);
            }, getRandomDelay(CONFIG.typingDelay));
        }
    }

    function addMessage(sender, text) {
        const messageElement = createMessageElement(sender, text);
        chatMessages.appendChild(messageElement);
        scrollToBottom();
        
        // Limit message count
        const messages = chatMessages.querySelectorAll('.message');
        if (messages.length > CONFIG.maxMessages) {
            messages[0].remove();
        }
    }

    function createMessageElement(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'user' ? '👤' : '🤖';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const textElement = document.createElement('p');
        textElement.textContent = text;
        
        const timeElement = document.createElement('div');
        timeElement.className = 'message-time';
        timeElement.textContent = getCurrentTime();
        
        content.appendChild(textElement);
        content.appendChild(timeElement);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        return messageDiv;
    }

    function generateResponse(userText) {
        const text = userText.toLowerCase();
        
        // Enhanced response patterns
        const responses = {
            // Fees
            fee: [
                "Fee payment deadline is the 15th of every month. You can pay online through the student portal or visit the accounts office.",
                "For fee-related queries, please check the fee structure on our website. Late fees apply after the 15th of each month.",
                "You can pay your fees through multiple methods: online portal, bank transfer, or cash at the accounts office."
            ],
            
            // Scholarships
            scholarship: [
                "Scholarship applications are open from August 1st to September 30th. Check the notice board for eligibility criteria and application forms.",
                "We offer various scholarships including merit-based, need-based, and special category scholarships. Visit the scholarship office for details.",
                "Scholarship results will be announced in October. Keep checking the college website for updates."
            ],
            
            // Exams
            exam: [
                "Mid-semester exams start on October 12th. The detailed timetable will be posted on the notice board tomorrow.",
                "Exam schedules are available on the college website. Make sure to check for any updates or changes.",
                "For exam-related queries, contact the examination cell or check the official notice board."
            ],
            
            // Admissions
            admission: [
                "Admissions are merit-based. Check the official website for current year cutoffs and application procedures.",
                "The admission process includes online application, document verification, and counseling. Visit the admission office for assistance.",
                "For admission queries, you can contact the admission cell or visit the college during office hours."
            ],
            
            // Hostel
            hostel: [
                "Hostel allotment list will be published next week. Contact the warden's office for detailed information about facilities and rules.",
                "Our hostels provide modern amenities including WiFi, mess facilities, and 24/7 security. Application forms are available at the hostel office.",
                "Hostel fees and rules are available on the college website. For specific queries, visit the hostel administration office."
            ],
            
            // Greetings
            greeting: [
                "Hello! I'm your campus assistant. How can I help you today?",
                "Hi there! I'm here to assist you with campus-related queries. What would you like to know?",
                "Welcome! I can help you with fees, scholarships, exams, admissions, and more. What do you need?"
            ],
            
            // Default
            default: [
                "I can help you with fees, scholarships, exam dates, admissions, hostel information, and more. Could you be more specific?",
                "That's an interesting question! I'm designed to help with campus-related queries. Try asking about fees, exams, or admissions.",
                "I'm here to assist with campus information. You can ask me about academic schedules, fees, scholarships, or any college-related topic."
            ]
        };
        
        // Pattern matching
        if (/(hello|hi|hey|good morning|good afternoon|good evening)/.test(text)) {
            return getRandomResponse(responses.greeting);
        }
        if (/(fee|fees|payment|pay|फीस|पैसा)/.test(text)) {
            return getRandomResponse(responses.fee);
        }
        if (/(scholarship|scholar|merit|छात्रवृत्ति|स्कॉलरशिप)/.test(text)) {
            return getRandomResponse(responses.scholarship);
        }
        if (/(exam|examination|test|date|schedule|परीक्षा|टेस्ट)/.test(text)) {
            return getRandomResponse(responses.exam);
        }
        if (/(admission|admit|apply|application|प्रवेश|एडमिशन)/.test(text)) {
            return getRandomResponse(responses.admission);
        }
        if (/(hostel|accommodation|room|आवास|हॉस्टल)/.test(text)) {
            return getRandomResponse(responses.hostel);
        }
        
        return getRandomResponse(responses.default);
    }

    function getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    function getRandomDelay(range) {
        return Math.random() * (range.max - range.min) + range.min;
    }

    function sendToBackend(message) {
        const history = getConversationHistory();
        const url = CONFIG.backend.apiBaseUrl + '/chat';
        
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                history: history
            }),
            timeout: CONFIG.backend.timeout
        }).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        });
    }

    function getConversationHistory() {
        try {
            const messages = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            return messages.slice(-10); // Return last 10 messages for context
        } catch (error) {
            console.warn('Failed to get conversation history:', error);
            return [];
        }
    }

    function showTypingIndicator() {
        typingIndicator.style.display = 'flex';
        scrollToBottom();
    }

    function hideTypingIndicator() {
        typingIndicator.style.display = 'none';
    }

    function scrollToBottom() {
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 100);
    }

    function getCurrentTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function autoResizeInput() {
        messageInput.style.height = 'auto';
        messageInput.style.height = messageInput.scrollHeight + 'px';
    }

    function handleKeyboardShortcuts(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatForm.dispatchEvent(new Event('submit'));
        }
    }

    // Storage Functions
    function saveMessage(sender, text) {
        try {
            const messages = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            messages.push({
                sender,
                text,
                timestamp: Date.now()
            });
            
            // Keep only recent messages
            if (messages.length > CONFIG.maxMessages) {
                messages.splice(0, messages.length - CONFIG.maxMessages);
            }
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        } catch (error) {
            console.warn('Failed to save message:', error);
        }
    }

    function loadConversationHistory() {
        try {
            const messages = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            messages.forEach(msg => {
                addMessage(msg.sender, msg.text);
            });
        } catch (error) {
            console.warn('Failed to load conversation history:', error);
        }
    }

    function clearConversation() {
        if (confirm('Are you sure you want to clear the conversation?')) {
            chatMessages.innerHTML = '';
            localStorage.removeItem(STORAGE_KEY);
            
            // Add welcome message
            setTimeout(() => {
                addMessage('bot', "Hello! I'm your campus assistant. How can I help you today?");
            }, 500);
        }
    }

    // Parallax Functions
    function initializeParallax() {
        if (!earth) return;
        
        let mouseX = 0;
        let mouseY = 0;
        let scrollY = 0;
        
        // Mouse movement parallax
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = (e.clientY / window.innerHeight) * 2 - 1;
            updateEarthTransform();
        });
        
        // Scroll parallax
        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
            updateEarthTransform();
        });
        
        function updateEarthTransform() {
            const rotateX = mouseY * 15;
            const rotateY = mouseX * 15;
            const translateY = scrollY * 0.1;
            
            earth.style.transform = `
                translateY(calc(-50% + ${translateY}px))
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
            `;
        }
        
        // Initial call
        updateEarthTransform();
    }

    // Animation Functions
    function initializeAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements
        document.querySelectorAll('.feature-card, .integration-card').forEach(el => {
            observer.observe(el);
        });
        
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    function applyTheme() {
        const minimal = Boolean(CONFIG.features?.minimalDesign);
        document.documentElement.classList.toggle('theme-minimal', minimal);
    }

    // Utility Functions
    function scrollToDemo() {
        const demoSection = document.getElementById('demo');
        if (demoSection) {
            demoSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Dialogflow Integration
    const DIALOGFLOW_CONFIG = {
        enabled: false,
        agentId: '',
        languageCode: 'en',
        apiLocation: 'global'
    };

    function initializeDialogflow() {
        if (!DIALOGFLOW_CONFIG.enabled) return;
        
        const script = document.createElement('script');
        script.src = 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
        script.async = true;
        
        script.onload = () => {
            const dfMessenger = document.createElement('df-messenger');
            dfMessenger.setAttribute('project-id', DIALOGFLOW_CONFIG.agentId);
            dfMessenger.setAttribute('language-code', DIALOGFLOW_CONFIG.languageCode);
            dfMessenger.setAttribute('api-location', DIALOGFLOW_CONFIG.apiLocation);
            dfMessenger.setAttribute('chat-title', 'EduBot Assistant');
            dfMessenger.setAttribute('agent-id', DIALOGFLOW_CONFIG.agentId);
            
            const embedDemo = document.getElementById('embedDemo');
            if (embedDemo) {
                embedDemo.innerHTML = '';
                embedDemo.appendChild(dfMessenger);
            }
        };
        
        document.head.appendChild(script);
    }

    // Initialize Dialogflow if enabled
    initializeDialogflow();

    // Expose global functions
    window.scrollToDemo = scrollToDemo;
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }

})();
