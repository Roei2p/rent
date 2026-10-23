import React, { useState } from 'react';
import { UserRole, LandlordProfile, TenantProfile, Property } from '../types';
import {
  User,
  Building2,
  Phone,
  Mail,
  Cake,
  ShieldCheck,
  CheckCircle2,
  Info,
  Calendar,
  Briefcase,
  FileCheck
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  landlord: LandlordProfile;
  tenant: TenantProfile;
  properties: Property[];
  onUpdateLandlord: (updated: LandlordProfile) => void;
  onUpdateTenant: (updated: TenantProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  activeRole,
  onRoleChange,
  landlord,
  tenant,
  properties,
  onUpdateLandlord,
  onUpdateTenant
}) => {
  const [selectedTab, setSelectedTab] = useState<UserRole>(activeRole);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states for tenant
  const [tenantName, setTenantName] = useState(tenant.name);
  const [tenantEmail, setTenantEmail] = useState(tenant.email);
  const [tenantPhone, setTenantPhone] = useState(tenant.phone);
  const [tenantBirthDate, setTenantBirthDate] = useState(tenant.birthDate);
  const [tenantId, setTenantId] = useState(tenant.nationalId);
  const [tenantOccupation, setTenantOccupation] = useState(tenant.occupation);
  const [tenantIncome, setTenantIncome] = useState(tenant.monthlyIncome);

  // Form states for landlord
  const [landlordName, setLandlordName] = useState(landlord.name);
  const [landlordEmail, setLandlordEmail] = useState(landlord.email);
  const [landlordPhone, setLandlordPhone] = useState(landlord.phone);
  const [landlordRoleType, setLandlordRoleType] = useState(landlord.roleType);
  const [landlordId, setLandlordId] = useState(landlord.nationalId);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTab === 'tenant') {
      onUpdateTenant({
        ...tenant,
        name: tenantName,
        email: tenantEmail,
        phone: tenantPhone,
        birthDate: tenantBirthDate,
        nationalId: tenantId,
        occupation: tenantOccupation,
        monthlyIncome: tenantIncome
      });
    } else {
      const roleTitles: Record<string, string> = {
        owner: 'משכיר בעל הנכס',
        manager: 'מנהל נכסים מוסמך',
        broker: 'מתווך מורשה',
        lawyer: 'עורך דין מייצג'
      };
      onUpdateLandlord({
        ...landlord,
        name: landlordName,
        email: landlordEmail,
        phone: landlordPhone,
        roleType: landlordRoleType,
        roleTypeHebrew: roleTitles[landlordRoleType] || 'משכיר בעל הנכס',
        nationalId: landlordId
      });
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                ניהול פרופיל משתמש והגדרות חשבון
              </h2>
              <p className="text-xs text-slate-500">
                איסוף נתוני התקשרות חובה, תאריך לידה למעקב וזיהוי מאומת
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

        {/* Tab switch */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setSelectedTab('landlord')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              selectedTab === 'landlord'
                ? 'bg-white text-blue-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>פרופיל משכיר / מנהל נכס ({landlord.name})</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab('tenant')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              selectedTab === 'tenant'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>פרופיל שוכר ({tenant.name})</span>
          </button>
        </div>

        {/* Save confirmation */}
        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>פרטי הפרופיל עודכנו בהצלחה במערכת!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          
          {selectedTab === 'tenant' ? (
            /* Tenant Form */
            <div className="space-y-4">
              
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <img
                  src={tenant.avatar}
                  alt={tenant.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-300"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="font-bold text-sm text-slate-900">{tenant.name}</div>
                  <div className="text-[11px] text-slate-500">שוכר מאומת · ציון יושר {tenant.trustScore}/100</div>
                  <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                    ערבות דיגיטלית מאושרת על סך ₪25,200
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    שם פרטי ומשפחה (חובה):
                  </label>
                  <input
                    type="text"
                    required
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    מספר תעודת זהות (חובה):
                  </label>
                  <input
                    type="text"
                    required
                    value={tenantId}
                    onChange={(e) => setTenantId(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    מספר טלפון נייד (חובה):
                  </label>
                  <input
                    type="tel"
                    required
                    value={tenantPhone}
                    onChange={(e) => setTenantPhone(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    כתובת דואר אלקטרוני (חובה):
                  </label>
                  <input
                    type="email"
                    required
                    value={tenantEmail}
                    onChange={(e) => setTenantEmail(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>

                {/* Date of Birth - highlighted in brief for birthday tracking */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <Cake className="w-3.5 h-3.5 text-amber-500" />
                    <span>תאריך לידה מלא (חובה - לצורך מעקב יום הולדת):</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={tenantBirthDate}
                    onChange={(e) => setTenantBirthDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    עיסוק ומקום עבודה:
                  </label>
                  <input
                    type="text"
                    value={tenantOccupation}
                    onChange={(e) => setTenantOccupation(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

            </div>
          ) : (
            /* Landlord Form */
            <div className="space-y-4">
              
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <img
                  src={landlord.avatar}
                  alt={landlord.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-300"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="font-bold text-sm text-slate-900">{landlord.name}</div>
                  <div className="text-[11px] text-slate-500">{landlord.roleTypeHebrew} · מנהל {properties.length} נכסים</div>
                  <div className="text-[11px] text-blue-700 font-semibold mt-0.5">
                    מנוי שנתי Pro פעיל (12 תשלומים רציפים)
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    שם מלא (משכיר / מנהל):
                  </label>
                  <input
                    type="text"
                    required
                    value={landlordName}
                    onChange={(e) => setLandlordName(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    סוג הגורם המשכיר:
                  </label>
                  <select
                    value={landlordRoleType}
                    onChange={(e) => setLandlordRoleType(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="owner">משכיר בעל הנכס</option>
                    <option value="manager">מנהל נכסים מקצועי</option>
                    <option value="broker">מתווך נדל"ן מורשה</option>
                    <option value="lawyer">עורך דין המייצג בעלים</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    מספר טלפון:
                  </label>
                  <input
                    type="tel"
                    required
                    value={landlordPhone}
                    onChange={(e) => setLandlordPhone(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    דואר אלקטרוני:
                  </label>
                  <input
                    type="email"
                    required
                    value={landlordEmail}
                    onChange={(e) => setLandlordEmail(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    תעודת זהות / ח.פ:
                  </label>
                  <input
                    type="text"
                    required
                    value={landlordId}
                    onChange={(e) => setLandlordId(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    נכסים מנוהלים תחת פרופיל האב:
                  </label>
                  <div className="p-2.5 bg-slate-100 rounded-xl font-bold text-slate-800">
                    {properties.length} נכסים (תל אביב, רעננה)
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Security & Verification Advisory */}
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-[11px] text-blue-950 space-y-1">
            <strong className="text-xs font-black text-blue-900 block">הנחיית אבטחה ורישום משתמשים:</strong>
            <p className="leading-relaxed font-medium">
              פרופיל המשכיר מאפשר ניהול מספר נכסים תחת חשבון אב מוסמך אחד (כולל תמיכה במנהל נכס, מתווך או עו"ד). פרופיל השוכר כולל תאריך לידה לצורך מעקב יום הולדת, פרטי ערבות מאושרים ותעודת יושר רשמית לשכירות בטוחה.
            </p>
          </div>

          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-700 hover:bg-blue-800 text-white font-black text-xs rounded-xl transition-colors shadow-xs"
            >
              שמור שינויים בפרופיל
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
            >
              ביטול
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
