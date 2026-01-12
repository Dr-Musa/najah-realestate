
import { CategoryType, PropertyType, OperationType } from './types';

export const SAUDI_CITIES = [
  'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام',
  'الخبر', 'الظهران', 'الطائف', 'بريدة', 'عنيزة', 'حائل',
  'تبوك', 'أبها', 'خميس مشيط', 'نجران', 'جازان', 'الجبيل', 'الهفوف'
];

export const SAUDI_DISTRICTS: Record<string, string[]> = {
  'الرياض': [
    'حي الملقا', 'حي حطين', 'حي الياسمين', 'حي النرجس', 'حي الصحافة', 
    'حي العقيق', 'حي القيروان', 'حي الرمال', 'حي النفل', 'حي الغدير',
    'حي العليا', 'حي السليمانية', 'حي المعذر', 'حي لبن', 'حي نمار'
  ],
  'جدة': [
    'حي الشاطئ', 'حي الحمراء', 'حي الروضة', 'حي السلامة', 'حي الزهراء',
    'حي النعيم', 'حي المحمدية', 'حي أبحر الشمالية', 'حي البساتين', 'حي المرجان'
  ],
  'مكة المكرمة': [
    'حي الشوقية', 'حي بطحاء قريش', 'حي العوالي', 'حي النسيم', 'حي الزايدي',
    'حي ولي العهد', 'حي الكعكية'
  ],
  'الدمام': [
    'حي الشاطئ', 'حي الفيصلية', 'حي المنار', 'حي طيبة', 'حي الفاخرية',
    'حي نزهة الخليج', 'حي الندى'
  ],
  'الخبر': [
    'حي الحزام الأخضر', 'حي الحزام الذهبي', 'حي الراكة', 'حي القصور', 'حي التحلية'
  ]
};

