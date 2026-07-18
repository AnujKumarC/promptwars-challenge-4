"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Mic, Volume2, VolumeX, ShieldAlert, Navigation2, HelpCircle } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const QUICK_TEMPLATES = [
  { text: "Where is nearest Washroom?", label: "Washroom Guide" },
  { text: "Recommend some Halal food options", label: "Food AI" },
  { text: "Show wheelchair routes to Metro", label: "Accessible Metro" },
  { text: "Next match schedule?", label: "Match Schedule" },
  { text: "Active emergency procedures?", label: "Emergency Help" },
];

export const FloatingAssistant: React.FC = () => {
  const { language, setLanguage, activeEmergency } = useAppState();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am FIFA Nexus AI. Ask me about stadium routes, food stalls, toilets, transport, accessibility support, or tournament schedules.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState<string>(" ");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Speech Recognition Setup (Web Speech API)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        
        // Match language
        rec.lang = language === "hi" ? "hi-IN" : language === "es" ? "es-ES" : "en-US";

        rec.onstart = () => setIsListening(true);
        rec.onend = () => setIsListening(false);
        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInput(transcript);
            handleSendMessage(transcript);
          }
        };
        recognitionRef.current = rec;
      }
    }
  }, [language]);

  // Speech Synthesis Output (Text to Speech)
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !voiceEnabled) return;
    window.speechSynthesis.cancel(); // Stop current speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "hi" ? "hi-IN" : language === "es" ? "es-ES" : "en-US";
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported on this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      window.speechSynthesis.cancel(); // Stop talking before listening
      recognitionRef.current.start();
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    // Add user message
    const userMsg: Message = { role: "user", content: trimmed, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput(" ");
    setIsLoading(true);

    try {
      // Build conversation history
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, language }),
      });

      const data = await res.json();

      if (res.ok && data.content) {
        const assistantMsg: Message = {
          role: "assistant",
          content: data.content,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        speakText(data.content);
      } else {
        throw new Error(data.error || "Failed to fetch response");
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I had trouble connecting. Let me check the stadium neural link. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end">
      {/* Expanded Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="w-[90vw] sm:w-[400px] h-[550px] glass rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/10 mb-4"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-purple-900 p-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                  <div className="w-5 h-5 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-full animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                    FIFA Nexus Assistant
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  </h3>
                  <p className="text-[10px] text-slate-400">Gemini Powered Stadium Intelligence</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Voice toggle */}
                <button
                  onClick={() => {
                    const next = !voiceEnabled;
                    setVoiceEnabled(next);
                    if (!next) window.speechSynthesis.cancel();
                  }}
                  className={`p-1.5 rounded-lg border transition-all ${
                    voiceEnabled 
                      ? "bg-blue-600/20 border-blue-500/40 text-blue-300" 
                      : "glass border-slate-700 text-slate-400 hover:text-slate-200"
                  }`}
                  title="Toggle Voice Output"
                >
                  {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg glass border-slate-700 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-950/20">
              {/* Emergency Banner if emergency active */}
              {activeEmergency !== "none" && (
                <div className="bg-red-950/40 border border-red-500/30 p-3 rounded-2xl flex gap-2 text-xs text-red-200 pulse-glow-red">
                  <ShieldAlert className="w-5 h-5 text-red-500 flex-shrink-0 animate-bounce" />
                  <div>
                    <span className="font-bold block">CODE RED ENFORCED: {activeEmergency.toUpperCase()}</span>
                    Follow safe routes. Ask AI for nearest exits or medical terminals immediately.
                  </div>
                </div>
              )}

              {/* Messages list */}
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} items-start gap-2.5`}
                >
                  {m.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">
                      AI
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-xs ${
                      m.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "glass text-slate-200 rounded-tl-none border-white/5"
                    }`}
                  >
                    {m.content}
                    <span className="block text-[8px] text-slate-500 mt-1 text-right">
                      {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex justify-start items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">
                    AI
                  </div>
                  <div className="glass text-slate-400 rounded-2xl rounded-tl-none px-3.5 py-2.5 text-xs border-white/5 flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Templates */}
            <div className="px-4 py-2 border-t border-white/5 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
              {QUICK_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(tmpl.text);
                    handleSendMessage(tmpl.text);
                  }}
                  className="glass border-slate-800 text-[10px] text-slate-300 hover:text-white px-2.5 py-1 rounded-full flex items-center gap-1 transition-all"
                >
                  <HelpCircle className="w-3 h-3 text-indigo-400" />
                  {tmpl.label}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleFormSubmit} className="p-4 border-t border-white/10 flex gap-2 items-center bg-slate-950/40">
              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-300 text-[11px] rounded-lg px-1.5 py-2 focus:ring-1 focus:ring-blue-500 outline-none w-16"
              >
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="hi">HI</option>
              </select>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask FIFA Nexus AI..."
                className="flex-1 bg-slate-900/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none placeholder-slate-500"
              />

              {/* Speech to text mic */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2 rounded-xl border transition-all ${
                  isListening
                    ? "bg-red-600 border-red-500 text-white animate-pulse"
                    : "glass border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
                title="Voice Input"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bubble Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-2xl border border-blue-400/20 relative cursor-pointer"
      >
        <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-md -z-10 animate-pulse" />
        <MessageSquare className="w-6 h-6" />
        
        {/* Urgent indicator if emergency is active */}
        {activeEmergency !== "none" && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white animate-bounce border border-white">
            !
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default FloatingAssistant;
