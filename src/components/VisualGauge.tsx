import React from 'react';
import { ShieldCheck, CheckCircle2, TrendingUp } from 'lucide-react';

interface CircularTrustGaugeProps {
  score: number; // 0 to 100
  size?: number;
  label?: string;
  sublabel?: string;
}

export const CircularTrustGauge: React.FC<CircularTrustGaugeProps> = ({
  score,
  size = 160,
  label = 'ציון יושר ואמינות',
  sublabel = 'לפי ביצועים בפועל'
}) => {
  // SVG circular arc calculation
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Arc of 240 degrees (leaving 120 open at bottom)
  const angle = 240;
  const arcLength = (angle / 360) * circumference;
  const offset = arcLength - (score / 100) * arcLength;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="w-full h-full transform -rotate-120"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Active Meter Fill */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1D4ED8"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <span className="text-4xl font-black text-slate-900 tracking-tight tabular-nums">
            {score}
          </span>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            מתוך 100
          </span>
        </div>
      </div>

      <div className="mt-1">
        <div className="text-xs font-bold text-slate-900 flex items-center justify-center gap-1">
          <ShieldCheck className="w-4 h-4 text-blue-700" />
          <span>{label}</span>
        </div>
        <div className="text-[11px] font-semibold text-blue-700 mt-0.5">
          {score >= 90 ? 'דירוג עליון (שוכר/משכיר למופת)' : 'דירוג תקין'}
        </div>
      </div>
    </div>
  );
};

interface FinancialProgressBarProps {
  currentAmount: number;
  totalAmount: number;
  monthsPaid: number;
  totalMonths?: number;
}

export const FinancialProgressBar: React.FC<FinancialProgressBarProps> = ({
  currentAmount,
  totalAmount,
  monthsPaid,
  totalMonths = 12
}) => {
  const percentage = Math.min(Math.round((currentAmount / totalAmount) * 100), 100);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="text-slate-800">קצב גביית שכר דירה שנתי</span>
        <span className="text-blue-700 font-black tabular-nums">{percentage}% שולמו</span>
      </div>

      {/* Segmented Meter Bar */}
      <div className="grid grid-cols-12 gap-1.5 h-3 bg-slate-100 p-1 rounded-xl border border-slate-200">
        {Array.from({ length: totalMonths }).map((_, i) => {
          const isPaid = i < monthsPaid;
          return (
            <div
              key={i}
              className={`h-full rounded-sm transition-all ${
                isPaid ? 'bg-blue-700 shadow-xs' : 'bg-slate-200'
              }`}
              title={`חודש ${i + 1}: ${isPaid ? 'שולם בזמן' : 'טרם הגיע מועד הפירעון'}`}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
        <span>{monthsPaid} מתוך {totalMonths} חודשים שולמו במועדם</span>
        <span className="font-bold text-slate-900 font-mono tabular-nums">
          ₪{currentAmount.toLocaleString('he-IL')} מתוך ₪{totalAmount.toLocaleString('he-IL')}
        </span>
      </div>
    </div>
  );
};

interface UtilityHealthMeterProps {
  verifiedCount: number;
  totalCount: number;
}

export const UtilityHealthMeter: React.FC<UtilityHealthMeterProps> = ({
  verifiedCount,
  totalCount
}) => {
  const allGood = verifiedCount === totalCount;

  return (
    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white ${
          allGood ? 'bg-blue-700' : 'bg-slate-700'
        }`}>
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-bold text-slate-900">
            תמונת מצב חשבונות רשמיים בדירה
          </div>
          <div className="text-[11px] text-slate-600 font-medium">
            חשמל, ארנונה, גז וועד בית - בדיקה חודשית
          </div>
        </div>
      </div>

      <div className="text-left font-bold">
        <div className="text-sm text-blue-700 tabular-nums">
          {verifiedCount} מתוך {totalCount} שולמו
        </div>
        <div className="text-[10px] text-slate-500 font-semibold">
          {allGood ? 'אין חובות פתוחים ✓' : 'ממתין לתשלום'}
        </div>
      </div>
    </div>
  );
};
