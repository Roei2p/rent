import React, { useState } from 'react';
import {
  UserRole,
  Property,
  LandlordProfile,
  TenantProfile,
  UtilityRecord,
  PaymentRecord,
  FaultTicket,
  ChatMessage
} from './types';
import {
  INITIAL_LANDLORD,
  INITIAL_TENANT,
  INITIAL_PROPERTIES,
  INITIAL_UTILITIES,
  INITIAL_PAYMENTS,
  INITIAL_FAULT_TICKETS,
  INITIAL_CHAT,
  VETTED_PROVIDERS
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { FaultsAndMaintenance } from './components/FaultsAndMaintenance';
import { PaymentsLedger } from './components/PaymentsLedger';
import { MarketTrendsModal } from './components/MarketTrendsModal';
import { TrustCertificateModal } from './components/TrustCertificateModal';
import { InternalChatModal } from './components/InternalChatModal';
import { AnnualSubscriptionModal } from './components/AnnualSubscriptionModal';
import { UserProfileModal } from './components/UserProfileModal';
import { HyperFramesPlayer } from './components/HyperFramesPlayer';
import { ShieldCheck, Building2, User, HelpCircle, Sparkles } from 'lucide-react';

export default function App() {
  // Global States
  const [activeRole, setActiveRole] = useState<UserRole>('landlord');
  const [activeTab, setActiveTab] = useState<'overview' | 'faults' | 'payments'>('overview');
  const [isFocusMode, setIsFocusMode] = useState(false);
  
  // Data States
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState<Property>(INITIAL_PROPERTIES[0]);
  const [landlord, setLandlord] = useState<LandlordProfile>(INITIAL_LANDLORD);
  const [tenant, setTenant] = useState<TenantProfile>(INITIAL_TENANT);
  const [utilities, setUtilities] = useState<UtilityRecord[]>(INITIAL_UTILITIES);
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [faultTickets, setFaultTickets] = useState<FaultTicket[]>(INITIAL_FAULT_TICKETS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);

  // Modal Visibility States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [isTrustOpen, setIsTrustOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBragReelOpen, setIsBragReelOpen] = useState(false);

  // Handlers
  const handleUpdateUtility = (updated: UtilityRecord) => {
    setUtilities((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const handleAddTicket = (ticket: FaultTicket) => {
    setFaultTickets((prev) => [ticket, ...prev]);
    // Also dispatch notification message to chat
    const newChatMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      propertyId: selectedProperty.id,
      senderRole: activeRole,
      senderName: activeRole === 'landlord' ? landlord.name : tenant.name,
      text: `נפתחה קריאת שירות חדשה במערכת: "${ticket.title}" (${ticket.urgencyHebrew}). התראה נשלחה למשכיר.`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      legalHash: `SHA256-auto-${Date.now().toString(16)}`
    };
    setChatMessages((prev) => [...prev, newChatMsg]);
  };

  const handleUpdateTicket = (ticket: FaultTicket) => {
    setFaultTickets((prev) => prev.map((t) => (t.id === ticket.id ? ticket : t)));
  };

  const handleSendMessage = (text: string, imageUrl?: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      propertyId: selectedProperty.id,
      senderRole: activeRole,
      senderName: activeRole === 'landlord' ? `${landlord.name} (משכיר)` : `${tenant.name} (שוכר)`,
      text,
      imageUrl,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      legalHash: `SHA256-${Math.random().toString(36).substring(2, 10)}${Date.now().toString(16)}`
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans" dir="rtl">
      
      {/* 3-Zone Standard Top Navigation with Focus & Brag Reel */}
      <Navbar
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        activeTab={activeTab}
        onTabChange={(tab: any) => setActiveTab(tab)}
        properties={properties}
        selectedProperty={selectedProperty}
        onSelectProperty={setSelectedProperty}
        landlord={landlord}
        tenant={tenant}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenTrustModal={() => setIsTrustOpen(true)}
        onOpenMarketModal={() => setIsMarketOpen(true)}
        onOpenProfileModal={() => setIsProfileOpen(true)}
        onOpenSubscriptionModal={() => setIsSubscriptionOpen(true)}
        onOpenBragReel={() => setIsBragReelOpen(true)}
        isFocusMode={isFocusMode}
        onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Role Banner / Context Indicator */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
              activeRole === 'landlord'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-emerald-100 text-emerald-700'
            }`}>
              {activeRole === 'landlord' ? <Building2 className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">תצוגת מערכת פעילה:</span>
                <span className="text-sm font-bold text-slate-900">
                  {activeRole === 'landlord' ? 'משכיר / מנהל נכס (רונן אברהמי)' : 'שוכר הנכס (יונתן לוי)'}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  activeRole === 'landlord' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {activeRole === 'landlord' ? 'ניהול 3 נכסים' : 'דירה פעילה'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                ניתן לעבור בכל שלב בין תצוגת המשכיר לתצוגת השוכר כדי לבחון את מלוא התהליכים וההרשאות.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveRole(activeRole === 'landlord' ? 'tenant' : 'landlord')}
              className="text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors"
            >
              החלף ל{activeRole === 'landlord' ? 'שוכר' : 'משכיר'} ←
            </button>
          </div>
        </div>

        {/* Tab View Routing */}
        {activeTab === 'overview' && (
          <DashboardOverview
            activeRole={activeRole}
            property={selectedProperty}
            landlord={landlord}
            tenant={tenant}
            utilities={utilities}
            payments={payments}
            faults={faultTickets}
            onOpenChat={() => setIsChatOpen(true)}
            onOpenMarketModal={() => setIsMarketOpen(true)}
            onOpenTrustModal={() => setIsTrustOpen(true)}
            onNavigateToFaults={() => setActiveTab('faults')}
            onNavigateToPayments={() => setActiveTab('payments')}
            onUpdateUtility={handleUpdateUtility}
            isFocusMode={isFocusMode}
          />
        )}

        {activeTab === 'faults' && (
          <FaultsAndMaintenance
            activeRole={activeRole}
            property={selectedProperty}
            tickets={faultTickets}
            vettedProviders={VETTED_PROVIDERS}
            onAddTicket={handleAddTicket}
            onUpdateTicket={handleUpdateTicket}
            onOpenChat={() => setIsChatOpen(true)}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentsLedger
            payments={payments}
            property={selectedProperty}
            activeRole={activeRole}
          />
        )}

      </main>

      {/* Modals & Reel Player */}
      <HyperFramesPlayer
        isOpen={isBragReelOpen}
        onClose={() => setIsBragReelOpen(false)}
        property={selectedProperty}
        landlord={landlord}
        tenant={tenant}
      />

      <InternalChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        activeRole={activeRole}
        property={selectedProperty}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
      />

      <MarketTrendsModal
        isOpen={isMarketOpen}
        onClose={() => setIsMarketOpen(false)}
        property={selectedProperty}
      />

      <TrustCertificateModal
        isOpen={isTrustOpen}
        onClose={() => setIsTrustOpen(false)}
        activeRole={activeRole}
        landlord={landlord}
        tenant={tenant}
      />

      <AnnualSubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
        landlord={landlord}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        landlord={landlord}
        tenant={tenant}
        properties={properties}
        onUpdateLandlord={setLandlord}
        onUpdateTenant={setTenant}
      />

      {/* Footer adhering to anti-slop and clean design rules */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span className="font-bold text-slate-800">RentShield (רנטשילד)</span>
            <span>·</span>
            <span>פלטפורמה חכמה ומקיפה ליחסי שכירות בטוחים בישראל</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>מוסר תשלומים מאומת</span>
            <span>·</span>
            <span>ערבויות דיגיטליות</span>
            <span>·</span>
            <span>דירוג ספקים עם 72 שעות ערעור</span>
            <span>·</span>
            <span>תיעוד משפטי קביל</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
