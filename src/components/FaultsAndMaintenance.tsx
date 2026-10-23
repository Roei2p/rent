import React, { useState } from 'react';
import {
  FaultTicket,
  FaultCategory,
  FaultUrgency,
  ServiceProvider,
  Property,
  UserRole
} from '../types';
import {
  Wrench,
  AlertCircle,
  Clock,
  CheckCircle2,
  Star,
  ShieldAlert,
  Phone,
  UserCheck,
  Plus,
  Send,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface FaultsAndMaintenanceProps {
  activeRole: UserRole;
  property: Property;
  tickets: FaultTicket[];
  vettedProviders: ServiceProvider[];
  onAddTicket: (ticket: FaultTicket) => void;
  onUpdateTicket: (ticket: FaultTicket) => void;
  onOpenChat: () => void;
}

export const FaultsAndMaintenance: React.FC<FaultsAndMaintenanceProps> = ({
  activeRole,
  property,
  tickets,
  vettedProviders,
  onAddTicket,
  onUpdateTicket,
  onOpenChat
}) => {
  // Modal states
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [selectedTicketForReview, setSelectedTicketForReview] = useState<FaultTicket | null>(null);
  const [activeAppealTicket, setActiveAppealTicket] = useState<FaultTicket | null>(null);

  // New ticket form state
  const [category, setCategory] = useState<FaultCategory>('water');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<FaultUrgency>('minor');

  // Review form state (Strict Rule: Rating 1-5, minimum 50 characters!)
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState<string | null>(null);

  // Provider appeal response state
  const [appealResponseText, setAppealResponseText] = useState('');
  const [appealCompensation, setAppealCompensation] = useState('');

  // Handle new ticket submit
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const categoryNames: Record<FaultCategory, string> = {
      water: 'נזקי מים ואינסטלציה',
      structure: 'מבנה, בינוי ופתחים',
      electricity: 'חשמל ותאורה',
      hvac: 'מיזוג אוויר ואקלים',
      other: 'תקלה אחרת / כללי'
    };

    const urgencyInfo: Record<FaultUrgency, { text: string; days: number }> = {
      minor: { text: 'תקלה קטנה (עד 14 ימי עסקים)', days: 14 },
      substantial: { text: 'תקלה מהותית (עד 3 ימים)', days: 3 },
      emergency: { text: 'חירום דחוף ומיידי (עד 24 שעות)', days: 1 }
    };

    // Check if landlord has preferred provider for this category
    const preferred = property.preferredProviders[category as keyof typeof property.preferredProviders];

    const now = new Date();
    const deadline = new Date(now.getTime() + urgencyInfo[urgency].days * 24 * 60 * 60 * 1000);

    const newTicket: FaultTicket = {
      id: `tkt-${Date.now()}`,
      propertyId: property.id,
      category,
      categoryHebrew: categoryNames[category],
      title,
      description,
      urgency,
      urgencyHebrew: urgencyInfo[urgency].text,
      maxSlaDays: urgencyInfo[urgency].days,
      status: 'open',
      createdAt: now.toISOString().replace('T', ' ').substring(0, 16),
      slaDeadline: deadline.toISOString().replace('T', ' ').substring(0, 16),
      openedByRole: activeRole,
      assignedProvider: preferred
        ? {
            id: 'preferred-pro',
            name: `${preferred.name} (איש מקצוע קבוע מטעמך/מטעם המשכיר)`,
            phone: preferred.phone,
            isLandlordPreferred: true
          }
        : undefined,
      photos: []
    };

    onAddTicket(newTicket);
    setIsNewTicketOpen(false);
    setTitle('');
    setDescription('');
    setUrgency('minor');
    setCategory('water');
  };

  // Submit review with 50-char validation & 72-hour trigger
  const handleSubmitReview = (ticket: FaultTicket) => {
    if (reviewComment.trim().length < 50) {
      setReviewError(`חובה להזין לפחות 50 תווים בביקורת (הזנת כעת ${reviewComment.trim().length} תווים). פירוט זה מסייע לאמינות המערכת.`);
      return;
    }

    const now = new Date();
    const deadline72h = new Date(now.getTime() + 72 * 60 * 60 * 1000);

    const isLessThan5 = rating < 5;

    const updatedTicket: FaultTicket = {
      ...ticket,
      status: 'closed',
      review: {
        id: `rev-${Date.now()}`,
        rating,
        comment: reviewComment,
        authorRole: activeRole,
        createdAt: now.toISOString().replace('T', ' ').substring(0, 16),
        appealStatus: isLessThan5 ? 'in_appeal' : 'none',
        appealDeadline: isLessThan5 ? deadline72h.toISOString().replace('T', ' ').substring(0, 16) : undefined
      }
    };

    onUpdateTicket(updatedTicket);
    setSelectedTicketForReview(null);
    setReviewComment('');
    setRating(5);
    setReviewError(null);
  };

  // Provider response to appeal
  const handleResolveAppeal = (ticket: FaultTicket, action: 'accept_compensation' | 'keep_original') => {
    if (!ticket.review) return;

    const updatedTicket: FaultTicket = {
      ...ticket,
      review: {
        ...ticket.review,
        appealStatus: 'resolved_appeal',
        rating: action === 'accept_compensation' ? 5 : ticket.review.rating,
        comment:
          action === 'accept_compensation'
            ? `${ticket.review.comment} [עודכן לאחר הידברות: הספק הציע פיצוי/תיקון משביע רצון]`
            : ticket.review.comment
      }
    };

    onUpdateTicket(updatedTicket);
    setActiveAppealTicket(null);
  };

  return (
    <div className="space-y-8">
      
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            ניהול תקלות, תחזוקה וספקים מוסמכים
          </h2>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            מעקב שקוף אחר תיקונים, עמידה בזמני טיפול שנקבעו בחוזה, ודירוג ספקים הוגן עם 72 שעות להידברות
          </p>
        </div>

        <button
          onClick={() => setIsNewTicketOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>פתיחת קריאת שירות חדשה</span>
        </button>
      </div>

      {/* Contract Timeline Guideline Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-slate-900 text-xs">
              זמני טיפול מוסכמים לפי חוק השכירות והחוזה:
            </div>
            <div className="text-slate-600 mt-0.5 font-medium">
              תקלה קטנה: עד 14 ימי עסקים · תקלה מהותית: עד 3 ימים · מקרה חירום (הצפה/קצר): טיפול מיידי תוך 24 שעות.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="font-bold text-slate-700">אינסטלטור קבוע מוגדר:</span>
          <span className="font-bold text-blue-800 bg-white px-3 py-1 rounded-xl border border-slate-200">
            {property.preferredProviders.water?.name || 'הפניה לספק מוסמך'}
          </span>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span>קריאות שירות פתוחות והיסטוריה</span>
          <span className="text-xs text-slate-500 font-normal">({tickets.length} קריאות בנכס)</span>
        </h3>

        {tickets.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">אין תקלות פתוחות בנכס</h4>
            <p className="text-xs text-slate-500">כל מערכות הדירה תקינות ומתוחזקות כנדרש.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {tickets.map((tkt) => {
              const isResolved = tkt.status === 'resolved' || tkt.status === 'closed';
              const hasAppeal = tkt.review?.appealStatus === 'in_appeal';

              return (
                <div
                  key={tkt.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-all shadow-xs space-y-4"
                >
                  
                  {/* Top row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                        {tkt.categoryHebrew}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        נפתחה ב-{tkt.createdAt}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs font-medium text-slate-600">
                        יעד SLA: {tkt.urgencyHebrew}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {tkt.status === 'open' && (
                        <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          קריאה פתוחה
                        </span>
                      )}
                      {tkt.status === 'in_progress' && (
                        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 flex items-center gap-1">
                          <Wrench className="w-3.5 h-3.5" />
                          בטיפול מול ספק
                        </span>
                      )}
                      {tkt.status === 'resolved' && (
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          תוקנה - ממתינה לדירוג
                        </span>
                      )}
                      {tkt.status === 'closed' && (
                        <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          טופלה ונסגרה
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      {tkt.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {tkt.description}
                    </p>
                  </div>

                  {/* Provider & Action strip */}
                  <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    
                    {/* Provider Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <div>
                        {tkt.assignedProvider ? (
                          <>
                            <div className="font-bold text-slate-800">
                              ספק מטפל: {tkt.assignedProvider.name}
                            </div>
                            <div className="text-slate-500 flex items-center gap-2 mt-0.5">
                              <span className="font-mono flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {tkt.assignedProvider.phone}
                              </span>
                              {tkt.assignedProvider.isLandlordPreferred && (
                                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                                  ספק קבוע מוגדר
                                </span>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="text-amber-800 font-medium">
                            טרם שובץ ספק · ניתן לפנות לספקים מוסמכים מתוך הרשימה למטה
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Tenant can rate resolved ticket */}
                      {tkt.status === 'resolved' && !tkt.review && (
                        <button
                          onClick={() => setSelectedTicketForReview(tkt)}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Star className="w-3.5 h-3.5" />
                          <span>דרג את הספק (חובה 50 תווים)</span>
                        </button>
                      )}

                      {/* Landlord or Tenant mark resolved */}
                      {tkt.status === 'in_progress' && (
                        <button
                          onClick={() => {
                            const updated: FaultTicket = { ...tkt, status: 'resolved' };
                            onUpdateTicket(updated);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>סמן שהתקלה תוקנה</span>
                        </button>
                      )}

                      {/* Discuss in Chat */}
                      <button
                        onClick={onOpenChat}
                        className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium rounded-lg transition-colors flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>צ'אט מתועד בנושא</span>
                      </button>
                    </div>

                  </div>

                  {/* 72-Hour Appeal Section if exists! (Action Item 4: Critical Requirement) */}
                  {tkt.review && (
                    <div className={`rounded-xl p-4 border text-xs space-y-3 ${
                      hasAppeal ? 'bg-amber-50/70 border-amber-300' : 'bg-slate-50 border-slate-200'
                    }`}>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">ביקורת ודירוג הספק:</span>
                          <div className="flex items-center text-amber-500">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${s <= tkt.review!.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                              />
                            ))}
                          </div>
                          <span className="font-bold tabular-nums text-slate-700">({tkt.review.rating}/5)</span>
                        </div>

                        {/* Appeal 72h status badge */}
                        {hasAppeal && (
                          <span className="font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-md flex items-center gap-1.5 animate-pulse">
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            <span>חלון ערעור והידברות של 72 שעות פעיל!</span>
                          </span>
                        )}
                        {tkt.review.appealStatus === 'resolved_appeal' && (
                          <span className="font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            הערעור יושב בהסכמה
                          </span>
                        )}
                      </div>

                      <p className="text-slate-700 bg-white/80 p-3 rounded-lg border border-slate-200/80 italic leading-relaxed">
                        "{tkt.review.comment}"
                      </p>

                      {/* Provider response during 72h appeal */}
                      {tkt.review.providerResponse && (
                        <div className="bg-blue-50/90 border border-blue-200 p-3 rounded-lg space-y-1.5">
                          <div className="font-bold text-blue-900 flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                            <span>תשובת הספק במסגרת 72 שעות הערעור:</span>
                          </div>
                          <p className="text-blue-800 leading-relaxed">
                            {tkt.review.providerResponse}
                          </p>
                          {tkt.review.compensationOffered && (
                            <div className="text-emerald-800 font-semibold bg-emerald-50 p-2 rounded border border-emerald-200">
                              הצעת פיצוי/הסדרה מצד הספק: {tkt.review.compensationOffered}
                            </div>
                          )}

                          {/* Tenant can accept resolution */}
                          {hasAppeal && (
                            <div className="flex gap-2 pt-1">
                              <button
                                onClick={() => handleResolveAppeal(tkt, 'accept_compensation')}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md transition-colors"
                              >
                                אשר את הפיצוי ועדכן ל-5 כוכבים
                              </button>
                              <button
                                onClick={() => handleResolveAppeal(tkt, 'keep_original')}
                                className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-md transition-colors"
                              >
                                השאר את הדירוג כפי שהוא
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* If no response yet and has appeal, pro can simulate dispute response */}
                      {hasAppeal && !tkt.review.providerResponse && (
                        <button
                          onClick={() => setActiveAppealTicket(tkt)}
                          className="text-xs text-blue-700 hover:underline font-semibold flex items-center gap-1"
                        >
                          הזן מענה לערעור מטעם הספק (בדיקת תרחיש הידברות 72 שעות)
                        </button>
                      )}

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Vetted Marketplace ("מדרוג" ספקים מוסמכים) */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              רשת ספקים מוסמכים ומדורגים (ממשק צד ג' - מדורג)
            </h3>
            <p className="text-xs text-slate-500">
              ספקים שנבדקו עם תעודת מקצוע, ביטוח צד ג' ודירוג של 4.8 ומעלה
            </p>
          </div>
          <span className="text-xs text-slate-400">
            תשלום ישיר ומאובטח דרך RentShield
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vettedProviders.map((pro) => (
            <div
              key={pro.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-slate-300 transition-all shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {pro.categoryHebrew}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">
                    {pro.name}
                  </h4>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 text-amber-700 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{pro.rating}</span>
                </div>
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>עבודות שבוצעו במערכת:</span>
                  <span className="font-semibold text-slate-800 tabular-nums">{pro.completedJobs}</span>
                </div>
                <div className="flex justify-between">
                  <span>תעריף ביקור משוער:</span>
                  <span className="font-semibold text-slate-800 tabular-nums">₪{pro.hourlyRate}</span>
                </div>
                <div className="flex justify-between">
                  <span>זמינות:</span>
                  <span className={pro.availableNow ? 'text-emerald-700 font-semibold' : 'text-slate-400'}>
                    {pro.availableNow ? 'זמין לקריאה מיידית' : 'זמין תוך 24 שעות'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={`tel:${pro.phone}`}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors text-center flex items-center justify-center gap-1 font-mono"
                >
                  <Phone className="w-3 h-3" />
                  {pro.phone}
                </a>
                <button
                  onClick={() => {
                    alert(`נפתחה פנייה ישירה אל ${pro.name}. תיאום מועד ביקור נשלח לשני הצדדים.`);
                  }}
                  className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                >
                  הזמן ספק
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Create New Ticket */}
      {isNewTicketOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">פתיחת קריאת שירות ותקלה בדירה</h3>
              </div>
              <button
                onClick={() => setIsNewTicketOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              
              {/* Category */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  סוג התקלה (קטגוריה):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(
                    [
                      { key: 'water', label: 'נזקי מים / אינסטלציה' },
                      { key: 'electricity', label: 'חשמל ותאורה' },
                      { key: 'structure', label: 'מבנה ודלתות' },
                      { key: 'hvac', label: 'מיזוג אוויר' },
                      { key: 'other', label: 'תקלה אחרת' }
                    ] as const
                  ).map((item) => (
                    <button
                      type="button"
                      key={item.key}
                      onClick={() => setCategory(item.key)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        category === item.key
                          ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Urgency & SLA */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  דחיפות התקלה (הגדרת SLA חוזי):
                </label>
                <div className="space-y-2">
                  {(
                    [
                      { key: 'minor', label: 'תקלה קטנה / בלאי סביר', sla: 'עד 14 ימי עסקים' },
                      { key: 'substantial', label: 'תקלה מהותית (פוגעת באיכות החיים)', sla: 'עד 3 ימים' },
                      { key: 'emergency', label: 'תקלת חירום דחופה (הצפה/קצר מלא)', sla: 'טיפול מיידי עד 24 שעות' }
                    ] as const
                  ).map((item) => (
                    <label
                      key={item.key}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                        urgency === item.key
                          ? 'border-blue-600 bg-blue-50/60'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="urgency"
                          checked={urgency === item.key}
                          onChange={() => setUrgency(item.key)}
                          className="text-blue-600"
                        />
                        <span className="font-semibold text-slate-800">{item.label}</span>
                      </div>
                      <span className="text-slate-500 font-mono">{item.sla}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  כותרת תמציתית של התקלה:
                </label>
                <input
                  type="text"
                  required
                  placeholder="למשל: דליפת מים מתחת לכיור במטבח"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  תיאור מפורט של המפגע:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="פרט היכן בדיוק התקלה, מתי הבחנת בה והאם יש סכנת נזק למבנה..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Pre-assigned pro notification note */}
              {property.preferredProviders[category as keyof typeof property.preferredProviders] && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
                  <div className="font-bold flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span>איש מקצוע קבוע מוגדר מראש ע״י המשכיר:</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-blue-800">
                    הקריאה תשוייך ישירות אל <strong>{property.preferredProviders[category as keyof typeof property.preferredProviders]?.name}</strong> ({property.preferredProviders[category as keyof typeof property.preferredProviders]?.phone}) בהתאם להנחיות החוזה.
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-black rounded-xl transition-colors shadow-xs"
                >
                  שלח קריאה ושלח התראה דיגיטלית
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewTicketOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                >
                  ביטול
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal: Rating & Review with 50-char validation & 72h rule */}
      {selectedTicketForReview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm">
                  דירוג הספק ומשוב בסיום הטיפול
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicketForReview(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl text-slate-700">
                <strong>תקלה:</strong> {selectedTicketForReview.title}
                {selectedTicketForReview.assignedProvider && (
                  <div className="mt-0.5">
                    <strong>ספק:</strong> {selectedTicketForReview.assignedProvider.name}
                  </div>
                )}
              </div>

              {/* Star selector */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  בחר ציון (1 עד 5 כוכבים):
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-sm text-slate-800 mr-2">
                    {rating === 5 ? 'מצוין (5 כוכבים)' : `${rating} כוכבים`}
                  </span>
                </div>
              </div>

              {/* 72h rule notice if < 5 */}
              {rating < 5 && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>מנגנון 72 שעות לערעור והידברות יופעל אוטומטית:</span>
                  </div>
                  <p className="leading-relaxed text-amber-800">
                    מאחר שהדירוג נמוך מ-5 כוכבים, תינתן לספק שהות של 72 שעות לברר את סיבת אי שביעות הרצון, להציע תיקון חוזר או פיצוי, בטרם ייקבע הציון באופן סופי במערכת.
                  </p>
                </div>
              )}

              {/* Comment with 50 chars counter */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-800">
                    תוכן הביקורת (חובה לפחות 50 תווים):
                  </label>
                  <span
                    className={`font-mono text-[11px] ${
                      reviewComment.trim().length >= 50
                        ? 'text-emerald-700 font-bold'
                        : 'text-amber-700 font-semibold'
                    }`}
                  >
                    {reviewComment.trim().length} / 50 תווים
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => {
                    setReviewComment(e.target.value);
                    if (reviewError) setReviewError(null);
                  }}
                  placeholder="תאר את אופן ביצוע העבודה, עמידה בזמנים, ניקיון המקום, אדיבות ופתרון התקלה..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                {reviewError && (
                  <p className="text-red-600 font-semibold mt-1 text-[11px]">
                    {reviewError}
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleSubmitReview(selectedTicketForReview)}
                  className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-black rounded-xl transition-colors shadow-xs"
                >
                  שלח ביקורת ודירוג
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTicketForReview(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                >
                  ביטול
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Modal: Provider response to appeal simulation */}
      {activeAppealTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm">מענה הספק בחלון הערעור (72 שעות)</h3>
              </div>
              <button
                onClick={() => setActiveAppealTicket(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                הספק יכול לפנות למזמין, להסביר את הסיבה או להציע שירות משלים על מנת להגיע להסכמה.
              </p>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  תגובת הספק:
                </label>
                <textarea
                  rows={3}
                  value={appealResponseText}
                  onChange={(e) => setAppealResponseText(e.target.value)}
                  placeholder="אני מתנצל על התקלה, אשמח להגיע שוב לבדיקה מלאה ללא עלות..."
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  הצעת פיצוי או הסדרה:
                </label>
                <input
                  type="text"
                  value={appealCompensation}
                  onChange={(e) => setAppealCompensation(e.target.value)}
                  placeholder="ביקור חוזר חינם + 15% הנחה על הטיפול הבא"
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!activeAppealTicket.review) return;
                    const updated: FaultTicket = {
                      ...activeAppealTicket,
                      review: {
                        ...activeAppealTicket.review,
                        providerResponse: appealResponseText || 'הספק פנה עם מענה שירותי מפורט.',
                        compensationOffered: appealCompensation || 'ביקור חוזר ללא עלות'
                      }
                    };
                    onUpdateTicket(updated);
                    setActiveAppealTicket(null);
                    setAppealResponseText('');
                    setAppealCompensation('');
                  }}
                  className="flex-1 py-2 bg-blue-700 hover:bg-blue-800 text-white font-black rounded-lg"
                >
                  שלח מענה לשוכר
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAppealTicket(null)}
                  className="px-3 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg"
                >
                  סגור
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
