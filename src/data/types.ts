//  ######  Window interface for access MKPPayment (Online payment SDK) ######## //
declare global {
  interface Window {
    MKPPayment: any; // 👈️ turn off type checking
  }
}

//  ######  CustomLink  ######## //
export interface CustomLink {
  label: string;
  href: string;
  targetBlank?: boolean;
}

//  ##########  PostDataType ######## //
export interface TaxonomyType {
  id: string | number;
  name: string;
  href: string;
  count?: number;
  thumbnail?: string;
  desc?: string;
  color?: TwMainColor | string;
  taxonomy: 'category' | 'tag';
  listingType?: 'stay' | 'experiences' | 'car';
}

export interface AuthorType {
  id: string | number;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar: string;
  bgImage?: string;
  email?: string;
  count: number;
  desc: string;
  jobName: string;
  href: string;
  starRating?: number;
}

export interface PostDataType {
  id: string | number;
  author: AuthorType;
  date: string;
  href: string;
  categories: TaxonomyType[];
  title: string;
  featuredImage: string;
  desc?: string;
  commentCount: number;
  viewdCount: number;
  readingTime: number;
  postType?: 'standard' | 'video' | 'gallery' | 'audio';
}

export type TwMainColor =
  | 'pink'
  | 'green'
  | 'yellow'
  | 'red'
  | 'indigo'
  | 'blue'
  | 'purple'
  | 'gray';

//
export interface StayDataType {
  id: string | number;
  author: AuthorType;
  date: string;
  href: string;
  title: string;
  featuredImage: string;
  commentCount: number;
  viewCount: number;
  address: string;
  reviewStart: number;
  reviewCount: number;
  like: boolean;
  galleryImgs: string[];
  price: string;
  listingCategory: TaxonomyType;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  saleOff?: string | null;
  isAds: boolean | null;
  map: {
    lat: number;
    lng: number;
  };
}

export interface TcsProductType {
  id: string | number;
  cid?: string;
  href: string;
  title: string;
  featuredImage: string;
  address: string;
  like: boolean;
  galleryImgs: string[];
  price: string;
  embedMap?: any;
  description?: string;
}

//
export interface ExperiencesDataType {
  id: string | number;
  author: AuthorType;
  date: string;
  href: string;
  title: string;
  featuredImage: string;
  commentCount: number;
  viewCount: number;
  address: string;
  reviewStart: number;
  reviewCount: number;
  like: boolean;
  galleryImgs: string[];
  price: string;
  listingCategory: TaxonomyType;
  maxGuests: number;
  saleOff?: string | null;
  isAds: boolean | null;
  map: {
    lat: number;
    lng: number;
  };
}

//
export interface CarDataType {
  id: string | number;
  author: AuthorType;
  date: string;
  href: string;
  title: string;
  featuredImage: string;
  commentCount: number;
  viewCount: number;
  address: string;
  reviewStart: number;
  reviewCount: number;
  like: boolean;
  galleryImgs: string[];
  price: string;
  listingCategory: TaxonomyType;
  seats: number;
  gearshift: string;
  saleOff?: string | null;
  isAds: boolean | null;
  map: {
    lat: number;
    lng: number;
  };
}

//
export interface HistoryDataType {
  bookingRef: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentStatus: string;
  paymentMerchantKey: string;
  paymentResponseRef: string;
  paymentMethod: string;
  paymentTotal: number;
  paymentDiscount: number;
  paymentPromoCode: string;
  paymentDate: string;
}

//
export interface DetailHistoryDataType {
  bookingRef: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentStatus: string;
  paymentMerchantKey: string;
  paymentResponseRef: string;
  paymentMethod: string;
  paymentTotal: number;
  paymentDiscount: number;
  paymentPromoCode: string;
  paymentDate: string;
  reportingTcs: ReportingTcsDataType[];
}

//
export interface ReportingTcsDataType {
  bookingCode: string;
  bindingCode: string;
  bookingDate: string;
  bookingStatus: string;
  vendorRequestRef: string;
  vendorResponseRef: string;
  vendorInvoiceRef: string;
  tcCid: string;
  tcMerchantKey: string;
  tcHirarki: string;
  tcName: string;
  subTotalAmount: number;
  reportingDetail: ReportingDetailDataType[];
}

//
export interface ReportingDetailDataType {
  productCode: string;
  productName: string;
  productQty: number;
  productPrice: number;
}
