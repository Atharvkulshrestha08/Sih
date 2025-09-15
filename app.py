from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import random
import re

app = Flask(__name__)
CORS(app)

# Load Dialogflow intents
INTENTS = {}
CUSTOM_RESPONSES = {}

def load_intents():
    """Load Dialogflow intents from JSON files"""
    intents_dir = os.path.join(os.path.dirname(__file__), 'intents')
    
    for filename in os.listdir(intents_dir):
        if filename.endswith('.json') and not filename.endswith('_usersays_'):
            filepath = os.path.join(intents_dir, filename)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    intent_data = json.load(f)
                    intent_name = intent_data.get('name', filename.replace('.json', ''))
                    INTENTS[intent_name] = intent_data
            except Exception as e:
                print(f"Error loading intent {filename}: {e}")

def load_custom_responses():
    """Load custom smalltalk responses"""
    custom_file = os.path.join(os.path.dirname(__file__), 'customSmalltalkResponses_en.json')
    try:
        with open(custom_file, 'r', encoding='utf-8') as f:
            CUSTOM_RESPONSES.update(json.load(f))
    except Exception as e:
        print(f"Error loading custom responses: {e}")

def detect_language(text):
    """Simple language detection based on script"""
    if re.search(r'[\u0900-\u097F]', text):  # Devanagari script
        return 'hi'
    return 'en'

def get_intent_response(message, language='en'):
    """Get response based on intent matching"""
    message_lower = message.lower()
    
    # Intent matching patterns
    intent_patterns = {
        'fee': ['fee', 'fees', 'payment', 'pay', 'फीस', 'पैसा', 'installment', 'deadline'],
        'scholarship': ['scholarship', 'scholar', 'merit', 'छात्रवृत्ति', 'स्कॉलरशिप', 'apply'],
        'exam': ['exam', 'examination', 'test', 'date', 'schedule', 'परीक्षा', 'टेस्ट', 'timetable'],
        'admission': ['admission', 'admit', 'apply', 'application', 'प्रवेश', 'एडमिशन'],
        'hostel': ['hostel', 'accommodation', 'room', 'आवास', 'हॉस्टल'],
        'attendance': ['attendance', 'present', 'absent', 'उपस्थिति', 'हाजिरी'],
        'results': ['result', 'marks', 'grade', 'परिणाम', 'अंक'],
        'id_card': ['id card', 'identity', 'card', 'आईडी', 'कार्ड'],
        'duplicate': ['duplicate', 'mark sheet', 'transcript', 'डुप्लिकेट', 'अंकपत्र'],
        'revaluation': ['revaluation', 'recheck', 'rechecking', 'पुनर्मूल्यांकन', 'पुनः जांच'],
        'internship': ['internship', 'placement', 'job', 'इंटर्नशिप', 'रोजगार'],
        'leave': ['leave', 'medical', 'genuine', 'छुट्टी', 'मेडिकल'],
        'welcome': ['hello', 'hi', 'hey', 'namaste', 'नमस्ते', 'नमस्कार']
    }
    
    # Check for intent matches
    for intent, patterns in intent_patterns.items():
        if any(pattern in message_lower for pattern in patterns):
            return get_response_for_intent(intent, language)
    
    return None

def get_response_for_intent(intent_name, language='en'):
    """Get response for specific intent"""
    # Map intent names to Dialogflow intent names
    intent_mapping = {
        'fee': 'What is the last date to pay the semester/annual fees?',
        'scholarship': 'How do I apply for a scholarship in college?',
        'exam': 'When will the exam timetable be released?',
        'admission': 'How do I apply for a scholarship in college?',  # Using scholarship as example
        'hostel': 'How do I apply for hostel accommodation?',
        'attendance': 'What is the minimum attendance required to appear for exams?',
        'results': 'When will the results be declared?',
        'id_card': 'How can I get my ID card if it\'s lost?',
        'duplicate': 'How can I get a duplicate mark sheet or transcript?',
        'revaluation': 'What is the process for revaluation/rechecking of answer sheets?',
        'internship': 'How can I apply for an internship/placement through college?',
        'leave': 'Can medical or genuine leave be considered in attendance?',
        'welcome': 'Welcome Intent'
    }
    
    dialogflow_intent = intent_mapping.get(intent_name)
    if dialogflow_intent and dialogflow_intent in INTENTS:
        intent_data = INTENTS[dialogflow_intent]
        responses = intent_data.get('responses', [])
        if responses:
            messages = responses[0].get('messages', [])
            for msg in messages:
                if msg.get('lang') == language:
                    speech = msg.get('speech', [])
                    if speech:
                        return random.choice(speech)
    
    # Fallback responses
    fallback_responses = {
        'en': {
            'fee': "Fee payment deadline is announced by the accounts section each semester. Please check the academic calendar for specific dates.",
            'scholarship': "Scholarship applications are available in the student portal. Check the scholarship section for eligibility criteria and application forms.",
            'exam': "Exam schedules are posted by the examination cell. Check the notice board or college website for updates.",
            'admission': "Admission procedures are available on the college website. Contact the admission office for detailed information.",
            'hostel': "Hostel applications are processed by the hostel administration. Visit the hostel office for application forms and procedures.",
            'attendance': "Minimum 75% attendance is required to appear for exams. Check your attendance record in the student portal.",
            'results': "Results are declared by the examination cell. Check the college website or notice board for updates.",
            'welcome': "Hello! I'm your campus assistant. How can I help you today?"
        },
        'hi': {
            'fee': "फीस की अंतिम तिथि हर सेमेस्टर में खाता अनुभाग द्वारा घोषित की जाती है। कृपया विशिष्ट तिथियों के लिए शैक्षणिक कैलेंडर देखें।",
            'scholarship': "छात्रवृत्ति आवेदन छात्र पोर्टल में उपलब्ध हैं। पात्रता मानदंड और आवेदन फॉर्म के लिए छात्रवृत्ति अनुभाग देखें।",
            'exam': "परीक्षा कार्यक्रम परीक्षा सेल द्वारा पोस्ट किया जाता है। अपडेट के लिए नोटिस बोर्ड या कॉलेज वेबसाइट देखें।",
            'admission': "प्रवेश प्रक्रिया कॉलेज वेबसाइट पर उपलब्ध है। विस्तृत जानकारी के लिए प्रवेश कार्यालय से संपर्क करें।",
            'hostel': "हॉस्टल आवेदन हॉस्टल प्रशासन द्वारा संसाधित किया जाता है। आवेदन फॉर्म और प्रक्रियाओं के लिए हॉस्टल कार्यालय जाएं।",
            'attendance': "परीक्षा में बैठने के लिए न्यूनतम 75% उपस्थिति आवश्यक है। छात्र पोर्टल में अपना उपस्थिति रिकॉर्ड देखें।",
            'results': "परिणाम परीक्षा सेल द्वारा घोषित किए जाते हैं। अपडेट के लिए कॉलेज वेबसाइट या नोटिस बोर्ड देखें।",
            'welcome': "नमस्ते! मैं आपका कैंपस सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?"
        }
    }
    
    return fallback_responses.get(language, fallback_responses['en']).get(intent_name, 
        "I can help you with fees, scholarships, exams, admissions, hostel information, and more. Could you be more specific?")

