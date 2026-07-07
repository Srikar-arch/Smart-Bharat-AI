import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

const TRANSLATIONS = {
  en: {
    nav_home: 'Home',
    nav_chat: 'AI Chat',
    nav_schemes: 'Schemes',
    nav_documents: 'Documents',
    nav_complaints: 'Complaints',
    nav_notices: 'Notice Summarizer',
    nav_offices: 'Nearby Offices',
    title_companion: "India's Intelligent Civic Companion",
    btn_start_chat: 'Start AI Chat',
    btn_explore_schemes: 'Explore Schemes',
    footer_copy: 'Official Portal of the Government of India.',
    footer_hosting: 'Website designed, developed and hosted by National Informatics Centre (NIC), Ministry of Electronics & IT.',
    lbl_gov_india: 'GOVERNMENT OF INDIA | भारत सरकार',
    lbl_ministry: 'MINISTRY OF ELECTRONICS & IT',
    btn_location: 'Enable Location Access',
    lbl_search: 'Search...',
    btn_submit: 'Submit',
    btn_back: 'Back',
    btn_continue: 'Continue',
  },
  hi: {
    nav_home: 'मुख्य पृष्ठ',
    nav_chat: 'एआई चैट',
    nav_schemes: 'योजनाएं',
    nav_documents: 'दस्तावेज गाइड',
    nav_complaints: 'शिकायतें',
    nav_notices: 'सूचना सारांश',
    nav_offices: 'निकटतम कार्यालय',
    title_companion: "भारत का बुद्धिमान नागरिक साथी",
    btn_start_chat: 'एआई चैट शुरू करें',
    btn_explore_schemes: 'योजनाएं खोजें',
    footer_copy: 'भारत सरकार का आधिकारिक पोर्टल।',
    footer_hosting: 'राष्ट्रीय सूचना विज्ञान केंद्र (NIC), इलेक्ट्रॉनिक्स और आईटी मंत्रालय द्वारा डिजाइन, विकसित और होस्ट की गई वेबसाइट।',
    lbl_gov_india: 'भारत सरकार | GOVERNMENT OF INDIA',
    lbl_ministry: 'इलेक्ट्रॉनिक्स और आईटी मंत्रालय',
    btn_location: 'स्थान पहुंच सक्षम करें',
    lbl_search: 'खोजें...',
    btn_submit: 'जमा करें',
    btn_back: 'पीछे',
    btn_continue: 'जारी रखें',
  },
  te: {
    nav_home: 'హోమ్',
    nav_chat: 'AI చాట్',
    nav_schemes: 'పథకాలు',
    nav_documents: 'పత్రాల గైడ్',
    nav_complaints: 'ఫిర్యాదులు',
    nav_notices: 'నోటీసు సారాంశం',
    nav_offices: 'సమీప కార్యాలయాలు',
    title_companion: "భారతదేశపు ఇంటెలిజెంట్ సివిక్ కంపానియన్",
    btn_start_chat: 'AI చాట్ ప్రారంభించండి',
    btn_explore_schemes: 'పథకాలను అన్వేషించండి',
    footer_copy: 'భారత ప్రభుత్వ అధికారిక పోర్టల్.',
    footer_hosting: 'నేషనల్ ఇన్ఫర్మేటిక్స్ సెంటర్ (NIC), ఎలక్ట్రానిక్స్ & ఐటి మంత్రిత్వ శాఖ రూపొందించిన వెబ్‌సైట్.',
    lbl_gov_india: 'భారత ప్రభుత్వం | GOVERNMENT OF INDIA',
    lbl_ministry: 'ఎలక్ట్రానిక్స్ & ఐటి మంత్రిత్వ శాఖ',
    btn_location: 'స్థాన ప్రాప్యతను ప్రారంభించండి',
    lbl_search: 'వెతకండి...',
    btn_submit: 'సమర్పించండి',
    btn_back: 'వెనుకకు',
    btn_continue: 'కొనసాగించండి',
  },
  ta: {
    nav_home: 'முகப்பு',
    nav_chat: 'AI அரட்டை',
    nav_schemes: 'திட்டங்கள்',
    nav_documents: 'ஆவண வழிகாட்டி',
    nav_complaints: 'புகார்கள்',
    nav_notices: 'அறிவிப்பு சுருக்கம்',
    nav_offices: 'அருகிலுள்ள அலுவலகங்கள்',
    title_companion: "இந்தியாவின் புத்திசாலித்தனமான குடிமக்கள் துணை",
    btn_start_chat: 'AI அரட்டையைத் தொடங்கு',
    btn_explore_schemes: 'திட்டங்களை ஆராயுங்கள்',
    footer_copy: 'இந்திய அரசின் அதிகாரப்பூர்வ தளம்.',
    footer_hosting: 'தேசிய தகவலியல் மையம் (NIC), மின்னணு மற்றும் தகவல் தொழில்நுட்ப அமைச்சகத்தால் வடிவமைக்கப்பட்டது.',
    lbl_gov_india: 'இந்திய அரசு | GOVERNMENT OF INDIA',
    lbl_ministry: 'மின்னணு மற்றும் தகவல் தொழில்நுட்ப அமைச்சகம்',
    btn_location: 'இருப்பிட அணுகலை இயக்கு',
    lbl_search: 'தேடு...',
    btn_submit: 'சமர்ப்பிக்கவும்',
    btn_back: 'பின்னால்',
    btn_continue: 'தொடரவும்',
  },
  kn: {
    nav_home: 'ಮುಖಪುಟ',
    nav_chat: 'AI ಚಾಟ್',
    nav_schemes: 'ಯೋಜನೆಗಳು',
    nav_documents: 'ದಾಖಲೆಗಳ ಮಾರ್ಗದರ್ಶಿ',
    nav_complaints: 'ದೂರುಗಳು',
    nav_notices: 'ನೋಟಿಸ್ ಸಾರಾಂಶ',
    nav_offices: 'ಹತ್ತಿರದ ಕಚೇರಿಗಳು',
    title_companion: "ಭಾರತದ ಬುದ್ಧಿವಂತ ನಾಗರಿಕ ಒಡನಾಡಿ",
    btn_start_chat: 'AI ಚಾಟ್ ಪ್ರಾರಂಭಿಸಿ',
    btn_explore_schemes: 'ಯೋಜನೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
    footer_copy: 'ಭಾರತ ಸರ್ಕಾರದ ಅಧಿಕೃತ ಪೋರ್ಟಲ್.',
    footer_hosting: 'ರಾಷ್ಟ್ರೀಯ ಮಾಹಿತಿ ಕೇಂದ್ರ (NIC), ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ ಮತ್ತು ಐಟಿ ಸಚಿವಾಲಯದಿಂದ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ.',
    lbl_gov_india: 'ಭಾರತ ಸರ್ಕಾರ | GOVERNMENT OF INDIA',
    lbl_ministry: 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ ಮತ್ತು ಐಟಿ ಸಚಿವಾಲಯ',
    btn_location: 'ಸ್ಥಳ ಪ್ರವೇಶವನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ',
    lbl_search: 'ಹುಡುಕಿ...',
    btn_submit: 'ಸಲ್ಲಿಸಿ',
    btn_back: 'ಹಿಂದಕ್ಕೆ',
    btn_continue: 'ಮುಂದುವರೆಯಿರಿ',
  },
  ml: {
    nav_home: 'ഹോം',
    nav_chat: 'AI ചാറ്റ്',
    nav_schemes: 'പദ്ധതികൾ',
    nav_documents: 'രേഖകളുടെ ഗൈഡ്',
    nav_complaints: 'പരാതികൾ',
    nav_notices: 'അറിയിപ്പ് സംഗ്രഹം',
    nav_offices: 'അടുത്തുള്ള ഓഫീസുകൾ',
    title_companion: "ഇന്ത്യയുടെ ഇന്റലിജന്റ് സിവിക് കമ്പാനിയൻ",
    btn_start_chat: 'AI ചാറ്റ് ആരംഭിക്കുക',
    btn_explore_schemes: 'പദ്ധതികൾ പര്യവേക്ഷണം ചെയ്യുക',
    footer_copy: 'ഭാരത സർക്കാരിന്റെ ഔദ്യോഗിക പോർട്ടൽ.',
    footer_hosting: 'നാഷണൽ ഇൻഫോർമാറ്റിക്സ് സെന്റർ (NIC), ഇലക്ട്രോണിക്സ് & ഐടി മന്ത്രാലയം രൂപകൽപ്പന ചെയ്ത വെബ്സൈറ്റ്.',
    lbl_gov_india: 'ഭാരത സർക്കാർ | GOVERNMENT OF INDIA',
    lbl_ministry: 'ഇലക്ട്രോണിക്സ് & ഐടി മന്ത്രാലയം',
    btn_location: 'ലൊക്കേഷൻ അനുമതി നൽകുക',
    lbl_search: 'തിരയുക...',
    btn_submit: 'സമർപ്പിക്കുക',
    btn_back: 'പിന്നിലേക്ക്',
    btn_continue: 'തുടരുക',
  },
  gu: {
    nav_home: 'હોમ',
    nav_chat: 'AI ચેટ',
    nav_schemes: 'યોજનાઓ',
    nav_documents: 'દસ્તાવેજ માર્ગદર્શિકા',
    nav_complaints: 'ફરિયાદો',
    nav_notices: 'સૂચના સારાંશ',
    nav_offices: 'નજીકની કચેરીઓ',
    title_companion: "ભારતનો બુદ્ધિશાળી નાગરિક સાથી",
    btn_start_chat: 'AI ચેટ શરૂ કરો',
    btn_explore_schemes: 'યોજનાઓ શોધો',
    footer_copy: 'ભારત સરકારનું સત્તાવાર પોર્ટલ.',
    footer_hosting: 'નેશનલ ઇન્ફોર્મેટિક્સ સેન્ટર (NIC), ઇલેક્ટ્રોનિક્સ અને આઇટી મંત્રાલય દ્વારા ડિઝાઇન કરાયેલ વેબસાઇટ.',
    lbl_gov_india: 'ભારત સરકાર | GOVERNMENT OF INDIA',
    lbl_ministry: 'ઇલેક્ટ્રોનિક્સ અને આઇટી મંત્રાલય',
    btn_location: 'સ્થાન ઍક્સેસ સક્ષમ કરો',
    lbl_search: 'શોધો...',
    btn_submit: 'સબમિટ કરો',
    btn_back: 'પાછા',
    btn_continue: 'ચાલુ રાખો',
  },
  pa: {
    nav_home: 'ਮੁੱਖ ਪੰਨਾ',
    nav_chat: 'AI ਚੈਟ',
    nav_schemes: 'ਯੋਜਨਾਵਾਂ',
    nav_documents: 'ਦਸਤਾਵੇਜ਼ ਗਾਈਡ',
    nav_complaints: 'ਸ਼ਿਕਾਇਤਾਂ',
    nav_notices: 'ਨੋਟਿਸ ਸਾਰਾਂਸ਼',
    nav_offices: 'ਨੇੜਲੇ ਦਫ਼ਤਰ',
    title_companion: "ਭਾਰਤ ਦਾ ਬੁੱਧੀਮਾਨ ਨਾਗਰਿਕ ਸਾਥੀ",
    btn_start_chat: 'AI ਚੈਟ ਸ਼ੁਰੂ ਕਰੋ',
    btn_explore_schemes: 'ਯੋਜਨਾਵਾਂ ਦੀ ਖੋਜ ਕਰੋ',
    footer_copy: 'ਭਾਰਤ ਸਰਕਾਰ ਦਾ ਅਧਿਕਾਰਤ ਪੋਰਟਲ।',
    footer_hosting: 'ਰਾਸ਼ਟਰੀ ਸੂਚਨਾ ਵਿਗਿਆਨ ਕੇਂਦਰ (NIC), ਇਲੈਕਟ੍ਰਾਨਿਕਸ ਅਤੇ ਆਈਟੀ ਮੰਤਰਾਲੇ ਦੁਆਰਾ ਤਿਆਰ ਕੀਤੀ ਗਈ ਵੈੱਬਸਾਈਟ।',
    lbl_gov_india: 'ਭਾਰਤ ਸਰਕਾਰ | GOVERNMENT OF INDIA',
    lbl_ministry: 'ਇਲੈਕਟ੍ਰਾਨਿਕਸ ਅਤੇ ਆਈਟੀ ਮੰਤਰਾਲਾ',
    btn_location: 'ਸਥਾਨ ਪਹੁੰਚ ਯੋਗ ਕਰੋ',
    lbl_search: 'ਖੋਜੋ...',
    btn_submit: 'ਜਮ੍ਹਾਂ ਕਰੋ',
    btn_back: 'ਪਿੱਛੇ',
    btn_continue: 'ਜਾਰੀ ਰੱਖੋ',
  },
  mr: {
    nav_home: 'मुख्य पृष्ठ',
    nav_chat: 'AI चॅट',
    nav_schemes: 'योजना',
    nav_documents: 'दस्तावेझ मार्गदर्शक',
    nav_complaints: 'तक्रारी',
    nav_notices: 'सूचना सारांश',
    nav_offices: 'जवळपासची कार्यालये',
    title_companion: "भारताचा बुद्धिमान नागरिक सहकारी",
    btn_start_chat: 'AI चॅट सुरू करा',
    btn_explore_schemes: 'योजना शोधा',
    footer_copy: 'भारत सरकारचे अधिकृत पोर्टल.',
    footer_hosting: 'राष्ट्रीय सूचना विज्ञान केंद्र (NIC), इलेक्ट्रॉनिक्स आणि आयटी मंत्रालयाद्वारे डिझाइन केलेली वेबसाइट.',
    lbl_gov_india: 'भारत सरकार | GOVERNMENT OF INDIA',
    lbl_ministry: 'इलेक्ट्रॉनिक्स आणि आयटी मंत्रालय',
    btn_location: 'स्थान प्रवेश सक्षम करा',
    lbl_search: 'शोधा...',
    btn_submit: 'सादर करा',
    btn_back: 'मागे',
    btn_continue: 'सुरू ठेवा',
  },
  bn: {
    nav_home: 'হোম',
    nav_chat: 'AI চ্যাট',
    nav_schemes: 'প্রকল্পসমূহ',
    nav_documents: 'নথিপত্র গাইড',
    nav_complaints: 'অভিযোগসমূহ',
    nav_notices: 'বিজ্ঞপ্তি সারসংক্ষেপ',
    nav_offices: 'নিকটবর্তী কার্যালয়',
    title_companion: "ভারতের বুদ্ধিমান নাগরিক সঙ্গী",
    btn_start_chat: 'AI চ্যাট শুরু করুন',
    btn_explore_schemes: 'প্রকল্পসমূহ অন্বেষণ করুন',
    footer_copy: 'ভারত সরকারের অফিসিয়াল পোর্টাল।',
    footer_hosting: 'ন্যাশনাল ইনফরমেটিক্স সেন্টার (NIC), ইলেকট্রনিক্স ও আইটি মন্ত্রক দ্বারা ডিজাইন করা ওয়েবসাইট।',
    lbl_gov_india: 'ভারত সরকার | GOVERNMENT OF INDIA',
    lbl_ministry: 'ইলেকট্রনিক্স ও আইটি মন্ত্রক',
    btn_location: 'অবস্থান অ্যাক্সেস সক্ষম করুন',
    lbl_search: 'অনুসন্ধান করুন...',
    btn_submit: 'জমা দিন',
    btn_back: 'পেছনে',
    btn_continue: 'চলিয়ে যান',
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('smart-bharat-lang') || 'en';
  });

  useEffect(() => {
    // Continuously hide Google Translate elements and reset body top
    const hideTranslateBar = () => {
      const frames = document.querySelectorAll('iframe.goog-te-banner-frame, .goog-te-banner-frame, .skiptranslate, #goog-gt-tt');
      frames.forEach(frame => {
        frame.style.display = 'none';
        frame.style.visibility = 'hidden';
        frame.style.height = '0px';
        frame.style.opacity = '0';
      });
      if (document.body) {
        document.body.style.top = '0px';
      }
      if (document.documentElement) {
        document.documentElement.style.top = '0px';
      }
    };

    hideTranslateBar();
    const interval = setInterval(hideTranslateBar, 250);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('smart-bharat-lang', lang);

    // Set google translate cookies
    document.cookie = `googtrans=/en/${lang}; path=/;`;
    document.cookie = `googtrans=/en/${lang}; path=/; domain=localhost;`;

    const triggerGoogleTranslate = () => {
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = lang;
        select.dispatchEvent(new Event('change'));
      }
    };

    triggerGoogleTranslate();
    const t1 = setTimeout(triggerGoogleTranslate, 500);
    const t2 = setTimeout(triggerGoogleTranslate, 1500);
    const t3 = setTimeout(triggerGoogleTranslate, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [lang]);

  const t = (key) => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['en'];
    return dict[key] || TRANSLATIONS['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
