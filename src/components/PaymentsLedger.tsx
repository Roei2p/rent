import React, { useState } from 'react';
import { PaymentRecord, UtilityRecord, Property, UserRole } from '../types';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Eye,
  FileCheck,
  ShieldCheck,
  Filter,
  ArrowUpRight
} from 'lucide-react';

interface PaymentsLedgerProps {
  payments: PaymentRecord[];
  property: Property;
  activeRole: UserRole;
}

export const PaymentsLedger: React.FC<PaymentsLedgerProps> = ({
  payments,
  property,
  activeRole
}) => {
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);

  const filteredPayments = payments.filter((p) => {
    if (filter === 'paid') return p.status === 'paid';
    if (filter === 'pending') return p.status === 'pending';
    return true;
  });

  const totalPaid = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalContract = property.monthlyRent * 12;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            סיכום תשלומים שנתי (12 תשלומים רציפים - 2026)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            מעקב אחר גביית שכר הדירה, העברות בנקאיות ישירות והנפקת אסמכתאות חתומות
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            כל 12 החודשים
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filter === 'paid'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            שולמו (10)
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filter === 'pending'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            מתוזמנים עתידיים (2)
          </button>
        </div>
      </div>

      {/* Overview Metric Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500">סטטוס גבייה שנתי מצטבר</div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              ₪{totalPaid.toLocaleString('he-IL')}{' '}
              <span className="text-xs font-normal text-slate-400">
                / ₪{totalContract.toLocaleString('he-IL')}
              </span>
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% דיוק ופירעון במועד ללא יום איחור
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          <button
            onClick={() => alert('דוח תשלומים שנתי לרואה חשבון או לצורכי מס הופק בהצלחה.')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>הורד דוח שנתי מרוכז (Excel / PDF)</span>
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">חודש</th>
                <th className="py-3 px-4">סכום</th>
                <th className="py-3 px-4">מועד פירעון חוזי</th>
                <th className="py-3 px-4">תאריך פירעון בפועל</th>
                <th className="py-3 px-4">אמצעי תשלום</th>
                <th className="py-3 px-4">מספר אסמכתא</th>
                <th className="py-3 px-4">סטטוס</th>
                <th className="py-3 px-4 text-center">אסמכתא דיגיטלית</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPayments.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {pay.monthName}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 tabular-nums">
                    ₪{pay.amount.toLocaleString('he-IL')}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {pay.dueDate}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {pay.paidDate || '—'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {pay.paymentMethod}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-blue-700">
                    {pay.referenceNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    {pay.status === 'paid' ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        שולם
                      </span>
                    ) : (
                      <span className="text-blue-700 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        מתוזמן
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {pay.status === 'paid' ? (
                      <button
                        onClick={() => setSelectedReceipt(pay)}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        צפה
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[11px]">יונפק במועד</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Digital Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  קבלה ואסמכתת שכר דירה מאומתת
                </h3>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">כתובת הנכס:</span>
                <span className="font-bold text-slate-900">{property.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">חודש:</span>
                <span className="font-bold text-slate-900">{selectedReceipt.monthName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">סכום ששולם:</span>
                <span className="font-bold text-emerald-700 text-sm tabular-nums">
                  ₪{selectedReceipt.amount.toLocaleString('he-IL')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">אסמכתת RentShield:</span>
                <code className="font-mono text-blue-700 font-bold">
                  {selectedReceipt.referenceNumber}
                </code>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">אמצעי תשלום:</span>
                <span className="text-slate-800">{selectedReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">מועד פירעון מדויק:</span>
                <span className="font-mono text-slate-700">{selectedReceipt.paidDate} 08:30:11</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  alert('האסמכתא הורדה כ-PDF רשמי עם חתימה דיגיטלית.');
                  setSelectedReceipt(null);
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                הורד אסמכתא (PDF)
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
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