def get_smalltalk_response(message, language='en'):
    """Get smalltalk response"""
    message_lower = message.lower()
    
    # Smalltalk patterns
    smalltalk_patterns = {
        'greeting': ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'namaste', 'नमस्ते', 'नमस्कार'],
        'thanks': ['thank', 'thanks', 'धन्यवाद', 'शुक्रिया'],
        'goodbye': ['bye', 'goodbye', 'see you', 'अलविदा', 'फिर मिलेंगे'],
        'how_are_you': ['how are you', 'how do you do', 'आप कैसे हैं', 'कैसे हो']
    }
    
    for category, patterns in smalltalk_patterns.items():
        if any(pattern in message_lower for pattern in patterns):
            return get_smalltalk_response_for_category(category, language)
    
    return None

def get_smalltalk_response_for_category(category, language='en'):
    """Get smalltalk response for specific category"""
    responses = {
        'greeting': {
            'en': ["Hello! How can I help you today?", "Hi there! What can I do for you?", "Good day! How can I assist you?"],
            'hi': ["नमस्ते! आज मैं आपकी कैसे मदद कर सकता हूं?", "नमस्कार! मैं आपके लिए क्या कर सकता हूं?", "शुभ दिन! मैं आपकी कैसे सहायता कर सकता हूं?"]
        },
        'thanks': {
            'en': ["You're welcome!", "My pleasure!", "Happy to help!"],
            'hi': ["आपका स्वागत है!", "मेरी खुशी!", "मदद करके खुशी हुई!"]
        },
        'goodbye': {
            'en': ["Goodbye! Have a great day!", "See you later!", "Take care!"],
            'hi': ["अलविदा! आपका दिन शुभ हो!", "फिर मिलेंगे!", "अपना ख्याल रखें!"]
        },
        'how_are_you': {
            'en': ["I'm doing great, thank you! How can I help you?", "All systems are working perfectly! What can I do for you?"],
            'hi': ["मैं बहुत अच्छा हूं, धन्यवाद! मैं आपकी कैसे मदद कर सकता हूं?", "सभी सिस्टम सही तरीके से काम कर रहे हैं! मैं आपके लिए क्या कर सकता हूं?"]
        }
    }
    
    category_responses = responses.get(category, {})
    lang_responses = category_responses.get(language, category_responses.get('en', ["I'm here to help!"]))
    return random.choice(lang_responses)

# Load data on startup
load_intents()
load_custom_responses()

@app.get("/")
def health():
    return jsonify(
        ok=True, 
        service="sih-chatbot-backend", 
        endpoints=["POST /chat", "GET /intents"],
        intents_loaded=len(INTENTS),
        languages_supported=["en", "hi"]
    )

@app.get("/intents")
def get_intents():
    """Get list of available intents"""
    return jsonify({
        "intents": list(INTENTS.keys()),
        "count": len(INTENTS)
    })

@app.post("/chat")
def chat():
    data = request.get_json(silent=True) or {}
    message = data.get("message", "").strip()
    history = data.get("history", [])

    if not message:
        return jsonify(reply="Please type a message.", historyLength=len(history))

    # Detect language
    language = detect_language(message)
    
    # Try to get response from intents
    reply = get_intent_response(message, language)
    
    # If no intent match, try smalltalk
    if not reply:
        reply = get_smalltalk_response(message, language)
    
    # Final fallback
    if not reply:
        fallback_responses = {
            'en': "I can help you with fees, scholarships, exams, admissions, hostel information, and more. Could you be more specific?",
            'hi': "मैं आपकी फीस, छात्रवृत्ति, परीक्षा, प्रवेश, हॉस्टल जानकारी और बहुत कुछ में मदद कर सकता हूं। क्या आप और विशिष्ट हो सकते हैं?"
        }
        reply = fallback_responses.get(language, fallback_responses['en'])

    return jsonify(
        reply=reply, 
        historyLength=len(history),
        language=language,
        intent_matched=bool(get_intent_response(message, language))
    )


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=3001)


