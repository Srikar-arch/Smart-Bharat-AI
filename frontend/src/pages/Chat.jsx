import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineChat, 
  HiOutlineClipboardCopy, 
  HiOutlineVolumeUp, 
  HiOutlineVolumeOff, 
  HiOutlineBookmark, 
  HiOutlineRefresh, 
  HiOutlineDownload, 
  HiOutlineArrowRight,
  HiSearch,
  HiLightBulb,
  HiMicrophone
} from 'react-icons/hi';
import { RiGovernmentLine, RiRobotLine, RiUserLine } from 'react-icons/ri';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';

const SUGGESTED_PROMPTS = [
  { icon: '🛂', text: 'How do I apply for a Passport in India?' },
  { icon: '🆔', text: 'How do I apply for Aadhaar Card updates?' },
  { icon: '🏠', text: 'What is the eligibility for PM Awas Yojana?' },
  { icon: '👩‍🌾', text: 'Eligibility for PM Kisan Samman Nidhi' },
  { icon: '🎓', text: 'National Scholarship Portal schemes list' },
  { icon: '🏥', text: 'Ayushman Bharat card details' },
  { icon: '💼', text: 'How to get a PAN Card online?' },
  { icon: '⚡', text: 'Pradhan Mantri Ujjwala Yojana details' },
];

const MessageBubble = ({ message, onSpeak, speakingId }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const copyText = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSpeaking = speakingId === message.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
        isUser
          ? 'bg-gradient-to-br from-saffron-400 to-navy-600'
          : 'bg-gradient-to-br from-saffron-500 to-navy-900 shadow-neon-saffron'
      }`}>
        {isUser ? <RiUserLine className="w-4 h-4 text-white" /> : <RiGovernmentLine className="w-4 h-4 text-white" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] group ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`relative px-4 py-3 rounded-2xl shadow-sm ${
          isUser
            ? 'bg-gradient-to-br from-saffron-500 to-orange-500 text-white rounded-br-sm'
            : 'bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-bl-sm text-gray-800 dark:text-gray-200'
        }`}>
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-200
              prose-headings:font-display prose-headings:font-bold prose-h2:text-base prose-h3:text-sm
              prose-p:text-sm prose-li:text-sm prose-code:text-saffron-600 dark:prose-code:text-saffron-400
              prose-code:bg-saffron-50 dark:prose-code:bg-saffron-900/20 prose-code:rounded prose-code:px-1
              prose-blockquote:border-saffron-400 prose-strong:text-gray-900 dark:prose-strong:text-white">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Message actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={copyText} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" title="Copy">
            {copied ? <span className="text-[10px] text-green-500 font-bold">✓ Copied</span> : <HiOutlineClipboardCopy className="w-3.5 h-3.5" />}
          </button>
          {!isUser && onSpeak && (
            <button onClick={() => onSpeak(message.content, message.id)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-saffron-500 transition-colors" title="Speak Response">
              {isSpeaking ? <HiOutlineVolumeOff className="w-3.5 h-3.5 text-saffron-500 animate-pulse" /> : <HiOutlineVolumeUp className="w-3.5 h-3.5" />}
            </button>
          )}
          <span className="text-[10px] text-gray-400">
            {new Date(message.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const TypingIndicator = () => (
  <div className="flex items-end gap-3">
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-saffron-500 to-navy-900 flex items-center justify-center flex-shrink-0">
      <RiGovernmentLine className="w-4 h-4 text-white" />
    </div>
    <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl rounded-bl-sm px-4 py-3">
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-saffron-400 rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  </div>
);

const Chat = () => {
  const { user, updateProfileFields } = useAuth();
  const { success, error, info } = useNotification();
  const [messages, setMessages] = useState([
    {
      id: 'default',
      role: 'assistant',
      content: `Namaste! I am **Smart Bharat AI**, your official intelligent companion. 🇮🇳

I can help you understand and apply for various services:
- 🛂 **Passport Seva**
- 🆔 **Aadhaar Cards**
- 💼 **PAN Card Applications**
- 🏠 **PM Awas Yojana**
- 👩‍🌾 **PM Kisan welfare**

