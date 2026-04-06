/**
 * services.js — بيانات الخدمات الحكومية الثلاث الأساسية
 * مصنّفة حسب أحداث الحياة، ليس حسب الوزارات
 */

export const lifeEvents = [
  {
    id: 'identity',
    title: 'شؤون الهوية',
    icon: 'IdCard',
    color: '#1B4F72',
    services: [
      {
        id: 'renew-national-id',
        name: 'تجديد البطاقة الوطنية الموحدة',
        requiredDocs: [
          'صورة شخصية حديثة (خلفية بيضاء)',
          'البطاقة الوطنية القديمة',
          'شهادة الجنسية العراقية',
        ],
        estimatedTime: '7-10 أيام عمل',
        canBookOnline: true,
        systemStatus: 'يعمل',
        fee: '5,000 دينار',
        office: 'مديرية الأحوال المدنية',
        notes: 'يُنصح بالحضور صباحاً قبل الساعة 10',
        walkInReason: null,
        avgWaitMinutes: null,
      },
      {
        id: 'extract-birth-cert',
        name: 'استخراج شهادة الميلاد',
        requiredDocs: [
          'هوية أحد الوالدين',
          'وثيقة تسجيل المولود من المستشفى',
        ],
        estimatedTime: '3-5 أيام عمل',
        canBookOnline: false,
        systemStatus: 'يعمل',
        fee: '3,000 دينار',
        office: 'مديرية الأحوال المدنية',
        notes: null,
        walkInReason: 'يتطلب التحقق من سجلات الأحوال المدنية الورقية يدوياً',
        avgWaitMinutes: 40,
      },
    ],
  },
  {
    id: 'vehicles',
    title: 'شؤون المركبات',
    icon: 'Car',
    color: '#1A5276',
    services: [
      {
        id: 'renew-vehicle-card',
        name: 'تجديد بطاقة المركبة السنوية',
        requiredDocs: [
          'هوية المالك الوطنية',
          'وثيقة التأمين السارية',
          'شهادة فحص المركبة (فحص الكراج)',
          'بطاقة المركبة القديمة',
        ],
        estimatedTime: '2-3 أيام عمل',
        canBookOnline: false,
        systemStatus: 'يعمل',
        fee: '25,000 دينار',
        office: 'مديرية المرور العامة',
        notes: 'الفحص الميكانيكي يجب إجراؤه قبل التقديم',
        walkInReason: 'يتطلب فحصاً بصرياً للمركبة في الموقع قبل إصدار البطاقة',
        avgWaitMinutes: 60,
      },
      {
        id: 'renew-driving-license',
        name: 'تجديد رخصة القيادة',
        requiredDocs: [
          'الهوية الوطنية',
          'رخصة القيادة القديمة',
          'صورة شخصية حديثة',
          'فحص طبي من مستشفى حكومي',
        ],
        estimatedTime: '5-7 أيام عمل',
        canBookOnline: true,
        systemStatus: 'يعمل',
        fee: '15,000 دينار',
        office: 'مديرية المرور العامة',
        notes: 'الفحص الطبي يشمل فحص البصر',
        walkInReason: null,
        avgWaitMinutes: null,
      },
    ],
  },
  {
    id: 'retirement',
    title: 'التقاعد والرعاية',
    icon: 'Heart',
    color: '#1E8449',
    services: [
      {
        id: 'update-retirement-data',
        name: 'تحديث بيانات المتقاعد',
        requiredDocs: [
          'هوية المتقاعد الوطنية',
          'وثيقة التقاعد الأصلية',
          'شهادة الإقامة الحالية',
          'رقم الحساب المصرفي',
        ],
        estimatedTime: '5-7 أيام عمل',
        canBookOnline: true,
        systemStatus: 'يعمل',
        fee: 'مجاني',
        office: 'هيئة التقاعد الوطنية',
        notes: 'التحديث السنوي إلزامي للحفاظ على الراتب التقاعدي',
        walkInReason: null,
        avgWaitMinutes: null,
      },
    ],
  },
]
