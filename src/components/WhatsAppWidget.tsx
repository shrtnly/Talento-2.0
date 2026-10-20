import { useState, useEffect, useRef } from 'react';
import { X, Send, ExternalLink, CheckCheck } from 'lucide-react';

const WHATSAPP_NUMBER = '8801973591514'; // +880 1973 591514
const WA_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

interface Question {
  id: string;
  question: string;
  autoReply: string;
  waText: string;
}

const FREQUENT_QUESTIONS: Question[] = [
  {
    id: 'hire-talent',
    question: 'I want to hire executive or leadership talent',
    autoReply:
      'We specialize in confidential C-Suite and executive search across Asia-Pacific with an 85% first-shortlist fit rate. Our principal consultants can schedule a confidential discovery call.',
    waText: 'Hello TALENTO, I would like to discuss hiring executive/leadership talent for our organization.',
  },
  {
    id: 'process-fees',
    question: 'What are your search timelines and fee models?',
    autoReply:
      'We offer retained and exclusive search models with transparent milestone stages. Average placement timeline is 4–8 weeks from brief to signed offer.',
    waText: 'Hi TALENTO, could you please share details about your executive search process, timelines, and fee structure?',
  },
  {
    id: 'candidate-career',
    question: 'I am a senior candidate looking for executive opportunities',
    autoReply:
      'We regularly advise C-level and senior directors on discrete career moves. You can share your credentials directly with our search desk.',
    waText: 'Hello TALENTO Search Desk, I am an executive professional interested in confidential leadership opportunities.',
  },
];

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  actionUrl?: string;
  actionLabel?: string;
}

export function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getCurrentTime = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Initialize welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: 'Hello! 👋 Welcome to TALENTO Executive Search. How can we assist with your leadership hiring or executive career today?',
        time: getCurrentTime(),
      },
    ]);
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false);
    }
  };

  const handleSelectQuestion = (q: Question) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q.question,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: q.autoReply,
        time: getCurrentTime(),
        actionUrl: `${WA_BASE_URL}?text=${encodeURIComponent(q.waText)}`,
        actionLabel: 'Chat on WhatsApp with Consultant',
      };
      setMessages((prev) => [...prev, botReply]);
    }, 700);
  };

  const handleSendCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputMessage.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'Thank you for reaching out! Connect directly with our team on WhatsApp to continue the conversation.',
        time: getCurrentTime(),
        actionUrl: `${WA_BASE_URL}?text=${encodeURIComponent(trimmed)}`,
        actionLabel: 'Send via WhatsApp',
      };
      setMessages((prev) => [...prev, botReply]);
    }, 600);
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Popover Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="WhatsApp Chat Window"
          className="pointer-events-auto mb-4 w-[calc(100vw-32px)] max-w-[360px] sm:max-w-[380px] bg-white dark:bg-[#0E223D] rounded-2xl shadow-2xl border border-[#B9C2CE]/30 dark:border-[#1B3047] overflow-hidden flex flex-col transition-all duration-300 animate-in fade-in zoom-in-95"
          style={{ maxHeight: 'calc(100vh - 120px)' }}
        >
          {/* Header */}
          <div className="bg-[#0A1A2E] text-white px-4 py-3.5 flex items-center justify-between border-b border-[#C2A163]/30">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#1A2E46] border border-[#C2A163]/50 flex items-center justify-center overflow-hidden">
                  <img src="/logo.png?v=2" alt="TALENTO" className="w-8 h-8 object-contain" />
                </div>
                <span
                  className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] rounded-full border-2 border-[#0A1A2E]"
                  title="Online"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-sm text-white">TALENTO Advisory</h3>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#C2A163]/20 text-[#C2A163] font-medium">
                    Verified
                  </span>
                </div>
                <p className="text-[11px] text-[#A9B8CC] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] inline-block animate-pulse" />
                  Typically replies in minutes
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#A9B8CC] hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close WhatsApp chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-[#F7F4EC]/60 dark:bg-[#08162A]/70 text-xs sm:text-[13px]">
            <div className="text-center my-1">
              <span className="text-[10px] uppercase tracking-wider text-[#718096] dark:text-[#A9B8CC]/70 bg-white/60 dark:bg-[#0E223D]/60 px-2.5 py-0.5 rounded-full border border-[#B9C2CE]/20">
                Official TALENTO WhatsApp Line
              </span>
            </div>

            {/* Render Messages */}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#C2A163] text-[#08162A] font-medium rounded-br-xs'
                      : 'bg-white dark:bg-[#0E223D] text-[#0A1A2E] dark:text-[#E2E8F0] border border-[#B9C2CE]/30 dark:border-[#1B3047] rounded-bl-xs'
                  }`}
                >
                  <p>{m.text}</p>

                  {m.actionUrl && (
                    <a
                      href={m.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs transition-all shadow hover:shadow-md active:scale-95"
                    >
                      <span>{m.actionLabel || 'Open WhatsApp'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-[#718096] dark:text-[#A9B8CC]/60 px-1">
                  <span>{m.time}</span>
                  {m.sender === 'user' && <CheckCheck className="w-3 h-3 text-[#C2A163]" />}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-[#0E223D] border border-[#B9C2CE]/30 dark:border-[#1B3047] rounded-2xl w-16">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C2A163] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#C2A163] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#C2A163] animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            {/* Frequent Questions Suggested Chips */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold text-[#7A5F2E] dark:text-[#C2A163] uppercase tracking-wider mb-2">
                Frequently Asked Questions:
              </p>
              <div className="space-y-1.5">
                {FREQUENT_QUESTIONS.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => handleSelectQuestion(q)}
                    className="w-full text-left p-2.5 rounded-xl bg-white dark:bg-[#0E223D] border border-[#B9C2CE]/40 dark:border-[#1B3047] hover:border-[#C2A163] text-[#0A1A2E] dark:text-[#D5DCE6] text-xs transition-all duration-200 hover:shadow-sm active:scale-[0.99] flex items-center justify-between group"
                  >
                    <span>{q.question}</span>
                    <span className="text-[#C2A163] font-bold opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <form
            onSubmit={handleSendCustomMessage}
            className="p-2.5 bg-white dark:bg-[#0E223D] border-t border-[#B9C2CE]/30 dark:border-[#1B3047] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 bg-[#F7F4EC] dark:bg-[#08162A] text-[#0A1A2E] dark:text-white placeholder-[#718096] dark:placeholder-[#A9B8CC]/60 px-3 py-2 rounded-xl text-xs border border-transparent focus:border-[#C2A163] focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              aria-label="Send message"
              className="p-2 bg-[#25D366] hover:bg-[#1EBE5D] disabled:opacity-40 disabled:hover:bg-[#25D366] text-white rounded-xl transition-all shadow-sm active:scale-95 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="pointer-events-auto relative group">
        {/* Unread Badge Notification */}
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 z-10">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#25D366] text-white text-[9px] font-bold items-center justify-center">
              1
            </span>
          </span>
        )}

        <button
          onClick={handleOpen}
          aria-label="Chat on WhatsApp with TALENTO"
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
        >
          {isOpen ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <svg
              className="w-7 h-7 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
