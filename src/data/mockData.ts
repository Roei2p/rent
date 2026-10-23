import {
  Property,
  LandlordProfile,
  TenantProfile,
  UtilityRecord,
  PaymentRecord,
  FaultTicket,
  ServiceProvider,
  ChatMessage,
  TrustScoreBreakdown
} from '../types';

export const INITIAL_LANDLORD: LandlordProfile = {
  id: 'll-101',
  name: 'רונן אברהמי',
  roleType: 'owner',
  roleTypeHebrew: 'משכיר בעל הנכס',
  email: 'ronen.avrahami@gmail.com',
  phone: '054-8899210',
  nationalId: '028475918',
  avatar: '/src/assets/images/landlord_avatar_1792744816551.jpg',
  trustScore: 98,
  annualSubscriptionActive: true,
  annualPlanTier: 'RentShield Pro (12 תשלומים רציפים)',
  subscriptionRenewalDate: '2027-01-01',
  managedPropertiesCount: 3
};

export const INITIAL_TENANT: TenantProfile = {
  id: 'tn-202',
  name: 'יונתן ומיכל לוי',
  email: 'yonatan.levy@techmail.co.il',
  phone: '052-4433190',
  nationalId: '314987621',
  birthDate: '1996-10-27', // Birthday in 4 days! Perfect for testing birthday tracking feature
  avatar: '/src/assets/images/tenant_avatar_1792744816573.jpg',
  occupation: 'מהנדס תוכנה בכיר',
  employer: 'חברת הייטק בתל אביב',
  monthlyIncome: 28500,
  guarantorName: 'ישראל לוי (ערב ראשי)',
  trustScore: 96,
  isVerified: true
};

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'דירת 4 חדרים יוקרתית + מרפסת שמש',
    address: 'דיזנגוף 142, תל אביב-יפו',
    city: 'תל אביב-יפו',
    neighborhood: 'לב העיר - צפון ישן',
    rooms: 4,
    sizeM2: 105,
    floor: 4,
    monthlyRent: 8400,
    landlordId: 'll-101',
    currentTenantId: 'tn-202',
    image: '/src/assets/images/tel_aviv_apartment_1792744816141.jpg',
    leaseStartDate: '2026-01-01',
    leaseEndDate: '2026-12-31',
    digitalGuaranteeAmount: 25200, // 3 months digital guarantee
    preferredProviders: {
      water: { name: 'יורם שמש (אינסטלציה מוסמכת)', phone: '050-5123456', company: 'שמש פתרונות מים' },
      electricity: { name: 'דניאל כהן (חשמלאי מוסמך)', phone: '052-6789123', company: 'כהן הנדסת חשמל' },
      hvac: { name: 'רועי קור (מיזוג אוויר)', phone: '053-9988771', company: 'קולטק מערכות אקלים' }
    }
  },
  {
    id: 'prop-2',
    title: 'דירת 3 חדרים משופצת אדריכלית',
    address: 'שדרות רוטשילד 88, תל אביב-יפו',
    city: 'תל אביב-יפו',
    neighborhood: 'לב העיר',
    rooms: 3,
    sizeM2: 78,
    floor: 2,
    monthlyRent: 7900,
    landlordId: 'll-101',
    currentTenantId: 'tn-202',
    image: '/src/assets/images/property_kitchen_1792744815846.jpg',
    leaseStartDate: '2025-08-01',
    leaseEndDate: '2026-07-31',
    digitalGuaranteeAmount: 23700,
    preferredProviders: {
      water: { name: 'יורם שמש (אינסטלציה מוסמכת)', phone: '050-5123456', company: 'שמש פתרונות מים' }
    }
  },
  {
    id: 'prop-3',
    title: 'דירת גן 5 חדרים שקטה',
    address: 'רחוב אחוזה 45, רעננה',
    city: 'רעננה',
    neighborhood: 'מרכז העיר השקט',
    rooms: 5,
    sizeM2: 135,
    floor: 0,
    monthlyRent: 9200,
    landlordId: 'll-101',
    currentTenantId: 'tn-202',
    image: '/src/assets/images/tel_aviv_apartment_1792744816141.jpg',
    leaseStartDate: '2026-03-01',
    leaseEndDate: '2027-02-28',
    digitalGuaranteeAmount: 27600,
    preferredProviders: {}
  }
];

