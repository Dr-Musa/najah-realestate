
export enum OperationType {
  SALE = 'بيع',
  PURCHASE = 'طلب شراء',
  RENT = 'إيجار',
  INVESTMENT = 'استثمار'
}

export enum CategoryType {
  RESIDENTIAL = 'سكني',
  COMMERCIAL = 'تجاري',
  INDUSTRIAL = 'صناعي',
  LAND = 'أراضٍ',
  HOSPITALITY = 'ضيافة',
  AGRICULTURAL = 'زراعي',
  SPECIAL = 'خاص'
}

export enum PropertyType {
  APARTMENT = 'شقة',
  VILLA = 'فيلا',
  DUPLEX = 'دوبلكس',
  TOWNHOUSE = 'تاون هاوس',
  FLOOR = 'دور',
  TRADITIONAL_HOUSE = 'بيت شعبي',
  RESIDENTIAL_BUILDING = 'عمارة سكنية',
  PALACE = 'قصر',
  COMPOUND = 'كمباوند',
  SHOP = 'محل',
  OFFICE = 'مكتب',
  EXHIBITION = 'معرض',
  COMMERCIAL_BUILDING = 'عمارة تجارية',
  MALL = 'مجمع تجاري',
  HALL = 'قاعة',
  WAREHOUSE = 'مستودع',
  FACTORY = 'مصنع',
  WORKSHOP = 'ورشة',
  LAND_RESIDENTIAL = 'أرض سكنية',
  LAND_COMMERCIAL = 'أرض تجارية',
  LAND_AGRICULTURAL = 'أرض زراعية',
  LAND_INDUSTRIAL = 'أرض صناعية',
  PLAN = 'مخطط',
  HOTEL = 'فندق',
  HOTEL_APARTMENTS = 'شقق فندقية',
  CHALET = 'شاليه',
  RESTHOUSE = 'استراحة',
  CAMP = 'مخيم',
  FARM = 'مزرعة'
}

export enum PropertyStatus {
  AVAILABLE = 'متاح',
  RESERVED = 'محجوز',
  RENTED = 'مؤجر',
  SOLD = 'مباع'
}

export enum UserRole {
  ADMIN = 'Admin',
  SUPERVISOR = 'Supervisor',
  AGENT = 'Agent',
  DATA_EDITOR = 'Data Editor',
  VIEWER = 'Viewer'
}

export interface Property {
  id: string;
  code: string;
  category: CategoryType;
  type: PropertyType;
  operation: OperationType;
  city: string;
  district: string;
  lat: number;
  lng: number;
  area: number;
  price: number;
  facade: string;
  status: PropertyStatus;
  trustScore: number;
  manualAdjustment?: number;
  isVerified?: boolean;
  verificationNotes?: string;
  images: string[];
  ownerName: string;
  ownerPhone: string;
  createdAt: string;
  updatedAt: string;
  source?: string;
}

export interface ExternalListing {
  title: string;
  uri: string;
  source: string;
  snippet: string;
  price?: string;
  imageUrl?: string;
  images?: string[]; // معرض صور متعدد
  location?: string;
  area?: string;
  rooms?: string;
  bathrooms?: string;
  phone?: string;
  ownerName?: string;
  trustScore: number; // درجة الثقة المستخرجة بالذكاء الاصطناعي
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface SavedSearch {
  id: string;
  name: string;
  criteria: string;
  date: Date;
}
