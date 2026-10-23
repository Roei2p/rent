import React, { useState } from 'react';
import { UserRole, Property, ChatMessage } from '../types';
import {
  MessageSquare,
  Send,
  Image as ImageIcon,
  ShieldCheck,
  FileText,
  Lock,
  Download,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface InternalChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRole: UserRole;
  property: Property;
  messages: ChatMessage[];
  onSendMessage: (text: string, imageUrl?: string) => void;
}

export const InternalChatModal: React.FC<InternalChatModalProps> = ({
  isOpen,
  onClose,
  activeRole,
  property,
  messages,
  onSendMessage
}) => {
  const [inputText, setInputText] = useState('');
  const [showLegalExport, setShowLegalExport] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(inputText);
    setInputText('');
  };

  const handleQuickImageAttach = () => {
    // Provide a sample maintenance kitchen/water photo
    onSendMessage('מצורפת תמונת אסמכתא לתיעוד המצב בדירה', '/src/assets/images/property_kitchen_1792744815846.jpg');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[620px] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">
                  צ'אט פנימי מתועד משפטית · RentShield
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  מוצפן וקביל
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {property.address} · כרונולוגיה נשמרת לצורך הגנה משפטית
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLegalExport(true)}
              className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
              title="הורדת קובץ התכתבות מסודר לעורך דין"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>הורדת מסמך לעורך דין</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 font-bold text-sm p-1.5"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Legal Advisory Strip */}
        <div className="bg-blue-50 px-4 py-2 border-b border-blue-200 text-xs text-blue-950 font-medium flex items-center justify-between">
          <span>
            ⚖️ כל הודעה ותמונה נשמרות עם תאריך ושעה רשמיים לצורך הגנה משפטית במקרה של אי-הבנה או מחלוקת.
          </span>
          <span className="font-bold text-blue-700 whitespace-nowrap mr-2">
            אתה כותב בתור: {activeRole === 'landlord' ? 'משכיר' : 'שוכר'}
          </span>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/40">
          {messages.map((msg) => {
            const isMe = msg.senderRole === activeRole;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1 px-1">
                  <span className="font-bold text-slate-800">{msg.senderName}</span>
                  <span>·</span>
                  <span className="font-mono">{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs space-y-2 text-xs leading-relaxed ${
                    isMe
                      ? 'bg-blue-700 text-white rounded-tl-xs'
                      : 'bg-white border border-slate-200 text-slate-900 rounded-tr-xs'
                  }`}
                >
                  <p className="font-medium">{msg.text}</p>

                  {/* Photo attachment if available */}
                  {msg.imageUrl && (
                    <div className="rounded-xl overflow-hidden border border-black/10 mt-2 max-w-xs">
                      <img
                        src={msg.imageUrl}
                        alt="Evidence"
                        className="w-full h-36 object-cover cursor-pointer hover:opacity-95"
                        onClick={() => setSelectedPhoto(msg.imageUrl!)}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  {/* Stamp */}
                  <div
                    className={`text-[10px] pt-1 border-t flex items-center justify-between font-medium ${
                      isMe
                        ? 'border-blue-600 text-blue-100'
                        : 'border-slate-100 text-slate-500'
                    }`}
                  >
                    <span>מתועד במערכת RentShield</span>
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
        >
          <button
            type="button"
            onClick={handleQuickImageAttach}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
            title="צרף תמונת ראיה/מפגע מתוך הדירה"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`כתוב הודעה לצד השני (${activeRole === 'landlord' ? 'לשוכר' : 'למשכיר'})...`}
            className="flex-1 py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-40 text-white text-xs font-black rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>שלח</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>

      {/* Modal: Legal Export Protocol View */}
      {showLegalExport && (
        <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-700" />
                <h4 className="font-bold text-slate-900 text-sm">
                  דוח התכתבות מסודר לעורך דין או לבוררות
                </h4>
              </div>
              <button
                onClick={() => setShowLegalExport(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl text-xs border border-slate-200 max-h-72 overflow-y-auto font-sans">
              <div className="border-b border-slate-200 pb-2">
                <div className="font-bold text-slate-900">
                  נכס: {property.address}
                </div>
                <div className="text-slate-500 text-[11px] font-medium">
                  תאריך הפקה: 23/10/2026 · הופק באמצעות מערכת RentShield
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-800">
                  רצף ההודעות וההסכמות בין המשכיר לשוכר:
                </div>
                {messages.map((m, idx) => (
                  <div key={m.id} className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <div className="flex justify-between text-[11px] text-slate-500 font-bold">
                      <span>#{idx + 1} {m.senderName}</span>
                      <span className="font-mono">{m.timestamp}</span>
                    </div>
                    <div className="text-slate-800 mt-1 font-medium">{m.text}</div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              מסמך זה מאגד את כל פניות הצדדים בצורה כרונולוגית ומדויקת כפי שנמסרו בזמן אמת, ומשמש כראיה ברורה לכל בירור משפטי.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  alert('דוח ההתכתבות הורד בהצלחה כקובץ PDF מסודר.');
                  setShowLegalExport(false);
                }}
                className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                הורד דוח מלא (PDF)
              </button>
              <button
                onClick={() => setShowLegalExport(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
              >
                סגור
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-70 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-2xl max-h-[85vh] bg-white rounded-2xl overflow-hidden p-2">
            <img
              src={selectedPhoto}
              alt="Evidence Full View"
              className="max-h-[80vh] w-auto object-contain mx-auto"
            />
          </div>
        </div>
      )}

    </div>
  );
};