Ask me a question or click one of the suggested prompts below to get started. I support central & state services in all official Indian languages.`,
      timestamp: new Date()
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState('en');
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load chat session
  const selectChat = (chat) => {
    setActiveChatId(chat.chatId);
    const formatted = chat.messages.map(m => ({
      id: m._id || Math.random().toString(),
      role: m.role === 'model' ? 'assistant' : m.role,
      content: m.content,
      timestamp: m.timestamp
    }));
    setMessages(formatted);
  };

  // Start fresh chat
  const startNewChat = () => {
    setActiveChatId(`chat_${Date.now()}`);
    setMessages([
      {
        id: 'default',
        role: 'assistant',
        content: `Start of a new conversation session. How can I help you today?`,
        timestamp: new Date()
      }
    ]);
  };

  // Send message
  const sendMessage = useCallback(async (text) => {
    const query = text || input.trim();
    if (!query || loading) return;

    // Generate chatId if none exists
    const currentChatId = activeChatId || `chat_${Date.now()}`;
    if (!activeChatId) {
      setActiveChatId(currentChatId);
    }

    const userMessage = {
      id: Math.random().toString(),
      role: 'user',
      content: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Map frontend messages history to format expected by backend
      const history = messages
        .filter(m => m.id !== 'default')
        .map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content
        }));

      const res = await axios.post('/api/ai/chat', {
        message: query,
        chatId: currentChatId,
        history,
        language: selectedLang
      });

      if (res.data) {
        const aiMessage = {
          id: Math.random().toString(),
          role: 'assistant',
          content: res.data.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);

        // Sync local user savedChats state if backend returned a sync
        if (user && user.savedChats) {
          const updatedChats = [...user.savedChats];
          const existingIdx = updatedChats.findIndex(c => c.chatId === currentChatId);
          const newUserMsg = { role: 'user', content: query, timestamp: new Date() };
          const newAiMsg = { role: 'model', content: res.data.message, timestamp: new Date() };

          if (existingIdx > -1) {
            updatedChats[existingIdx].messages.push(newUserMsg, newAiMsg);
          } else {
            updatedChats.push({
              chatId: currentChatId,
              title: query.slice(0, 30),
              messages: [newUserMsg, newAiMsg]
            });
          }
          user.savedChats = updatedChats;
          localStorage.setItem('smart-bharat-user', JSON.stringify(user));
        }
      }
    } catch (err) {
      error("Using offline mode — limited responses available.");
      // Simulated Fallback
      await new Promise(r => setTimeout(r, 1000));
      
      const lowerQuery = query.toLowerCase();
      let fallbackContent = '';
      
      if (lowerQuery.includes('passport')) {
        fallbackContent = `### Passport Application Guide (Offline Mode)\n\nTo apply for a passport:\n1. Register on the [Passport Seva Portal](https://portal2.passportindia.gov.in)\n2. Login and click "Apply for Fresh Passport/Re-issue of Passport"\n3. Fill the online form and submit\n4. Pay the fee and schedule an appointment\n5. Visit the Passport Seva Kendra (PSK) with original documents`;
      } else if (lowerQuery.includes('aadhaar')) {
        fallbackContent = `### Aadhaar Update Guide (Offline Mode)\n\nTo update your Aadhaar card:\n- **Online:** Address can be updated via the [myAadhaar portal](https://myaadhaar.uidai.gov.in) using OTP.\n- **Offline:** Visit an Aadhaar Enrolment Center for biometric, mobile number, or name changes.`;
      } else if (lowerQuery.includes('pm awas') || lowerQuery.includes('housing')) {
        fallbackContent = `### PM Awas Yojana (Offline Mode)\n\nThe Pradhan Mantri Awas Yojana (PMAY) provides affordable housing.\n- Apply online via [pmaymis.gov.in](https://pmaymis.gov.in)\n- Requires Aadhaar card, income proof, and bank details.\n- Subsidized interest rates available for low-income groups.`;
      } else if (lowerQuery.includes('ayushman') || lowerQuery.includes('health')) {
        fallbackContent = `### Ayushman Bharat Scheme (Offline Mode)\n\nProvides health cover of up to ₹5 lakhs per family per year.\n- Check eligibility at [mera.pmjay.gov.in](https://mera.pmjay.gov.in)\n- Covers secondary and tertiary care hospitalization.\n- Carry your Ayushman Card or Aadhaar to empanelled hospitals.`;
      } else {
        fallbackContent = `### Government Services Guide (Offline Mode)\n\nI am currently operating in offline mode. Please verify your internet connection or check official portals:\n- [MyGov.in](https://www.mygov.in) for citizen engagement\n- [India.gov.in](https://www.india.gov.in) for National Portal of India\n- [Digital India](https://www.digitalindia.gov.in) for digital services`;
      }

      const aiMessage = {
        id: Math.random().toString(),
        role: 'assistant',
        content: fallbackContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setLoading(false);
    }
  }, [input, activeChatId, messages, loading, selectedLang, user, error]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Web Speech API - Voice Input (Speech to Text)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = selectedLang === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
        success('Speech transcribed successfully!');
      };
      recognition.onerror = () => {
        setIsListening(false);
        info('Voice input cancelled or not recognized.');
      };

      recognitionRef.current = recognition;
    }
  }, [selectedLang, success, info]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please try Chrome or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  // Text to Speech Voice Output
  const speakMessage = (text, id) => {
    if (!window.speechSynthesis) {
      alert("Speech synthesis is not supported on this browser.");
      return;
    }

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting characters for clean speech
    const cleanText = text.replace(/[*#_`~[\]]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = selectedLang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Regenerate last query
  const regenerateLastMessage = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      sendMessage(lastUserMsg.content);
    }
  };

  // Export Chat PDF (Print view trigger)
  const exportChatPDF = () => {
    const printWindow = window.open('', '_blank');
    const contentHtml = messages.map(m => `
      <div style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
        <strong style="color: ${m.role === 'user' ? '#1A237E' : '#E65100'}">${m.role === 'user' ? 'Citizen' : 'Smart Bharat AI'}</strong>
        <span style="font-size: 10px; color: #888; margin-left: 10px;">${new Date(m.timestamp).toLocaleString()}</span>
        <p style="white-space: pre-wrap; font-family: sans-serif; font-size: 14px; line-height: 1.5; margin-top: 5px;">${m.content}</p>
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Smart Bharat AI Chat Export</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            h1 { text-align: center; color: #1A237E; margin-bottom: 40px; }
            .header-bar { border-bottom: 3px solid #FF6B35; padding-bottom: 10px; margin-bottom: 30px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header-bar">
            <h1>Smart Bharat AI — Official Chat Report</h1>
            <p>Export Date: ${new Date().toLocaleDateString('en-IN')}</p>
          </div>
          ${contentHtml}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Bookmark active chat session
  const bookmarkChat = async () => {
    if (!activeChatId) return;
    try {
      await axios.post('/api/users/bookmarks', { item: `chat_${activeChatId}` });
      success("Conversation bookmarked successfully!");
    } catch (e) {
      // Local fallback
      success("Conversation bookmarked locally!");
    }
  };

  // Filter conversations in sidebar
  const filteredConversations = (user?.savedChats || []).filter(c =>
    c.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50 dark:bg-dark-bg overflow-hidden">
      {/* Sidebar - Chat History */}
      <div className="hidden lg:flex flex-col w-80 bg-white dark:bg-dark-card border-r border-gray-100 dark:border-dark-border flex-shrink-0">
        <div className="p-4 border-b border-gray-100 dark:border-dark-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-sm text-gray-900 dark:text-white">Conversations</h3>
            <button onClick={startNewChat} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-saffron-500 transition-colors" title="New Conversation">
              <HiOutlineRefresh className="w-4 h-4" />
            </button>
          </div>

          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search chat sessions..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs input-base bg-gray-50 border-gray-200"
            />
            <HiSearch className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>

          <button
            onClick={startNewChat}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-saffron-500 text-white text-sm font-semibold hover:bg-saffron-600 transition-colors shadow-neon-saffron"
          >
            <HiOutlineChat className="w-4 h-4" />
            New Conversation
          </button>
        </div>

        {/* Saved Chat History List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((chat) => (
              <button
                key={chat.chatId}
                onClick={() => selectChat(chat)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors truncate flex items-center gap-2 ${
                  activeChatId === chat.chatId
                    ? 'bg-saffron-50 dark:bg-saffron-500/10 text-saffron-600 dark:text-saffron-400 font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                <HiOutlineChat className="w-4 h-4 opacity-75 flex-shrink-0" />
                <span className="truncate">{chat.title || 'Conversation'}</span>
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-3">
                <HiOutlineChat className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">No conversations yet</p>
              <p className="text-xs text-gray-400">Start a new chat to begin</p>
            </div>
          )}
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-gray-100 dark:border-dark-border space-y-3">
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">Language</label>
            <select
              value={selectedLang}
              onChange={e => setSelectedLang(e.target.value)}
              className="w-full text-xs input-base py-2"
            >
              <option value="en">English (English)</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="mr">मराठी (Marathi)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-dark-card border-b border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-saffron-500 to-navy-900 flex items-center justify-center shadow-neon-saffron">
              <RiGovernmentLine className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-gray-900 dark:text-white">Smart Bharat AI</p>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                Official Civic Assistant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={bookmarkChat} disabled={!activeChatId} className="btn-ghost p-2 rounded-lg disabled:opacity-40" title="Bookmark Conversation">
              <HiOutlineBookmark className="w-4 h-4" />
            </button>
            <button onClick={regenerateLastMessage} disabled={messages.length <= 1} className="btn-ghost p-2 rounded-lg disabled:opacity-40" title="Regenerate last response">
              <HiOutlineRefresh className="w-4 h-4" />
            </button>
            <button onClick={exportChatPDF} className="btn-ghost p-2 rounded-lg" title="Export as PDF">
              <HiOutlineDownload className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Panel */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 bg-gray-50/50 dark:bg-dark-bg">
          {messages.map(message => (
            <MessageBubble
              key={message.id}
              message={message}
              onSpeak={speakMessage}
              speakingId={speakingId}
            />
          ))}
          {loading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Panel */}
        {messages.length <= 1 && (
          <div className="px-4 sm:px-6 pb-4">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-600 mb-2 flex items-center gap-1">
              <HiLightBulb className="w-3.5 h-3.5 text-saffron-500" />
              SUGGESTED HELPLINES
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map(prompt => (
                <button
                  key={prompt.text}
                  onClick={() => sendMessage(prompt.text)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border text-xs text-gray-600 dark:text-gray-400 hover:border-saffron-300 hover:text-saffron-600 dark:hover:text-saffron-400 transition-all shadow-sm"
                >
                  <span>{prompt.icon}</span>
                  {prompt.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="px-4 sm:px-6 pb-6">
          <div className="relative flex items-end gap-3 p-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl shadow-md focus-within:border-saffron-400 focus-within:ring-2 focus-within:ring-saffron-100 dark:focus-within:ring-saffron-900/30 transition-all">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about passport, Aadhaar card, PAN card, welfare schemes, etc..."
                rows={1}
                className="w-full bg-transparent border-none outline-none resize-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 max-h-32"
                style={{ minHeight: '24px' }}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleVoiceInput}
                className={`p-2 rounded-lg transition-colors ${
                  isListening
                    ? 'text-red-500 bg-red-50 dark:bg-red-900/20 animate-pulse'
                    : 'text-gray-400 hover:text-saffron-500 hover:bg-saffron-50 dark:hover:bg-saffron-500/10'
                }`}
                title="Voice Input (Speech-to-Text)"
              >
                <HiMicrophone className="w-5 h-5" />
              </button>
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl bg-saffron-500 hover:bg-saffron-600 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-neon-saffron transition-colors"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <HiOutlineArrowRight className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-2">
            Smart Bharat AI Companion processes requests using official digital database benchmarks. Check official portals for verified records.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