export const INITIAL_UTILITIES: UtilityRecord[] = [
  {
    id: 'util-1',
    propertyId: 'prop-1',
    type: 'electric',
    typeName: 'חשמל',
    providerName: 'חברת החשמל לישראל (חח"י)',
    billingPeriod: 'ספטמבר - אוקטובר 2026',
    amount: 485,
    dueDate: '2026-10-28',
    status: 'paid',
    receiptNumber: 'IEC-9844210',
    receiptUrl: 'https://iec.co.il/receipt/mock-9844210.pdf',
    lastVerifiedAt: '2026-10-22 14:30',
    apiVerified: true
  },
  {
    id: 'util-2',
    propertyId: 'prop-1',
    type: 'arnona',
    typeName: 'ארנונה',
    providerName: 'עיריית תל אביב-יפו',
    billingPeriod: 'ספטמבר - אוקטובר 2026',
    amount: 890,
    dueDate: '2026-10-31',
    status: 'paid',
    receiptNumber: 'TLV-MUNI-65419',
    receiptUrl: 'https://tel-aviv.gov.il/arnona/mock-65419.pdf',
    lastVerifiedAt: '2026-10-20 09:15',
    apiVerified: true
  },
  {
    id: 'util-3',
    propertyId: 'prop-1',
    type: 'gas',
    typeName: 'גז מרכזי',
    providerName: 'פזגז ישראל',
    billingPeriod: 'אוגוסט - ספטמבר 2026',
    amount: 112,
    dueDate: '2026-10-25',
    status: 'paid',
    receiptNumber: 'PZ-332190',
    receiptUrl: 'https://pazgas.co.il/receipt/mock-332190.pdf',
    lastVerifiedAt: '2026-10-18 11:00',
    apiVerified: true
  },
  {
    id: 'util-4',
    propertyId: 'prop-1',
    type: 'committee',
    typeName: 'ועד בית',
    providerName: 'נציגות הבית המשותף (דיזנגוף 142)',
    billingPeriod: 'אוקטובר 2026',
    amount: 350,
    dueDate: '2026-10-10',
    status: 'paid',
    receiptNumber: 'VAAD-OCT-2026-14',
    receiptUrl: 'https://vaad.rentshield.co.il/receipt/mock-vaad-14.pdf',
    lastVerifiedAt: '2026-10-10 18:20',
    apiVerified: false
  }
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-1',
    propertyId: 'prop-1',
    monthName: 'ינואר',
    year: 2026,
    amount: 8400,
    dueDate: '2026-01-01',
    paidDate: '2026-01-01',
    status: 'paid',
    referenceNumber: 'RS-PAY-2026-01',
    paymentMethod: 'העברה בנקאית ישירה (RentShield Direct)'
  },
  {
    id: 'pay-2',
    propertyId: 'prop-1',
    monthName: 'פברואר',
    year: 2026,
    amount: 8400,
    dueDate: '2026-02-01',
    paidDate: '2026-02-01',
    status: 'paid',
    referenceNumber: 'RS-PAY-2026-02',
    paymentMethod: 'העברה בנקאית ישירה (RentShield Direct)'
  },
  {
    id: 'pay-3',
    propertyId: 'prop-1',
    monthName: 'מרץ',
    year: 2026,
    amount: 8400,
    dueDate: '2026-03-01',
    paidDate: '2026-03-01',
    status: 'paid',
    referenceNumber: 'RS-PAY-2026-03',
    paymentMethod: 'העברה בנקאית ישירה (RentShield Direct)'
  },
  {
    id: 'pay-4',
    propertyId: 'prop-1',
    monthName: 'אפריל',
    year: 2026,
    amount: 8400,
    dueDate: '2026-04-01',
    paidDate: '2026-04-01',
    status: 'paid',
    referenceNumber: 'RS-PAY-2026-04',
    paymentMethod: 'העברה בנקאית ישירה (RentShield Direct)'
  },
  {
    id: 'pay-5',
    propertyId: 'prop-1',
    monthName: 'מאי',
    year: 2026,
    amount: 8400,
    dueDate: '2026-05-01',
    paidDate: '2026-05-01',
    status: 'paid',
    referenceNumber: 'RS-PAY-2026-05',
    paymentMethod: 'העברה בנקאית ישירה (RentShield Direct)'
  },
  {
    id: 'pay-6',
    propertyId: 'prop-1',
    monthName: 'יוני',
    year: 2026,
    amount: 8400,
    dueDate: '2026-06-01',
    paidDate: '2026-06-01',
    status: 'paid',
    referenceNumber: 'RS-PAY-2026-06',
    paymentMethod: 'העברה בנקאית ישירה (RentShield Direct)'
  },
  {
    id: 'pay-7',
    propertyId: 'prop-1',
    monthName: 'יולי',
    year: 2026,
    amount: 8400,
    dueDate: '2026-07-01',
    paidDate: '2026-07-01',
    status: 'paid',
    referenceNumber: 'RS-PAY-2026-07',
    paymentMethod: 'העברה בנקאית ישירה (RentShield Direct)'
  },
  {
    id: 'pay-8',
    propertyId: 'prop-1',
    monthName: 'אוגוסט',
    year: 2026,
    amount: 8400,
    dueDate: '2026-08-01',
    paidDate: '2026-08-01',
    status: 'paid',
    referenceNumber: 'RS-PAY-2026-08',
    paymentMethod: 'העברה בנקאית ישירה (RentShield Direct)'
  },
  {
    id: 'pay-9',
    propertyId: 'prop-1',
    monthName: 'ספטמבר',
    year: 2026,
    amount: 8400,
    dueDate: '2026-09-01',
    paidDate: '2026-09-01',
    status: 'paid',
    referenceNumber: 'RS-PAY-2026-09',
    paymentMethod: 'העברה בנקאית ישירה (RentShield Direct)'
  },
  {
    id: 'pay-10',
    propertyId: 'prop-1',
    monthName: 'אוקטובר (חודש נוכחי)',
    year: 2026,
    amount: 8400,
    dueDate: '2026-10-01',
    paidDate: '2026-10-01',
    status: 'paid',
    referenceNumber: 'RS-PAY-2026-10',
    paymentMethod: 'העברה בנקאית ישירה (RentShield Direct)'
  },
  {
    id: 'pay-11',
    propertyId: 'prop-1',
    monthName: 'נובמבר (עתידי)',
    year: 2026,
    amount: 8400,
    dueDate: '2026-11-01',
    status: 'pending',
    referenceNumber: 'RS-SCHED-2026-11',
    paymentMethod: 'חיוב מתוזמן בהוראת קבע'
  },
  {
    id: 'pay-12',
    propertyId: 'prop-1',
    monthName: 'דצמבר (עתידי)',
    year: 2026,
    amount: 8400,
    dueDate: '2026-12-01',
    status: 'pending',
    referenceNumber: 'RS-SCHED-2026-12',
    paymentMethod: 'חיוב מתוזמן בהוראת קבע'
  }
];

