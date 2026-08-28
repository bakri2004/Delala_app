export interface VehicleListing {
  id: string;
  title: string;
  titleEn: string;
  make: string;
  model: string;
  year: number;
  price: number; // in Sudanese Pounds (SDG)
  priceNegotiable: boolean;
  city: string;
  cityEn: string;
  locationDetails: string;
  locationDetailsEn: string;
  mileage: number; // in km
  transmission: 'أوتوماتيك' | 'عادي' | 'Automatic' | 'Manual';
  fuelType: 'بنزين' | 'جاز (ديزل)' | 'هايبرد' | 'Petrol' | 'Diesel' | 'Hybrid';
  bodyType: 'سيدان' | 'نقل ركاب (شريحة/هايس)' | 'بوكس / دبل كابين' | 'دفار / شاحنة' | 'هاتشباك' | 'دفع رباعي';
  bodyTypeEn: string;
  photos: string[];
  description: string;
  descriptionEn: string;
  seller: {
    name: string;
    phone: string;
    whatsapp: string;
    isVerified: boolean;
    memberSince: string;
    city: string;
  };
  createdAt: string;
  createdAtEn: string;
  viewsCount?: number;
}

export type ViewScreen = 'browse' | 'detail' | 'post';

export interface UserAccount {
  name: string;
  phone: string;
  city: string;
  accountType: 'individual' | 'dealer';
  password?: string;
  createdAt: string;
}

export interface FilterState {
  searchQuery: string;
  make: string;
  city: string;
  bodyType: string;
  minPrice: number | '';
  maxPrice: number | '';
  sortBy: 'latest' | 'price_asc' | 'price_desc';
}
