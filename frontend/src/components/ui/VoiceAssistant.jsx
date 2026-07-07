import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMicrophone, HiVolumeUp, HiX, HiAdjustments, HiVolumeOff } from 'react-icons/hi';
import { useNotification } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';

const VoiceAssistant = () => {
  const navigate = useNavigate();
  const { info, success, warning, error } = useNotification();
  const [listening, setListening] = useState(false);
  const [continuous, setContinuous] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  
  const recognitionRef = useRef(null);
  const lastExecutionTimeRef = useRef(0);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition is not supported in this browser.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true; // Real-time recognition
    rec.lang = 'en-IN'; // Indian English accent support

    rec.onresult = (e) => {
      const lastResultIdx = e.results.length - 1;
      const speechToText = e.results[lastResultIdx][0].transcript.trim().toLowerCase();
      setTranscript(speechToText);
      processCommand(speechToText);
    };

    rec.onerror = (e) => {
      console.error("Speech Recognition Error: ", e.error);
      if (e.error === 'no-speech' && !continuous) {
        setListening(false);
      }
    };

    rec.onend = () => {
      if (continuous && listening) {
        try {
          recognitionRef.current?.start();
        } catch (err) {
          console.warn("Speech restart failed:", err);
        }
      } else {
        setListening(false);
      }
    };

    recognitionRef.current = rec;
  }, [continuous, listening]);

  // Speak feedback to user
  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop any active speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const processCommand = (command) => {
    const now = Date.now();
    // Prevent double execution within 1.5s cooldown window
    if (now - lastExecutionTimeRef.current < 1500) {
      return;
    }

    let matched = false;
    let spokenFeedback = "";
    let navPath = "";
    let actionFn = null;

    if (command.includes('home') || command.includes('main page')) {
      spokenFeedback = "Navigating to Home";
      navPath = '/';
      matched = true;
    } else if (command.includes('chat') || command.includes('assistant') || command.includes('gemini')) {
      spokenFeedback = "Opening AI Chat assistant";
      navPath = '/chat';
      matched = true;
    } else if (command.includes('scheme') || command.includes('recommendation')) {
      spokenFeedback = "Opening Schemes recommendation wizard";
      navPath = '/schemes';
      matched = true;
    } else if (command.includes('complaint') || command.includes('grievance')) {
      if (command.includes('new') || command.includes('file') || command.includes('register')) {
        spokenFeedback = "Opening form to file a new complaint";
        navPath = '/complaints/new';
      } else {
        spokenFeedback = "Opening complaints history dashboard";
        navPath = '/complaints';
      }
      matched = true;
    } else if (command.includes('document') || command.includes('guide') || command.includes('checklist')) {
      spokenFeedback = "Opening Document guide";
      navPath = '/documents';
      matched = true;
    } else if (command.includes('notice') || command.includes('summarizer') || command.includes('pdf')) {
      spokenFeedback = "Opening Government Notice Summarizer";
      navPath = '/notices';
      matched = true;
    } else if (command.includes('office') || command.includes('maps') || command.includes('nearby')) {
      spokenFeedback = "Opening nearby government offices locator";
      navPath = '/offices';
      matched = true;
    }
    
    // Theme / Accessibility Commands
    else if (command.includes('dark mode') || command.includes('night mode')) {
      spokenFeedback = "Switching to dark theme";
      actionFn = () => {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        info("Dark theme enabled");
      };
      matched = true;
    } else if (command.includes('light mode') || command.includes('day mode')) {
      spokenFeedback = "Switching to light theme";
      actionFn = () => {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        info("Light theme enabled");
      };
      matched = true;
    } else if (command.includes('contrast') || command.includes('color blind') || command.includes('high contrast')) {
      spokenFeedback = "Toggling high contrast mode";
      actionFn = () => {
        const isColorBlind = document.documentElement.classList.toggle('color-blind');
        localStorage.setItem('color-blind', isColorBlind ? 'true' : 'false');
        info(isColorBlind ? "High Contrast Mode Enabled" : "High Contrast Mode Disabled");
      };
      matched = true;
    } else if (command.includes('font') || command.includes('larger') || command.includes('bigger')) {
      spokenFeedback = "Increasing font size";
      actionFn = () => {
        document.documentElement.classList.remove('font-size-sm', 'font-size-lg');
        document.documentElement.classList.add('font-size-lg');
        info("Large fonts enabled");
      };
      matched = true;
    } else if (command.includes('smaller') || command.includes('decrease font')) {
      spokenFeedback = "Decreasing font size";
      actionFn = () => {
        document.documentElement.classList.remove('font-size-sm', 'font-size-lg');
        document.documentElement.classList.add('font-size-sm');
        info("Small fonts enabled");
      };
      matched = true;
    } else if (command.includes('reset font') || command.includes('normal font')) {
      spokenFeedback = "Resetting font size";
      actionFn = () => {
        document.documentElement.classList.remove('font-size-sm', 'font-size-lg');
        info("Font size reset");
      };
      matched = true;
    }

    if (matched) {
      lastExecutionTimeRef.current = now;
      setFeedback(`Command matched: "${command}"`);
      speakText(spokenFeedback);
      
      if (navPath) {
        navigate(navPath);
        setShowPanel(false);
      }
      if (actionFn) {
        actionFn();
      }
    } else {
      setFeedback(`Heard: "${command}"`);
    }
  };

  const toggleListening = async () => {
    if (!recognitionRef.current) {
      warning("Speech recognition is not supported in this browser.");
      return;
    }

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      speakText("Voice assistant deactivated");
    } else {
      try {
        setFeedback('Requesting microphone permission...');
        // Request mic access explicitly to force browser prompt
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop stream immediately to release the mic so SpeechRecognition can acquire it
        stream.getTracks().forEach(track => track.stop());

        setTranscript('');
        setFeedback('Listening for commands...');
        setListening(true);
        recognitionRef.current.start();
        speakText("Smart Bharat Assistant online. How can I help you?");
      } catch (err) {
        console.error("Microphone access failed:", err);
        error("Microphone permission is required to use the Voice Assistant.");
        setFeedback('Microphone access denied');
        setListening(false);
      }
    }
  };

  return (
    <>
      {/* Floating Microphone Bubble */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {showPanel && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-3xl p-5 shadow-2xl w-72 text-center"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-display font-bold text-xs text-gray-500 uppercase tracking-wider">Voice Control Center</h4>
                <button onClick={() => setShowPanel(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                  <HiX className="w-4 h-4" />
                </button>
              </div>

              <div className="py-4 flex flex-col items-center">
                {listening ? (
                  <div className="flex gap-1 mb-4 h-6 items-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ height: [8, 24, 8] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                        className="w-1 bg-saffron-500 rounded-full"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-gray-100 dark:bg-dark-bg rounded-full flex items-center justify-center mb-4">
                    <HiVolumeOff className="w-5 h-5 text-gray-400" />
                  </div>
                )}

                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 min-h-[32px] px-2 leading-relaxed">
                  {feedback || 'Click microphone to start listening'}
                </p>

                <p className="text-[10px] text-gray-400 dark:text-gray-500 italic mt-1.5">
                  Try saying: "go to chat", "dark mode", "high contrast"
                </p>
              </div>

              {/* Preferences */}
              <div className="flex justify-around items-center pt-3 border-t border-gray-100 dark:border-dark-border mt-3 text-xs">
                <button
                  type="button"
                  onClick={() => setContinuous(!continuous)}
                  className={`flex items-center gap-1 font-bold ${continuous ? 'text-saffron-500' : 'text-gray-400'}`}
                >
                  <HiAdjustments className="w-4 h-4" />
                  {continuous ? 'Continuous On' : 'Continuous Off'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2">
          <button
            onClick={() => setShowPanel(!showPanel)}
            className="w-10 h-10 rounded-full bg-navy-900 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
            title="Voice Commands Help"
          >
            <HiVolumeUp className="w-5 h-5" />
          </button>
          <button
            onClick={toggleListening}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl relative transition-all duration-300 ${
              listening
                ? 'bg-saffron-500 text-white ring-4 ring-saffron-100 dark:ring-saffron-950/40 animate-pulse'
                : 'bg-gradient-to-r from-saffron-500 to-orange-500 text-white hover:scale-105'
            }`}
            title={listening ? 'Deactivate Voice Commands' : 'Activate Voice Commands'}
          >
            <HiMicrophone className="w-6 h-6" />
          </button>
        </div>
      </div>
    </>
  );
};

export default VoiceAssistant;