export const VETTED_PROVIDERS: ServiceProvider[] = [
  {
    id: 'pro-1',
    name: 'יורם שמש - אינסטלציה מוסמכת',
    phone: '050-5123456',
    category: 'water',
    categoryHebrew: 'נזקי מים ואינסטלציה',
    rating: 4.95,
    completedJobs: 342,
    hourlyRate: 380,
    availableNow: true,
    isLandlordPreferred: true
  },
  {
    id: 'pro-2',
    name: 'דניאל כהן - הנדסת חשמל',
    phone: '052-6789123',
    category: 'electricity',
    categoryHebrew: 'חשמל ותאורה',
    rating: 4.9,
    completedJobs: 198,
    hourlyRate: 350,
    availableNow: true,
    isLandlordPreferred: true
  },
  {
    id: 'pro-3',
    name: 'גל בינוי ושיפוצים מבית מדרג',
    phone: '054-3322114',
    category: 'structure',
    categoryHebrew: 'מבנה, דלתות וחלונות',
    rating: 4.85,
    completedJobs: 114,
    hourlyRate: 420,
    availableNow: false
  },
  {
    id: 'pro-4',
    name: 'אביב מערכות מיזוג וקירור',
    phone: '053-1122339',
    category: 'hvac',
    categoryHebrew: 'מיזוג אוויר ואוורור',
    rating: 4.88,
    completedJobs: 260,
    hourlyRate: 360,
    availableNow: true
  },
  {
    id: 'pro-5',
    name: 'מומחי המרזב והאיטום תל אביב',
    phone: '050-9988112',
    category: 'water',
    categoryHebrew: 'נזקי מים ואיטום',
    rating: 4.82,
    completedJobs: 87,
    hourlyRate: 400,
    availableNow: true
  }
];

