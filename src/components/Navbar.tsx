import React from 'react';
import { UserRole, Property, LandlordProfile, TenantProfile } from '../types';
import { ShieldCheck, UserCheck, MessageSquare, Building2, User, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  properties: Property[];
  selectedProperty: Property;
  onSelectProperty: (property: Property) => void;
  landlord: LandlordProfile;
  tenant: TenantProfile;
  onOpenChat: () => void;
  onOpenTrustModal: () => void;
  onOpenMarketModal: () => void;
  onOpenProfileModal: () => void;
  onOpenSubscriptionModal: () => void;
  onOpenBragReel: () => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRole,
  onRoleChange,
  activeTab,
  onTabChange,
  properties,
  selectedProperty,
  onSelectProperty,
  landlord,
  tenant,
  onOpenChat,
  onOpenTrustModal,
  onOpenMarketModal,
  onOpenProfileModal,
  onOpenSubscriptionModal,
  onOpenBragReel,
  isFocusMode,
  onToggleFocusMode
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Primary Top Bar (Three-zone Contract) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-xl shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
              RentShield
            </span>
            <span className="text-xs text-slate-500 font-medium tracking-wide">
              רנטשילד · מגן השכירות
            </span>
          </div>
        </div>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onTabChange('overview')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            דשבורד ראשי
          </button>
          <button
            onClick={() => onTabChange('faults')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
              activeTab === 'faults'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            ניהול תקלות וספקים
          </button>
          <button
            onClick={() => onTabChange('payments')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
              activeTab === 'payments'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            חשבונות ותשלומים
          </button>
          <button
            onClick={onOpenMarketModal}
            className="whitespace-nowrap text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
          >
            <span>מצב המשק</span>
          </button>
          <button
            onClick={onOpenTrustModal}
            className="whitespace-nowrap text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>תעודת יושר</span>
          </button>
        </nav>

        {/* Zone 3: Persona Switcher & Quick Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Video Overview Button (Human-friendly non-tech label) */}
          <button
            onClick={onOpenBragReel}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
            title="צפה בתקציר מונפש של הנכס, החשבונות והערבויות"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">תקציר הנכס בוידאו</span>
          </button>

          {/* Chat Quick Access */}
          <button
            onClick={onOpenChat}
            className="relative p-2 text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="הודעות וצ'אט מתועד"
            aria-label="הודעות וצ'אט"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-700 rounded-full"></span>
          </button>

          {/* Interactive Role Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => onRoleChange('landlord')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                activeRole === 'landlord'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>משכיר</span>
            </button>
            <button
              onClick={() => onRoleChange('tenant')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                activeRole === 'tenant'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>שוכר</span>
            </button>
          </div>

          {/* Active User Avatar & Profile Button */}
          <button
            onClick={onOpenProfileModal}
            className="flex items-center gap-2 pr-1 pl-2 py-1 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
            title="פרופיל משתמש והגדרות"
          >
            <img
              src={activeRole === 'landlord' ? landlord.avatar : tenant.avatar}
              alt="User Avatar"
              className="w-7 h-7 rounded-full object-cover border border-slate-200"
              referrerPolicy="no-referrer"
            />
            <div className="hidden lg:flex flex-col text-right leading-tight">
              <span className="text-xs font-semibold text-slate-800">
                {activeRole === 'landlord' ? landlord.name : tenant.name}
              </span>
              <span className="text-[10px] text-slate-500">
                ציון: {activeRole === 'landlord' ? landlord.trustScore : tenant.trustScore}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Property Selector & Focus Mode Bar */}
      <div className="bg-slate-50/90 border-t border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-500 font-medium">נכס פעיל:</span>
            {activeRole === 'landlord' ? (
              <div className="flex items-center gap-1.5">
                <select
                  value={selectedProperty.id}
                  onChange={(e) => {
                    const prop = properties.find((p) => p.id === e.target.value);
                    if (prop) onSelectProperty(prop);
                  }}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 font-semibold text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.address} ({p.rooms} חד׳ · ₪{p.monthlyRent.toLocaleString('he-IL')})
                    </option>
                  ))}
                </select>
                <span className="text-slate-400">|</span>
                <span className="text-slate-600 font-normal">
                  שוכר: <span className="font-semibold text-slate-800">{tenant.name}</span>
                </span>
              </div>
            ) : (
              <span className="font-semibold text-slate-800">
                {selectedProperty.address} · דירת {selectedProperty.rooms} חדרים (משכיר: {landlord.name})
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Focus Mode Declutter Toggle Button */}
            <button
              onClick={onToggleFocusMode}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-bold transition-all ${
                isFocusMode
                  ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                  : 'bg-white text-slate-800 border-slate-300 hover:border-slate-400'
              }`}
              title="תצוגה מקוצרת המרכזת את הפעולות הדחופות ביותר"
            >
              <span className="w-2 h-2 rounded-full bg-current"></span>
              <span>{isFocusMode ? 'תצוגה מקוצרת (פעילה)' : 'תצוגה מקוצרת ללא עומס'}</span>
            </button>

            {activeRole === 'landlord' && (
              <button
                onClick={onOpenSubscriptionModal}
                className="hidden sm:flex text-blue-700 hover:text-blue-900 font-medium items-center gap-1 hover:underline"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>מנוי שנתי (12 תשלומים)</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
