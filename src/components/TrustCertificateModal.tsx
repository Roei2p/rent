import React, { useState } from 'react';
import { UserRole, LandlordProfile, TenantProfile } from '../types';
import {
  TRUST_SCORE_BREAKDOWN_LANDLORD,
  TRUST_SCORE_BREAKDOWN_TENANT
} from '../data/mockData';
import {
  ShieldCheck,
  CheckCircle2,
  Award,
  QrCode,
  Share2,
  Printer,
  Sparkles,
  Info,
  Sliders
} from 'lucide-react';
import { CircularTrustGauge } from './VisualGauge';

interface TrustCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRole: UserRole;
  landlord: LandlordProfile;
  tenant: TenantProfile;
}

export const TrustCertificateModal: React.FC<TrustCertificateModalProps> = ({
  isOpen,
  onClose,
  activeRole,
  landlord,
  tenant
}) => {
  const [activeTab, setActiveTab] = useState<'view' | 'algorithm'>(
    'view'
  );

  if (!isOpen) return null;

  const user = activeRole === 'landlord' ? landlord : tenant;
  const breakdown =
    activeRole === 'landlord'
      ? TRUST_SCORE_BREAKDOWN_LANDLORD
      : TRUST_SCORE_BREAKDOWN_TENANT;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">
                תעודת יושר רשמית · מדד אמינות RentShield
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                שיקוף אמינות, מוסר תשלומים ועמידה בהסכמים לשני הצדדים
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-sm p-1"
          >
            ✕
          </button>
        </div>

        {/* Tab switch: Certificate View vs Algorithm Explanation */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('view')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'view'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            תעודת יושר רשמית
          </button>
          <button
            onClick={() => setActiveTab('algorithm')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'algorithm'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            פירוט מדדי הציון והתנאים
          </button>
        </div>

        {activeTab === 'view' ? (
          /* Official Certificate Certificate Card */
          <div className="space-y-6">
            
            <div className="relative overflow-hidden rounded-3xl border-2 border-blue-600/30 bg-gradient-to-br from-blue-50/40 via-white to-slate-50 p-6 sm:p-8 shadow-sm">
              
              {/* Certificate Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-200 pb-5">
                <div className="flex items-center gap-4">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-700 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider bg-blue-100 px-2.5 py-0.5 rounded-md">
                      {activeRole === 'landlord' ? 'תעודת יושר למשכיר' : 'תעודת יושר לשוכר'}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-1">
                      {user.name}
                    </h3>
                    <div className="text-xs text-slate-600 font-medium">
                      ת.ז: <span className="font-mono font-bold text-slate-800">{user.nationalId}</span> · אומת במערכת
                    </div>
                  </div>
                </div>

                <div className="flex justify-center sm:justify-end">
                  <CircularTrustGauge
                    score={user.trustScore}
                    size={130}
                    label="דירוג יושר"
                  />
                </div>
              </div>

              {/* Breakdown Rows */}
              <div className="mt-5 space-y-3">
                <h4 className="text-xs font-bold text-slate-800">
                  מדדי ביצוע ועמידה ביעדים:
                </h4>
                {breakdown.map((item) => (
                  <div key={item.category} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-800">{item.category}</span>
                      <span className="font-bold text-emerald-700 tabular-nums">{item.score}%</span>
                    </div>
                    <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-1.5 rounded-full"
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                    <div className="text-[11px] text-slate-500">{item.details}</div>
                  </div>
                ))}
              </div>

              {/* Certificate Security Footer */}
              <div className="mt-6 pt-4 border-t border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 font-medium">
                <div>
                  <span>קוד אימות דיגיטלי: </span>
                  <code className="font-mono text-blue-900 font-black">
                    RS-CERT-2026-X981A
                  </code>
                </div>
                <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>מאומת ברישום מערכת RentShield</span>
                </div>
              </div>

            </div>

            {/* Print & Share actions */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-2">
                <button
                  onClick={() => alert('תעודת היושר הודפסה / נשמרה כקובץ רשמי לצורך הצגה לצד השני בעסקה.')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-blue-700" />
                  <span>הדפס / שמור כ-PDF</span>
                </button>
                <button
                  onClick={() => alert('קישור מאובטח לתעודת היושר הועתק ללוח לשיתוף עם משכיר או שוכר עתידי!')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Share2 className="w-4 h-4 text-blue-700" />
                  <span>שתף קישור מאומת</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                סגור
              </button>
            </div>

          </div>
        ) : (
          /* Algorithm and Conditions Explanation */
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-blue-950 space-y-2">
              <h4 className="font-black text-sm flex items-center gap-1.5 text-blue-900">
                <Sliders className="w-4 h-4 text-blue-700" />
                <span>מפרט מדדי הציון והתנאים הרשמיים:</span>
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                ציון תעודת היושר מחושב במודל רב-פרמטרי דינמי הנע בין 0 ל-100. כל סטייה או איחור גורעים נקודות בהתאם למשקל החוזי, בעוד רצף עסקאות חלק מזכה בבונוסים.
              </p>
            </div>

            <div className="space-y-3 divide-y divide-slate-100">
              
              <div className="pt-2">
                <h5 className="font-black text-slate-900 mb-1.5 text-xs">
                  1. שקלול עבור שוכרים:
                </h5>
                <ul className="list-disc list-inside space-y-1.5 text-slate-700 font-medium">
                  <li><strong>מוסר תשלומים (35%):</strong> כל יום פיגור בתשלום שכר הדירה מפחית 2.5 נקודות. תשלום רציף במועד מעניק 100%.</li>
                  <li><strong>תשלומי רשויות ותשתית (25%):</strong> אימות תשלום חשבונות חשמל, ארנונה, גז וועד בית תוך 30 יום ממועד הפירעון.</li>
                  <li><strong>שמירה על הדירה ותחזוקה (20%):</strong> דיווח על תקלות ללא הזנחה, שימוש בספקים מוסמכים, היעדר נזקים בביקור סיום שכירות.</li>
                  <li><strong>אמינות וערבויות (10%):</strong> הצגת ערבות דיגיטלית בתוקף ואימות זהות ותלושי שכר.</li>
                  <li><strong>תרבות שיח בצ'אט (10%):</strong> היעדר התראות משפטיות או שפה בלתי הולמת במערכת.</li>
                </ul>
              </div>

              <div className="pt-3">
                <h5 className="font-black text-slate-900 mb-1.5 text-xs">
                  2. שקלול עבור משכירים:
                </h5>
                <ul className="list-disc list-inside space-y-1.5 text-slate-700 font-medium">
                  <li><strong>עמידה בזמני טיפול בתקלות (35%):</strong> תיקון נזילות ואינסטלציה תוך עד 14 יום לקטן, עד 3 ימים למהותי, ועד 24 שעות לחירום. חריגה מפחיתה 5 נקודות לכל יום איחור.</li>
                  <li><strong>כיסוי הוצאות בלאי (25%):</strong> פירעון תשלומים לאנשי מקצוע ללא גלגול שרירותי על השוכר.</li>
                  <li><strong>שקיפות והסכמיות (20%):</strong> שימוש בחוזה סטנדרטי ללא סעיפים מקפחים.</li>
                  <li><strong>פרטיות השוכר (10%):</strong> תיאום ביקורים מראש של 48 שעות לפחות.</li>
                  <li><strong>הידברות ופשרה (10%):</strong> מענה במסגרת חלון 72 שעות הערעור ונכונות להסדר.</li>
                </ul>
              </div>

            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveTab('view')}
                className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl transition-colors shadow-xs"
              >
                חזור לתעודת היושר
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
