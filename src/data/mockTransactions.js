/**
 * mockTransactions.js — بيانات تجريبية للمعاملات الحكومية
 * تُستخدم في Dashboard و Live Tracker
 * جميع البيانات بأسماء وأرقام عراقية واقعية
 */

export const mockUser = {
  name: 'أحمد محمد الربيعي',
  nationalId: '19870412****',
  avatar: null,
  governorate: 'البصرة',
}

export const mockDocuments = [
  {
    id: 'national-id',
    type: 'البطاقة الوطنية الموحدة',
    number: 'IQ-1987-****-0412',
    issueDate: '2019-03-15',
    expiryDate: '2026-03-15',
    status: 'expiring-soon', // valid | expiring-soon | expired
    daysLeft: 344,
    icon: 'IdCard',
  },
  {
    id: 'driving-license',
    type: 'رخصة القيادة',
    number: 'DL-BS-****-221',
    issueDate: '2021-06-01',
    expiryDate: '2025-06-01',
    status: 'expired',
    daysLeft: -305,
    icon: 'Car',
  },
  {
    id: 'vehicle-card',
    type: 'بطاقة المركبة',
    number: 'VC-52-****-7',
    issueDate: '2024-01-10',
    expiryDate: '2025-01-10',
    status: 'expired',
    daysLeft: -86,
    icon: 'Truck',
  },
]

export const mockTransactions = [
  {
    id: 'TXN-2025-BS-00441',
    type: 'تجديد البطاقة الوطنية الموحدة',
    submittedAt: '2025-03-20',
    lastUpdate: '2025-04-01',
    currentStep: 3,
    totalSteps: 5,
    status: 'in-progress',
    office: 'مديرية الأحوال المدنية — البصرة المركز',
    estimatedDays: 3,
    steps: [
      { label: 'تم استلام الطلب',         done: true,  date: '2025-03-20' },
      { label: 'قيد المراجعة الأولية',     done: true,  date: '2025-03-23' },
      { label: 'لدى الجهة المختصة',        done: false, date: null, current: true },
      { label: 'انتظار الموافقة النهائية', done: false, date: null },
      { label: 'جاهزة للاستلام',           done: false, date: null },
    ],
  },
  {
    id: 'TXN-2025-BS-00389',
    type: 'تجديد رخصة القيادة',
    submittedAt: '2025-03-28',
    lastUpdate: '2025-03-29',
    currentStep: 2,
    totalSteps: 5,
    status: 'in-progress',
    office: 'مديرية المرور العامة — البصرة',
    estimatedDays: 7,
    steps: [
      { label: 'تم استلام الطلب',         done: true,  date: '2025-03-28' },
      { label: 'قيد المراجعة الأولية',     done: false, date: null, current: true },
      { label: 'لدى الجهة المختصة',        done: false, date: null },
      { label: 'انتظار الموافقة النهائية', done: false, date: null },
      { label: 'جاهزة للاستلام',           done: false, date: null },
    ],
  },
]

export const mockAlerts = [
  {
    id: 'alert-1',
    severity: 'danger',
    title: 'رخصة القيادة منتهية',
    message: 'رخصة القيادة الخاصة بك منتهية منذ 305 يوم. التجديد إلزامي قانونياً.',
    action: 'تجديد الآن',
    actionPath: '/services',
    icon: 'AlertTriangle',
  },
  {
    id: 'alert-2',
    severity: 'danger',
    title: 'بطاقة المركبة منتهية',
    message: 'بطاقة مركبتك (52/****7) منتهية منذ 86 يوم.',
    action: 'تجديد بطاقة المركبة',
    actionPath: '/services',
    icon: 'AlertTriangle',
  },
  {
    id: 'alert-3',
    severity: 'warning',
    title: 'البطاقة الوطنية تقترب من الانتهاء',
    message: 'تنتهي صلاحية بطاقتك الوطنية خلال 344 يوم (مارس 2026). ابدأ التجديد مبكراً.',
    action: 'تذكيرني لاحقاً',
    actionPath: null,
    icon: 'Clock',
  },
  {
    id: 'alert-4',
    severity: 'info',
    title: 'تحديث على معاملة TXN-2025-BS-00441',
    message: 'انتقلت معاملتك إلى مرحلة "لدى الجهة المختصة". الوقت المتوقع 3 أيام عمل.',
    action: 'تتبع المعاملة',
    actionPath: '/tracker',
    icon: 'Info',
  },
]