export const REAL_ESTATE_CATEGORIES = [
  // --- القطاع السكني (RESIDENTIAL) ---
  { "code": "RES_VILLA_SALE", "name_ar": "فلل سكنية - للبيع", "type": PropertyType.VILLA, "op": OperationType.SALE, "group": "القطاع السكني" },
  { "code": "RES_APT_SALE", "name_ar": "شقق تمليك - للبيع", "type": PropertyType.APARTMENT, "op": OperationType.SALE, "group": "القطاع السكني" },
  { "code": "RES_FLOOR_SALE", "name_ar": "أدوار مستقلة - للبيع", "type": PropertyType.FLOOR, "op": OperationType.SALE, "group": "القطاع السكني" },
  { "code": "RES_TOWN_SALE", "name_ar": "تاون هاوس - للبيع", "type": PropertyType.TOWNHOUSE, "op": OperationType.SALE, "group": "القطاع السكني" },
  { "code": "RES_DUPLEX_SALE", "name_ar": "دوبلكس - للبيع", "type": PropertyType.DUPLEX, "op": OperationType.SALE, "group": "القطاع السكني" },
  { "code": "RES_APT_RENT", "name_ar": "شقق سكنية - للإيجار", "type": PropertyType.APARTMENT, "op": OperationType.RENT, "group": "القطاع السكني" },
  { "code": "RES_VILLA_RENT", "name_ar": "فلل سكنية - للإيجار", "type": PropertyType.VILLA, "op": OperationType.RENT, "group": "القطاع السكني" },

  // --- القطاع التجاري (COMMERCIAL) ---
  { "code": "COM_SHOP_RENT", "name_ar": "محلات وصالات عرض - للإيجار", "type": PropertyType.SHOP, "op": OperationType.RENT, "group": "القطاع التجاري" },
  { "code": "COM_OFFICE_RENT", "name_ar": "مكاتب إدارية - للإيجار", "type": PropertyType.OFFICE, "op": OperationType.RENT, "group": "القطاع التجاري" },
  { "code": "COM_BLDG_SALE", "name_ar": "عمائر تجارية - للبيع", "type": PropertyType.COMMERCIAL_BUILDING, "op": OperationType.SALE, "group": "القطاع التجاري" },
  { "code": "COM_MALL_INV", "name_ar": "مجمعات ومراكز تجارية - استثمار", "type": PropertyType.MALL, "op": OperationType.INVESTMENT, "group": "القطاع التجاري" },

  // --- قطاع الأراضي والمخططات (LANDS) ---
  { "code": "LAND_RES_SALE", "name_ar": "أراضٍ سكنية - للبيع", "type": PropertyType.LAND_RESIDENTIAL, "op": OperationType.SALE, "group": "الأراضي والمخططات" },
  { "code": "LAND_COM_SALE", "name_ar": "أراضٍ تجارية - للبيع", "type": PropertyType.LAND_COMMERCIAL, "op": OperationType.SALE, "group": "الأراضي والمخططات" },
  { "code": "LAND_PLAN_SALE", "name_ar": "مخططات خام / بلوكات - للبيع", "type": PropertyType.PLAN, "op": OperationType.SALE, "group": "الأراضي والمخططات" },
  { "code": "LAND_IND_SALE", "name_ar": "أراضٍ صناعية - للبيع", "type": PropertyType.LAND_INDUSTRIAL, "op": OperationType.SALE, "group": "الأراضي والمخططات" },

  // --- القطاع الاستثماري (INVESTMENT) ---
  { "code": "INV_BLDG_SALE", "name_ar": "عمائر سكنية استثمارية - للبيع", "type": PropertyType.RESIDENTIAL_BUILDING, "op": OperationType.SALE, "group": "القطاع الاستثماري" },
  { "code": "INV_PALACE_SALE", "name_ar": "قصور وفلل فاخرة - للبيع", "type": PropertyType.PALACE, "op": OperationType.SALE, "group": "القطاع الاستثماري" },
  { "code": "INV_HOTEL_SALE", "name_ar": "فنادق وأبراج فندقية - للبيع", "type": PropertyType.HOTEL, "op": OperationType.SALE, "group": "القطاع الاستثماري" },

  // --- القطاع الصناعي واللوجستي (INDUSTRIAL) ---
  { "code": "IND_WARE_RENT", "name_ar": "مستودعات لوجستية - للإيجار", "type": PropertyType.WAREHOUSE, "op": OperationType.RENT, "group": "الصناعي واللوجستي" },
  { "code": "IND_FACT_SALE", "name_ar": "مصانع ومعامل - للبيع", "type": PropertyType.FACTORY, "op": OperationType.SALE, "group": "الصناعي واللوجستي" },

  // --- القطاع الزراعي والترفيهي (RURAL/RECREATIONAL) ---
  { "code": "AGR_FARM_SALE", "name_ar": "مزارع ومنتجعات - للبيع", "type": PropertyType.FARM, "op": OperationType.SALE, "group": "الزراعي والترفيهي" },
  { "code": "REC_CHALET_RENT", "name_ar": "شاليهات واستراحات - للإيجار", "type": PropertyType.CHALET, "op": OperationType.RENT, "group": "الزراعي والترفيهي" }
];

export const CATEGORY_MAP: Record<CategoryType, PropertyType[]> = {
  [CategoryType.RESIDENTIAL]: [
    PropertyType.APARTMENT, PropertyType.VILLA, PropertyType.DUPLEX, 
    PropertyType.TOWNHOUSE, PropertyType.FLOOR, PropertyType.TRADITIONAL_HOUSE, 
    PropertyType.RESIDENTIAL_BUILDING, PropertyType.PALACE, PropertyType.COMPOUND
  ],
  [CategoryType.COMMERCIAL]: [
    PropertyType.SHOP, PropertyType.OFFICE, PropertyType.EXHIBITION, 
    PropertyType.COMMERCIAL_BUILDING, PropertyType.MALL, PropertyType.HALL
  ],
  [CategoryType.INDUSTRIAL]: [
    PropertyType.WAREHOUSE, PropertyType.FACTORY, PropertyType.WORKSHOP
  ],
  [CategoryType.LAND]: [
    PropertyType.LAND_RESIDENTIAL, PropertyType.LAND_COMMERCIAL, 
    PropertyType.LAND_AGRICULTURAL, PropertyType.LAND_INDUSTRIAL, PropertyType.PLAN
  ],
  [CategoryType.HOSPITALITY]: [
    PropertyType.HOTEL, PropertyType.HOTEL_APARTMENTS
  ],
  [CategoryType.AGRICULTURAL]: [
    PropertyType.FARM
  ],
  [CategoryType.SPECIAL]: [
    PropertyType.CHALET, PropertyType.RESTHOUSE, PropertyType.CAMP
  ]
};