export const INITIAL_FAULT_TICKETS: FaultTicket[] = [
  {
    id: 'tkt-1',
    propertyId: 'prop-1',
    category: 'water',
    categoryHebrew: 'נזקי מים ואינסטלציה',
    title: 'טפטוף בברז המטבח המרכזי מתחת לכיור',
    description: 'הבחנתי בטפטוף איטי מתחת לכיור המטבח באזור הצינור הגמיש של המים החמים. הארון מעט לח.',
    urgency: 'minor',
    urgencyHebrew: 'תקלה קטנה (עד 14 ימי עסקים)',
    maxSlaDays: 14,
    status: 'resolved',
    createdAt: '2026-10-15 10:20',
    slaDeadline: '2026-10-29 10:20',
    openedByRole: 'tenant',
    assignedProvider: {
      id: 'pro-1',
      name: 'יורם שמש (איש מקצוע קבוע מוגדר ע״י המשכיר)',
      phone: '050-5123456',
      isLandlordPreferred: true,
      cost: 420,
      paidBy: 'landlord'
    },
    photos: ['/src/assets/images/property_kitchen_1792744815846.jpg'],
    review: {
      id: 'rev-1',
      rating: 4, // Trigger 72h appeal demonstration!
      comment: 'השרברב יורם הגיע תוך יומיים ותיקן את הנזילה בצורה מקצועית, אך השאיר מעט לכלוך בארון ולא החליף את הגומיה המשנית.',
      authorRole: 'tenant',
      createdAt: '2026-10-22 18:00',
      appealStatus: 'in_appeal',
      appealDeadline: '2026-10-25 18:00', // active 72h window!
      providerResponse: 'שלום מיכל, מתנצל על אי הנוחות. אשמח להגיע מחר לנקות את הארון ולהחליף את הגומיה ללא תוספת תשלום, על מנת שתהיי מרוצה ב-100%.',
      compensationOffered: 'ביקור חוזר חינם לניקוי והחלפת גומיה + 10% זיכוי'
    }
  },
  {
    id: 'tkt-2',
    propertyId: 'prop-1',
    category: 'electricity',
    categoryHebrew: 'חשמל ותאורה',
    title: 'קפיצת פקק תאורה בסלון הדירה',
    description: 'ממסר הפחת או הפקק של תאורת הסלון קופץ לסירוגין כאשר מדליקים את תאורת האווירה השקועה.',
    urgency: 'substantial',
    urgencyHebrew: 'תקלה מהותית (עד 3 ימים)',
    maxSlaDays: 3,
    status: 'in_progress',
    createdAt: '2026-10-22 09:30',
    slaDeadline: '2026-10-25 09:30',
    openedByRole: 'tenant',
    assignedProvider: {
      id: 'pro-2',
      name: 'דניאל כהן (חשמלאי מוסמך מוגדר)',
      phone: '052-6789123',
      isLandlordPreferred: true
    },
    photos: []
  }
];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'msg-1',
    propertyId: 'prop-1',
    senderRole: 'landlord',
    senderName: 'רונן (משכיר)',
    text: 'שלום יונתן ומיכל, תודה על תשלום שכר הדירה לחודש אוקטובר שהתקבל במלואו בזמן. שיהיה חודש מצוין!',
    timestamp: '2026-10-01 11:15',
    legalHash: 'SHA256-4c8a91be3048fa...'
  },
  {
    id: 'msg-2',
    propertyId: 'prop-1',
    senderRole: 'tenant',
    senderName: 'יונתן לוי (שוכר)',
    text: 'תודה רבה רונן! העברנו גם את חשבונות החשמל והארנונה של חודש אוגוסט-ספטמבר, האסמכתאות מעודכנות במערכת.',
    timestamp: '2026-10-01 12:40',
    legalHash: 'SHA256-91e8bc210087da...'
  },
  {
    id: 'msg-3',
    propertyId: 'prop-1',
    senderRole: 'tenant',
    senderName: 'מיכל לוי (שוכרת)',
    text: 'היי רונן, פתחנו קריאה לגבי טפטוף קטן מתחת לכיור במטבח. ראינו שיורם שמש הוא האינסטלטור המוגדר מטעמך ופנינו אליו ישירות.',
    timestamp: '2026-10-15 10:25',
    imageUrl: '/src/assets/images/property_kitchen_1792744815846.jpg',
    legalHash: 'SHA256-ba102ef76c1149...'
  },
  {
    id: 'msg-4',
    propertyId: 'prop-1',
    senderRole: 'landlord',
    senderName: 'רונן (משכיר)',
    text: 'מצוין, יורם תואם והחשבונית שולמה על ידי. כל תיקון נזילות ואינסטלציה שוטפת הוא באחריותי המלאה כמסוכם בחוזה השכירות.',
    timestamp: '2026-10-17 14:10',
    legalHash: 'SHA256-e9102c771340aa...'
  }
];

