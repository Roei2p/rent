import React from 'react';
import { Property } from '../types';
import { MARKET_COMPARISON_DATA } from '../data/mockData';
import { TrendingUp, BarChart3, Database, ShieldCheck, Info, MapPin } from 'lucide-react';

interface MarketTrendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
}

export const MarketTrendsModal: React.FC<MarketTrendsModalProps> = ({
  isOpen,
  onClose,
  property
}) => {
  if (!isOpen) return null;

  const data = MARKET_COMPARISON_DATA;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                מסך "מצב המשק" והשוואת מחירי שוק
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                השוואת שכר הדירה בנכס מול מחירי השכירות בשכונה, בטריטוריה ובעיר
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

        {/* Current Property Benchmark Strip */}
        <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-700 shrink-0" />
            <div>
              <div className="text-xs font-black text-slate-900">
                הדירה שלך: {property.address}
              </div>
              <div className="text-[11px] text-slate-600 font-semibold">
                {property.rooms} חדרים · {property.sizeM2} מ"ר · קומה {property.floor}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="text-right">
              <span className="text-slate-500 block text-[11px] font-bold">שכ״ד בפועל:</span>
              <span className="text-base font-black text-slate-900 tabular-nums">
                ₪{property.monthlyRent.toLocaleString('he-IL')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block text-[11px] font-bold">מחיר למ"ר:</span>
              <span className="text-base font-black text-blue-800 tabular-nums">
                ₪{data.currentProperty.pricePerM2}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block text-[11px] font-bold">תשואה מוערכת:</span>
              <span className="text-base font-black text-emerald-700 tabular-nums">
                {data.currentProperty.yieldEst}
              </span>
            </div>
          </div>
        </div>

        {/* 3-Tier Geographic Comparison Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
            השוואה גיאוגרפית רב-שכבתית (דירות 4 חדרים דומות)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Neighborhood Tier */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-xs">
              <div className="text-xs font-bold text-blue-800">
                1. ברמת השכונה
              </div>
              <div className="text-sm font-black text-slate-900">
                {data.neighborhood.name}
              </div>
              <div className="text-2xl font-black text-slate-900 tabular-nums">
                ₪{data.neighborhood.avgRent.toLocaleString('he-IL')}
                <span className="text-xs font-medium text-slate-500"> /חודש</span>
              </div>
              <div className="text-xs space-y-1.5 text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="font-medium">ממוצע למ"ר:</span>
                  <span className="font-bold tabular-nums text-slate-900">₪{data.neighborhood.avgPricePerM2}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">שינוי שנתי:</span>
                  <span className="font-bold text-emerald-700 tabular-nums">{data.neighborhood.rentChangeYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">פער מהנכס:</span>
                  <span className="font-extrabold text-emerald-700 tabular-nums">
                    -₪{(data.neighborhood.avgRent - property.monthlyRent).toLocaleString('he-IL')} (מחיר אטרקטיבי)
                  </span>
                </div>
              </div>
            </div>

            {/* Territory Tier */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-xs">
              <div className="text-xs font-bold text-blue-800">
                2. ברמת הטריטוריה
              </div>
              <div className="text-sm font-black text-slate-900">
                {data.territory.name}
              </div>
              <div className="text-2xl font-black text-slate-900 tabular-nums">
                ₪{data.territory.avgRent.toLocaleString('he-IL')}
                <span className="text-xs font-medium text-slate-500"> /חודש</span>
              </div>
              <div className="text-xs space-y-1.5 text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="font-medium">ממוצע למ"ר:</span>
                  <span className="font-bold tabular-nums text-slate-900">₪{data.territory.avgPricePerM2}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">שינוי שנתי:</span>
                  <span className="font-bold text-emerald-700 tabular-nums">{data.territory.rentChangeYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">רמת ביקוש:</span>
                  <span className="font-bold text-slate-900">{data.territory.demandLevel}</span>
                </div>
              </div>
            </div>

            {/* City Tier */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-xs">
              <div className="text-xs font-bold text-blue-800">
                3. ברמת כלל העיר
              </div>
              <div className="text-sm font-black text-slate-900">
                {data.city.name}
              </div>
              <div className="text-2xl font-black text-slate-900 tabular-nums">
                ₪{data.city.avgRent.toLocaleString('he-IL')}
                <span className="text-xs font-medium text-slate-500"> /חודש</span>
              </div>
              <div className="text-xs space-y-1.5 text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="font-medium">ממוצע למ"ר:</span>
                  <span className="font-bold tabular-nums text-slate-900">₪{data.city.avgPricePerM2}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">שינוי שנתי:</span>
                  <span className="font-bold text-emerald-700 tabular-nums">{data.city.rentChangeYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">רמת ביקוש:</span>
                  <span className="font-bold text-slate-900">{data.city.demandLevel}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Historical Visual Trend */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-blue-700" />
              <span>מגמת מחירי שכירות ב-12 החודשים האחרונים</span>
            </h4>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-blue-900">
                <span className="w-3 h-3 bg-blue-700 rounded-xs"></span> הדירה שלך (₪8,400)
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 bg-blue-300 rounded-xs"></span> ממוצע השכונה (₪8,650)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 pt-3 items-end h-32">
            {data.historicalTrend.map((m) => {
              const heightProp = (m.current / 10000) * 100;
              const heightNeigh = (m.neighborhood / 10000) * 100;
              return (
                <div key={m.month} className="flex flex-col items-center gap-1 h-full justify-end">
                  <div className="flex items-end gap-1 w-full justify-center h-22">
                    <div
                      style={{ height: `${heightProp}%` }}
                      className="w-2.5 bg-blue-700 rounded-t-xs"
                      title={`${m.month}: הנכס ₪${m.current}`}
                    ></div>
                    <div
                      style={{ height: `${heightNeigh}%` }}
                      className="w-2.5 bg-blue-300 rounded-t-xs"
                      title={`${m.month}: השכונה ₪${m.neighborhood}`}
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-600 font-bold whitespace-nowrap">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reliable Data Sources */}
        <div className="space-y-2 border-t border-slate-200 pt-4">
          <div className="flex items-center gap-2 text-xs font-black text-slate-900">
            <Database className="w-4 h-4 text-blue-700" />
            <span>מקורות נתונים רשמיים ומהימנים לאימות מחירי השוק:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {data.reliableSources.map((source) => (
              <div key={source.name} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-extrabold text-slate-900">{source.name}</div>
                <div className="text-[11px] text-slate-600 font-medium mt-1 leading-snug">
                  {source.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            הבנתי, סגור חלון
          </button>
        </div>

      </div>
    </div>
  );
};
