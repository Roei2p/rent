export type UserRole = 'landlord' | 'tenant';

export type FaultCategory = 'water' | 'structure' | 'electricity' | 'hvac' | 'other';
export type FaultUrgency = 'minor' | 'substantial' | 'emergency';
export type FaultStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface ServiceProvider {
  id: string;
  name: string;
  phone: string;
  category: FaultCategory;
  categoryHebrew: string;
  rating: number;
  completedJobs: number;
  hourlyRate: number;
  availableNow: boolean;
  isLandlordPreferred?: boolean;
}

export interface FaultReview {
  id: string;
  rating: number; // 1-5
  comment: string; // min 50 characters
  authorRole: 'tenant' | 'landlord';
  createdAt: string;
  appealStatus: 'none' | 'in_appeal' | 'resolved_appeal' | 'expired';
  appealDeadline?: string; // 72 hours from createdAt
  providerResponse?: string;
  compensationOffered?: string;
}

export interface FaultTicket {
  id: string;
  propertyId: string;
  category: FaultCategory;
  categoryHebrew: string;
  title: string;
  description: string;
  urgency: FaultUrgency;
  urgencyHebrew: string;
  maxSlaDays: number;
  status: FaultStatus;
  createdAt: string;
  slaDeadline: string;
  openedByRole: 'tenant' | 'landlord';
  assignedProvider?: {
    id: string;
    name: string;
    phone: string;
    isLandlordPreferred: boolean;
    cost?: number;
    paidBy?: 'landlord' | 'tenant';
  };
  photos: string[];
  review?: FaultReview;
}

export interface UtilityRecord {
  id: string;
  propertyId: string;
  type: 'electric' | 'arnona' | 'gas' | 'committee';
  typeName: string;
  providerName: string;
  billingPeriod: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  receiptNumber?: string;
  receiptUrl?: string;
  lastVerifiedAt?: string;
  apiVerified?: boolean;
}

export interface PaymentRecord {
  id: string;
  propertyId: string;
  monthName: string;
  year: number;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue';
  referenceNumber: string;
  receiptUrl?: string;
  paymentMethod: string;
}

export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  neighborhood: string;
  rooms: number;
  sizeM2: number;
  floor: number;
  monthlyRent: number;
  landlordId: string;
  currentTenantId: string;
  image: string;
  leaseStartDate: string;
  leaseEndDate: string;
  digitalGuaranteeAmount: number;
  preferredProviders: {
    water?: { name: string; phone: string; company: string };
    electricity?: { name: string; phone: string; company: string };
    structure?: { name: string; phone: string; company: string };
    hvac?: { name: string; phone: string; company: string };
  };
}

export interface LandlordProfile {
  id: string;
  name: string;
  roleType: 'owner' | 'manager' | 'broker' | 'lawyer';
  roleTypeHebrew: string;
  email: string;
  phone: string;
  nationalId: string;
  avatar: string;
  trustScore: number;
  annualSubscriptionActive: boolean;
  annualPlanTier: string;
  subscriptionRenewalDate: string;
  managedPropertiesCount: number;
}

export interface TenantProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationalId: string;
  birthDate: string; // for birthday tracking
  avatar: string;
  occupation: string;
  employer: string;
  monthlyIncome: number;
  guarantorName: string;
  trustScore: number;
  isVerified: boolean;
}

export interface ChatMessage {
  id: string;
  propertyId: string;
  senderRole: 'landlord' | 'tenant';
  senderName: string;
  text: string;
  imageUrl?: string;
  timestamp: string;
  legalHash: string;
}

export interface TrustScoreBreakdown {
  category: string;
  weight: number;
  score: number;
  details: string;
}
