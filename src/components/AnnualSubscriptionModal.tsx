import React from 'react';
import { LandlordProfile } from '../types';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileText,
  CreditCard,
  Users,
  Award,
  Zap
} from 'lucide-react';

interface AnnualSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  landlord: LandlordProfile;
}

export const AnnualSubscriptionModal: React.FC<AnnualSubscriptionModalProps> = ({
  isOpen,
  onClose,
  landlord
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                המודל השנתי: מעטפת הגנה ב-12 תשלומים רציפים
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                מעטפת ניהול וביטחון מלאה למשכירים, מנהלי נכסים, מתווכים ועורכי דין
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 font-black text-base p-1"
          >
            ✕
          </button>
        </div>

        {/* Current Active Plan Status */}
        <div className="bg-blue-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm border border-blue-800">
          <div>
            <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
              תוכנית מבוטחת פעילה
            </span>
            <h3 className="text-2xl font-black mt-2">{landlord.annualPlanTier}</h3>
            <p className="text-xs text-blue-200 mt-1 font-medium">
              חידוש שנתי הבא: {landlord.subscriptionRenewalDate} · פריסה שנתית ב-12 חודשים בהוראת קבע
            </p>
          </div>
          <div className="bg-white/10 border border-white/20 px-4 py-3 rounded-xl text-left sm:text-right">
            <div className="text-[11px] text-blue-200 font-medium">דמי ניהול חודשיים</div>
            <div className="text-2xl font-black">₪99<span className="text-xs font-normal"> /חודש</span></div>
          </div>
        </div>

        {/* Included Benefits Grid */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            מה כולל המנוי השנתי של RentShield למשכיר:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <div className="font-black text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>ניהול דיגיטלי מוחלט וללא ניירת</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed font-medium">
                מעקב שכר דירה, אסמכתאות תשלום חתומות, ואימות חשבונות ארנונה, חשמל וגז בזמן אמת.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <div className="font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>ערבויות דיגיטליות חכמות</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed font-medium">
                החלפת צ'קים ישנים בערבות דיגיטלית בנקאית בעלת תוקף משפטי מחייב ללא טרחה.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <div className="font-black text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>תיעוד משפטי מוסמך לשעת צורך</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed font-medium">
                גיבוי מסודר של כל שיחות הצ'אט, התמונות וההסכמות לצורך כישלון תמורה או פינוי מושכר.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <div className="font-black text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>רשת ספקים מוסמכים מיידית</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed font-medium">
                מערך אנשי מקצוע בדירוג גבוה עם אכיפת לוחות זמנים לפי חוזה וחלון 72 שעות לבירור.
              </p>
            </div>
          </div>
        </div>

        {/* Savings vs Broker Comparison */}
        <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 text-xs space-y-2">
          <div className="font-black text-blue-950 flex items-center gap-2 text-sm">
            <Award className="w-4 h-4 text-blue-800" />
            <span>חיסכון בעלויות תיווך ומניעת סכסוכים</span>
          </div>
          <p className="text-slate-700 leading-relaxed font-medium">
            במקום לשלם חודש שכירות מלא (₪8,400 ומעלה) למתווך בכל תחלופה, תעודת היושר ומערכת RentShield מושכות שוכרים איכותיים ומספקות שקט נפשי מתמשך בעלות של ₪1,188 לשנה בלבד.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            סגור חלון
          </button>
        </div>

      </div>
    </div>
  );
};
