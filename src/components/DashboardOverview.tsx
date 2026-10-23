import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Property,
  LandlordProfile,
  TenantProfile,
  UtilityRecord,
  PaymentRecord,
  UserRole,
  FaultTicket
} from '../types';
import {
  Calendar,
  CreditCard,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  Wrench,
  Cake,
  RefreshCw,
  Eye,
  Download,
  Zap,
  Flame,
  Home,
  Droplets,
  PlusCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import {
  CircularTrustGauge,
  FinancialProgressBar,
  UtilityHealthMeter
} from './VisualGauge';

interface DashboardOverviewProps {
  activeRole: UserRole;
  property: Property;
  landlord: LandlordProfile;
  tenant: TenantProfile;
  utilities: UtilityRecord[];
  payments: PaymentRecord[];
  faults: FaultTicket[];
  onOpenChat: () => void;
  onOpenMarketModal: () => void;
  onOpenTrustModal: () => void;
  onNavigateToFaults: () => void;
  onNavigateToPayments: () => void;
  onUpdateUtility: (updated: UtilityRecord) => void;
  isFocusMode?: boolean;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  activeRole,
  property,
  landlord,
  tenant,
  utilities,
  payments,
  faults,
  onOpenChat,
  onOpenMarketModal,
  onOpenTrustModal,
  onNavigateToFaults,
  onNavigateToPayments,
  onUpdateUtility,
  isFocusMode = false
}) => {
  const [selectedReceipt, setSelectedReceipt] = useState<{ title: string; number: string; amount: number; period: string } | null>(null);
  const [isVerifyingApi, setIsVerifyingApi] = useState<string | null>(null);
  const [apiToast, setApiToast] = useState<string | null>(null);
  const [utilFilter, setUtilFilter] = useState<'all' | 'paid' | 'pending'>('all');

  // Financial calculations
  const totalPaid2026 = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalContract2026 = property.monthlyRent * 12;
  const currentMonthPayment = payments.find((p) => p.monthName.includes('אוקטובר'));
  const futurePendingPayments = payments.filter((p) => p.status === 'pending');
  const futurePendingTotal = futurePendingPayments.reduce((sum, p) => sum + p.amount, 0);

  // Birthday check: Tenant birthDate 1996-10-27 (October 27) vs Current simulated date Oct 23, 2026
  const isBirthdaySoon = true; // In 4 days

  // Active faults count
  const activeFaultsCount = faults.filter((f) => f.status !== 'resolved' && f.status !== 'closed').length;

  // Simulate API verification call for utilities (Israel Electric Corp, Tel Aviv Muni, etc.)
  const handleSimulateApiCheck = (record: UtilityRecord) => {
    setIsVerifyingApi(record.id);
    setTimeout(() => {
      setIsVerifyingApi(null);
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const updated: UtilityRecord = {
        ...record,
        status: 'paid',
        apiVerified: true,
        lastVerifiedAt: `היום בשעה ${timeStr}`
      };
      onUpdateUtility(updated);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 }
      });
      setApiToast(`אימות API הצליח מול שרתי ${record.providerName}! החשבון סומן כמאומת ב-100%`);
      setTimeout(() => setApiToast(null), 4500);
    }, 1200);
  };

  const getUtilityIcon = (type: string) => {
    switch (type) {
      case 'electric':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'arnona':
        return <Home className="w-5 h-5 text-blue-600" />;
      case 'gas':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'committee':
        return <Building2Icon className="w-5 h-5 text-emerald-600" />;
      default:
        return <Droplets className="w-5 h-5 text-indigo-500" />;
    }
  };

  if (isFocusMode) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Toast Alert */}
        {apiToast && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-sm font-medium">{apiToast}</span>
            </div>
            <button
              onClick={() => setApiToast(null)}
              className="text-xs text-emerald-700 hover:underline font-semibold"
            >
              סגור
            </button>
          </div>
        )}

        {/* Focus Mode Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-6 border border-slate-700 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
                  מצב מיקוד נקי · ריכוז מקביל ללא עומס בעיניים
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Focus Active
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                מרכז שליטה תפעולי מרוכז במקביל ({property.address})
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                שלושת ערוצי הפעולה המרכזיים מוצגים זה לצד זה ללא צורך במעבר בין מסכים
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenChat}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>צ'אט מתועד</span>
            </button>
            <button
              onClick={onOpenTrustModal}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>תעודת יושר</span>
            </button>
          </div>
        </div>

        {/* 3 Parallel Streams Cockpit */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Stream 1: שכר דירה וערבויות */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">1. תקבולים וערבויות</h4>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                100% במועד
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl space-y-1">
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>חודש נוכחי (אוקטובר):</span>
                  <span className="text-emerald-700 font-bold">שולם בזמן</span>
                </div>
                <div className="text-xl font-bold text-slate-900 tabular-nums">
                  ₪{property.monthlyRent.toLocaleString('he-IL')}
                </div>
                <div className="text-[11px] text-slate-500">
                  אסמכתא: <code className="font-mono text-blue-700">{currentMonthPayment?.referenceNumber}</code>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl space-y-1">
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>סכום עתידי מתוזמן (נובמבר-דצמבר):</span>
                  <span className="text-blue-700 font-semibold">הוראת קבע</span>
                </div>
                <div className="text-lg font-bold text-slate-900 tabular-nums">
                  ₪{futurePendingTotal.toLocaleString('he-IL')}
                </div>
                <div className="text-[11px] text-slate-500">
                  מועד חיוב קרוב: 01/11/2026
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">ערבות דיגיטלית בנקאית:</span>
                <span className="font-bold text-emerald-700 font-mono">₪{property.digitalGuaranteeAmount.toLocaleString('he-IL')}</span>
              </div>
            </div>

            <button
              onClick={onNavigateToPayments}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
            >
              <span>לוח תשלומים שנתי מלא (12 חודשים)</span>
              <ChevronRight className="w-3.5 h-3.5 rotate-180" />
            </button>
          </div>

          {/* Stream 2: חשבונות שוטפים ואימות API */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">2. חשבונות תשתית (API)</h4>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {utilities.length} חשבונות
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {utilities.map((util) => (
                <div
                  key={util.id}
                  className="p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/60 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {getUtilityIcon(util.type)}
                    <div>
                      <div className="font-bold text-slate-800">{util.typeName}</div>
                      <div className="text-[10px] text-slate-500">{util.providerName}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-left">
                    <span className="font-bold tabular-nums text-slate-900">₪{util.amount}</span>
                    <button
                      onClick={() => handleSimulateApiCheck(util)}
                      disabled={isVerifyingApi === util.id}
                      className="px-2 py-1 text-[10px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                      title="אמת תשלום מול API רשמי"
                    >
                      {isVerifyingApi === util.id ? 'בודק...' : util.apiVerified ? 'מאומת ✓' : 'אמת'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2.5 bg-blue-50/80 rounded-xl text-[11px] text-blue-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>כל החשבונות מסונכרנים ואין חובות פתוחים.</span>
            </div>
          </div>

          {/* Stream 3: תקלות פעילות ו-SLA */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-700">
                  <Wrench className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">3. תקלות ו-SLA פעיל</h4>
              </div>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                {faults.filter(f => f.status !== 'resolved' && f.status !== 'closed').length} בטיפול
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {faults.slice(0, 2).map((tkt) => (
                <div key={tkt.id} className="p-3 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{tkt.title}</span>
                    <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded">
                      SLA: {tkt.maxSlaDays} ימים
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-1">{tkt.description}</p>
                  
                  {tkt.review && tkt.review.appealStatus === 'in_appeal' && (
                    <div className="text-[10px] font-bold text-amber-800 bg-amber-100/80 p-1.5 rounded-lg flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-700" />
                      חלון 72 שעות ערעור ספק פעיל
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-1 border-t border-slate-200/60 text-[11px]">
                    <span className="text-slate-500">ספק: {tkt.assignedProvider?.name.split('(')[0] || 'טרם שובץ'}</span>
                    <button
                      onClick={onNavigateToFaults}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      פרטי קריאה ←
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onNavigateToFaults}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors"
            >
              פתח קריאת שירות חדשה
            </button>
          </div>

        </div>

        {/* Digital Receipt Modal (Shared in Focus Mode) */}
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-sm">אסמכתת תשלום דיגיטלית חתומה</h3>
                </div>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-xl text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">עבור:</span>
                  <span className="font-bold text-slate-800">{selectedReceipt.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">תקופת חיוב:</span>
                  <span className="font-mono text-slate-800">{selectedReceipt.period}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">סכום שנפרע:</span>
                  <span className="font-bold text-emerald-700 text-sm font-mono">
                    ₪{selectedReceipt.amount.toLocaleString('he-IL')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">מספר אסמכתא ייחודי:</span>
                  <code className="font-mono text-blue-700 font-bold">{selectedReceipt.number}</code>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    confetti({ particleCount: 30 });
                    alert('האסמכתא הורדה כקובץ PDF מאומת.');
                    setSelectedReceipt(null);
                  }}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  הורד כ-PDF מאובטח
                </button>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                >
                  סגור
                </button>
              </div>
            </div>
          </div>
        )}

      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Toast Alert */}
      {apiToast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-sm font-medium">{apiToast}</span>
          </div>
          <button
            onClick={() => setApiToast(null)}
            className="text-xs text-emerald-700 hover:underline font-semibold"
          >
            סגור
          </button>
        </div>
      )}

      {/* Birthday Alert Notification (Action Item: Tenant Birthday Tracking) */}
      {isBirthdaySoon && (
        <div className="bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Cake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">
                  {activeRole === 'landlord'
                    ? `יום הולדת לשוכר (${tenant.name}) בעוד 4 ימים!`
                    : 'יום הולדתך חל בעוד 4 ימים (27 באוקטובר)!'}
                </h4>
                <span className="text-xs text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md font-medium">
                  מחווה קהילתית
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {activeRole === 'landlord'
                  ? 'מערכת RentShield ממליצה לשלוח ברכה חמה לחיזוק יחסי האמון ושימור שוכר לטווח ארוך.'
                  : 'צוות RentShield ובעל הנכס מאחלים לך שנת מגורים פורייה, בטוחה ומהנה!'}
              </p>
            </div>
          </div>
          {activeRole === 'landlord' ? (
            <button
              onClick={onOpenChat}
              className="text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              שלח ברכת יום הולדת בצ׳אט
            </button>
          ) : (
            <span className="text-xs text-slate-500 font-medium">
              מזל טוב מ-RentShield
            </span>
          )}
        </div>
      )}

      {/* Main Visual Gauges Strip - Bold, Official, Unified Palette */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        
        {/* Gauge 1: Circular Trust Gauge (4 Cols) */}
        <div className="md:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-800">מדד אמינות רשמי</span>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
              מאושר ללא תלונות
            </span>
          </div>

          <div className="my-2">
            <CircularTrustGauge
              score={activeRole === 'landlord' ? landlord.trustScore : tenant.trustScore}
              size={150}
              label={activeRole === 'landlord' ? 'ציון יושר למשכיר' : 'ציון יושר לשוכר'}
            />
          </div>

          <button
            onClick={onOpenTrustModal}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors text-center"
          >
            פתח תעודת יושר רשמית מלאה ←
          </button>
        </div>

        {/* Financial Progress & Pacing Bar (8 Cols) */}
        <div className="md:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Rent Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                <span>שכר דירה חודש נוכחי</span>
                <span className="text-blue-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  שולם במועד
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 tabular-nums">
                ₪{property.monthlyRent.toLocaleString('he-IL')}
              </div>
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>אסמכתא: {currentMonthPayment?.referenceNumber || 'RS-PAY-2026-10'}</span>
                <button
                  onClick={() => {
                    if (currentMonthPayment) {
                      setSelectedReceipt({
                        title: `שכר דירה אוקטובר 2026 - ${property.address}`,
                        number: currentMonthPayment.referenceNumber,
                        amount: currentMonthPayment.amount,
                        period: '01/10/2026 - 31/10/2026'
                      });
                    }
                  }}
                  className="text-blue-700 hover:underline font-bold"
                >
                  הצג קבלה
                </button>
              </div>
            </div>

            {/* Next Month Scheduled */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                <span>תשלום מתוזמן הבא (01/11)</span>
                <span className="text-blue-700 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  הוראת קבע
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 tabular-nums">
                ₪{property.monthlyRent.toLocaleString('he-IL')}
              </div>
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>סך עתידי לגבייה: ₪{futurePendingTotal.toLocaleString('he-IL')}</span>
                <span className="text-blue-700 font-bold">ערבות בתוקף</span>
              </div>
            </div>

          </div>

          {/* Segmented Financial Pacing Gauge */}
          <div className="pt-2 border-t border-slate-100">
            <FinancialProgressBar
              currentAmount={totalPaid2026}
              totalAmount={totalContract2026}
              monthsPaid={10}
              totalMonths={12}
            />
          </div>

          {/* Infrastructure Health Meter */}
          <UtilityHealthMeter
            verifiedCount={utilities.filter(u => u.status === 'paid').length}
            totalCount={utilities.length}
          />

        </div>

      </div>

      {/* Two Column Layout: Utilities Tracker (Right in RTL) & Action Modules (Left in RTL) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Utilities Section (Col Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                מעקב תשלומי תשתית ורשויות שוטפים
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                חיווי סטטוס בזמן אמת, הצגת אסמכתאות ואימות API ישיר מול הגופים הרשמיים
              </p>
            </div>
            
            {/* Filter Segmented Control for Utilities */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => setUtilFilter('all')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  utilFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                הכל ({utilities.length})
              </button>
              <button
                onClick={() => setUtilFilter('paid')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  utilFilter === 'paid'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                שולמו ({utilities.filter((u) => u.status === 'paid').length})
              </button>
              <button
                onClick={() => setUtilFilter('pending')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  utilFilter === 'pending'
                    ? 'bg-white text-amber-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ממתינים ({utilities.filter((u) => u.status !== 'paid').length})
              </button>
            </div>
          </div>

          {/* Utilities Table/Cards */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs divide-y divide-slate-100">
            {utilities
              .filter((u) => {
                if (utilFilter === 'paid') return u.status === 'paid';
                if (utilFilter === 'pending') return u.status !== 'paid';
                return true;
              })
              .map((util) => {
              const isVerifying = isVerifyingApi === util.id;
              return (
                <div key={util.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                  
                  {/* Left: Info */}
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-slate-100 shrink-0">
                      {getUtilityIcon(util.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900">
                          {util.typeName}
                        </span>
                        <span className="text-slate-400 text-xs">·</span>
                        <span className="text-xs text-slate-600">
                          {util.providerName}
                        </span>
                        {util.apiVerified && (
                          <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                            שולם ומאומת רשמית ✓
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
                        <span>תקופה: {util.billingPeriod}</span>
                        <span>·</span>
                        <span>מועד פירעון: {util.dueDate}</span>
                      </div>
                      {util.receiptNumber && (
                        <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                          מספר אישור פירעון: <code className="font-mono font-bold text-slate-800">{util.receiptNumber}</code>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Amount, Status & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                    <div className="text-right sm:text-left">
                      <div className="text-base font-black text-slate-900 tabular-nums">
                        ₪{util.amount.toLocaleString('he-IL')}
                      </div>
                      <div className="text-[11px]">
                        {util.status === 'paid' ? (
                          <span className="text-blue-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            שולם במלואו
                          </span>
                        ) : util.status === 'overdue' ? (
                          <span className="text-rose-700 font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            באיחור
                          </span>
                        ) : (
                          <span className="text-slate-700 font-bold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            ממתין לתשלום
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* View Receipt Button */}
                      {util.receiptNumber && (
                        <button
                          onClick={() =>
                            setSelectedReceipt({
                              title: `${util.typeName} - ${util.providerName}`,
                              number: util.receiptNumber!,
                              amount: util.amount,
                              period: util.billingPeriod
                            })
                          }
                          className="px-3 py-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1"
                          title="צפה באסמכתת תשלום"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>אסמכתא</span>
                        </button>
                      )}

                      {/* Verify Button */}
                      <button
                        onClick={() => handleSimulateApiCheck(util)}
                        disabled={isVerifying}
                        className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors flex items-center gap-1 disabled:opacity-50"
                        title="בדיקה ישירה מול הגוף הרשמי"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                        <span>{isVerifying ? 'בודק...' : 'בדוק תשלום'}</span>
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

          {/* Accessible Human Callout */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="text-slate-900 font-bold">אימות חשבונות שוטף:</strong>
              <p className="leading-relaxed">
                המערכת בודקת באופן ישיר וממוחשב מול ספרי חברת החשמל, ספקי הגז ועיריית תל אביב-יפו, כך שאין צורך לחפש קבלות נייר ישנות או לחשוש מחובות שנשכחו בדירה.
              </p>
            </div>
          </div>

        </div>

        {/* Action Modules Sidebar (Col Span 1) */}
        <div className="space-y-6">
          
          {/* Quick Shortcuts Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              פעולות מהירות ויחסי שכירות
            </h3>

            <div className="space-y-2.5">
              
              {/* Chat Button */}
              <button
                onClick={onOpenChat}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-right flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                      צ'אט פנימי מתועד
                    </div>
                    <div className="text-[11px] text-slate-500">
                      כולל תיעוד משפטי מוצפן וייצוא כרונולוגי
                    </div>
                  </div>
                </div>
                <span className="text-xs text-blue-600 font-semibold group-hover:translate-x-[-2px] transition-transform">
                  פתח ←
                </span>
              </button>

              {/* Faults / Maintenance Button */}
              <button
                onClick={onNavigateToFaults}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all text-right flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-amber-800 flex items-center gap-1.5">
                      <span>ניהול תקלות וספקים</span>
                      {activeFaultsCount > 0 && (
                        <span className="bg-amber-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                          {activeFaultsCount}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      לוחות זמנים (SLA) וערעור 72 שעות
                    </div>
                  </div>
                </div>
                <span className="text-xs text-amber-700 font-semibold group-hover:translate-x-[-2px] transition-transform">
                  נהל ←
                </span>
              </button>

              {/* Market Comparison Button ("מצב המשק") */}
              <button
                onClick={onOpenMarketModal}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 transition-all text-right flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                      מסך "מצב המשק"
                    </div>
                    <div className="text-[11px] text-slate-500">
                      השוואת שכר דירה לאזור, לעיר ולמדלן
                    </div>
                  </div>
                </div>
                <span className="text-xs text-purple-600 font-semibold group-hover:translate-x-[-2px] transition-transform">
                  השווה ←
                </span>
              </button>

              {/* Integrity Certificate Button ("תעודת יושר") */}
              <button
                onClick={onOpenTrustModal}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-right flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                      תעודת יושר אישית
                    </div>
                    <div className="text-[11px] text-slate-500">
                      דירוג מוניטין ואמינות עסקאות
                    </div>
                  </div>
                </div>
                <span className="text-xs text-emerald-600 font-semibold group-hover:translate-x-[-2px] transition-transform">
                  צפה ←
                </span>
              </button>

            </div>
          </div>

          {/* Property Summary Details Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              פרטי הסכם השכירות הפעיל
            </h3>

            <div className="relative rounded-xl overflow-hidden h-32 border border-slate-100">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent flex items-end p-3">
                <span className="text-white text-xs font-bold">
                  {property.address}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>תקופת הסכם:</span>
                <span className="font-semibold text-slate-900 font-mono">01/01/2026 - 31/12/2026</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>סוג ערבות:</span>
                <span className="font-semibold text-emerald-700">ערבות דיגיטלית חכמה (ללא צ'קים)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>גובה הערבות:</span>
                <span className="font-semibold text-slate-900 font-mono">₪{property.digitalGuaranteeAmount.toLocaleString('he-IL')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>בעל מקצוע מים מוגדר:</span>
                <span className="font-semibold text-blue-700">
                  {property.preferredProviders.water?.name || 'ללא (הפניה למדורג)'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={onNavigateToPayments}
                className="w-full py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-center"
              >
                צפה בלוח התשלומים השנתי המלא (12 תשלומים)
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Digital Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">אסמכתת תשלום דיגיטלית חתומה</h3>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">עבור:</span>
                <span className="font-bold text-slate-800">{selectedReceipt.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">תקופת חיוב:</span>
                <span className="font-mono text-slate-800">{selectedReceipt.period}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">סכום שנפרע:</span>
                <span className="font-bold text-emerald-700 text-sm font-mono">
                  ₪{selectedReceipt.amount.toLocaleString('he-IL')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">מספר אסמכתא ייחודי:</span>
                <code className="font-mono text-blue-700 font-bold">{selectedReceipt.number}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">חותמת זמן אלקטרונית:</span>
                <span className="font-mono text-slate-600">2026-10-23 09:14:22 UTC+3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">אימות משפטי:</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  תקף ומאושר לפי חוק השכירות
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  alert('האסמכתא הורדה כקובץ PDF מאומת.');
                  setSelectedReceipt(null);
                }}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                הורד כ-PDF מאובטח
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
              >
                סגור
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Internal helper icon
function Building2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}