export const TRUST_SCORE_BREAKDOWN_TENANT: TrustScoreBreakdown[] = [
  {
    category: 'מוסר תשלומים ודיוק במועדים',
    weight: 35,
    score: 100,
    details: '10/10 תשלומי שכירות שולמו ב-1 לחודש בדיוק ללא יום פיגור אחד.'
  },
  {
    category: 'תשלומי תשתית ורשויות (חשמל, ארנונה, גז, ועד)',
    weight: 25,
    score: 98,
    details: 'כל החשבונות שולמו במועדם ואומתו מול חח"י ועיריית תל אביב.'
  },
  {
    category: 'שמירה על הנכס והתנהלות סבירה',
    weight: 20,
    score: 95,
    details: 'דיווח מיידי על תקלות, שימוש באנשי מקצוע מורשים, אפס נזקי רשלנות.'
  },
  {
    category: 'אמינות, ערבויות ואימות זהות',
    weight: 10,
    score: 100,
    details: 'ערבות דיגיטלית מאושרת ע״י שובר בנקאי מאומת, זיהוי ת.ז ותלושי שכר.'
  },
  {
    category: 'תרבות שיח ותקשורת מכבדת בצ׳אט',
    weight: 10,
    score: 96,
    details: 'התכתבות עניינית ומכבדת, אפס סכסוכים או התראות משפטיות.'
  }
];

