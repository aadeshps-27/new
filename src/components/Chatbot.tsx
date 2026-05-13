import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, User, Bot, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'skills' | 'projects' | 'contact';
}

const INITIAL_BOT_MESSAGE = "Hi! I'm Aadesh's assistant. I can show you his portfolio highlights, skills, or even help you get in touch. What's on your mind?";

const TOPICS = [
  { id: 'skills', label: 'View Skills', icon: '🚀' },
  { id: 'projects', label: 'Recent Work', icon: '💼' },
  { id: 'contact', label: 'Get in Touch', icon: '✉️' },
  { id: 'about', label: 'Biography', icon: '👤' }
];

const AUTO_RESPONSES: Record<string, { text: string; type?: Message['type'] }> = {
  "work": { text: "Aadesh specializes in Graphics Design, Vector Art, and Web Development. He's currently focused on high-performance React apps.", type: 'projects' },
  "projects": { text: "Aadesh has some really cool projects! From military robots to premium vector art. Check these out:", type: 'projects' },
  "skills": { text: "He has a powerful multidisciplinary skill set combining electronics and digital design:", type: 'skills' },
  "contact": { text: "You can reach Aadesh directly via email or socials. He's always open for collaboration!", type: 'contact' },
  "about": { text: "Based in Kerala, India, Aadesh weaves technology and art together. He holds a Master's in Applied Electronics.", type: 'text' },
  "hi": { text: "Hey! Glad you're here. Want to see Aadesh's work or ask something specific?", type: 'text' },
  "hello": { text: "Hey! Glad you're here. Want to see Aadesh's work or ask something specific?", type: 'text' },
  "creator": { text: "This entire experience was conceptualized and built by Aadesh PS.", type: 'text' },
  "illustrator": { text: "Digital illustration is his playground. He uses Illustrator for high-precision vector work.", type: 'text' },
  "affinity": { text: "He's a big fan of the Affinity suite for pixel-perfect design workflows.", type: 'text' },
  "robot": { text: "The Military spying robot is a standout tech project. It uses IoT and custom hardware logic.", type: 'text' },
  "default": { text: "I'm not quite sure about that yet, but I can tell you all about Aadesh's design skills or projects!", type: 'text' }
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: INITIAL_BOT_MESSAGE, sender: 'bot', timestamp: new Date(), type: 'text' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const triggerResponse = (input: string) => {
    setIsTyping(true);
    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      let response = AUTO_RESPONSES.default;

      for (const key in AUTO_RESPONSES) {
        if (lowerInput.includes(key)) {
          response = AUTO_RESPONSES[key];
          break;
        }
      }

      const botMessage: Message = {
        id: Date.now().toString(),
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        type: response.type
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSend = (textOverride?: string) => {
    const text = textOverride || inputValue;
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    triggerResponse(text);
  };

  const renderRichContent = (type?: Message['type']) => {
    switch (type) {
      case 'skills':
        return (
          <div className="flex flex-wrap gap-2 mt-3">
            {['React', 'TypeScript', 'Illustrator', 'Affinity', 'Robotics'].map(s => (
              <span key={s} className="px-3 py-1 bg-brand/10 text-brand rounded-full text-[10px] font-black uppercase tracking-widest border border-brand/20">
                {s}
              </span>
            ))}
          </div>
        );
      case 'projects':
        return (
          <div className="grid grid-cols-1 gap-2 mt-3">
             <button onClick={() => window.location.href='#projects'} className="p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-left hover:border-brand transition-colors group">
                <p className="text-xs font-bold uppercase tracking-tight">View Featured Projects</p>
                <p className="text-[10px] opacity-50">Click to scroll to projects</p>
             </button>
          </div>
        );
      case 'contact':
        return (
          <div className="flex flex-col gap-2 mt-3">
             <a href="mailto:aadeshps2015@gmail.com" className="flex items-center gap-2 p-3 bg-brand text-white rounded-xl text-xs font-bold uppercase tracking-widest text-center justify-center">
                <Send size={14} /> Send Email
             </a>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="w-[380px] max-w-[calc(100vw-48px)] h-[580px] max-h-[85vh] bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.2)] border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden mb-6"
            >
              {/* Header */}
              <div className="p-7 bg-zinc-950 text-white flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/30 blur-[60px] translate-x-1/2 -translate-y-1/2" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-brand flex items-center justify-center shadow-lg shadow-brand/20 relative">
                    <Bot size={24} />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-zinc-950 rounded-full" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm uppercase tracking-widest">Assistant</h3>
                    <span className="text-[9px] uppercase font-black tracking-widest opacity-40">Ready to help</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-3 hover:bg-white/10 rounded-full transition-colors relative z-10"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:24px_24px]">
                {messages.map((msg) => (
                  <motion.div 
                    initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={msg.id} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] flex flex-col gap-1.5 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`p-4 rounded-3xl text-sm leading-relaxed font-medium shadow-sm transition-all ${
                        msg.sender === 'user' 
                          ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-tr-none' 
                          : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-none border border-zinc-100 dark:border-zinc-700'
                      }`}>
                        {msg.text}
                        {msg.sender === 'bot' && renderRichContent(msg.type)}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-zinc-800 p-4 rounded-3xl rounded-tl-none border border-zinc-100 dark:border-zinc-700 flex gap-1 items-center">
                      <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-brand rounded-full" />
                      <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-brand rounded-full" />
                      <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-brand rounded-full" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions Footer */}
              <div className="border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                <div className="flex gap-2 p-3 overflow-x-auto no-scrollbar scroll-smooth">
                   {TOPICS.map(topic => (
                      <button 
                        key={topic.id}
                        onClick={() => handleSend(topic.id)}
                        className="flex-shrink-0 px-4 py-2 bg-zinc-50 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 text-[10px] font-black uppercase tracking-widest hover:border-brand hover:text-brand transition-all flex items-center gap-2 whitespace-nowrap"
                      >
                         <span>{topic.icon}</span>
                         {topic.label}
                      </button>
                   ))}
                </div>
                
                <div className="p-6 pt-0">
                  <div className="relative flex items-center group">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 px-6 pr-14 text-sm focus:outline-none focus:border-brand transition-all font-medium"
                    />
                    <button 
                      onClick={() => handleSend()}
                      disabled={!inputValue.trim() || isTyping}
                      className="absolute right-2 p-3 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-xl hover:bg-brand dark:hover:bg-brand hover:text-white transition-all disabled:opacity-30 active:scale-95 shadow-md shadow-zinc-400/20"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 rounded-[1.8rem] shadow-2xl flex items-center justify-center transition-all duration-500 group relative overflow-hidden ${
             isOpen ? 'bg-zinc-900 border-zinc-800' : 'bg-brand'
          }`}
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 text-white">
            {isOpen ? <X size={28} /> : <MessageSquare size={28} fill="currentColor" />}
          </div>
        </motion.button>
      </div>
    </>
  );
}
