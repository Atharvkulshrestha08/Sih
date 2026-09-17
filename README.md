> ### 🛡️ Author & Original Creator
> **Atharv Kulshrestha** — [@Atharvkulshrestha08](https://github.com/Atharvkulshrestha08)  
> *This repository and its codebase are the original work of Atharv Kulshrestha. All rights reserved.*

---

# EduBot Pro - Smart Campus Assistant

A complete full-stack multilingual campus assistant chatbot with modern frontend and intelligent backend. Built for Smart India Hackathon (SIH25104) with cutting-edge design principles and AI-powered conversations.

## 🚀 Features

### Frontend
- **Modern Design**: Gradient backgrounds, smooth animations, and responsive layout
- **Interactive Chat**: WhatsApp-style interface with typing indicators and quick actions
- **Parallax Effects**: Advanced 3D earth with mouse and scroll interactions
- **Multilingual Support**: Real-time language detection and responses in Hindi, English, and regional languages
- **Local Storage**: Conversation history persists across sessions
- **Real-time Backend**: Integrated with Flask backend for intelligent responses
- **Mobile Responsive**: Optimized for all device sizes
- **Performance Optimized**: Fast loading with modern CSS and JavaScript

### Backend
- **Flask API**: RESTful backend with CORS support
- **Dialogflow Integration**: 62+ pre-configured intents for campus queries
- **Multilingual AI**: Automatic language detection and response generation
- **Intent Matching**: Smart pattern matching for accurate responses
- **Smalltalk Support**: Natural conversation handling
- **Scalable Architecture**: Easy to extend and maintain

## 📁 Project Structure

```
ModernBot/
├── index.html                    # Main HTML structure
├── styles.css                    # Modern CSS with animations
├── app.js                       # Interactive JavaScript
├── start.py                     # Startup script for full stack
├── Backend/
│   ├── app.py                   # Flask backend server
│   ├── requirements.txt         # Python dependencies
│   ├── agent.json              # Dialogflow agent configuration
│   ├── customSmalltalkResponses_en.json  # Custom responses
│   └── intents/                # 62+ Dialogflow intent files
│       ├── *.json              # Intent definitions
│       └── *_usersays_*.json   # Training phrases
├── assets/
│   ├── css/styles.css          # Additional styles
│   ├── js/
│   │   ├── chat.js             # Chat functionality
│   │   └── config.js           # Configuration
│   └── img/logo.svg            # Logo assets
└── README.md                   # This file
```

## 🎨 Design Highlights

- **Color Palette**: Modern gradients with primary blues and accent colors
- **Typography**: Poppins font family for clean, modern look
- **Animations**: Smooth transitions, hover effects, and scroll animations
- **3D Elements**: Spinning earth with parallax and lighting effects
- **Interactive UI**: Hover states, button animations, and micro-interactions

## 🛠️ Getting Started

### Quick Start (Recommended)
1. **Install Python**: Ensure Python 3.7+ is installed
2. **Install dependencies**: `pip install -r Backend/requirements.txt`
3. **Run the application**: `python start.py`
4. **Access the app**: Browser will open automatically at `http://localhost:8080`

### Manual Setup
1. **Backend**: 
   ```bash
   cd Backend
   pip install -r requirements.txt
   python app.py
   ```
2. **Frontend**: 
   ```bash
   python -m http.server 8080
   ```
3. **Access**: Open `http://localhost:8080` in your browser

### Development Mode
1. **Frontend only**: Open `index.html` directly (backend features disabled)
2. **Backend only**: Run `python Backend/app.py` for API testing
3. **Full stack**: Use `python start.py` for complete experience

## 💬 Chat Demo

The chat interface includes:
- Quick action buttons for common queries
- Typing indicators for realistic conversation flow
- Message history with timestamps
- Local storage for conversation persistence
- Responsive design for mobile devices

### Sample Queries
- "What are the fee payment deadlines?"
- "Tell me about scholarship opportunities"
- "When are the next exams scheduled?"
- "How do I apply for admission?"
- "What are the hostel facilities?"

## 🔧 Dialogflow Integration

To connect with Google Dialogflow:

1. **Enable in app.js**:
```javascript
const DIALOGFLOW_CONFIG = {
    enabled: true,
    agentId: 'your-project-id',
    languageCode: 'en',
    apiLocation: 'global'
};
```

2. **Configure your Dialogflow agent** with intents for:
   - Fee queries
   - Scholarship information
   - Exam schedules
   - Admission procedures
   - Hostel details

3. **The messenger widget** will automatically appear in the Embed section

## 📱 Responsive Design

- **Desktop**: Full-featured layout with side-by-side sections
- **Tablet**: Optimized grid layouts and navigation
- **Mobile**: Stacked layout with touch-friendly interactions

## 🎯 Customization

### Colors
Modify CSS custom properties in `styles.css`:
```css
:root {
    --primary: #6366f1;
    --secondary: #06b6d4;
    --accent: #f59e0b;
    /* ... more colors */
}
```

### Content
- Update hero text in `index.html`
- Modify feature descriptions
- Change quick action buttons
- Customize response patterns in `app.js`

### Animations
- Adjust animation durations in CSS
- Modify parallax sensitivity in JavaScript
- Add new hover effects and transitions

## 🚀 Performance Features

- **Optimized Images**: Efficient earth texture loading
- **Smooth Animations**: Hardware-accelerated CSS transforms
- **Lazy Loading**: Intersection Observer for scroll animations
- **Local Storage**: Efficient conversation persistence
- **Modern JavaScript**: ES6+ features with fallbacks

## 🔗 Integrations

The website is designed to work with:
- **WhatsApp Business API** (via Twilio)
- **Telegram Bot API** (via BotFather)
- **College Websites** (embed widget)
- **Mobile Apps** (API integration)

## 📊 Analytics Ready

Built-in hooks for:
- Message tracking
- User interaction monitoring
- Performance metrics
- Error logging

## 🎓 Educational Use

Perfect for:
- **Hackathons**: Smart India Hackathon (SIH25104)
- **Student Projects**: Campus automation
- **Research**: Multilingual AI applications
- **Demonstrations**: AI chatbot capabilities

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Share improvements

## 📞 Support

For questions or support:
- Check the code comments
- Review the README
- Test the demo functionality
- Customize for your needs

---

**Built with ❤️ for Smart Education (SIH25104)**
*Government of Rajasthan • Directorate of Technical Education*