export const TRUST_SCORE_BREAKDOWN_LANDLORD: TrustScoreBreakdown[] = [
  {
    category: 'עמידה בלוחות זמנים לתיקון תקלות (SLA)',
    weight: 35,
    score: 98,
    details: 'טיפול ממוצע תוך 2.1 ימים בתקלות מהותיות (יעד החוזה: עד 3 ימים).'
  },
  {
    category: 'העמדת אנשי מקצוע מוסמכים וכיסוי עלויות',
    weight: 25,
    score: 100,
    details: 'איש מקצוע קבוע מוגדר לכל תחום, כיסוי מלא של בלאי סביר ללא עיכובים.'
  },
  {
    category: 'שקיפות ויושרה חוזית',
    weight: 20,
    score: 97,
    details: 'חוזה שכירות סטנדרטי לפי חוק השכירות והשאילה, ללא דרישות פיצוי מופרזות.'
  },
  {
    category: 'כיבוד פרטיות השוכר',
    weight: 10,
    score: 100,
    details: 'תיאום ביקורים מראש של 48 שעות לפחות, ללא כניסה ללא רשות.'
  },
  {
    category: 'התנהלות מכבדת בפתרון מחלוקות',
    weight: 10,
    score: 96,
    details: 'נכונות להידברות במסגרת 72 שעות הערעור, שיח פורה.'
  }
];

export const MARKET_COMPARISON_DATA = {
  currentProperty: {
    address: 'דיזנגוף 142, תל אביב-יפו',
    rooms: 4,
    sizeM2: 105,
    rent: 8400,
    pricePerM2: 80,
    yieldEst: '3.1%'
  },
  neighborhood: {
    name: 'לב העיר - צפון ישן (תל אביב)',
    avgRent: 8650,
    avgPricePerM2: 82.5,
    rentChangeYear: '+3.4%',
    demandLevel: 'גבוהה מאוד (זמן השכרה ממוצע: 11 ימים)'
  },
  territory: {
    name: 'אזור תל אביב מרכז וגוש דן',
    avgRent: 7800,
    avgPricePerM2: 74.2,
    rentChangeYear: '+2.8%',
    demandLevel: 'גבוהה'
  },
  city: {
    name: 'כלל העיר תל אביב-יפו',
    avgRent: 7450,
    avgPricePerM2: 71.0,
    rentChangeYear: '+2.1%',
    demandLevel: 'יציבה'
  },
  historicalTrend: [
    { month: 'נוב 25', current: 8200, neighborhood: 8350, city: 7200 },
    { month: 'דצמ 25', current: 8200, neighborhood: 8400, city: 7250 },
    { month: 'ינו 26', current: 8400, neighborhood: 8450, city: 7300 },
    { month: 'פבר 26', current: 8400, neighborhood: 8500, city: 7320 },
    { month: 'מרץ 26', current: 8400, neighborhood: 8520, city: 7350 },
    { month: 'אפר 26', current: 8400, neighborhood: 8550, city: 7380 },
    { month: 'מאי 26', current: 8400, neighborhood: 8580, city: 7400 },
    { month: 'יונ 26', current: 8400, neighborhood: 8600, city: 7420 },
    { month: 'יול 26', current: 8400, neighborhood: 8620, city: 7440 },
    { month: 'אוג 26', current: 8400, neighborhood: 8650, city: 7450 },
    { month: 'ספט 26', current: 8400, neighborhood: 8650, city: 7450 },
    { month: 'אוק 26', current: 8400, neighborhood: 8650, city: 7450 }
  ],
  reliableSources: [
    { name: 'מאגר נדל"ן ממשלתי ורשות המסים', description: 'דיווח עסקאות אמת מחייב בדיווח חוזים' },
    { name: 'הלשכה המרכזית לסטטיסטיקה (הלמ"ס)', description: 'מדד מחירי שירותי דיור בבעלות הדיירים ושכר דירה חודשי' },
    { name: 'מדד מדלן ולוחות הנדל"ן המובילים', description: 'ניתוח היצע וביקוש מקומי לפי רחוב וקומפלקס מגורים' }
  ]
};
