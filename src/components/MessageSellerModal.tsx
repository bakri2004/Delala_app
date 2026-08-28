import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  MessageCircle,
  Phone,
  CheckCheck,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { VehicleListing } from '../types';
import { getWhatsAppUrl, formatCardPrice } from '../lib/formatters';
import { ModalCloseButton } from './ModalCloseButton';

interface ChatMessage {
  id: string;
  sender: 'buyer' | 'seller';
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

interface MessageSellerModalProps {
  isOpen: boolean;
  listing: VehicleListing;
  onClose: () => void;
  isArabic: boolean;
}

export const MessageSellerModal: React.FC<MessageSellerModalProps> = ({
  isOpen,
  listing,
  onClose,
  isArabic,
}) => {
  const [inputText, setInputText] = useState('');
  const [isSellerTyping, setIsSellerTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Storage key specific to this vehicle listing
  const storageKey = `dallala_chat_thread_${listing.id}`;

  // Initial welcome message from seller
  const getInitialMessages = (): ChatMessage[] => {
    const defaultTime = new Date().toLocaleTimeString(isArabic ? 'ar-SD' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return [
      {
        id: `welcome-${listing.id}`,
        sender: 'seller',
        text: isArabic
          ? `السلام عليكم ورحمة الله، مرحباً بك! معك ${listing.seller.name} مالك السيارة (${listing.title}). تفضل بأي استفسار، أنا متواجد للرد عليك.`
          : `Hello! I'm ${listing.seller.name}, the owner of this ${listing.titleEn}. Feel free to ask any questions, I'm here to help.`,
        timestamp: defaultTime,
        status: 'read',
      },
    ];
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore JSON parse error
    }
    return getInitialMessages();
  });

  // Re-read or re-init when listing changes
  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
            return;
          }
        }
      } catch {
        // ignore
      }
      setMessages(getInitialMessages());
    }
  }, [isOpen, listing.id]);

  // Persist messages whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(messages));
      } catch {
        // ignore storage error
      }
    }
  }, [messages, storageKey]);

  // Auto-scroll to bottom of chat thread
  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom(false);
      // focus input when modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, isSellerTyping]);

  if (!isOpen) return null;

  // Sudanese Arabic and English quick-reply questions
  const quickQuestions = isArabic
    ? [
        'هل السيارة متوفرة حالياً؟',
        'هل السعر قابل للتفاوض؟',
        'وين مكان المعاينة والفحص؟',
        'هل الترخيص والتأمين ساري ومجدد؟',
        'كيف حالة الماكينة والجير؟',
      ]
    : [
        'Is the vehicle still available?',
        'Is the price negotiable?',
        'Where can I inspect the car?',
        'Are registration and insurance valid?',
        'How is the engine and transmission?',
      ];

  // Send a message from the buyer
  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const currentTime = new Date().toLocaleTimeString(isArabic ? 'ar-SD' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newBuyerMessage: ChatMessage = {
      id: `buyer-msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      sender: 'buyer',
      text,
      timestamp: currentTime,
      status: 'sent',
    };

    setMessages((prev) => [...prev, newBuyerMessage]);
    setInputText('');

    // Simulate natural realistic seller response in the continuous thread
    simulateSellerResponse(text);
  };

  const simulateSellerResponse = (userText: string) => {
    const lowerText = userText.toLowerCase();

    let replyText = isArabic
      ? `أهلاً بك! تم استلام استفسارك بخصوص السيارة. سأوافيك بالتفاصيل فوراً، وتفضل بالاتصال بي أو التواصل عبر واتساب في أي وقت.`
      : `Thanks for your inquiry! The car is ready for inspection. Feel free to message or call me anytime.`;

    if (
      lowerText.includes('متوفر') ||
      lowerText.includes('موجود') ||
      lowerText.includes('available') ||
      lowerText.includes('قاعد')
    ) {
      replyText = isArabic
        ? `أهلاً وسهلاً بك، نعم السيارة متوفرة حالياً وبحالة ممتازة وجاهزة للمعاينة المباشرة والفحص.`
        : `Yes, the car is still available and ready for direct inspection anytime!`;
    } else if (
      lowerText.includes('تفاوض') ||
      lowerText.includes('تخفيض') ||
      lowerText.includes('السعر') ||
      lowerText.includes('price') ||
      lowerText.includes('negotiable')
    ) {
      replyText = isArabic
        ? `السعر المطلوب ${formatCardPrice(listing.price, isArabic)}${
            listing.priceNegotiable ? ' وهو قابل للتفاوض البسيط بعد المعاينة للجادين في الشراء' : ' والبيع كاش'
          }. تفضل بالمعاينة أولاً وما بنختلف إن شاء الله.`
        : `The asking price is ${formatCardPrice(listing.price, false)}. Reasonable negotiation is welcomed for serious buyers upon inspection.`;
    } else if (
      lowerText.includes('مكان') ||
      lowerText.includes('معاينة') ||
      lowerText.includes('فحص') ||
      lowerText.includes('وين') ||
      lowerText.includes('inspect') ||
      lowerText.includes('where')
    ) {
      const location = listing.locationDetails
        ? `${listing.city} (${listing.locationDetails})`
        : listing.city;
      replyText = isArabic
        ? `مكان المعاينة في: ${location}. يسعدني التنسيق معك على موعد يناسبك، يمكنك الاتصال بي هاتفياً قبل الحضور.`
        : `Inspection location is in ${location}. Please feel free to coordinate a suitable time with me.`;
    } else if (
      lowerText.includes('ترخيص') ||
      lowerText.includes('تأمين') ||
      lowerText.includes('اوراق') ||
      lowerText.includes('شهادة') ||
      lowerText.includes('registration')
    ) {
      replyText = isArabic
        ? `الترخيص والتأمين ساري ومجدد بالكامل، والشهادة والوثائق كلها أصلية ومطابقة وجاهزة لنقل الملكية الفوري.`
        : `Registration and insurance are completely up to date. All vehicle papers are genuine and ready for transfer.`;
    } else if (
      lowerText.includes('ماكينة') ||
      lowerText.includes('جير') ||
      lowerText.includes('حالة') ||
      lowerText.includes('نظافة') ||
      lowerText.includes('engine')
    ) {
      replyText = isArabic
        ? `الماكينة والجير والتكييف والشاصيه بحالة الوكالة ونظيفة جداً وعلى الشرط، ويمكنك إحضار أي فني أو مهندس لمعاينتها.`
        : `Engine, transmission, and AC are in great condition. You are fully welcome to bring any mechanic for inspection.`;
    }

    // Show realistic typing indicator after 800ms, then deliver reply after 1800ms
    setTimeout(() => {
      setIsSellerTyping(true);
      setTimeout(() => {
        setIsSellerTyping(false);
        const replyTime = new Date().toLocaleTimeString(isArabic ? 'ar-SD' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });

        const sellerMsg: ChatMessage = {
          id: `seller-reply-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          sender: 'seller',
          text: replyText,
          timestamp: replyTime,
          status: 'read',
        };

        setMessages((prev) => {
          // Mark all previous buyer messages as read
          const updated = prev.map((m) =>
            m.sender === 'buyer' ? { ...m, status: 'read' as const } : m
          );
          return [...updated, sellerMsg];
        });
      }, 1400);
    }, 600);
  };

  const whatsappLink = getWhatsAppUrl(
    listing.seller.whatsapp || listing.seller.phone,
    isArabic ? listing.title : listing.titleEn,
    listing.price,
    isArabic
  );

  return (
    <div
      id="message-seller-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="message-seller-container"
        className="bg-white w-full max-w-lg h-[640px] max-h-[94vh] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* 1. Header with Seller Profile, Direct Contact Actions, and Standardized Top-Left Close Button */}
        <div className="flex items-center justify-between px-3.5 sm:px-5 py-3 bg-slate-50 border-b border-slate-200 shrink-0">
          {/* Seller Information */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {listing.seller.name.charAt(0)}
              </div>
              <span
                className="absolute bottom-0 end-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"
                title={isArabic ? 'متصل الآن' : 'Online'}
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                  {listing.seller.name}
                </h3>
              </div>
              <p className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                {isArabic ? 'نشط الآن للرد' : 'Active now'}
              </p>
            </div>
          </div>

          {/* Actions: Optional WhatsApp, Direct Phone Call, and Top-Left X Close Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* WhatsApp Contact Action */}
            <a
              id="chat-header-whatsapp-btn"
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#075E54] border border-[#25D366]/30 transition-colors"
              title={isArabic ? 'محادثة عبر واتساب' : 'Chat on WhatsApp'}
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-[#25D366]" />
            </a>

            {/* Direct Phone Call Action */}
            <a
              id="chat-header-phone-btn"
              href={`tel:${listing.seller.phone.replace(/[^0-9+]/g, '')}`}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-emerald-900 border border-slate-200 transition-colors"
              title={isArabic ? `اتصال (${listing.seller.phone})` : `Call ${listing.seller.phone}`}
              aria-label="Phone Call"
            >
              <Phone className="w-4 h-4 text-emerald-800" />
            </a>

            {/* Standardized Top-Left Close Button */}
            <ModalCloseButton
              id="chat-close-btn"
              onClose={onClose}
              isArabic={isArabic}
            />
          </div>
        </div>

        {/* 2. Pinned Vehicle Context Card (Shows vehicle details right in the conversation) */}
        <div className="bg-emerald-50/70 border-b border-emerald-900/10 px-3.5 py-2 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={listing.photos[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80'}
              alt={listing.title}
              className="w-11 h-9 rounded-lg object-cover border border-slate-200/80 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">
                {isArabic ? listing.title : listing.titleEn}
              </h4>
              <div className="flex items-center gap-2 text-[11px] text-slate-600">
                <span className="font-bold text-emerald-800">
                  {formatCardPrice(listing.price, isArabic)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5 text-slate-500">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {isArabic ? listing.city : listing.cityEn}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-medium shrink-0 bg-white/80 px-2 py-1 rounded-md border border-slate-200/60 hidden xs:block">
            {isArabic ? 'محادثة حول الإعلان' : 'About this car'}
          </div>
        </div>

        {/* 3. Continuous Scrollable Chat Message Stream */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3 bg-[#f8fafc]">
          {/* Day marker */}
          <div className="flex justify-center my-1">
            <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
              {isArabic ? 'اليوم' : 'Today'}
            </span>
          </div>

          {messages.map((msg) => {
            const isBuyer = msg.sender === 'buyer';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  isBuyer ? 'items-end' : 'items-start'
                } animate-in fade-in duration-100`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    isBuyer
                      ? 'bg-emerald-800 text-white rounded-br-xs'
                      : 'bg-white text-slate-900 border border-slate-200/90 rounded-bl-xs'
                  }`}
                >
                  {!isBuyer && (
                    <div className="text-[10px] font-bold text-emerald-800 mb-1">
                      {listing.seller.name}
                    </div>
                  )}

                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                  <div
                    className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                      isBuyer ? 'text-emerald-200' : 'text-slate-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isBuyer && (
                      <CheckCheck
                        className={`w-3.5 h-3.5 ${
                          msg.status === 'read' ? 'text-cyan-300' : 'text-emerald-200'
                        }`}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Realistic Typing indicator */}
          {isSellerTyping && (
            <div className="flex items-start animate-in fade-in duration-150">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs px-3.5 py-2 text-xs text-slate-500 shadow-2xs flex items-center gap-1.5">
                <span className="text-[11px] font-medium">
                  {isArabic ? `${listing.seller.name} يكتب الآن` : `${listing.seller.name} is typing`}
                </span>
                <span className="flex items-center gap-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" />
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 4. Quick Suggestion Chips (One-tap rapid inquiries without typing) */}
        <div className="px-3 py-2 bg-slate-50 border-t border-slate-200/80 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-bold text-slate-500 shrink-0">
              {isArabic ? 'سؤال سريع:' : 'Quick ask:'}
            </span>
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                id={`quick-chip-${idx}`}
                type="button"
                onClick={() => handleSendMessage(q)}
                className="whitespace-nowrap text-xs bg-white hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 text-slate-700 font-medium px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs transition-all cursor-pointer shrink-0"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Chat Input Bar (Direct sending with Enter or Send button, stays continuously in chat) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-2.5 sm:p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
        >
          <input
            ref={inputRef}
            id="chat-input-text"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isArabic
                ? 'اكتب رسالتك للبائع واضغط إرسال...'
                : 'Type a message to the seller...'
            }
            className="flex-1 bg-slate-100 hover:bg-slate-100/90 focus:bg-white border border-slate-200 rounded-full px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700 font-medium transition-all"
          />

          <button
            id="chat-send-btn"
            type="submit"
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-full bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 disabled:hover:bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-xs transition-all cursor-pointer"
            aria-label={isArabic ? 'إرسال الرسالة' : 'Send message'}
          >
            <Send className="w-4 h-4 rtl:rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
};
